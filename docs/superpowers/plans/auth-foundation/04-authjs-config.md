# Task 4 — Auth.js config, route handlers, and type augmentation

> **Read `00-overview.md` first** for global constraints. Requires Tasks 2 & 3 committed, and Task 1's OAuth creds in `.env.local`.

**Deliverable:** Working Google sign-in end-to-end; a user row + session row appear in Neon; the session's `user` carries `id` and `role`; bootstrap emails become `tech_admin`.

**Interfaces:**
- Consumes: `db`, tables from `@/lib/db`; `parseBootstrapEmails`, `shouldBootstrapTechAdmin`, `Role` from `@/lib/auth/roles`; env `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`, `BOOTSTRAP_TECH_ADMIN_EMAILS`.
- Produces: `handlers`, `auth`, `signIn`, `signOut` from `@/auth`.

**Files:**
- Create: `auth.ts` (root), `types/next-auth.d.ts`, `app/api/auth/[...nextauth]/route.ts`

---

- [ ] **Step 1: Read the auth guide** — `node_modules/next/dist/docs/01-app/02-guides/authentication.md` (Session Management + Authorization). Confirm the `database` session callback receives `{ session, user }`.

- [ ] **Step 2: Write the type augmentation** — create `types/next-auth.d.ts`:

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

- [ ] **Step 3: Write `auth.ts`** at the project root:

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

- [ ] **Step 4: Write the route handler** — create `app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 5: Typecheck**

`npx tsc --noEmit` → no errors. If `@auth/drizzle-adapter`'s option names differ from the installed version's types, correct them to match the installed package's exported types (four table roles: users/accounts/sessions/verificationTokens), then re-run.

- [ ] **Step 6: Verify sign-in end-to-end (manual)**

`npm run dev` → visit `http://localhost:3000/api/auth/signin` → Google → complete OAuth.
Expected: redirects back signed in; a `user` row appears in Neon (role `tech_admin` if your email is in `BOOTSTRAP_TECH_ADMIN_EMAILS`, else `user`) and a `session` row exists.
If Google returns `redirect_uri_mismatch`, fix the Authorized redirect URI (Task 1 Step 3) to exactly `http://localhost:3000/api/auth/callback/google`.

- [ ] **Step 7: Commit**

```bash
git add auth.ts types/next-auth.d.ts app/api/auth
git commit -m "feat: configure Auth.js Google provider with DB sessions and tech-admin bootstrap"
```
