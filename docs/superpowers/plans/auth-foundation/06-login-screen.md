# Task 6 — Login screen

> **Read `00-overview.md` first** for global constraints. Requires Tasks 4 & 5 committed.

**Deliverable:** A themed `/login` route with a "Continue with Google" button; redirects to `callbackUrl` (or `/`) when already signed in.

**Interfaces:**
- Consumes: `getSessionUser` from `@/lib/auth/dal`; `signIn` from `@/auth`.
- Produces: `/login` route; `<SignInButton callbackUrl?: string />`.

**Files:**
- Create: `app/login/page.tsx`, `components/auth/SignInButton.tsx`

---

- [ ] **Step 1: Write the sign-in button** (server component + inline server action) — create `components/auth/SignInButton.tsx`:

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

- [ ] **Step 2: Write the login page** (server component; redirects if already signed in) — create `app/login/page.tsx`:

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

`npx tsc --noEmit && npm run build` → both succeed; `/login` appears in the build route list.

- [ ] **Step 4: Verify (manual)**

`npm run dev` → visit `/login` signed out → button works, lands back at `/`. Visit `/login` signed in → immediately redirects to `/`.

- [ ] **Step 5: Commit**

```bash
git add app/login components/auth/SignInButton.tsx
git commit -m "feat: add themed /login screen with Google sign-in"
```
