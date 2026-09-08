# Member Portal Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Google sign-in with a persistent (auto-login) session, a DB-stored per-user role (`user`/`admin`/`tech_admin`), and reusable server-side authorization primitives — the foundation that features 2–6 build on.

**Architecture:** Auth.js v5 (`next-auth@beta`) with the Google provider and a **database session strategy**, persisted to Neon serverless Postgres via Drizzle ORM + `@auth/drizzle-adapter`. Authoritative authorization runs server-side in a Data Access Layer (`getSessionUser` / `requireRole`). The root layout stays static: the navbar's auth UI is driven by a client `useSession` boundary, so marketing pages are not forced dynamic. An optimistic cookie check in `proxy.ts` (Next 16's renamed middleware) pre-redirects unauthenticated visitors away from the `/portal` prefix.

**Tech Stack:** Next.js 16.2 (App Router), React 19, TypeScript 5, Tailwind v4, `next-auth@beta`, `@auth/drizzle-adapter`, `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit` + `dotenv` (dev).

## Global Constraints

- **Next.js 16 renamed `middleware` → `proxy`.** Protection middleware lives in `proxy.ts` at the project root, exporting a `proxy` function + `config.matcher`. Do NOT create `middleware.ts`. Runtime is Node.js by default; do not set `runtime` in a proxy file.
- **Before writing code that touches a Next.js API, read the matching guide under `node_modules/next/dist/docs/`** (per `AGENTS.md` — this is not stock Next.js). Relevant files: `01-app/03-api-reference/03-file-conventions/proxy.md`, `01-app/02-guides/authentication.md`, `01-app/01-getting-started/15-route-handlers.md`.
- **Session strategy is `database`** (not JWT), so DB role edits take effect on the next request.
- **Roles are DB-stored and editable**; `user (0) < admin (1) < tech_admin (2)`. Default `user`.
- **Login is open to any Google account** — no email-domain restriction on sign-in.
- **No test framework exists and none is being added.** Per-task verification = `npx tsc --noEmit`, `npm run lint`, `npm run build`, and the documented manual browser checklist. The one piece of pure logic (`lib/auth/roles.ts`) is verified by a runnable assertion script via `npx tsx`.
- **Secrets go in `.env.local`** (git-ignored, loaded by Next). `.env.example` documents them with placeholder values and is committed. Never commit real secrets.
- **Match existing styling idioms** — Tailwind utility classes referencing theme tokens already used in `components/Navbar.tsx` (`dark:bg-midnight`, `text-bfb-blue`, `text-silver`, `border-white/10`, etc.). The actual fonts are DM Sans + Libre Baskerville (see `app/layout.tsx`); use existing classes rather than hardcoding font names.
- **Path alias:** `@/*` → repo root (`@/auth` = `./auth.ts`, `@/lib/...` = `./lib/...`).

---

## File Structure

**Created:**
- `.env.example` — documents required env vars (committed, placeholders only)
- `drizzle.config.ts` — drizzle-kit migration config
- `lib/db/schema.ts` — Drizzle schema: `users` (+`role`), `accounts`, `sessions`, `verificationTokens`
- `lib/db/index.ts` — Neon client + Drizzle `db` instance
- `lib/auth/roles.ts` — `Role` type, rank ordering, `roleAtLeast`, bootstrap helpers (pure, no imports)
- `auth.ts` — NextAuth config (adapter, Google provider, DB sessions, session + bootstrap callbacks); exports `handlers`, `auth`, `signIn`, `signOut`
- `types/next-auth.d.ts` — module augmentation adding `id` + `role` to the session user
- `app/api/auth/[...nextauth]/route.ts` — re-exports Auth.js route handlers
- `lib/auth/dal.ts` — server-only DAL: `getSessionUser`, `requireUser`, `requireRole`
- `proxy.ts` — optimistic cookie redirect for `/portal` prefix
- `app/login/page.tsx` — themed login screen (server component)
- `components/auth/SignInButton.tsx` — "Continue with Google" (server component, inline server action)
- `components/auth/SessionProviderWrapper.tsx` — client wrapper around `SessionProvider`
- `components/auth/AuthNav.tsx` — client auth affordance (avatar/name/sign-out via `useSession`)
- `app/portal/page.tsx` — minimal authed landing (proves gating + shows role)
- `scripts/check-roles.ts` — throwaway assertion runner for `roles.ts`
- `drizzle/` — generated migration SQL

**Modified:**
- `components/Navbar.tsx` — render `<AuthNav />` in desktop actions + mobile menu
- `app/layout.tsx` — wrap app in `<SessionProviderWrapper>`

---

## Task 1: Dependencies, external resources, and env scaffolding

**Files:**
- Create: `.env.example`
- Modify: `.env.local` (create if absent; NOT committed)

**Interfaces:**
- Produces: installed packages; env vars `AUTH_SECRET`, `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BOOTSTRAP_TECH_ADMIN_EMAILS` available to Next.

- [ ] **Step 1: Install packages**

Run:
```bash
npm install next-auth@beta @auth/drizzle-adapter drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv
```
Expected: installs succeed; `next-auth` resolves to a `5.x` (beta) version. If peer-dep errors against React 19 / Next 16 appear, re-run with `--legacy-peer-deps` and note the exact version installed.

- [ ] **Step 2: Provision Neon Postgres (user action)**

Create a free project at https://neon.tech, create a database, copy the pooled connection string (starts `postgresql://...`). This is `DATABASE_URL`.

- [ ] **Step 3: Create Google OAuth credentials (user action)**

Google Cloud Console → APIs & Services → Credentials → Create Credentials → OAuth client ID → Web application.
- Authorized JavaScript origins: `http://localhost:3000` (+ production origin later).
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (+ `https://<prod-domain>/api/auth/callback/google` later).
Copy the client ID → `GOOGLE_CLIENT_ID`, secret → `GOOGLE_CLIENT_SECRET`.

- [ ] **Step 4: Generate `AUTH_SECRET`**

Run:
```bash
npx auth secret
```
This writes `AUTH_SECRET` to `.env.local` automatically. (Fallback if the command is unavailable: `openssl rand -base64 32` and paste it as `AUTH_SECRET=...`.)

- [ ] **Step 5: Write `.env.local` (not committed)**

Ensure `.env.local` contains (real values):
```
AUTH_SECRET=... (from step 4)
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
BOOTSTRAP_TECH_ADMIN_EMAILS=your-email@gmail.com
```

- [ ] **Step 6: Write committed `.env.example`**

Create `.env.example`:
```
# Auth.js session signing secret — generate with `npx auth secret`
AUTH_SECRET=
# Neon serverless Postgres pooled connection string
DATABASE_URL=
# Google OAuth 2.0 Web client (SEPARATE from GOOGLE_API_KEY used by the Python backend)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
# Comma-separated emails auto-promoted to tech_admin on sign-in
BOOTSTRAP_TECH_ADMIN_EMAILS=
```

- [ ] **Step 7: Confirm `.env.local` is git-ignored**

Run:
```bash
git check-ignore .env.local
```
Expected: prints `.env.local` (it is ignored). If it prints nothing, add `.env.local` to `.gitignore` before continuing.

- [ ] **Step 8: Verify build still works**

Run: `npm run build`
Expected: build succeeds (no code changes yet, just deps).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: add auth/db dependencies and env scaffolding"
```

---

## Task 2: Role logic (pure functions)

**Files:**
- Create: `lib/auth/roles.ts`
- Create: `scripts/check-roles.ts`

**Interfaces:**
- Produces:
  - `type Role = "user" | "admin" | "tech_admin"`
  - `ROLE_RANK: Record<Role, number>`
  - `roleAtLeast(role: Role, min: Role): boolean`
  - `parseBootstrapEmails(raw: string | undefined): string[]`
  - `shouldBootstrapTechAdmin(email: string | null | undefined, currentRole: Role, bootstrapEmails: string[]): boolean`

- [ ] **Step 1: Write the assertion script (the failing test)**

Create `scripts/check-roles.ts`:
```ts
import assert from "node:assert/strict";
import {
  roleAtLeast,
  parseBootstrapEmails,
  shouldBootstrapTechAdmin,
} from "../lib/auth/roles";

// roleAtLeast ordering
assert.equal(roleAtLeast("tech_admin", "admin"), true);
assert.equal(roleAtLeast("admin", "admin"), true);
assert.equal(roleAtLeast("user", "admin"), false);
assert.equal(roleAtLeast("admin", "tech_admin"), false);

// parseBootstrapEmails: trims, lowercases, drops blanks
assert.deepEqual(parseBootstrapEmails(" A@x.com , b@y.com ,"), ["a@x.com", "b@y.com"]);
assert.deepEqual(parseBootstrapEmails(undefined), []);
assert.deepEqual(parseBootstrapEmails(""), []);

// shouldBootstrapTechAdmin
const list = ["me@gmail.com"];
assert.equal(shouldBootstrapTechAdmin("me@gmail.com", "user", list), true);
assert.equal(shouldBootstrapTechAdmin("ME@Gmail.com", "user", list), true); // case-insensitive
assert.equal(shouldBootstrapTechAdmin("me@gmail.com", "tech_admin", list), false); // already there
assert.equal(shouldBootstrapTechAdmin("other@gmail.com", "user", list), false);
assert.equal(shouldBootstrapTechAdmin(null, "user", list), false);

console.log("roles.ts: all assertions passed");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx tsx scripts/check-roles.ts`
Expected: FAILS — cannot find module `../lib/auth/roles` (not created yet).

- [ ] **Step 3: Implement `lib/auth/roles.ts`**

Create `lib/auth/roles.ts` (pure — no framework imports, safe to import anywhere):
```ts
export const ROLES = ["user", "admin", "tech_admin"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_RANK: Record<Role, number> = {
  user: 0,
  admin: 1,
  tech_admin: 2,
};

export function roleAtLeast(role: Role, min: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

export function parseBootstrapEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function shouldBootstrapTechAdmin(
  email: string | null | undefined,
  currentRole: Role,
  bootstrapEmails: string[],
): boolean {
  if (!email) return false;
  return (
    bootstrapEmails.includes(email.toLowerCase()) &&
    !roleAtLeast(currentRole, "tech_admin")
  );
}
```

- [ ] **Step 4: Run the assertion script to verify it passes**

Run: `npx tsx scripts/check-roles.ts`
Expected: prints `roles.ts: all assertions passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/auth/roles.ts scripts/check-roles.ts
git commit -m "feat: add pure role-resolution logic with assertions"
```

---

## Task 3: Database schema, client, and migration

**Files:**
- Create: `lib/db/schema.ts`
- Create: `lib/db/index.ts`
- Create: `drizzle.config.ts`
- Create: `drizzle/` (generated)

**Interfaces:**
- Consumes: `DATABASE_URL` from `.env.local`.
- Produces:
  - `db` (Drizzle instance) from `@/lib/db`
  - table objects `users`, `accounts`, `sessions`, `verificationTokens` from `@/lib/db/schema`
  - `users` includes a `role` text column (default `"user"`)

- [ ] **Step 1: Write the schema**

Create `lib/db/schema.ts` (standard Auth.js Drizzle pg schema + `role`):
```ts
import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);
```

- [ ] **Step 2: Write the db client**

Create `lib/db/index.ts`:
```ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

- [ ] **Step 3: Write drizzle-kit config**

Create `drizzle.config.ts` (loads `.env.local` explicitly so drizzle-kit sees `DATABASE_URL`):
```ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

- [ ] **Step 4: Generate the migration**

Run: `npx drizzle-kit generate`
Expected: creates a `.sql` migration + metadata under `drizzle/`. Inspect the SQL — it must create `user`, `account`, `session`, `verificationToken` tables and the `user.role` column with default `'user'`.

- [ ] **Step 5: Apply the migration to Neon**

Run: `npx drizzle-kit migrate`
Expected: completes without error. Verify in the Neon SQL editor (or `npx drizzle-kit studio`) that the four tables exist and `user` has `role` + `createdAt`.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add lib/db/schema.ts lib/db/index.ts drizzle.config.ts drizzle/
git commit -m "feat: add Drizzle schema, Neon client, and initial migration"
```

---

## Task 4: Auth.js config, route handlers, and type augmentation

**Files:**
- Create: `auth.ts`
- Create: `types/next-auth.d.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

**Interfaces:**
- Consumes: `db`, tables from `@/lib/db`; `parseBootstrapEmails`, `shouldBootstrapTechAdmin`, `Role` from `@/lib/auth/roles`; env `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`, `BOOTSTRAP_TECH_ADMIN_EMAILS`.
- Produces: `handlers`, `auth`, `signIn`, `signOut` from `@/auth`; session's `user` carries `id` and `role`.

- [ ] **Step 1: Read the auth guide sections**

Read `node_modules/next/dist/docs/01-app/02-guides/authentication.md` (Session Management + Authorization) and confirm the `database` session callback receives `{ session, user }`.

- [ ] **Step 2: Write the type augmentation**

Create `types/next-auth.d.ts`:
```ts
import type { DefaultSession } from "next-auth";
import type { Role } from "@/lib/auth/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
  interface User {
    role: Role;
  }
}
```

- [ ] **Step 3: Write `auth.ts`**

Create `auth.ts` at the project root:
```ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";
import {
  parseBootstrapEmails,
  shouldBootstrapTechAdmin,
  type Role,
} from "@/lib/auth/roles";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "database", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = ((user as { role?: Role }).role ?? "user") as Role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      const bootstrap = parseBootstrapEmails(
        process.env.BOOTSTRAP_TECH_ADMIN_EMAILS,
      );
      const currentRole = ((user as { role?: Role }).role ?? "user") as Role;
      if (shouldBootstrapTechAdmin(user.email, currentRole, bootstrap)) {
        await db
          .update(users)
          .set({ role: "tech_admin" })
          .where(eq(users.email, user.email!));
      }
    },
  },
});
```

- [ ] **Step 4: Write the route handler**

Create `app/api/auth/[...nextauth]/route.ts`:
```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. If `@auth/drizzle-adapter`'s option names differ from the installed version's types, correct them to match the installed package's exported types (the four table roles: users/accounts/sessions/verificationTokens), then re-run.

- [ ] **Step 6: Verify sign-in end-to-end (manual)**

Run: `npm run dev`. Visit `http://localhost:3000/api/auth/signin` → click Google → complete OAuth. Expected: redirects back signed in; a row appears in Neon `user` (role `tech_admin` if your email is in `BOOTSTRAP_TECH_ADMIN_EMAILS`, else `user`) and a `session` row exists.
If Google returns `redirect_uri_mismatch`, fix the Authorized redirect URI (Task 1 Step 3) to exactly `http://localhost:3000/api/auth/callback/google`.

- [ ] **Step 7: Commit**

```bash
git add auth.ts types/next-auth.d.ts app/api/auth
git commit -m "feat: configure Auth.js Google provider with DB sessions and tech-admin bootstrap"
```

---

## Task 5: Data Access Layer + proxy guard

**Files:**
- Create: `lib/auth/dal.ts`
- Create: `proxy.ts`

**Interfaces:**
- Consumes: `auth` from `@/auth`; `roleAtLeast`, `Role` from `@/lib/auth/roles`.
- Produces:
  - `getSessionUser(): Promise<SessionUser | null>` where `SessionUser = Session["user"]`
  - `requireUser(): Promise<SessionUser>` (redirects to `/login` if unauthenticated)
  - `requireRole(min: Role): Promise<SessionUser>` (redirects `/login` if unauthenticated, `/` if under-privileged)

- [ ] **Step 1: Write the DAL**

Create `lib/auth/dal.ts`:
```ts
import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { roleAtLeast, type Role } from "./roles";

export const getSessionUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(min: Role) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!roleAtLeast(user.role, min)) redirect("/");
  return user;
}
```

- [ ] **Step 2: Read the proxy doc**

Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` (Migration + Using Cookies sections) to confirm the `proxy` export + `config.matcher` shape.

- [ ] **Step 3: Write `proxy.ts`**

Create `proxy.ts` at the project root (optimistic cookie presence check only — DB sessions mean the cookie holds no role, so authoritative role checks stay in the DAL):
```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth.js session cookie names (dev vs. secure prod)
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));
  if (!hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
```

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed. `server-only` must not be imported into any client component (it is only used by `dal.ts`, consumed server-side).

- [ ] **Step 5: Commit**

```bash
git add lib/auth/dal.ts proxy.ts
git commit -m "feat: add auth DAL guards and proxy redirect for /portal"
```

---

## Task 6: Login screen

**Files:**
- Create: `app/login/page.tsx`
- Create: `components/auth/SignInButton.tsx`

**Interfaces:**
- Consumes: `getSessionUser` from `@/lib/auth/dal`; `signIn` from `@/auth`.
- Produces: `/login` route; `<SignInButton callbackUrl?: string />`.

- [ ] **Step 1: Write the sign-in button (server component + inline server action)**

Create `components/auth/SignInButton.tsx`:
```tsx
import { signIn } from "@/auth";

export default function SignInButton({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: callbackUrl || "/" });
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 border border-slate-300 dark:border-white/15 text-slate-700 dark:text-silver text-sm font-semibold tracking-wide hover:border-slate-400 dark:hover:border-white/30 transition-colors"
      >
        Continue with Google
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Write the login page**

Create `app/login/page.tsx` (server component; redirects if already signed in):
```tsx
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/dal";
import SignInButton from "@/components/auth/SignInButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const user = await getSessionUser();
  const { callbackUrl } = await searchParams;
  if (user) redirect(callbackUrl || "/");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-gutter">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-serif text-slate-900 dark:text-silver mb-2">
          Member Sign In
        </h1>
        <p className="text-sm text-slate-500 dark:text-silver/60 mb-8">
          Sign in with Google to access your quiz history and application status.
        </p>
        <SignInButton callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed; `/login` appears in the build route list.

- [ ] **Step 4: Verify (manual)**

`npm run dev` → visit `/login` while signed out → button works, lands back at `/`. Visit `/login` while signed in → immediately redirects to `/`.

- [ ] **Step 5: Commit**

```bash
git add app/login components/auth/SignInButton.tsx
git commit -m "feat: add themed /login screen with Google sign-in"
```

---

## Task 7: Navbar auth affordance

**Files:**
- Create: `components/auth/SessionProviderWrapper.tsx`
- Create: `components/auth/AuthNav.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/Navbar.tsx`

**Interfaces:**
- Consumes: `useSession`, `signOut`, `SessionProvider` from `next-auth/react`.
- Produces: `<SessionProviderWrapper>`, `<AuthNav />` (self-contained; reads its own session client-side).

- [ ] **Step 1: Write the session provider wrapper**

Create `components/auth/SessionProviderWrapper.tsx`:
```tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

- [ ] **Step 2: Wrap the app in the provider (keep layout static — no `auth()` call here)**

Modify `app/layout.tsx`: import the wrapper and wrap the existing tree. Change:
```tsx
import MotionProvider from "@/components/MotionProvider";
```
to also import:
```tsx
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";
```
and change the body content from:
```tsx
        <MotionProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </MotionProvider>
```
to:
```tsx
        <SessionProviderWrapper>
          <MotionProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </MotionProvider>
        </SessionProviderWrapper>
```
Do NOT make `RootLayout` async or call `getSessionUser()` here — that would force every page to render dynamically.

- [ ] **Step 3: Write `AuthNav`**

Create `components/auth/AuthNav.tsx` (client; matches existing nav styling idioms):
```tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AuthNav() {
  const { status, data } = useSession();

  if (status === "loading") {
    return <div className="w-8 h-8" aria-hidden />; // reserve space, avoid layout shift
  }

  if (status !== "authenticated") {
    return (
      <Link
        href="/login"
        className="text-[15px] tracking-wide text-slate-600 dark:text-silver/60 hover:text-slate-900 dark:hover:text-silver transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const user = data.user;
  return (
    <div className="flex items-center gap-3">
      <Link href="/portal" className="flex items-center gap-2 group">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name ?? "Account"}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/15"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-bfb-blue/15 text-bfb-blue flex items-center justify-center text-sm font-semibold">
            {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
          </span>
        )}
        <span className="hidden lg:inline text-sm text-slate-600 dark:text-silver/70 group-hover:text-slate-900 dark:group-hover:text-silver transition-colors">
          {user.name ?? user.email}
        </span>
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-slate-500 dark:text-silver/50 hover:text-slate-900 dark:hover:text-silver transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Mount `AuthNav` in the Navbar**

Modify `components/Navbar.tsx`:
- Add import near the other component imports (after `import ThemeToggle from "./ThemeToggle";`):
```tsx
import AuthNav from "./auth/AuthNav";
```
- In the desktop actions cluster (the `<div className="flex items-center gap-2 justify-self-end">` around line 189), add `<AuthNav />` immediately after `<ThemeToggle />`:
```tsx
          <div className="flex items-center gap-2 justify-self-end">
            <ThemeToggle />
            <AuthNav />
            <Link
              href="/contact"
```
- In the mobile menu, add sign-in/account access. In the pinned CTA block (the `<div className="flex-shrink-0 px-gutter py-5 border-t ...">` near line 322), add above the existing "Join Us" link:
```tsx
              <Link
                href="/portal"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full text-center mb-3 text-slate-600 dark:text-silver/70 py-3 text-base"
              >
                My Account
              </Link>
```
(The `/portal` route redirects to `/login` when signed out via `proxy.ts`, so one link serves both states on mobile.)

- [ ] **Step 5: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed. Confirm marketing pages (e.g. `/`) are still statically rendered in the build output (not forced dynamic) — the `○ (Static)` marker should remain on `/`.

- [ ] **Step 6: Verify (manual)**

`npm run dev`:
- Signed out: navbar shows "Sign in"; clicking → `/login`.
- After signing in: navbar shows avatar + name + "Sign out"; "Sign out" returns to `/` signed out.

- [ ] **Step 7: Commit**

```bash
git add components/auth/SessionProviderWrapper.tsx components/auth/AuthNav.tsx app/layout.tsx components/Navbar.tsx
git commit -m "feat: add navbar auth affordance via client session boundary"
```

---

## Task 8: Portal landing + end-to-end role verification

**Files:**
- Create: `app/portal/page.tsx`

**Interfaces:**
- Consumes: `requireUser` from `@/lib/auth/dal`.
- Produces: `/portal` authed landing that displays the user's role (proves gating + bootstrap end-to-end).

- [ ] **Step 1: Write the portal page**

Create `app/portal/page.tsx` (server component; authoritative gate via DAL):
```tsx
import { requireUser } from "@/lib/auth/dal";
import { roleAtLeast } from "@/lib/auth/roles";

export default async function PortalPage() {
  const user = await requireUser();
  const isAdmin = roleAtLeast(user.role, "admin");

  return (
    <div className="min-h-[70vh] px-gutter py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif text-slate-900 dark:text-silver mb-2">
        Welcome, {user.name ?? user.email}
      </h1>
      <p className="text-sm text-slate-500 dark:text-silver/60 mb-8">
        Your role: <span className="font-semibold text-bfb-blue">{user.role}</span>
      </p>
      {isAdmin && (
        <p className="text-sm text-slate-600 dark:text-silver/70 border border-bfb-blue/30 px-4 py-3">
          You have admin access. Admin tools arrive in a later feature.
        </p>
      )}
      <p className="mt-8 text-sm text-slate-400 dark:text-silver/40">
        Quiz history and application tracking will appear here.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed; `/portal` is dynamic (uses cookies) — that is correct and expected for this route only.

- [ ] **Step 3: Full manual verification checklist**

`npm run dev` and confirm each (this is the foundation's acceptance test):
1. Signed out, visit `/portal` → redirected to `/login?callbackUrl=/portal` (by `proxy.ts`).
2. Sign in with a **bootstrap** email → land at `/portal` showing role `tech_admin` + the admin banner. Confirm `user.role = tech_admin` in Neon.
3. Reload the app → **still signed in** (auto-login), no re-prompt.
4. Sign out (navbar) → navbar shows "Sign in".
5. Sign in with a **non-bootstrap** email → `/portal` shows role `user`, no admin banner.
6. In Neon, manually set that user's `role` to `admin`; reload `/portal` → the admin banner now appears (proves DB sessions read live roles).
7. Reset that user's `role` back to `user` in Neon.

- [ ] **Step 4: Commit**

```bash
git add app/portal/page.tsx
git commit -m "feat: add authed /portal landing and verify role gating end-to-end"
```

- [ ] **Step 5: Optionally remove the throwaway assertion script**

`scripts/check-roles.ts` may stay (useful for future refactors of `roles.ts`) or be removed. If removing:
```bash
git rm scripts/check-roles.ts
git commit -m "chore: remove one-off roles assertion script"
```

---

## Self-Review

**Spec coverage:**
- Goal 1 (Google sign-in from `/login`) → Tasks 4, 6. ✓
- Goal 2 (persistent auto-login) → Task 4 (30-day DB sessions) + Task 8 checklist item 3. ✓
- Goal 3 (DB-stored editable `role`) → Task 3 (`role` column) + Task 8 checklist item 6. ✓
- Goal 4 (bootstrap first tech-admin via env) → Task 2 (`shouldBootstrapTechAdmin`) + Task 4 (`events.signIn`). ✓
- Goal 5 (reusable guards `getSessionUser`/`requireRole` + proxy) → Task 5. ✓
- Non-goals (no applications/quiz tables, no admin UI, no Flask changes, open login, no test harness) respected — none of those are built. ✓
- Env vars from spec (`AUTH_SECRET`, `DATABASE_URL`, `GOOGLE_CLIENT_ID/SECRET`, `BOOTSTRAP_TECH_ADMIN_EMAILS`) → Task 1. ✓

**Placeholder scan:** No TBD/TODO; every code step contains complete code. ✓

**Type consistency:** `Role`, `roleAtLeast`, `parseBootstrapEmails`, `shouldBootstrapTechAdmin` defined in Task 2 and consumed with identical signatures in Tasks 4–5, 8. Session `user.id`/`user.role` augmented in Task 4 and read in Tasks 5, 8. Table names (`users`/`accounts`/`sessions`/`verificationTokens`) consistent across Tasks 3–4. ✓

**Known risk (carried from spec):** `next-auth@beta` + `@auth/drizzle-adapter` API surface may differ slightly from the code above depending on the exact installed version (adapter option names, provider env auto-detection). Tasks 4–5 include typecheck gates and instruct correcting names against the installed package's types. If Auth.js v5 proves incompatible with Next 16.2, the fallback is a JWT session strategy (role embedded in the token, refreshed on sign-in) — but attempt the DB-session path first.
