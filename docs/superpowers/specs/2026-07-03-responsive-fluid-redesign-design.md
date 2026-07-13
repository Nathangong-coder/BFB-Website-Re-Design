# Responsive Fluid Redesign — Design Doc

**Date:** 2026-07-03
**Status:** Draft for review
**Scope:** Homepage first (as the reusable template), then roll the token system across the remaining ~18 routes.

---

## 1. Problem

The site looks well-proportioned on a 16" Aero laptop but oversized on a 13.3" L13 Yoga. Two root causes, confirmed by measurement:

1. **No fluid scaling.** Type and spacing are fixed px/rem values that only change at Tailwind breakpoints (`md`, `lg`) and are otherwise locked. Between breakpoints, a 72px headline stays 72px whether the viewport is 780px or 1400px — so on a narrower viewport it eats a larger share of the screen.
2. **A badly placed breakpoint.** The multi-column "desktop" layout only activates at `md` (768px). The L13 renders at ~725px effective width — *below* that line — so it is served the **phone layout on a laptop**. That, not just size, is why it feels wrong.

### Measured reference points (100% zoom, `window.innerWidth` / `screen.width`)

| Device | Effective CSS width | Current layout served |
|---|---|---|
| 16" Aero (looks good — **the anchor**) | ~1152px | Multi-column desktop (`lg` tier) |
| 13.3" L13 Yoga (looks too big) | ~725px | Phone/mobile layout |

The Aero at 1152px is the **reference width**: every element's on-screen proportion there is treated as correct, and we preserve that proportion at all widths.

---

## 2. Goals & non-goals

**Goals**
- Convert fixed type/spacing to a **fluid scale** so each element holds the same *proportion* of the viewport it has on the Aero at 1152px.
- Ensure **all laptops down to 11.6"** receive the multi-column "laptop" layout — not the phone layout. The phone layout is reserved for true phones (~< 600px).
- **Completely rethink the mobile (< 600px) experience** — structure, hierarchy, and navigation, not just restyling.
- Centralize the system so rollout to the other ~18 routes is mechanical.

**Non-goals**
- No content rewrites, no new sections' copy, no backend/data changes.
- No visual rebrand (colors, fonts, logo stay).
- Other routes are out of scope for *this* spec beyond confirming the tokens fit them; each gets its own follow-up pass.

---

## 3. Approach A — Fluid token system (chosen)

One source of truth in `app/globals.css` under Tailwind v4's `@theme`. Every fixed size becomes a named fluid token; components reference tokens instead of hard-coded classes.

### 3.1 Calibration method

For a display element measured at size `S` px on the Aero (1152px viewport), its proportion is `S / 1152`. Expressed as a viewport unit that reproduces `S` at 1152px:

```
preferred = (S / 1152 × 100) vw
```

Wrapped in `clamp(min, preferred, max)` where:
- **`min`** = readable floor reached on phones (prevents type shrinking to unreadable at ~375px).
- **`max`** = cap reached on large monitors (prevents display type ballooning past ~1536px).

In the **laptop band (600–1400px)** the `preferred` term dominates, so sizing is ~pure-proportional and matches the Aero. Outside that band the clamps take over gracefully.

> **Two scaling speeds.** *Display type* (headlines) scales at its true proportion (aggressive vw). *Structural chrome* (nav height, logo, gutters) scales gently and caps at its current size, so it compacts on small laptops but never grows beyond today's look on big screens.

### 3.2 Type tokens

| Token | Aero @1152 | `clamp(min, preferred, max)` |
|---|---|---|
| `--fs-eyebrow` | 10px | `clamp(0.625rem, 0.87vw, 0.75rem)` |
| `--fs-caption` | 12px | `clamp(0.75rem, 1.05vw, 0.8125rem)` |
| `--fs-body` | 16px | `clamp(0.9375rem, 1.4vw, 1.0625rem)` |
| `--fs-body-lg` | 18px | `clamp(1rem, 1.6vw, 1.1875rem)` |
| `--fs-h3` (block title) | 36px | `clamp(1.5rem, 3.1vw, 2.375rem)` |
| `--fs-h2` (section head) | 60px | `clamp(2rem, 5.2vw, 4rem)` |
| `--fs-hero` (headline) | 72px | `clamp(2.25rem, 6.25vw, 5rem)` |

Spot-checks for `--fs-hero` (`6.25vw`): 1152px → 72px (anchor ✓), 725px → 45px (compacts on the L13 ✓), 375px → floors to 36px ✓, 1600px → caps at 80px ✓.

### 3.3 Spacing & structural tokens

| Token | Aero @1152 | `clamp(...)` | Notes |
|---|---|---|---|
| `--nav-h` | 80px | `clamp(3.5rem, 6.95vw, 5rem)` | Hits 80px at ~1152px, caps 80, compacts to ~50px on the L13 |
| `--logo-h` | 70px | `clamp(2.5rem, 6.1vw, 4.375rem)` | Caps 70px |
| `--gutter` (page side padding) | 40px | `clamp(1rem, 4vw, 2.5rem)` | Replaces `px-4 sm:px-6 lg:px-10` |
| `--space-section` | 144px* | `clamp(3.5rem, 9vw, 8rem)` | *Current `py-36`=144px is excessive; intentionally capped at 128px |
| `--block-gap` | 64px | `clamp(2.5rem, 5.55vw, 4rem)` | |
| `--pad-card` | 64px | `clamp(1.75rem, 5.5vw, 4rem)` | Card inner padding (`px-16`) |

`max-w-[1400px]` content container is retained.

### 3.4 How components consume tokens

Tailwind v4 exposes `@theme` vars as arbitrary values, e.g. `text-[length:var(--fs-hero)]`, `h-[var(--nav-h)]`, `py-[var(--space-section)]`, `gap-[var(--block-gap)]`. Fixed classes (`text-7xl`, `h-20`, `gap-16`, `py-36`) are swapped for these. A small set of `@utility` shorthands (e.g. `.text-hero`, `.section-y`, `.gutter-x`) will be defined to keep markup readable.

---

## 4. Breakpoint strategy

Introduce **one decisive layout breakpoint** for the phone → laptop switch, replacing the current reliance on `md`/`lg` for column collapsing.

```css
@theme { --breakpoint-lap: 600px; }   /* phone (<600) → laptop (>=600) */
```

- **≥ 600px — "laptop" layout:** multi-column blocks, fluid tokens. Two-column image/text blocks use `lap:flex-row`. Covers 11.6"/13.3"/16" laptops.
- **< 600px — "phone" layout:** the redesigned mobile experience (Section 5).

Two-column blocks use a **58% image / 42% text** split with fluid `--pad-card`. At the 600px floor that yields a ~348px image and a ~252px text column — readable with the fluid padding's 28px min. `sm`/`lg` remain available for minor tuning but are no longer the structural switch. The exact 600px value will be validated on the user's actual 11.6"/13.3" machines and nudged if a real laptop reports below it.

---

## 5. Homepage mobile redesign (< 600px)

A structural + navigation rethink, not a restyle.

### 5.1 Navigation — full-screen overlay drawer
Replace today's inline accordion (which pushes page content down) with a **full-screen overlay menu**:
- Slides/fades in over the page; background scroll locked.
- Large tappable rows (≥ 48px), generous spacing, grouped by section with clear group headers; nested items (Tech, Newsletters) expand inline within the overlay.
- Staggered entrance animation (reuse `staggerContainer`/`fadeInUp`).
- Primary **"Join Us"** CTA pinned at the bottom of the overlay; clear close (X) top-right.
- Logo scales via `--logo-h`; bar height via `--nav-h` (compact on phones).

### 5.2 Hero
- Height uses **`svh`** units (`min-h-[100svh]` capped) so mobile browser chrome doesn't cause jump/overflow; drop the 750px min-height that overshoots small phones.
- Headline uses `--fs-hero` (floors at 36px on phones — deliberately smaller share than today's fixed 40px).
- **Add a visible primary CTA in the hero on mobile** (currently there is none — only a scroll chevron). Surfaces the key "Apply/Join" action immediately.

### 5.3 Section order — surface social proof earlier
On phones, move **Placements (firm logos)** directly below the Hero, ahead of the 5-block philosophy section. Rationale: prestigious placement logos are the strongest hook; the philosophy section is long-form and better as second read. Desktop order is unchanged. (This is a proposal — easy to revert if you'd rather keep parity.)

### 5.4 "The BFB Approach" blocks
- Stack as compact cards: image becomes a shorter banner (`~40svh`, fluid), title/eyebrow below, body text at `--fs-body`.
- Tighten vertical rhythm with `--block-gap`; reduce the 5-block scroll fatigue with clearer per-card hierarchy and consistent card chrome.

### 5.5 Placements ticker
- Shrink logo tiles from fixed 160px to fluid (~96–112px), tune marquee speed for the narrower width; keep the edge fade masks.

### 5.6 Apply CTA
- Uses `--space-section` (kills the 144px vertical padding on phones). Buttons already stack full-width; keep, with ≥ 48px height.

### 5.7 Footer
- Today's fixed `h-20` `justify-between` row cramps on phones. Restack into a small multi-row footer: copyright, social icons (larger tap targets), and the **Join Us** button (currently hidden below `sm`) made visible.

---

## 6. Rollout plan

1. **Foundation:** add tokens + `--breakpoint-lap` + utility shorthands to `globals.css`.
2. **Homepage components** (`Hero`, `LifeAtBFB`/`SpeakerSlideshow`, `PlacementsTicker`, Apply CTA in `page.tsx`, `Navbar`, `Footer`): swap fixed sizing for tokens; implement the mobile redesign.
3. **Validate** on the user's 11.6"/13.3"/16" machines; tune clamp caps and the 600px breakpoint.
4. **Mechanical rollout** to the other ~18 routes: replace the same fixed-size patterns with tokens, re-point column switches from `md`/`lg` to `lap`. Each route sanity-checked. (Separate follow-up spec/plan.)

---

## 7. Risks & validation

- **Text column too tight at 600px.** Mitigated by the 58/42 split + fluid padding min; validate on-device, fall back to 55/45 or reduced padding if cramped.
- **Clamp caps vs. large monitors.** Display type capped so 1440p/4K don't balloon; confirm the caps look intentional on a large screen.
- **`svh` support.** Supported in current evergreen browsers; acceptable for this audience.
- **Reduced motion.** New overlay/stagger animations respect `prefers-reduced-motion`.
- No automated tests exist; validation is manual/visual across the three reference widths plus a phone.

---

## 8. Out of scope
- The other ~18 routes' full redesign (tokens applied mechanically later).
- Content/copy changes, rebrand, backend/data, new features.
