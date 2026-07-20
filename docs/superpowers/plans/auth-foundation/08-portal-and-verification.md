# Task 8 — Portal landing + end-to-end role verification

> **Read `00-overview.md` first** for global constraints. Requires all prior tasks committed. This task is the foundation's **acceptance test**.

**Deliverable:** An authed `/portal` landing that displays the user's role, plus a completed manual verification checklist proving auth, auto-login, gating, and live role reads.

**Interfaces:**
- Consumes: `requireUser` from `@/lib/auth/dal`; `roleAtLeast` from `@/lib/auth/roles`.
- Produces: `/portal` route (member area root; features 2–6 will extend it).

**Files:**
- Create: `app/portal/page.tsx`

---

- [ ] **Step 1: Write the portal page** (server component; authoritative gate via DAL) — create `app/portal/page.tsx`:

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

`npx tsc --noEmit && npm run build` → both succeed; `/portal` is dynamic (uses cookies) — correct and expected for this route only.

- [ ] **Step 3: Full manual verification checklist** (`npm run dev`)

1. Signed out, visit `/portal` → redirected to `/login?callbackUrl=/portal` (by `proxy.ts`).
2. Sign in with a **bootstrap** email → land at `/portal` showing role `tech_admin` + admin banner. Confirm `user.role = tech_admin` in Neon.
3. Reload the app → **still signed in** (auto-login), no re-prompt.
4. Sign out (navbar) → navbar shows "Sign in".
5. Sign in with a **non-bootstrap** email → `/portal` shows role `user`, no admin banner.
6. In Neon, manually set that user's `role` to `admin`; reload `/portal` → admin banner now appears (proves DB sessions read live roles).
7. Reset that user's `role` back to `user` in Neon.

- [ ] **Step 4: Commit**

```bash
git add app/portal/page.tsx
git commit -m "feat: add authed /portal landing and verify role gating end-to-end"
```

- [ ] **Step 5: Optionally remove the throwaway assertion script**

`scripts/check-roles.ts` may stay (useful for future `roles.ts` refactors) or be removed:
```bash
git rm scripts/check-roles.ts
git commit -m "chore: remove one-off roles assertion script"
```

---

## Foundation complete

With all 8 tasks done, the next sub-projects each get their own spec + plan:
2. Quiz history (save attempts + review)
3. Application submission + status tracking (applicant view)
4. Admin console — review/approve/reject applications
5. Role management UI (tech-admin promotes/demotes)
6. Future admin features
