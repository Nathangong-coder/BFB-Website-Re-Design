# Member Portal Foundation — Task Index & Global Constraints

**Read this file first before executing any task file in this folder.**

Full design spec: `docs/superpowers/specs/2026-07-19-auth-foundation-design.md`
Consolidated plan: `docs/superpowers/plans/2026-07-19-auth-foundation.md`

**Goal:** Add Google sign-in with a persistent (auto-login) session, a DB-stored per-user role (`user`/`admin`/`tech_admin`), and reusable server-side authorization primitives — the foundation that features 2–6 build on.

**Architecture:** Auth.js v5 (`next-auth@beta`) + Google provider + **database session strategy**, persisted to Neon serverless Postgres via Drizzle ORM + `@auth/drizzle-adapter`. Authoritative authorization runs server-side in a Data Access Layer (`getSessionUser` / `requireRole`). The root layout stays static: the navbar's auth UI is driven by a client `useSession` boundary. An optimistic cookie check in `proxy.ts` (Next 16's renamed middleware) pre-redirects unauthenticated visitors away from `/portal`.

## Execution order (each file = one task, one commit)

| Task | File | Deliverable | Needs user action |
|------|------|-------------|-------------------|
| 1 | `01-dependencies-and-env.md` | deps installed, Neon + Google OAuth set up, env scaffolded | **Yes** — create Neon DB + Google OAuth client |
| 2 | `02-role-logic.md` | pure role functions + passing assertions | No |
| 3 | `03-database-schema.md` | Drizzle schema + Neon client + applied migration | No (needs Task 1's `DATABASE_URL`) |
| 4 | `04-authjs-config.md` | working Google sign-in end-to-end | No (needs Task 1's OAuth creds) |
| 5 | `05-dal-and-proxy.md` | `requireRole` guards + `/portal` proxy redirect | No |
| 6 | `06-login-screen.md` | `/login` page | No |
| 7 | `07-navbar-auth.md` | navbar sign-in / avatar / sign-out | No |
| 8 | `08-portal-and-verification.md` | `/portal` landing + full acceptance checklist | No |

Do tasks in order — later tasks import symbols produced by earlier ones. Tasks 2–8 can be run by a fresh agent as long as prior tasks are committed.

## Global Constraints (apply to EVERY task)

- **Next.js 16 renamed `middleware` → `proxy`.** Protection middleware lives in `proxy.ts` at the project root, exporting a `proxy` function + `config.matcher`. Do NOT create `middleware.ts`. Runtime is Node.js by default; do not set `runtime` in a proxy file.
- **Before writing code that touches a Next.js API, read the matching guide under `node_modules/next/dist/docs/`** (per `AGENTS.md` — this is not stock Next.js). Key files: `01-app/03-api-reference/03-file-conventions/proxy.md`, `01-app/02-guides/authentication.md`, `01-app/01-getting-started/15-route-handlers.md`.
- **Session strategy is `database`** (not JWT), so DB role edits take effect on the next request.
- **Roles are DB-stored and editable**; ordering `user (0) < admin (1) < tech_admin (2)`. Default `user`.
- **Login is open to any Google account** — no email-domain restriction on sign-in.
- **No test framework exists and none is being added.** Per-task verification = `npx tsc --noEmit`, `npm run lint`, `npm run build`, and the documented manual browser checklist. The one piece of pure logic (`lib/auth/roles.ts`) is verified by a runnable assertion via `npx tsx`.
- **Secrets go in `.env.local`** (git-ignored, loaded by Next). `.env.example` documents them with placeholders and is committed. Never commit real secrets.
- **Match existing styling idioms** — Tailwind utility classes referencing theme tokens already used in `components/Navbar.tsx` (`dark:bg-midnight`, `text-bfb-blue`, `text-silver`, `border-white/10`, etc.). Actual fonts are DM Sans + Libre Baskerville (`app/layout.tsx`); use existing classes rather than hardcoding font names.
- **Path alias:** `@/*` → repo root (`@/auth` = `./auth.ts`, `@/lib/...` = `./lib/...`).

## Known risk (carried from spec)

`next-auth@beta` (v5) + `@auth/drizzle-adapter` API surface may differ slightly from the code in these files depending on the exact installed version (adapter option names, provider env auto-detection). Tasks 4–5 include typecheck gates; correct names against the installed package's types if needed. If Auth.js v5 proves incompatible with Next 16.2, the fallback is a JWT session strategy (role embedded in the token, refreshed on sign-in) — attempt the DB-session path first.

## Full file manifest (created across all tasks)

```
.env.example                                  (Task 1)
drizzle.config.ts                             (Task 3)
drizzle/                                       (Task 3, generated)
lib/db/schema.ts                              (Task 3)
lib/db/index.ts                               (Task 3)
lib/auth/roles.ts                             (Task 2)
lib/auth/dal.ts                               (Task 5)
auth.ts                                        (Task 4)
types/next-auth.d.ts                          (Task 4)
proxy.ts                                       (Task 5)
app/api/auth/[...nextauth]/route.ts           (Task 4)
app/login/page.tsx                            (Task 6)
app/portal/page.tsx                           (Task 8)
components/auth/SignInButton.tsx              (Task 6)
components/auth/SessionProviderWrapper.tsx    (Task 7)
components/auth/AuthNav.tsx                    (Task 7)
scripts/check-roles.ts                        (Task 2, optional throwaway)
```

Modified: `components/Navbar.tsx` (Task 7), `app/layout.tsx` (Task 7).
