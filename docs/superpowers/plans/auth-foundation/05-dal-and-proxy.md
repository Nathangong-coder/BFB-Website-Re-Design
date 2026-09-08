# Task 5 — Data Access Layer + proxy guard

> **Read `00-overview.md` first** for global constraints. Requires Tasks 2 & 4 committed.

**Deliverable:** Reusable server-side authorization guards and an optimistic `proxy.ts` redirect protecting the `/portal` prefix.

**Interfaces:**
- Consumes: `auth` from `@/auth`; `roleAtLeast`, `Role` from `@/lib/auth/roles`.
- Produces (imported by Tasks 6, 8 and future features):
  - `getSessionUser(): Promise<SessionUser | null>` (`SessionUser = Session["user"]`)
  - `requireUser(): Promise<SessionUser>` — redirects to `/login` if unauthenticated
  - `requireRole(min: Role): Promise<SessionUser>` — redirects `/login` if unauthenticated, `/` if under-privileged

**Files:**
- Create: `lib/auth/dal.ts`, `proxy.ts` (root)

---

- [ ] **Step 1: Write the DAL** — create `lib/auth/dal.ts`:

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

- [ ] **Step 2: Read the proxy doc** — `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` (Migration + Using Cookies). Confirm the `proxy` export + `config.matcher` shape.

- [ ] **Step 3: Write `proxy.ts`** at the project root (optimistic cookie presence check only — DB sessions mean the cookie holds no role, so authoritative role checks stay in the DAL):

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

`npx tsc --noEmit && npm run build` → both succeed.
Note: `server-only` must NOT be imported into any client component (it is used only by `dal.ts`, consumed server-side).

- [ ] **Step 5: Commit**

```bash
git add lib/auth/dal.ts proxy.ts
git commit -m "feat: add auth DAL guards and proxy redirect for /portal"
```
