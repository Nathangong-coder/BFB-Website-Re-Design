# BFB Website Redesign — Design Spec
**Date:** 2026-05-06

## Overview

Incremental visual and content update to the existing BFB Next.js site. The existing design feel is preserved (dark navy, glassmorphism, `backdrop-blur`, `border-white/10`, Framer Motion animations). Changes are: new color palette, new fonts, gold removal, team photo color, one new combined section, one new Diverse Placements section, and a placements marquee on the homepage.

---

## 1. Color Palette

Update `app/globals.css` CSS variables:

| Token | Old value | New value |
|---|---|---|
| `--bfb-blue` | `#2774AE` | `#253d86` |
| `--accent` | *(new)* | `#5b9cd4` |
| `--silver` | `#E2E8F0` | `#e1e1e1` |
| `--gold` | `#C5A059` | **Remove entirely** |

`--midnight` (`#0A0F1C`) and `--glass` stay unchanged.

Also add `--color-accent: var(--accent)` to the `@theme inline` block so Tailwind can use `text-accent`, `bg-accent`, etc.

All references to `text-gold`, `bg-gold`, `border-gold`, `via-gold`, `text-gold/70`, `hover:bg-gold`, etc. across every component must be replaced:
- Decorative accents (divider lines, dots, hover dots) → `bfb-blue` (now `#253d86`) or `accent` (`#5b9cd4`)
- Section eyebrow labels → `text-[var(--accent)]` (i.e. `#5b9cd4`)
- Card icon backgrounds on hover → `bg-[var(--bfb-blue)]`

---

## 2. Fonts

Replace both font imports and CSS variable wiring in `app/layout.tsx` and `app/globals.css`:

| Role | Old font | New font |
|---|---|---|
| Headings (`font-serif`) | Playfair Display | **Libre Baskerville** |
| UI / Body (`font-sans`) | Geist Sans | **DM Sans** |

- Import `Libre_Baskerville` and `DM_Sans` from `next/font/google` in `layout.tsx`.
- Remove `Geist`, `Geist_Mono`, `Playfair_Display` imports.
- Update `--font-serif` and `--font-sans` CSS variables in `globals.css` to reference the new font CSS variables.
- All existing `font-serif` and `font-sans` Tailwind classes automatically pick up the new fonts — no component-level changes needed for typography.

---

## 3. Team Photos — Full Color

In `components/Team.tsx`, remove the `grayscale` and `group-hover:grayscale-0` classes from the `<img>` tag. Photos should always render in full color.

Current: `className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"`

New: `className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"`

---

## 4. Combined Section: Approach + Life at BFB

Replace the existing `<Approach>` and `<Events>` components (and their imports in `app/page.tsx`) with a single new component: `components/LifeAtBFB.tsx`.

### Layout

Alternating 50/50 blog-style blocks. Each block: full-width row, image fills the left or right half, text fills the other half. No cards, no grid — full-bleed edge-to-edge rows within the section. Preserves site's dark bg (`bg-[var(--midnight)]`), glassmorphism borders on text side, and Framer Motion `whileInView` entrance animations.

### 4 Blocks (in order)

| # | Image side | Photo | Eyebrow | Title | Body |
|---|---|---|---|---|---|
| 1 | Left | `/assorted/bfb-general-meeting.jpg` | Technical Mastery | Education | "Our rigorous accelerator program equips members with the technical foundations of finance — from DCF modeling to complex valuation techniques — ensuring every member is career-ready from day one." |
| 2 | Right | `/assorted/bfb-alum-speaker.jpg` | Elite Networking | Guest Speakers | "Direct access to industry leaders — from New York hedge funds to LA private credit firms. Our alumni speaker series bridges the gap between academic theory and professional practice." |
| 3 | Left | `/capstone/bfb-capstone.jpg` | Applied Experience | Member Projects | "Quarterly team-based challenges including investment pitches, M&A simulations, company partnerships, and quant modeling that mirror real-world institutional workflows." |
| 4 | Right | `/group-photo/bfb-group-photo.jpg` *(fallback until user adds community photo)* | Work Hard, Play Hard | Community | "A tight-knit group that extends beyond the boardroom — from retreat weekends to big/little traditions. We believe the best teams are built on genuine relationships." |

### Image treatment
- Photo covers its half with `object-cover`, `opacity-80`, dark overlay `bg-midnight/40`
- Small caption tag bottom-left (9px, uppercase, `text-white/50`)
- On mobile: stack vertically, image on top (full width, fixed height ~240px), text below

### Section header
- Eyebrow: "Our Philosophy" in `text-[var(--accent)]`
- Title: "The Approach & Life at BFB" in `font-serif`
- Blue `2px` rule divider (no gold gradient)

---

## 5. Diverse Placements Section

New component `components/DiversePlacements.tsx`, placed after `<LifeAtBFB>` in `app/page.tsx`.

### Layout

Single 50/50 row (same alternating style as LifeAtBFB). Image left, text right.

**Image side:** `/group-photo/bfb-group-photo-professional.jpg` with `opacity-75` and `bg-midnight/35` overlay.

**Text side:**
- Section eyebrow: "Career Tracks"
- Heading: "From campus to every corner of finance"
- Subtext: "BFB alumni go on to some of the most competitive roles in the industry — across banking, markets, investments, and beyond."
- Bullet list of 6 career tracks (plain `·` dot, no emojis, no grid cards):

```
• Investment Banking  — Morgan Stanley · JPMorgan · Barclays · Citi
• Asset Management   — GIC · TCW · TPG · Almitas Capital
• Sales & Trading    — UBS · Scotiabank · KeyBanc · Mizuho
• Consulting & Advisory — Deloitte · Altman Solon · Accenture · PwC
• Public Finance     — Federal Reserve
• Private Equity     — TPG · Ducera Partners
```

Track name bold in `text-[var(--silver)]`, firm names in `text-silver/40`. Bullet dot is a 5px circle in `bg-[var(--accent)]`.

---

## 6. Homepage Placements Marquee

New component `components/PlacementsTicker.tsx`, placed after `<DiversePlacements>` and before the Apply CTA in `app/page.tsx`.

### Layout

- Section eyebrow: "Career Outcomes"
- Section title: "Our Placements" (`font-serif`)
- Single infinite-scroll row of firm name chips
- Left/right fade using `mask-image` linear gradient
- Chips: `bg-glass border border-white/8 rounded-sm px-4 py-2` with a 5px `bg-[var(--bfb-blue)]` dot and firm name in `text-silver/70 text-sm font-semibold`
- Animation: CSS `@keyframes scroll` (`translateX(0)` → `translateX(-50%)`), 30s linear infinite, paused on hover
- All unique firms across all 3 years (deduped): Morgan Stanley, Citi, Barclays, UBS, Ducera Partners, Federal Reserve, Mizuho Financial Group, Altman Solon, Waymo, Siemens Healthineers, JPMorgan, Scotiabank, KeyBanc Capital Markets, GIC, TPG, Almitas Capital, TCW, Deloitte, Lazard, BMO, Stifel, Accenture, KPMG, PwC, Adobe, HP, Lockton
- Track array duplicated once for seamless loop

### Placement on page
Sits between Diverse Placements and the Apply CTA. Has `border-t border-white/8` separator.

---

## 7. Files Changed

| File | Change |
|---|---|
| `app/globals.css` | Update color vars, remove `--gold`, update font vars |
| `app/layout.tsx` | Swap font imports (Libre Baskerville + DM Sans) |
| `app/page.tsx` | Replace `<Approach>` + `<Events>` with `<LifeAtBFB>`, add `<DiversePlacements>`, add `<PlacementsTicker>` |
| `components/Approach.tsx` | **Delete** |
| `components/Events.tsx` | **Delete** |
| `components/Team.tsx` | Remove grayscale classes from img |
| `components/LifeAtBFB.tsx` | **New** |
| `components/DiversePlacements.tsx` | **New** |
| `components/PlacementsTicker.tsx` | **New** |

---

## 8. Out of Scope

- Training page, Navbar structure, Footer, Placements page — no changes
- No new routes or data layer changes
- Community photo (block 4) — user will add to `/public/assorted/` later; fallback to group photo in the meantime
