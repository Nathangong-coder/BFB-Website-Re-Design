# Footer and Ticker Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the footer and refine the placements ticker on the homepage.

**Architecture:** Modifying existing components and global styles to reflect design changes.

**Tech Stack:** Next.js, Tailwind CSS, Framer Motion.

---

### Task 1: Update Ticker Animation Speed

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Modify ticker duration**

```css
/* app/globals.css */
@layer utilities {
  .animate-ticker {
    animation: ticker 46s linear infinite;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: update ticker animation duration to 46s"
```

### Task 2: Constrain Ticker Width

**Files:**
- Modify: `components/PlacementsTicker.tsx`

- [ ] **Step 1: Wrap marquee in container**

```tsx
// components/PlacementsTicker.tsx
// ... around line 64
      {/* Marquee */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-midnight to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-midnight to-transparent z-10 pointer-events-none" />

          <div className="flex gap-6 w-max animate-ticker hover:[animation-play-state:paused] px-3 items-center">
            {doubled.map((firm, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-48 h-24 bg-white dark:bg-glass border border-slate-200 dark:border-white/8 rounded-sm overflow-hidden p-3 transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={logoMap[firm]}
                  alt={firm}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
```

- [ ] **Step 2: Commit**

```bash
git add components/PlacementsTicker.tsx
git commit -m "style: constrain placements ticker width"
```

### Task 3: Replace Footer Logo with Text

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Replace logo link with copyright text**

```tsx
// components/Footer.tsx
// ... modify line 9-13
        <div className="text-center md:text-left text-sm text-slate-500 dark:text-silver/50 font-light">
          © 2026 Bruins in Finance and Banking
        </div>
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: replace footer logo with copyright text"
```

### Task 4: Verification

- [ ] **Step 1: Inspect changes**

Start dev server: `npm run dev`
Visit `http://localhost:3000`
1. Footer: Confirm text "© 2026 Bruins in Finance and Banking" appears correctly aligned on the left.
2. Ticker: Confirm it spans the width of the navbar content and moves slower (~46s total duration).
