# Task 2 — Role logic (pure functions)

> **Read `00-overview.md` first** for global constraints.

**Deliverable:** Pure, dependency-free role helpers with a passing assertion script.

**Interfaces produced (imported by Tasks 4, 5, 8):**
- `type Role = "user" | "admin" | "tech_admin"`
- `ROLE_RANK: Record<Role, number>`
- `roleAtLeast(role: Role, min: Role): boolean`
- `parseBootstrapEmails(raw: string | undefined): string[]`
- `shouldBootstrapTechAdmin(email: string | null | undefined, currentRole: Role, bootstrapEmails: string[]): boolean`

**Files:**
- Create: `lib/auth/roles.ts`
- Create: `scripts/check-roles.ts` (throwaway assertion runner)

---

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

`npx tsx scripts/check-roles.ts`
Expected: FAILS — cannot find module `../lib/auth/roles`.

- [ ] **Step 3: Implement `lib/auth/roles.ts`** (pure — no framework imports, safe to import anywhere including client)

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

`npx tsx scripts/check-roles.ts`
Expected: prints `roles.ts: all assertions passed`.

- [ ] **Step 5: Commit**

```bash
git add lib/auth/roles.ts scripts/check-roles.ts
git commit -m "feat: add pure role-resolution logic with assertions"
```
