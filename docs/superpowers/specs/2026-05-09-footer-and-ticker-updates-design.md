# Footer and Placements Ticker Updates Design

This document outlines the design for updating the footer logo and adjusting the placements ticker speed and width.

## Overview
The goal is to simplify the footer by replacing the logo with text and to refine the placements ticker on the homepage to match the navbar's width and move at a more relaxed pace.

## Requirements
- **Footer**: Replace the left-side logo with "© 2026 Bruins in Finance and Banking".
- **Placements Ticker**:
  - Slow down the animation by 15% (from 40s to 46s).
  - Constrain the width of the ticker content to match the navbar (`max-w-7xl mx-auto`).

## Architecture and Components

### 1. Footer (`components/Footer.tsx`)
- **Current**: A `Link` containing an `img` tag pointing to `/bfb_bear.png`.
- **New**: A `div` or `span` containing the text "© 2026 Bruins in Finance and Banking".
- **Styling**: `text-sm text-slate-500 dark:text-silver/50 font-light`.

### 2. Global Styles (`app/globals.css`)
- **Current**: `.animate-ticker` has `animation: ticker 40s linear infinite;`.
- **New**: `.animate-ticker` has `animation: ticker 46s linear infinite;`.

### 3. Placements Ticker (`components/PlacementsTicker.tsx`)
- **Current**: The marquee `div` and its gradient overlays are inside the `section` without a width-limiting container.
- **New**: Wrap the marquee and its gradient overlays in a `div` with class `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Visual Goal**: Ensure logos and the gradient "fade-out" edges align with the navbar's horizontal bounds.

## Data Flow
No changes to data flow are required as all content is currently hardcoded or managed within these components.

## Testing
1. **Visual Inspection**:
   - Verify footer text is correctly placed and styled.
   - Verify placements ticker is centered and constrained to the navbar width.
   - Observe ticker speed to ensure it is noticeably slower.
2. **Responsive Check**:
   - Ensure the `max-w-7xl` container correctly handles smaller viewports using the existing `px-4 sm:px-6 lg:px-8` padding.
