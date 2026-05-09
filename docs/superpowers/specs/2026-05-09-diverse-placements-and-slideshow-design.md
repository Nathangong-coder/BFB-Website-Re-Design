# Diverse Placements Fix and Guest Speakers Slideshow Design

This document outlines the design for fixing the Diverse Placements section styling and implementing a slideshow for the Guest Speakers block.

## Overview
The goal is to ensure visual consistency between the "LifeAtBFB" and "Diverse Placements" sections and to add interactive visual interest to the Guest Speakers block.

## Requirements

### 1. Diverse Placements Fix
- **Background**: Remove the off-white/gray section background. Change `bg-slate-50 dark:bg-[#080C18]` to `bg-white dark:bg-midnight`.
- **Alignment**: Align the container width and padding with the "LifeAtBFB" blocks (`max-w-[1300px] mx-auto` and `py-12`).
- **Styling**: Refine the inner card's border and rounding (`rounded-xl`, `border-white/10`) to match the "LifeAtBFB" components.

### 2. Guest Speakers Slideshow
- **Component**: Create a `SpeakerSlideshow` component.
- **Images**: Use all photos located in `public/speakers/`.
- **Behavior**:
  - **Auto-Cycle**: Images transition automatically every 5 seconds.
  - **Transitions**: Cross-fade animation using Framer Motion's `AnimatePresence`.
  - **Manual Navigation**:
    - Interactive dots at the bottom of the image area.
    - Clicking a dot updates the current image and resets the auto-cycle timer.
- **Layout**: Integrate into the "Guest Speakers" block of `LifeAtBFB.tsx` while maintaining the existing 60/40 split.

## Technical Implementation

### DiversePlacements.tsx
- Update the `<section>` classes to match the `LifeAtBFB` background.
- Update the wrapper `div` to match the `LifeAtBFB` block layout.

### LifeAtBFB.tsx
- Identify the "Guest Speakers" block in the `blocks` array.
- Replace the static `<img>` with the `<SpeakerSlideshow />` component.

### SpeakerSlideshow.tsx
- State: `currentIndex` (number).
- Logic: `useEffect` for `setInterval` to increment `currentIndex`.
- Animation: `motion.img` with `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, `exit={{ opacity: 0 }}`.
- Navigation: Map through image array to render dots; `onClick` handler to set `currentIndex`.

## Testing
- **Visual Consistency**: Verify the transition from "LifeAtBFB" to "Diverse Placements" is seamless with no gray background strips.
- **Slideshow Functionality**:
  - Verify auto-cycling works.
  - Verify manual dot navigation works.
  - Verify images are correctly sourced from `public/speakers/`.
- **Responsiveness**: Ensure the slideshow fits perfectly within the block's 60% width on desktop and 100% on mobile.
