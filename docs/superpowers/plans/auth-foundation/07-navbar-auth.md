# Task 7 — Navbar auth affordance

> **Read `00-overview.md` first** for global constraints. Requires Task 4 committed (for `useSession` to resolve against `/api/auth/session`).

**Deliverable:** Navbar shows "Sign in" when logged out, and avatar + name + "Sign out" when logged in — driven by a **client** session boundary so the root layout stays static (marketing pages remain statically rendered).

**Interfaces:**
- Consumes: `useSession`, `signOut`, `SessionProvider` from `next-auth/react`.
- Produces: `<SessionProviderWrapper>`, `<AuthNav />` (self-contained; reads its own session client-side).

**Files:**
- Create: `components/auth/SessionProviderWrapper.tsx`, `components/auth/AuthNav.tsx`
- Modify: `app/layout.tsx`, `components/Navbar.tsx`

---

- [ ] **Step 1: Write the session provider wrapper** — create `components/auth/SessionProviderWrapper.tsx`:

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

- [ ] **Step 2: Wrap the app in the provider** (keep layout static — do NOT call `auth()` / `getSessionUser()` in the layout, and do NOT make `RootLayout` async).

Modify `app/layout.tsx`. Add the import alongside the existing component imports:
```tsx
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";
```
Change the body content from:
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

- [ ] **Step 3: Write `AuthNav`** (client; matches existing nav styling idioms) — create `components/auth/AuthNav.tsx`:

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

- [ ] **Step 4: Mount `AuthNav` in the Navbar** — modify `components/Navbar.tsx`:

Add the import after `import ThemeToggle from "./ThemeToggle";`:
```tsx
import AuthNav from "./auth/AuthNav";
```
In the desktop actions cluster (`<div className="flex items-center gap-2 justify-self-end">`, ~line 189), add `<AuthNav />` right after `<ThemeToggle />`:
```tsx
          <div className="flex items-center gap-2 justify-self-end">
            <ThemeToggle />
            <AuthNav />
            <Link
              href="/contact"
```
In the mobile pinned-CTA block (`<div className="flex-shrink-0 px-gutter py-5 border-t ...">`, ~line 322), add above the existing "Join Us" link:
```tsx
              <Link
                href="/portal"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full text-center mb-3 text-slate-600 dark:text-silver/70 py-3 text-base"
              >
                My Account
              </Link>
```
(`/portal` redirects to `/login` when signed out via `proxy.ts`, so one link serves both states on mobile.)

- [ ] **Step 5: Typecheck + build**

`npx tsc --noEmit && npm run build` → both succeed. Confirm `/` is still statically rendered in the build output (the `○ (Static)` marker on `/` should remain — the client session boundary must not force it dynamic).

- [ ] **Step 6: Verify (manual)**

`npm run dev`:
- Signed out: navbar shows "Sign in"; clicking → `/login`.
- After signing in: navbar shows avatar + name + "Sign out"; "Sign out" returns to `/` signed out.

- [ ] **Step 7: Commit**

```bash
git add components/auth/SessionProviderWrapper.tsx components/auth/AuthNav.tsx app/layout.tsx components/Navbar.tsx
git commit -m "feat: add navbar auth affordance via client session boundary"
```
