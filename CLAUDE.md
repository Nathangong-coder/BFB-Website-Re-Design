# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Stack

- **Next.js 16** with App Router (`app/` directory)
- **React 19**, **TypeScript 5**
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss`; no `tailwind.config.*` file (v4 uses CSS-first config in `app/globals.css`)
- **Framer Motion v12** for animations
- **Zustand v5** for client state
- **Lucide React** for icons

## Architecture

### Routing

Two routes, both using the root layout in `app/layout.tsx` (wraps every page with `<Navbar>` and `<Footer>`):

- `app/page.tsx` — landing page; composes `Hero`, `Approach`, `Placements`, `Team`, and an apply CTA section inline
- `app/training/page.tsx` — interactive finance quiz; three-state UI (module select → active quiz → results)

### State

`lib/store.ts` holds a single Zustand store (`useTrainingStore`) that owns all quiz state: active module, question index, score, and lifecycle status. The training page reads and drives this store exclusively.

### Data

All content is hardcoded:
- `lib/questions.ts` — three finance modules (DCF, LBO, Accounting) with questions and answer keys
- `components/Team.tsx` — team member data inline
- `components/Placements.tsx` — placement company data inline

### Animations

`lib/animations.ts` exports reusable Framer Motion variants (`fadeInUp`, `staggerContainer`, `scaleIn`). Components use `whileInView` for scroll-triggered entrance. Always pull variants from here rather than defining inline.

### Styling conventions

Custom theme tokens are CSS variables defined in `app/globals.css`:
- `--midnight` (#0A0F1C) — page background
- `--bfb-blue` (#2774AE) — primary brand color (UCLA blue)
- `--silver` (#E2E8F0) — secondary text
- `--glass` (rgba white 0.03) — glassmorphism surface

Use Tailwind classes that reference these vars (e.g., `bg-[var(--midnight)]`). Glassmorphism cards use `backdrop-blur` + `border border-white/10`.

Fonts: **Playfair Display** (serif, headings) and **Geist** (sans-serif, body). Both loaded via Next.js font optimization in `app/layout.tsx`.
