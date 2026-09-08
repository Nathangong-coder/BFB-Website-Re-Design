# Task 3 — Database schema, client, and migration

> **Read `00-overview.md` first** for global constraints. Requires Task 1's `DATABASE_URL` in `.env.local`.

**Deliverable:** Drizzle schema + Neon client + an applied migration; the four Auth.js tables exist in Neon with a `role` column on `user`.

**Interfaces:**
- Consumes: `DATABASE_URL` from `.env.local`.
- Produces: `db` (Drizzle instance) from `@/lib/db`; tables `users`, `accounts`, `sessions`, `verificationTokens` from `@/lib/db/schema`; `users.role` text column default `"user"`.

**Files:**
- Create: `lib/db/schema.ts`, `lib/db/index.ts`, `drizzle.config.ts`, `drizzle/` (generated)

---

- [ ] **Step 1: Write the schema** — create `lib/db/schema.ts`:

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

- [ ] **Step 2: Write the db client** — create `lib/db/index.ts`:

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

- [ ] **Step 3: Write drizzle-kit config** — create `drizzle.config.ts` (loads `.env.local` so drizzle-kit sees `DATABASE_URL`):

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

`npx drizzle-kit generate`
Expected: creates a `.sql` migration + metadata under `drizzle/`. Inspect the SQL — must create `user`, `account`, `session`, `verificationToken` tables and `user.role` with default `'user'`.

- [ ] **Step 5: Apply the migration to Neon**

`npx drizzle-kit migrate`
Expected: completes without error. Verify in the Neon SQL editor (or `npx drizzle-kit studio`) that the four tables exist and `user` has `role` + `createdAt`.

- [ ] **Step 6: Typecheck**

`npx tsc --noEmit` → no errors.

- [ ] **Step 7: Commit**

```bash
git add lib/db/schema.ts lib/db/index.ts drizzle.config.ts drizzle/
git commit -m "feat: add Drizzle schema, Neon client, and initial migration"
```
