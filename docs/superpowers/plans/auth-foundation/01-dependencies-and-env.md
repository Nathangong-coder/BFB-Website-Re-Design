# Task 1 — Dependencies, external resources, and env scaffolding

> **Read `00-overview.md` first** for global constraints. This task requires **user action** (creating a Neon DB + Google OAuth client) — it cannot be fully automated.

**Deliverable:** Auth/DB packages installed, Neon Postgres + Google OAuth credentials created, env vars in place, `.env.example` committed, `npm run build` still green.

**Interfaces produced:** installed packages; env vars `AUTH_SECRET`, `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BOOTSTRAP_TECH_ADMIN_EMAILS` available to Next.

**Files:**
- Create: `.env.example` (committed)
- Modify/create: `.env.local` (NOT committed)

---

- [ ] **Step 1: Install packages**

```bash
npm install next-auth@beta @auth/drizzle-adapter drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv
```
Expected: installs succeed; `next-auth` resolves to a `5.x` (beta) version. If peer-dep errors against React 19 / Next 16 appear, re-run with `--legacy-peer-deps` and note the exact installed version.

- [ ] **Step 2: Provision Neon Postgres (USER ACTION)**

Create a free project at https://neon.tech, create a database, copy the **pooled** connection string (`postgresql://...`). This is `DATABASE_URL`.

- [ ] **Step 3: Create Google OAuth credentials (USER ACTION)**

Google Cloud Console → APIs & Services → Credentials → Create Credentials → OAuth client ID → Web application.
- Authorized JavaScript origins: `http://localhost:3000` (+ production origin later).
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (+ `https://<prod-domain>/api/auth/callback/google` later).
Copy client ID → `GOOGLE_CLIENT_ID`, secret → `GOOGLE_CLIENT_SECRET`.

- [ ] **Step 4: Generate `AUTH_SECRET`**

```bash
npx auth secret
```
Writes `AUTH_SECRET` to `.env.local`. Fallback if unavailable: `openssl rand -base64 32` and paste as `AUTH_SECRET=...`.

- [ ] **Step 5: Write `.env.local` (real values, NOT committed)**

```
AUTH_SECRET=... (from step 4)
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
BOOTSTRAP_TECH_ADMIN_EMAILS=your-email@gmail.com
```

- [ ] **Step 6: Write committed `.env.example`**

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

```bash
git check-ignore .env.local
```
Expected: prints `.env.local`. If nothing prints, add `.env.local` to `.gitignore` before continuing.

- [ ] **Step 8: Verify build still works**

`npm run build` → succeeds (no code changes yet, just deps).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: add auth/db dependencies and env scaffolding"
```
