# Homepage UI Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the landing page layout with a cinematic hero banner, a custom-width 60/40 split for the Approach section, and a cleaner, caption-free aesthetic.

**Architecture:** 
- Refactor `Hero.tsx` to a fixed-height banner layout.
- Refactor `LifeAtBFB.tsx` to use a `max-w-[1300px]` container and an asymmetrical 60/40 grid/flex split.
- Perform a surgical removal of "eyebrow" captions across `LifeAtBFB.tsx`, `DiversePlacements.tsx`, and `app/page.tsx`.

**Tech Stack:** Next.js, Tailwind CSS v4, Framer Motion.

---

### Task 1: Cinematic Hero Banner

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Verify current layout**
  Run: `browser-use open http://localhost:3000 && browser-use screenshot hero_before.png`
  Expected: Full-screen hero with `92vh` height and centered content.

- [ ] **Step 2: Implement fixed-height banner and remove text box**
  - Change `section` class from `h-[92vh] min-h-[560px]` to `h-[600px]`.
  - Remove the `max-w-4xl` wrapper from the main content to eliminate the "box" feel, ensuring text is centered via `flex items-center justify-center`.
  - Update overlay opacity to `bg-midnight/50` for better contrast.

```tsx
// components/Hero.tsx
// Change line 49:
<section className="relative h-[600px] flex flex-col overflow-hidden pt-20 pb-8">

// Change line 68:
<div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
  {/* Remove the <div className="max-w-4xl mx-auto text-center"> wrapper */}
  <motion.div
    // ... existing props
    className="flex flex-col items-center gap-7"
  >
    {/* content */}
  </motion.div>
</div>
```

- [ ] **Step 3: Verify visual change**
  Run: `browser-use open http://localhost:3000 && browser-use screenshot hero_after.png`
  Expected: A 600px tall banner with centered text floating directly on the image.

- [ ] **Step 4: Commit**
  ```bash
  git add components/Hero.tsx
  git commit -m "ui: refactor hero to fixed-height cinematic banner"
  ```

### Task 2: The BFB Approach Layout Refactor

**Files:**
- Modify: `components/LifeAtBFB.tsx`

- [ ] **Step 1: Update section heading**
  Change `The Approach & Life at BFB` to `The BFB Approach`.

- [ ] **Step 2: Implement constrained width and 60/40 split**
  - Wrap the `blocks.map` section in a `div` with `max-w-[1300px] mx-auto w-full`.
  - Change image container width from `md:w-1/2` to `md:w-[60%]`.
  - Change text container width from `md:w-1/2` to `md:w-[40%]`.
  - Increase image `min-h` from `md:min-h-[360px]` to `md:min-h-[500px]`.

```tsx
// components/LifeAtBFB.tsx
// Change line 61:
The BFB Approach

// Change line 73:
<div className="max-w-[1300px] mx-auto w-full border-t border-slate-100 dark:border-white/8">
  {blocks.map((block, index) => (
    // ...
  ))}
</div>

// Change line 86 (Image half):
<div className="relative w-full md:w-[60%] min-h-[240px] md:min-h-[500px] overflow-hidden flex-shrink-0">

// Change line 99 (Text half):
<div className={`w-full md:w-[40%] px-8 md:px-14 py-12 md:py-16 ...`}>
```

- [ ] **Step 3: Remove blue eyebrow captions**
  Delete the `div` containing `{block.eyebrow}` (lines 106-108).

- [ ] **Step 4: Verify visual change**
  Run: `browser-use open http://localhost:3000 && browser-use screenshot approach_after.png`
  Expected: 60/40 split with taller images and `max-w-[1300px]` centering.

- [ ] **Step 5: Commit**
  ```bash
  git add components/LifeAtBFB.tsx
  git commit -m "ui: refactor approach section to 60/40 split with cinematic height"
  ```

### Task 3: Homepage Caption Cleanup

**Files:**
- Modify: `components/DiversePlacements.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Remove captions from Placements section**
  In `components/DiversePlacements.tsx`, remove the `span` containing `Career Tracks` (lines 38-40).

- [ ] **Step 2: Remove captions from Apply CTA section**
  In `app/page.tsx`, remove the `span` containing `Applications Open` (lines 22-24).

- [ ] **Step 3: Verify final state**
  Run: `browser-use open http://localhost:3000 && browser-use screenshot homepage_final.png`
  Expected: No blue accent captions remaining on the home page.

- [ ] **Step 4: Commit**
  ```bash
  git add components/DiversePlacements.tsx app/page.tsx
  git commit -m "ui: remove accent eyebrow captions across homepage"
  ```
