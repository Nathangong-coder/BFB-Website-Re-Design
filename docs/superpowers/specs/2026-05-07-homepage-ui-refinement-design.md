# Homepage UI Refinement Design Spec

**Date:** 2026-05-07
**Topic:** Homepage UI Refinement
**Goal:** Modernize the landing page layout, imagery, and typography by implementing a cinematic banner hero, a custom-width split-layout Approach section, and removing visual noise (eyebrows).

## 1. Hero Section
- **Layout**: Full-width banner with a fixed height of `600px`.
- **Visuals**: The hero image will be a full-bleed `object-cover` background. A dark blue overlay (`bg-midnight/50` or similar) will be applied to ensure the white text is legible.
- **Content**: 
    - Remove the "text box" container.
    - Center the descriptor text and main heading as direct overlays on the image.
    - Maintain the typing animation for the main heading.

## 2. The BFB Approach Section (`LifeAtBFB.tsx`)
- **Container**: Wrap the section content in a centered container with `max-w-[1300px]` to create a "10 points over" effect relative to the navbar.
- **Layout**:
    - Change the image/text split from 50/50 to **60% image / 40% text**.
    - Increase the height of the images to a cinematic scale (`500px - 600px`).
- **Content**:
    - Update the section heading to **"The BFB Approach"**.
    - Remove the blue "eyebrow" text (all-caps, `var(--accent)`) from all blocks.

## 3. Other Homepage Sections
- **Placements Section (`DiversePlacements.tsx`)**: 
    - Remove the "Career Tracks" blue eyebrow text.
- **Join the Legacy Section (`app/page.tsx`)**:
    - Remove the "Applications Open" blue eyebrow text.

## 4. Visual Polish
- Ensure all layout changes remain responsive (stacking on mobile).
- Verify that the color contrast between the white text and the background images (with overlays) meets accessibility standards.
