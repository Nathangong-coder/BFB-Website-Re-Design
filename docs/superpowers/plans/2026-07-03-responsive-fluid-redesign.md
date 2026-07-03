# Responsive Fluid Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage scale proportionally across all screen widths (anchored to the 16" Aero at 1152px) and give every laptop down to 11.6" the multi-column layout, plus a rethought mobile experience.

**Architecture:** Introduce a fluid `clamp()` token system in Tailwind v4's `@theme` (font-size tokens via `--text-*`, spacing tokens via `--spacing-*`, one layout breakpoint via `--breakpoint-lap`). Homepage components swap fixed sizes/breakpoints for these tokens. The phone (<600px) experience is restructured: full-screen overlay nav, hero CTA, reordered sections, restacked footer.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4 (CSS-first, no config file), Framer Motion v12, Lucide React.

## Global Constraints

- **Reference anchor:** 16" Aero at **1152px** effective width — its element proportions are the target at all widths. Copied from spec §1.
- **Layout breakpoint:** phone < **600px**, laptop ≥ 600px (`--breakpoint-lap: 600px`). All content column-switches use `lap:`. Spec §4.
- **Navbar switch stays at `md` (768px)** — the horizontal menu overflows below ~700px, so the overlay hamburger serves < 768px even though content goes multi-column at 600px. (Rationale documented here; intentional divergence from content breakpoint.)
- **Tailwind v4 CSS-first only** — no `tailwind.config.*`; all tokens live in `app/globals.css` `@theme`. Consume via generated utilities (`text-hero`, `h-nav`, `py-section`, etc.), not arbitrary `[var(...)]`.
- **Caps are deliberate:** section vertical padding caps at 128px (current `py-36`=144px is oversized); display type caps so large monitors don't balloon. Spec §3.3.
- **Preserve** `max-w-[1400px]` content container, brand colors, fonts, logo, and all copy. No content/data/backend changes. Spec §2.
- **Accessibility:** new animations respect `prefers-reduced-motion`; mobile tap targets ≥ 48px; hero height uses `svh`. Spec §5, §7.
- **AGENTS.md caution:** this is Next.js 16 — if any task introduces a Next API (it shouldn't; this is styling only), read `node_modules/next/dist/docs/` first.

---

### Task 1: Fluid token foundation

**Files:**
- Modify: `app/globals.css` (the `@theme inline` block, lines 20-30; plus a new reduced-motion rule)

**Interfaces:**
- Consumes: nothing.
- Produces (utilities every later task uses):
  - Font size: `text-eyebrow`, `text-caption`, `text-body`, `text-body-lg`, `text-h3`, `text-h2`, `text-hero`
  - Spacing (usable as `h-`, `min-h-`, `w-`, `p-`, `px-`, `py-`, `gap-`): `nav`, `logo`, `gutter`, `section`, `block`, `card`
  - Breakpoint variant: `lap:` (≥600px)

- [ ] **Step 1: Add tokens to the `@theme inline` block**

In `app/globals.css`, replace this block (lines 20-30):

```css
@theme inline {
  --color-bg: var(--bg);
  --color-bg-secondary: var(--bg-secondary);
  --color-midnight: var(--midnight);
  --color-bfb-blue: var(--bfb-blue);
  --color-accent: var(--accent);
  --color-silver: var(--silver);
  --color-glass: var(--glass);
  --font-serif: var(--font-libre-baskerville), serif;
  --font-sans: var(--font-dm-sans), sans-serif;
}
```

with:

```css
@theme inline {
  --color-bg: var(--bg);
  --color-bg-secondary: var(--bg-secondary);
  --color-midnight: var(--midnight);
  --color-bfb-blue: var(--bfb-blue);
  --color-accent: var(--accent);
  --color-silver: var(--silver);
  --color-glass: var(--glass);
  --font-serif: var(--font-libre-baskerville), serif;
  --font-sans: var(--font-dm-sans), sans-serif;

  /* Layout breakpoint: phone (<600px) -> laptop (>=600px) */
  --breakpoint-lap: 600px;

  /* Fluid type scale — anchored so each hits its Aero@1152px size */
  --text-eyebrow: clamp(0.625rem, 0.87vw, 0.75rem);   /* 10px @1152 */
  --text-caption: clamp(0.75rem, 1.05vw, 0.8125rem);  /* 12px @1152 */
  --text-body: clamp(0.9375rem, 1.4vw, 1.0625rem);    /* 16px @1152 */
  --text-body-lg: clamp(1rem, 1.6vw, 1.1875rem);      /* 18px @1152 */
  --text-h3: clamp(1.5rem, 3.1vw, 2.375rem);          /* 36px @1152 */
  --text-h2: clamp(2rem, 5.2vw, 4rem);                /* 60px @1152 */
  --text-hero: clamp(2.25rem, 6.25vw, 5rem);          /* 72px @1152 */

  /* Fluid spacing/structural scale */
  --spacing-nav: clamp(3.5rem, 6.95vw, 5rem);         /* 80px @1152, caps 80 */
  --spacing-logo: clamp(2.5rem, 6.1vw, 4.375rem);     /* 70px @1152, caps 70 */
  --spacing-gutter: clamp(1rem, 4vw, 2.5rem);         /* page side padding */
  --spacing-section: clamp(3.5rem, 9vw, 8rem);        /* section vertical padding */
  --spacing-block: clamp(2.5rem, 5.55vw, 4rem);       /* 64px @1152 */
  --spacing-card: clamp(1.75rem, 5.5vw, 4rem);        /* card inner padding */
}
```

- [ ] **Step 2: Add a reduced-motion safeguard**

Append to the end of `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: build completes with exit code 0 (no CSS/PostCSS errors). The new utilities are unused so far, so nothing else should change.

- [ ] **Step 4: Verify lint passes**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Smoke-test a token renders**

Run: `npm run dev`, open `http://localhost:3000`, in DevTools console run:
```js
const el = document.createElement('div'); el.className='h-nav w-nav'; document.body.append(el);
getComputedStyle(el).height
```
Expected: a px value that changes when you resize the window (e.g. ~50px at 725px wide, ~80px at ≥1152px). Remove the element afterward. This confirms `--spacing-*` generated working utilities.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "feat: add fluid clamp() token scale and lap breakpoint

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Navbar — token sizing + full-screen overlay mobile nav

**Files:**
- Modify: `components/Navbar.tsx`

**Interfaces:**
- Consumes: `h-nav`, `h-logo`, `px-gutter` (Task 1); `staggerContainer`, `fadeInUp` from `@/lib/animations`.
- Produces: nothing consumed by later tasks.

**Note:** The horizontal-menu vs. hamburger switch **stays at `md` (768px)** (see Global Constraints). Only the bar sizing is tokenized and the mobile menu is replaced with a full-screen overlay.

- [ ] **Step 1: Update imports and add overlay behavior hooks**

In `components/Navbar.tsx`, change the import lines (1-8) to:

```tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import ThemeToggle from "./ThemeToggle";
```

Inside `export default function Navbar()`, immediately after the existing `const timeoutRef = ...` line (108), add:

```tsx
  const reduceMotion = useReducedMotion();

  // Close the overlay on navigation and lock body scroll while it is open
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
```

- [ ] **Step 2: Tokenize the bar, container, and logo**

Replace the container/bar/logo section. Change line 121 from:

```tsx
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between h-20 items-center">
```

to:

```tsx
      <div className="max-w-[1400px] mx-auto px-gutter">
        <div className="flex justify-between h-nav items-center">
```

Change the two logo `<img>` classNames (lines 128 and 133) from `className="h-[70px] w-auto object-contain dark:hidden"` and `className="h-[70px] w-auto object-contain hidden dark:block"` to use `h-logo` instead of `h-[70px]`:

```tsx
                className="h-logo w-auto object-contain dark:hidden"
```
```tsx
                className="h-logo w-auto object-contain hidden dark:block"
```

- [ ] **Step 3: Replace the inline accordion with a full-screen overlay**

Replace the entire mobile `AnimatePresence` block (current lines 191-279, from `<AnimatePresence>` through its closing `</AnimatePresence>`) with:

```tsx
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-[60] bg-white dark:bg-[#080C18] flex flex-col"
          >
            {/* Overlay header */}
            <div className="flex items-center justify-between h-nav px-gutter border-b border-slate-100 dark:border-white/8 flex-shrink-0">
              <img
                src="/bfb-transparent.png"
                alt="BFB Logo"
                className="h-logo w-auto object-contain dark:hidden"
              />
              <img
                src="/dark-blue-BFB-logo.png"
                alt="BFB Logo"
                className="h-logo w-auto object-contain hidden dark:block"
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-2 -mr-2 text-slate-600 dark:text-silver/70 hover:text-slate-900 dark:hover:text-silver transition-colors"
              >
                <X size={26} />
              </button>
            </div>

            {/* Scrollable nav list */}
            <motion.nav
              variants={reduceMotion ? undefined : staggerContainer}
              initial={reduceMotion ? undefined : "hidden"}
              animate={reduceMotion ? undefined : "visible"}
              className="flex-1 overflow-y-auto px-gutter py-6 flex flex-col gap-1"
            >
              {navItems.map((item) => (
                <motion.div key={item.name} variants={reduceMotion ? undefined : fadeInUp}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === item.name ? null : item.name)
                        }
                        className="flex items-center justify-between w-full min-h-[52px] px-2 text-lg text-slate-800 dark:text-silver"
                      >
                        {item.name}
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-200 ${
                            mobileExpanded === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pl-4 border-l border-bfb-blue/20 ml-2"
                          >
                            {item.children.map((child) =>
                              child.children ? (
                                <div key={child.name} className="py-1">
                                  <span className="block px-2 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    {child.name}
                                  </span>
                                  {child.children.map((sub) => (
                                    <Link
                                      key={sub.name}
                                      href={sub.href || "#"}
                                      onClick={() => setMobileOpen(false)}
                                      className="flex items-center min-h-[48px] px-2 text-base text-slate-500 dark:text-silver/60 hover:text-bfb-blue dark:hover:text-silver transition-colors"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <Link
                                  key={child.name}
                                  href={child.href || "#"}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center min-h-[48px] px-2 text-base text-slate-600 dark:text-silver/70 hover:text-bfb-blue dark:hover:text-silver transition-colors"
                                >
                                  {child.name}
                                </Link>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center min-h-[52px] px-2 text-lg text-slate-800 dark:text-silver hover:text-bfb-blue transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.nav>

            {/* Pinned primary CTA */}
            <div className="flex-shrink-0 px-gutter py-5 border-t border-slate-100 dark:border-white/8">
              <Link
                href="/join"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-bfb-blue text-white py-4 rounded-sm text-base font-semibold hover:bg-bfb-blue/90 transition-colors"
              >
                Join Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
```

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: exit code 0, no errors, no unused-import warnings (all of `Menu`, `X`, `ChevronRight`, `ChevronDown`, `staggerContainer`, `fadeInUp` are now used).

- [ ] **Step 5: Visual check**

Run `npm run dev`. Resize the browser to ~500px wide (or use DevTools device toolbar):
- Tap the hamburger → a full-screen overlay covers the page; background does not scroll.
- Nav rows are large (≥48px), "Team/Events/Resources" expand inline, "Resources → Tech/Newsletters" show nested sub-items.
- "Join Us" is pinned at the bottom; the X closes the overlay.
At ≥768px: the horizontal menu shows as before; the bar height and logo shrink slightly on a narrow (~700px) window vs. a wide one.

- [ ] **Step 6: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: tokenize navbar and add full-screen overlay mobile nav

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Hero — fluid sizing, svh height, mobile CTA

**Files:**
- Modify: `components/Hero.tsx`

**Interfaces:**
- Consumes: `text-hero`, `text-eyebrow`, `text-body`, `pt-nav` (Task 1).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Import `Link`**

Add to the top of `components/Hero.tsx`, after the existing imports (line 5):

```tsx
import Link from "next/link";
```

- [ ] **Step 2: Fluid section height and top padding**

Change the `<section>` opening tag (line 50) from:

```tsx
    <section className="relative min-h-[750px] h-[90vh] max-h-[1000px] flex flex-col items-center justify-center overflow-hidden pt-20 pb-8 bg-midnight">
```

to:

```tsx
    <section className="relative min-h-[100svh] lap:min-h-0 lap:h-[88svh] max-h-[1000px] flex flex-col items-center justify-center overflow-hidden pt-nav pb-8 bg-midnight">
```

- [ ] **Step 3: Fluid eyebrow, headline, and subtext**

Change the eyebrow `<span>` (line 72) from `className="text-xs font-bold tracking-[0.3em] uppercase text-white/60"` to:

```tsx
          <span className="text-eyebrow font-bold tracking-[0.3em] uppercase text-white/60">
```

Change the `<h1>` (line 76) from `className="text-4xl md:text-7xl font-serif text-white leading-[1.1] min-h-[1.2em] flex items-center justify-center max-w-6xl mx-auto"` to:

```tsx
          <h1 className="text-hero font-serif text-white leading-[1.1] min-h-[1.2em] flex items-center justify-center max-w-6xl mx-auto">
```

Change the `<motion.p>` (line 87) from `className="text-white/55 text-sm md:text-base leading-relaxed font-light max-w-2xl"` to:

```tsx
            className="text-white/55 text-body leading-relaxed font-light max-w-2xl"
```

- [ ] **Step 4: Add a visible hero CTA**

Immediately after the closing `</motion.p>` (line 91) and before the closing `</motion.div>` (line 92), add:

```tsx
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: settled ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Link
              href="/join"
              className="inline-flex items-center justify-center min-h-[48px] px-10 py-3 bg-bfb-blue text-white text-body font-semibold rounded-sm hover:bg-bfb-blue/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-bfb-blue/20"
            >
              Join BFB
            </Link>
          </motion.div>
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: exit code 0, no errors.

- [ ] **Step 6: Visual check**

Run `npm run dev`. At ~375px, ~725px, and ~1152px wide:
- The headline is a proportionally consistent share of the width (never touching edges, never clipped), floors readable on the phone.
- No vertical clipping/overlap of the fixed navbar (content starts below it).
- A "Join BFB" button appears once the typing animation settles, at all widths.
- On a phone-height viewport, the hero fills the screen without the old 750px overflow.

- [ ] **Step 7: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: fluid hero with svh height and mobile CTA

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: LifeAtBFB + SpeakerSlideshow — 600px breakpoint, fluid, mobile cards

**Files:**
- Modify: `components/LifeAtBFB.tsx`
- Modify: `components/SpeakerSlideshow.tsx`

**Interfaces:**
- Consumes: `text-eyebrow`, `text-h2`, `text-h3`, `text-body`, `py-section`, `px-gutter`, `gap-block`, `p-card` (Task 1); `lap:` variant.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Fluid section header**

In `components/LifeAtBFB.tsx`, change the header wrapper (line 69) from `className="py-16 px-4 text-center"` to `className="py-section px-gutter text-center"`.

Change the eyebrow `<motion.span>` (line 75) from `className="inline-block text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-5"` to:

```tsx
          className="inline-block text-eyebrow font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-5"
```

Change the `<motion.h2>` (line 84) from `className="text-3xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6"` to:

```tsx
          className="text-h2 font-serif text-slate-900 dark:text-silver mb-6"
```

- [ ] **Step 2: Fluid blocks container**

Change the blocks container (line 100) from:

```tsx
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-16 py-12 px-6 sm:px-6 lg:px-8">
```

to:

```tsx
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-block py-section px-gutter">
```

- [ ] **Step 3: Switch column collapse to the `lap` breakpoint**

Change the block `<motion.div>` className (lines 108-110) from:

```tsx
            className={`flex flex-col border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden md:flex-row ${
              !block.imageLeft ? "md:flex-row-reverse" : ""
            }`}
```

to:

```tsx
            className={`flex flex-col border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden lap:flex-row ${
              !block.imageLeft ? "lap:flex-row-reverse" : ""
            }`}
```

- [ ] **Step 4: Fluid image and text halves**

Change the image half `<div>` (line 113) from:

```tsx
            <div className="relative w-full mx-auto md:max-w-none md:w-[55%] lg:w-[60%] h-[300px] md:h-auto md:min-h-[450px] lg:min-h-[550px] overflow-hidden">
```

to:

```tsx
            <div className="relative w-full mx-auto lap:w-[58%] h-[40svh] lap:h-auto lap:min-h-[clamp(22rem,42vw,34rem)] overflow-hidden">
```

Change the text half `<div>` (lines 118-120) from:

```tsx
            <div
              className="w-full md:w-[45%] lg:w-[40%] px-8 md:px-12 lg:px-16 py-12 md:py-16 flex flex-col justify-center gap-4 bg-white dark:bg-midnight"
            >
```

to:

```tsx
            <div className="w-full lap:w-[42%] p-card flex flex-col justify-center gap-4 bg-white dark:bg-midnight">
```

- [ ] **Step 5: Fluid text inside the block**

Change the eyebrow `<span>` (line 122) from `className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-bfb-blue/70"` to:

```tsx
                <span className="text-eyebrow font-bold tracking-[0.2em] uppercase text-bfb-blue/70">
```

Change the `<h3>` (line 125) from `className="text-xl md:text-3xl lg:text-4xl font-serif text-slate-900 dark:text-silver leading-tight"` to:

```tsx
                <h3 className="text-h3 font-serif text-slate-900 dark:text-silver leading-tight">
```

Change the body `<p>` (line 130) from `className="text-slate-500 dark:text-silver/55 leading-relaxed font-light text-sm lg:text-base max-w-xl whitespace-pre-line"` to:

```tsx
                <p className="text-slate-500 dark:text-silver/55 leading-relaxed font-light text-body max-w-xl whitespace-pre-line">
```

Change the list `<ul>` (line 134) from `className="space-y-2 text-slate-600 dark:text-silver/70 text-sm lg:text-base font-light"` to:

```tsx
                  <ul className="space-y-2 text-slate-600 dark:text-silver/70 text-body font-light">
```

- [ ] **Step 6: Tokenize the slideshow caption**

In `components/SpeakerSlideshow.tsx`, change the caption `<motion.span>` (line 78) from `className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80 bg-black/40 px-2 py-1 rounded-sm backdrop-blur-sm"` to:

```tsx
            className="text-eyebrow font-bold tracking-[0.2em] uppercase text-white/80 bg-black/40 px-2 py-1 rounded-sm backdrop-blur-sm"
```

- [ ] **Step 7: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: exit code 0, no errors.

- [ ] **Step 8: Visual check**

Run `npm run dev`. At **~600px and ~725px** wide: each "Approach" block is **two columns** (image + text side by side), not stacked — this is the core fix for the 13" laptop. Text is readable, not cramped; no horizontal scrollbar. At **~1152px**: matches the current Aero look. At **~500px** (phone): blocks stack, image is a ~40svh banner above the text.

- [ ] **Step 9: Commit**

```bash
git add components/LifeAtBFB.tsx components/SpeakerSlideshow.tsx
git commit -m "feat: fluid approach blocks with 600px multi-column breakpoint

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: PlacementsTicker — fluid tiles and heading

**Files:**
- Modify: `components/PlacementsTicker.tsx`

**Interfaces:**
- Consumes: `text-h2`, `text-body`, `py-section`, `px-gutter` (Task 1).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Fluid section padding and heading**

Change the `<section>` (line 31) from `className="py-16 border-t border-slate-100 dark:border-white/8 bg-white dark:bg-midnight overflow-hidden"` to:

```tsx
    <section className="py-section border-t border-slate-100 dark:border-white/8 bg-white dark:bg-midnight overflow-hidden">
```

Change the `<motion.h2>` (line 38) from `className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-silver"` to:

```tsx
          className="text-h2 font-serif text-slate-900 dark:text-silver"
```

Change the `<p>` (line 42) from `className="text-slate-500 dark:text-silver/50 text-sm mt-2 font-light"` to:

```tsx
        <p className="text-slate-500 dark:text-silver/50 text-body mt-2 font-light max-w-2xl mx-auto">
```

- [ ] **Step 2: Fluid marquee container and logo tiles**

Change the marquee container (line 55) from `className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 overflow-hidden relative"` to:

```tsx
      <div className="max-w-[1400px] mx-auto px-gutter overflow-hidden relative">
```

Change the logo tile `<div>` (line 63) from:

```tsx
              className="flex items-center justify-center w-40 h-40 bg-white dark:bg-glass border border-slate-200 dark:border-white/8 rounded-sm overflow-hidden p-6 transition-transform duration-300 hover:scale-105"
```

to:

```tsx
              className="flex items-center justify-center w-[clamp(6rem,12vw,10rem)] h-[clamp(6rem,12vw,10rem)] bg-white dark:bg-glass border border-slate-200 dark:border-white/8 rounded-sm overflow-hidden p-[clamp(0.75rem,2vw,1.5rem)] transition-transform duration-300 hover:scale-105"
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: exit code 0, no errors.

- [ ] **Step 4: Visual check**

Run `npm run dev`. At ~500px the logo tiles are ~96px (not the oversized 160px); at ~1152px they are ~138px. The marquee still scrolls and pauses on hover; edge fades intact; no horizontal page scroll.

- [ ] **Step 5: Commit**

```bash
git add components/PlacementsTicker.tsx
git commit -m "feat: fluid placements ticker tiles and heading

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Homepage Apply CTA + mobile section reorder

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `text-h2`, `text-body-lg`, `py-section`, `px-gutter` (Task 1); `lap:` variant; `order-*` utilities (built-in).
- Produces: nothing consumed by later tasks.

**Reorder logic:** DOM order is Hero, LifeAtBFB, PlacementsTicker, Apply. On phones we want Hero, **Placements**, **Approach**, Apply (social proof first). Achieved with flex `order`: on phone Hero=0 (default), Placements=1, LifeAtBFB=2, Apply=3; at `lap` all reset to `order-none` (0) so DOM order returns. (Note: this diverges visual order from tab/DOM order on phones only — acceptable for full-width sections.)

- [ ] **Step 1: Wrap the reordered sections and set order classes**

In `app/page.tsx`, replace the component list (lines 8-11):

```tsx
    <div className="flex flex-col min-h-screen">
      <Hero />
      <LifeAtBFB />
      <PlacementsTicker />
```

with:

```tsx
    <div className="flex flex-col min-h-screen">
      <Hero />
      <div className="order-2 lap:order-none flex flex-col">
        <LifeAtBFB />
      </div>
      <div className="order-1 lap:order-none flex flex-col">
        <PlacementsTicker />
      </div>
```

- [ ] **Step 2: Fluid Apply CTA section**

Change the Apply `<section>` (line 14) from `className="relative py-36 px-4 sm:px-6 lg:px-8 overflow-hidden"` to:

```tsx
      <section id="apply" className="relative order-3 lap:order-none py-section px-gutter overflow-hidden">
```

Change the `<h2>` (line 21) from `className="text-3xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6 leading-tight"` to:

```tsx
            className="text-h2 font-serif text-slate-900 dark:text-silver mb-6 leading-tight"
```

Change the `<p>` (line 26) from `className="text-slate-500 dark:text-silver/50 text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed font-light"` to:

```tsx
          <p className="text-slate-500 dark:text-silver/50 text-body-lg mb-12 max-w-md mx-auto leading-relaxed font-light">
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: exit code 0, no errors.

- [ ] **Step 4: Visual check**

Run `npm run dev`. At **~500px** (phone): section order top-to-bottom is Hero → **Our Placements** → **The BFB Approach** → **Interested?** CTA. At **≥600px**: order returns to Hero → Approach → Placements → CTA (unchanged from today). The CTA's vertical padding is noticeably tighter on the phone than the old 144px.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: fluid apply CTA and phone-first section reorder

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Footer — fluid sizing + mobile restack

**Files:**
- Modify: `components/Footer.tsx`

**Interfaces:**
- Consumes: `min-h-nav`, `px-gutter`, `text-body` (Task 1); `lap:` variant.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Fluid footer shell that stacks on phones**

Change the `<footer>` (line 7) from:

```tsx
    <footer className="h-20 bg-slate-50 dark:bg-midnight border-t border-slate-100 dark:border-white/8 flex items-center">
```

to:

```tsx
    <footer className="min-h-nav py-5 lap:py-0 bg-slate-50 dark:bg-midnight border-t border-slate-100 dark:border-white/8 flex items-center">
```

Change the inner container (line 8) from:

```tsx
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 flex justify-between items-center">
```

to:

```tsx
      <div className="max-w-[1400px] mx-auto w-full px-gutter flex flex-col gap-5 lap:flex-row lap:justify-between lap:gap-0 items-center">
```

- [ ] **Step 2: Make the Join button always visible and tokenize copyright**

Change the copyright `<div>` (line 9) from `className="text-center md:text-left text-sm text-slate-500 dark:text-silver/50 font-light"` to:

```tsx
        <div className="text-center lap:text-left text-body text-slate-500 dark:text-silver/50 font-light">
```

Change the "Join Us" `<Link>` (line 16) from `className="hidden sm:inline-flex items-center px-4 py-2 bg-bfb-blue text-white text-[13px] font-semibold rounded-sm hover:bg-bfb-blue/90 transition-colors"` to:

```tsx
            className="inline-flex items-center min-h-[44px] px-5 py-2 bg-bfb-blue text-white text-body font-semibold rounded-sm hover:bg-bfb-blue/90 transition-colors"
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: exit code 0, no errors.

- [ ] **Step 4: Visual check**

Run `npm run dev`. At **~500px**: the footer stacks into centered rows (copyright, then Join + social icons), all tap targets comfortable, "Join Us" visible. At **≥600px**: single row, copyright left / actions right, as today.

- [ ] **Step 5: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: fluid footer that restacks on phones

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: On-device validation & tuning

**Files:**
- Modify (only if tuning needed): `app/globals.css`

**Interfaces:**
- Consumes: everything from Tasks 1-7.
- Produces: final calibrated tokens.

- [ ] **Step 1: Full-width visual sweep**

Run `npm run dev`. Using DevTools responsive mode, step through widths **375, 500, 600, 725, 900, 1152, 1440, 1920** and confirm at each:
- No horizontal scrollbar / no element touching or overflowing the viewport edges.
- The 600px and 725px widths show the **multi-column** Approach blocks (the primary bug fix).
- Type and spacing look proportionally consistent — the 1152px view matches the pre-change Aero look; smaller widths are a scaled-down version, not a re-flowed phone view (until <600px).

- [ ] **Step 2: On-device check (the two real laptops)**

On the 13.3" L13 Yoga and 16" Aero, load the site at 100% zoom. Confirm the L13 now shows the laptop (multi-column) layout at a comfortable size and the Aero is unchanged. If the L13 still drops to the phone layout, its effective width is below 600px — lower `--breakpoint-lap` (e.g. to `560px`) in `app/globals.css` and re-check.

- [ ] **Step 3: Mobile + accessibility check**

On a phone (or ~390px emulation): overlay nav opens/locks scroll/closes; hero CTA present; section order is Placements-before-Approach; footer stacked. Toggle OS "reduce motion" and confirm the marquee/animations settle instead of looping.

- [ ] **Step 4: Tune if needed, then commit**

If any clamp cap looked wrong during the sweep (e.g. display type too large at 1920px or too small at 375px), adjust the specific `--text-*` / `--spacing-*` `min` or `max` in `app/globals.css` and re-run Step 1. Then:

```bash
git add app/globals.css
git commit -m "fix: calibrate fluid token caps and breakpoint after on-device testing

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

(If no tuning was needed, skip the commit.)

---

## Rollout note (out of scope for this plan)

Once the homepage is validated, the same mechanical swaps apply to the other ~18 routes: replace fixed `text-*`/`h-*`/`px-*`/`py-*`/`gap-*` patterns with the tokens, and re-point `md:`/`lg:` column switches to `lap:`. That is a separate plan per spec §6.
