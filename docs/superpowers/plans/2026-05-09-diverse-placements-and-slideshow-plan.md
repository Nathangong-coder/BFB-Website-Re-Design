# Diverse Placements Fix and Guest Speakers Slideshow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix visual inconsistencies in the Diverse Placements section and implement a cross-fading slideshow for the Guest Speakers block in the LifeAtBFB section.

**Architecture:** 
- Update existing section styling to match design patterns in `LifeAtBFB.tsx`.
- Create a standalone `SpeakerSlideshow` component for the image cycling logic.
- Integrate the slideshow into the `LifeAtBFB` blocks array.

**Tech Stack:** Next.js, Tailwind CSS, Framer Motion.

---

### Task 1: Fix Diverse Placements Styling

**Files:**
- Modify: `components/DiversePlacements.tsx`

- [ ] **Step 1: Update section background and container**

```tsx
// components/DiversePlacements.tsx
// Replace the section class:
// <section className="bg-slate-50 dark:bg-[#080C18] border-t border-slate-100 dark:border-white/8">
// With:
<section className="bg-white dark:bg-midnight border-t border-slate-100 dark:border-white/8">

// Replace the container div:
// <div className="max-w-[1300px] mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
// With:
<div className="max-w-[1300px] mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
```

- [ ] **Step 2: Update card styling to match LifeAtBFB**

```tsx
// components/DiversePlacements.tsx
// Update the inner card wrapper:
// <div className="border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-midnight">
// With:
<div className="border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-midnight">
```

- [ ] **Step 3: Commit**

```bash
git add components/DiversePlacements.tsx
git commit -m "style: align Diverse Placements section with LifeAtBFB styling"
```

### Task 2: Create SpeakerSlideshow Component

**Files:**
- Create: `components/SpeakerSlideshow.tsx`

- [ ] **Step 1: Implement the slideshow logic and UI**

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SpeakerSlideshowProps {
  images: string[];
}

export default function SpeakerSlideshow({ images }: SpeakerSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide lC = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="Guest Speaker"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-bfb-blue scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SpeakerSlideshow.tsx
git commit -m "feat: add SpeakerSlideshow component"
```

### Task 3: Integrate Slideshow into LifeAtBFB

**Files:**
- Modify: `components/LifeAtBFB.tsx`

- [ ] **Step 1: Import the new component**

```tsx
import SpeakerSlideshow from "./SpeakerSlideshow";
```

- [ ] **Step 2: Replace static image for Guest Speakers block**

```tsx
// components/LifeAtBFB.tsx
// Find the block where title is "Guest Speakers"
// Replace the <img> tag in the "Image half" section for that specific block.

// The blocks array is defined before the component.
// I will modify the block definition to include an image array for the slideshow.
```

- [ ] **Step 3: Commit**

L_S:
```bash
git add components/LifeAtBFB.tsx
git commit -m "feat: integrate SpeakerSlideshow into LifeAtBFB"
```

### Task 4: Verification

- [ ] **Step 1: Visual Inspection**
  - Check `DiversePlacements.tsx` for background color and alignment.
  - Verify `SpeakerSlideshow` auto-cycles and manual dots work.
  - Verify images from `public/speakers` are used.
- [ ] **Step 2: Run dev server and verify**
  - Run: `npm run dev`
  - Visit `http://localhost:3000`
  - Observe "Diverse Placements" and "Guest Speakers" sections.
