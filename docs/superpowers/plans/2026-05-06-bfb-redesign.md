# BFB Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the BFB site with a new color palette, fonts, full-color team photos, a combined blog-style Approach+Life section, a Diverse Placements section, and a homepage placements marquee — all preserving the existing dark navy glassmorphism design system.

**Architecture:** Incremental changes to existing files, plus three new components (`LifeAtBFB`, `DiversePlacements`, `PlacementsTicker`) that replace `Approach` and `Events`. No new routes, no data layer changes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS v4 (CSS-first), Framer Motion v12, `next/font/google`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | Color tokens, font vars, ticker animation |
| `app/layout.tsx` | Modify | Font imports (DM Sans + Libre Baskerville) |
| `components/Team.tsx` | Modify | Remove grayscale filter from photos |
| `components/Approach.tsx` | Delete | Replaced by LifeAtBFB |
| `components/Events.tsx` | Delete | Replaced by LifeAtBFB |
| `components/LifeAtBFB.tsx` | Create | Combined 4-block blog-style section |
| `components/DiversePlacements.tsx` | Create | Career tracks 50/50 section |
| `components/PlacementsTicker.tsx` | Create | Infinite marquee of firm names |
| `app/page.tsx` | Modify | Wire new components, remove old imports |

---

## Task 1: Update color tokens and add ticker animation in globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Replace the entire file with the updated version**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --midnight: #0A0F1C;
  --bfb-blue: #253d86;
  --accent: #5b9cd4;
  --silver: #e1e1e1;
  --glass: rgba(255, 255, 255, 0.03);
}

.dark {
  --bg: #0A0F1C;
  --bg-secondary: #080C18;
}

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

body {
  background: var(--bg);
  color: var(--fg, #0F172A);
  font-family: var(--font-sans);
  position: relative;
  overflow-x: hidden;
}

.dark body {
  color: var(--silver);
}

body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.4s;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.dark body::before {
  opacity: 0.045;
}

@keyframes ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@layer utilities {
  .animate-ticker {
    animation: ticker 30s linear infinite;
  }
}
```

- [ ] **Verify** — run `npm run build` (or `npm run dev`) and confirm no CSS errors in the terminal. The site's primary color should now appear as navy `#253d86` instead of UCLA blue.

- [ ] **Commit**

```bash
git add app/globals.css
git commit -m "feat: update color palette to #253d86 primary, add #5b9cd4 accent, remove gold"
```

---

## Task 2: Swap font imports in layout.tsx

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Replace the entire file**

```tsx
import type { Metadata } from "next";
import { DM_Sans, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Bruins in Finance and Banking | BFB",
  description: "UCLA's Premier Finance Club.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${libreBaskerville.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Verify** — run `npm run dev`, open the site. Headings should render in Libre Baskerville (serif with slightly more classic feel than Playfair). Nav links and body text should render in DM Sans (clean geometric sans).

- [ ] **Commit**

```bash
git add app/layout.tsx
git commit -m "feat: swap fonts to DM Sans (body) + Libre Baskerville (headings)"
```

---

## Task 3: Remove grayscale filter from Team photos

**Files:**
- Modify: `components/Team.tsx`

- [ ] **Edit the img className** — find this line (around line 79):

```tsx
className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
```

Replace with:

```tsx
className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
```

- [ ] **Verify** — navigate to `/team` in the dev server. All member photos should display in full color immediately (no grayscale on load, no color reveal on hover).

- [ ] **Commit**

```bash
git add components/Team.tsx
git commit -m "feat: show team photos in full color"
```

---

## Task 4: Create LifeAtBFB component

**Files:**
- Create: `components/LifeAtBFB.tsx`

- [ ] **Create the file with the full implementation**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const blocks = [
  {
    imageLeft: true,
    src: "/assorted/bfb-general-meeting.jpg",
    caption: "General Meetings",
    eyebrow: "Technical Mastery",
    title: "Education",
    body: "Our rigorous accelerator program equips members with the technical foundations of finance — from DCF modeling to complex valuation techniques — ensuring every member is career-ready from day one.",
  },
  {
    imageLeft: false,
    src: "/assorted/bfb-alum-speaker.jpg",
    caption: "Alumni Night",
    eyebrow: "Elite Networking",
    title: "Guest Speakers",
    body: "Direct access to industry leaders — from New York hedge funds to LA private credit firms. Our alumni speaker series bridges the gap between academic theory and professional practice.",
  },
  {
    imageLeft: true,
    src: "/capstone/bfb-capstone.jpg",
    caption: "Capstone Projects",
    eyebrow: "Applied Experience",
    title: "Member Projects",
    body: "Quarterly team-based challenges including investment pitches, M&A simulations, company partnerships, and quant modeling that mirror real-world institutional workflows.",
  },
  {
    imageLeft: false,
    src: "/group-photo/bfb-group-photo.jpg",
    caption: "BFB Community",
    eyebrow: "Work Hard, Play Hard",
    title: "Community",
    body: "A tight-knit group that extends beyond the boardroom — from retreat weekends to big/little traditions. We believe the best teams are built on genuine relationships.",
  },
] as const;

export default function LifeAtBFB() {
  return (
    <section id="approach" className="bg-white dark:bg-midnight">
      {/* Section header */}
      <div className="py-16 px-4 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-5"
        >
          Our Philosophy
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          The Approach &amp; Life at BFB
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="h-0.5 w-10 bg-[var(--bfb-blue)] mx-auto"
        />
      </div>

      {/* Blocks */}
      <div className="border-t border-slate-100 dark:border-white/8">
        {blocks.map((block, index) => (
          <motion.div
            key={block.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col border-b border-slate-100 dark:border-white/8 md:flex-row${
              !block.imageLeft ? " md:flex-row-reverse" : ""
            }`}
          >
            {/* Image half */}
            <div className="relative w-full md:w-1/2 min-h-[240px] md:min-h-[360px] overflow-hidden flex-shrink-0">
              <img
                src={block.src}
                alt={block.caption}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-midnight/40" />
              <span className="absolute bottom-4 left-4 text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 bg-black/40 px-2 py-1 rounded-sm">
                {block.caption}
              </span>
            </div>

            {/* Text half */}
            <div
              className={`w-full md:w-1/2 px-8 md:px-14 py-12 md:py-16 flex flex-col justify-center gap-4 ${
                index % 2 !== 0
                  ? "bg-slate-50 dark:bg-[#0f1622]"
                  : "bg-white dark:bg-midnight"
              }`}
            >
              <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-[var(--accent)]">
                {block.eyebrow}
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-silver">
                {block.title}
              </h3>
              <p className="text-slate-500 dark:text-silver/55 leading-relaxed font-light text-sm max-w-md">
                {block.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Verify** — component exists and has no TypeScript errors (`npm run lint` or check IDE diagnostics).

- [ ] **Commit**

```bash
git add components/LifeAtBFB.tsx
git commit -m "feat: add LifeAtBFB combined blog-style section"
```

---

## Task 5: Create DiversePlacements component

**Files:**
- Create: `components/DiversePlacements.tsx`

- [ ] **Create the file**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const tracks = [
  { name: "Investment Banking", firms: "Morgan Stanley · JPMorgan · Barclays · Citi" },
  { name: "Asset Management", firms: "GIC · TCW · TPG · Almitas Capital" },
  { name: "Sales & Trading", firms: "UBS · Scotiabank · KeyBanc · Mizuho" },
  { name: "Consulting & Advisory", firms: "Deloitte · Altman Solon · Accenture · PwC" },
  { name: "Public Finance", firms: "Federal Reserve" },
  { name: "Private Equity", firms: "TPG · Ducera Partners" },
];

export default function DiversePlacements() {
  return (
    <section className="bg-slate-50 dark:bg-[#080C18] border-t border-slate-100 dark:border-white/8">
      <div className="flex flex-col md:flex-row">
        {/* Image half */}
        <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-[460px] overflow-hidden flex-shrink-0">
          <img
            src="/group-photo/bfb-group-photo-professional.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-75"
          />
          <div className="absolute inset-0 bg-midnight/35" />
        </div>

        {/* Text half */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-1/2 px-8 md:px-14 py-12 md:py-16 flex flex-col justify-center gap-5 bg-white dark:bg-midnight"
        >
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[var(--accent)]">
            Career Tracks
          </span>
          <h2
            className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-silver leading-tight"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            From campus to every corner of finance
          </h2>
          <p className="text-slate-500 dark:text-silver/50 text-sm font-light leading-relaxed max-w-sm">
            BFB alumni go on to some of the most competitive roles in the industry — across banking, markets, investments, and beyond.
          </p>
          <ul className="flex flex-col gap-3 mt-1">
            {tracks.map((track) => (
              <li key={track.name} className="flex items-start gap-3">
                <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-[var(--accent)] flex-shrink-0" />
                <span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-silver">
                    {track.name}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-silver/40">
                    {" "}— {track.firms}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Verify** — no TypeScript errors.

- [ ] **Commit**

```bash
git add components/DiversePlacements.tsx
git commit -m "feat: add DiversePlacements career tracks section"
```

---

## Task 6: Create PlacementsTicker component

**Files:**
- Create: `components/PlacementsTicker.tsx`

- [ ] **Create the file**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const firms = [
  "Morgan Stanley", "Citi", "Barclays", "UBS", "Ducera Partners",
  "Federal Reserve", "Mizuho Financial Group", "Altman Solon", "Waymo",
  "Siemens Healthineers", "JPMorgan", "Scotiabank", "KeyBanc Capital Markets",
  "GIC", "TPG", "Almitas Capital", "TCW", "Deloitte", "Lazard", "BMO",
  "Stifel", "Accenture", "KPMG", "PwC", "Adobe", "HP", "Lockton",
];

const doubled = [...firms, ...firms];

export default function PlacementsTicker() {
  return (
    <section className="py-16 border-t border-slate-100 dark:border-white/8 bg-white dark:bg-midnight overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10 px-4">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-4"
        >
          Career Outcomes
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-silver"
        >
          Our Placements
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="h-0.5 w-10 bg-[var(--bfb-blue)] mx-auto mt-5"
        />
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-midnight to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-midnight to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 w-max animate-ticker hover:[animation-play-state:paused] px-3">
          {doubled.map((firm, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-glass border border-slate-200 dark:border-white/8 rounded-sm whitespace-nowrap"
            >
              <span className="w-[5px] h-[5px] rounded-full bg-[var(--bfb-blue)] flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-600 dark:text-silver/70">
                {firm}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Verify** — no TypeScript errors.

- [ ] **Commit**

```bash
git add components/PlacementsTicker.tsx
git commit -m "feat: add PlacementsTicker infinite marquee"
```

---

## Task 7: Wire page.tsx and delete old components

**Files:**
- Modify: `app/page.tsx`
- Delete: `components/Approach.tsx`
- Delete: `components/Events.tsx`

- [ ] **Replace `app/page.tsx`**

```tsx
import Link from "next/link";
import Hero from "@/components/Hero";
import LifeAtBFB from "@/components/LifeAtBFB";
import DiversePlacements from "@/components/DiversePlacements";
import PlacementsTicker from "@/components/PlacementsTicker";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <LifeAtBFB />
      <DiversePlacements />
      <PlacementsTicker />

      {/* Apply CTA */}
      <section id="apply" className="relative py-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-midnight" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bfb-blue/25 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-bfb-blue/[0.05] dark:bg-bfb-blue/[0.07] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-6">
            Applications Open
          </span>
          <h2
            className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6 leading-tight"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Join the Legacy
          </h2>
          <p className="text-slate-500 dark:text-silver/50 text-lg mb-12 max-w-md mx-auto leading-relaxed font-light">
            We recruit the most ambitious students at UCLA. Ready to take the first step?
          </p>
          <Link
            href="/join"
            className="inline-block px-12 py-5 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-bfb-blue/20"
          >
            Begin Application
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Delete `components/Approach.tsx`**

```bash
rm "components/Approach.tsx"
```

- [ ] **Delete `components/Events.tsx`**

```bash
rm "components/Events.tsx"
```

- [ ] **Run `npm run build`** to confirm no broken imports or TypeScript errors.

Expected: build succeeds with no errors.

- [ ] **Run `npm run dev` and do a full visual pass:**
  - Homepage loads: Hero → combined section (4 alternating blocks) → Diverse Placements → ticker → Apply CTA
  - Ticker scrolls continuously, pauses on hover
  - Dark mode toggle works for all new sections
  - Mobile layout stacks image above text on each block
  - No gold color anywhere on the page
  - Headings use Libre Baskerville, body/nav text uses DM Sans

- [ ] **Commit**

```bash
git add app/page.tsx
git rm components/Approach.tsx components/Events.tsx
git commit -m "feat: wire homepage with LifeAtBFB, DiversePlacements, PlacementsTicker"
```
