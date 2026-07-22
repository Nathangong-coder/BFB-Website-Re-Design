# Design Spec — Member Portal Foundation (Auth · Roles · Datastore)

**Date:** 2026-07-19
**Status:** Approved (design), pending spec review
**Scope:** Sub-project 1 of 6 (the foundation). Features D/E/F get their own specs.

---

## Context

The BFB site is a Next.js 16 (App Router, React 19, TS) app deployed on Vercel,
with a separate Dockerized Python/Flask backend used only for SmartComps
valuation (proxied via `app/api/[tool]/[...path]`). There is currently **no
auth** and **no persistence** — quiz state lives in an in-memory Zustand store
(`lib/store.ts`) that resets on reload. Email (contact + quiz perfect-score)
goes out via Resend.

The user wants to grow the site into a member portal. The full vision decomposes
into **six independent sub-projects**, each with its own spec/plan/build cycle:

| # | Sub-project | Depends on |
|---|-------------|-----------|
| **1** | **Foundation — Auth, Roles, Datastore** *(this spec)* | — |
| 2 | Quiz history (save attempts + review) | 1 |
| 3 | Application submission + status tracking (applicant view) | 1 |
| 4 | Admin console — review/approve/reject applications | 1, 3 |
| 5 | Role management UI (tech-admin promotes/demotes) | 1, 4 |
| 6 | (Reserved) future admin features on top of the console | 1, 4 |

Everything else depends on this foundation, so it is built first. This spec
delivers **only** identity + storage primitives — no feature pages.

## Goals

1. A user can sign in with Google from a `/login` screen.
2. The session persists ("auto-login"): a returning visitor lands already
   signed in until they sign out or the session expires.
3. Every user has a DB-stored `role` (`user` / `admin` / `tech_admin`),
   editable in the DB, defaulting to `user`.
4. The first `tech_admin`(s) can be bootstrapped via env config, with no admin
   UI in existence yet.
5. Reusable server-side guards exist (`getSessionUser()`, `requireRole()`, and
   route middleware) so later features gate pages/actions in one line.

## Non-Goals (explicitly deferred)

- No `applications` or `quiz_attempts` tables/logic (features 2–4).
- No admin console, no promote/demote UI (features 4–5).
- No changes to the Flask/SmartComps backend.
- No `@ucla.edu` email restriction — login is open to any Google account
  (applicants use personal Gmail).
- No automated test harness (none exists in the repo); verification is a
  documented manual checklist.

## Stack Decisions

- **Auth:** Auth.js v5 (`next-auth`) with the Google provider.
- **Datastore:** Neon serverless Postgres (free tier). Chosen over SQLite
  because Vercel's filesystem is ephemeral; Neon survives redeploys.
- **ORM/adapter:** Drizzle ORM + `@auth/drizzle-adapter`, using Neon's
  serverless driver. Lightweight and typed; preferred over Prisma to avoid
  client-generation weight and cold-start cost for a ~5-table schema.
- **Session strategy:** **database sessions** (not pure JWT), so DB role edits
  take effect on the next request instead of waiting for a token to refresh.
  Session lifetime 30 days, sliding.

## Data Model (foundation only)

Standard Auth.js/Drizzle-adapter tables, plus one added column.

```
users
  id            text (pk)
  name          text
  email         text (unique, not null)
  emailVerified timestamp
  image         text
  role          text not null default 'user'   -- 'user' | 'admin' | 'tech_admin'   [ADDED]
  createdAt     timestamp default now()

accounts             -- Auth.js standard (OAuth account linkage)
sessions             -- Auth.js standard (server-side session rows)
verification_tokens  -- Auth.js standard
```

`role` is a plain text column validated in app code (a TS union type), not a
Postgres enum, to keep migrations trivial when values evolve. `applications`
and `quiz_attempts` are intentionally absent — they arrive in later specs.

## Auth & Auto-Login Flow

1. **`/login`** — a themed screen (midnight bg, UCLA-blue accent, Playfair
   heading) with a single "Continue with Google" button. If already
   authenticated, it redirects to `/` (or a `?callbackUrl`).
2. Google OAuth → Auth.js callback → user upserted into `users` via the Drizzle
   adapter → **database session row created**, session cookie set (30-day
   sliding).
3. **Auto-login** = that persistent cookie. Returning visitors are already
   signed in. Signing out deletes the session row + cookie.
4. **Navbar** gains an auth affordance: avatar + name + "Sign out" when authed;
   "Sign in" link when not. (Minimal, matches existing nav styling.)

## Role Assignment + Bootstrap

- New users are inserted with `role = 'user'`.
- **`BOOTSTRAP_TECH_ADMIN_EMAILS`** — comma-separated env var. In the Auth.js
  `signIn`/`session` callback, if the authenticated email is in this list and
  the stored role is lower than `tech_admin`, it is upgraded to `tech_admin`.
  This is how the first admin exists before any UI. Idempotent; safe to leave
  set.
- Role **ordering** for comparisons: `user (0) < admin (1) < tech_admin (2)`.
- Foundation ships the column, the bootstrap, and the guards. The promote/demote
  UI is feature 5.

## Route Protection (primitives only)

Delivered as reusable helpers in `lib/auth/` (or similar):

- **`auth()`** — Auth.js v5 accessor for the current session (server-side).
- **`getSessionUser()`** — returns the typed current user (incl. `role`) or
  `null`.
- **`requireRole(min: Role)`** — for server components/actions; redirects to
  `/login` if unauthenticated, or renders/returns a 403 path if under-privileged.
- **`middleware.ts`** — Auth.js middleware guarding a matcher (initially just
  ensures the wiring works; real gated routes are added by later features).

No admin/feature pages are built here — only the locks they will use.

## Config / Env

New env vars (documented in `.env.example` and the setup steps):

| Var | Purpose |
|-----|---------|
| `AUTH_SECRET` | Auth.js session/JWT signing secret |
| `DATABASE_URL` | Neon Postgres connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client (NEW — distinct from existing `GOOGLE_API_KEY`) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BOOTSTRAP_TECH_ADMIN_EMAILS` | Comma-separated emails seeded to `tech_admin` |

The existing `GOOGLE_API_KEY` (Gemini, backend) and `RESEND_API_KEY` are
untouched.

**Manual setup the user performs (steps provided during implementation):**
1. Create a Neon project → copy `DATABASE_URL`.
2. Create a Google OAuth 2.0 Client (Authorized redirect URIs for localhost +
   the Vercel domain) → copy client id/secret.
3. Populate `.env.local` (and Vercel env) with the vars above.

## Verification (manual checklist)

No test framework is configured; verification is manual and documented:

1. Visit `/login` while signed out → "Continue with Google" works, lands signed
   in.
2. Reload the app → **still signed in** (auto-login) without re-prompting.
3. Sign out → session cleared, navbar shows "Sign in".
4. Sign in with an email listed in `BOOTSTRAP_TECH_ADMIN_EMAILS` → `users.role`
   is `tech_admin` in Neon.
5. Sign in with any other email → role is `user`.
6. A `requireRole('admin')`-guarded scratch route redirects a `user` and allows
   an `admin`/`tech_admin` (temporary test route, removed after).

## Risks / Notes

- **Next.js 16 + React 19 + Auth.js v5 compatibility.** Per `AGENTS.md`, this is
  not a stock Next.js — the App Router route-handler/middleware APIs may differ
  from training data. Before writing code, read the relevant guides under
  `node_modules/next/dist/docs/` and verify Auth.js v5 works with Next 16.2. If
  there is a hard incompatibility, fall back to a JWT session strategy or an
  alternative adapter and note it.
- **DB sessions cost a query per request.** Negligible at club scale; acceptable
  trade for fresh roles.
- **Bootstrap env is powerful** — anyone whose email is listed becomes
  tech-admin on sign-in. Keep the list tight.
