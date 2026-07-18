# Recruitment Page Redesign — 3 Styles × 2 Depths

## Problem

The current `/recruitment` hero paragraph is long and generic ("fluffy"), and the
transition from hero into the timeline section relies on soft gradient blobs
fading out — there's no clear visual cue pulling the eye down the page.

## Scope

Keep `/recruitment` untouched as the baseline ("Original"). Build 6 new
standalone pages exploring 3 visual directions, each with two depth levels:

| Route | Style | Depth |
|---|---|---|
| `/recruitment/v1/hero` | Minimal / high-tech | Hero only |
| `/recruitment/v1/full` | Minimal / high-tech | Hero + timeline + CTA |
| `/recruitment/v2/hero` | NYT-style broadsheet masthead | Hero only |
| `/recruitment/v2/full` | NYT-style broadsheet masthead | Hero + timeline + CTA |
| `/recruitment/v3/hero` | Hybrid | Hero only |
| `/recruitment/v3/full` | Hybrid | Hero + timeline + CTA |

"Hero only" = new hero, timeline/CTA keep the current 5-card-grid layout and
card CTA layout, reskinned in the style's palette/type. "Full" = hero,
timeline, and CTA are all rebuilt in the style's own layout paradigm.

Each page is a fully self-contained file (matches the existing pattern in
`app/recruitment/page.tsx`, `app/tech/bai/page.tsx`, etc. — no shared
abstraction forced across styles).

## The shared fix

Every version replaces the long paragraph with one tight sentence, and
replaces the soft-blob fade with a **hard graphic break**: a bordered
element (stat strip, rule line, sidebar box) sitting directly under the hero
copy whose edge becomes the next section's edge — no gap, no fade.

## V1 — Minimal / High-Tech

- New font: JetBrains Mono (via `next/font/google`), scoped to these two
  pages only, used for eyebrows/numerals/stat labels. Body stays DM Sans.
- No gradient blobs; pure hairlines, high contrast, bfb-blue as sole accent.
- Hero: mono eyebrow (`RECRUITMENT — CYCLE 2026`) → tight bold sans headline
  → 1-sentence subhead → bordered horizontal stat strip (`05 ROUNDS` /
  `90 MIN FINAL` / `2 HR COFFEE CHATS`) whose bottom border is the next
  section's top border.
- Full timeline: vertical numbered steps like a CLI deploy log — mono step
  number, connecting vertical line, accent-colored hover state.
- Full CTA: dark console-style card, `> run assessment` button.

## V2 — Minimalist Broadsheet / NYT Masthead

- New font: Playfair Display (via `next/font/google`), scoped to these two
  pages only, used for the masthead wordmark + numerals. Body stays Libre
  Baskerville/DM Sans.
- Real masthead: meta row (`VOLUME I — RECRUITMENT DESK` / `2026 CYCLE`) →
  big letter-spaced serif nameplate → double rule (thick+thin) as the hard
  break.
- Below the rule: lede column (short italic serif deck) + a bordered
  "At a Glance" sidebar box (Rounds/Duration/Format).
- Full timeline: single-column list of numbered "sections" separated by thin
  rules, large serif numerals — reads like consecutive newspaper items.
- Full CTA: bordered call-out box styled like a print ad, "Continue Reading →"
  link.

## V3 — Hybrid

- Reuses JetBrains Mono + Playfair Display (both already scoped to their own
  V1/V2 pages; loaded again scoped to the V3 pages — no third font).
- Hero: thin top rule → serif headline (smaller than V2's masthead) → tight
  sans subhead → mono stat strip (V1-style) bordered top+bottom as the hard
  break.
- Full timeline: numbered rows with serif numerals + thin connector line +
  mono step labels — blend of V1 and V2's timelines.
- Full CTA: card with serif headline + mono button label.

## Navbar

`Events > Recruitment` becomes a submenu (same nested pattern already used
for `Resources > Tech`), listing: Original, V1 · Hero, V1 · Full, V2 · Hero,
V2 · Full, V3 · Hero, V3 · Full.

## Out of scope

- No changes to the site-wide aesthetic, other pages, or the original
  `/recruitment` route.
- No changes to timeline/CTA copy content — only layout/visual treatment.
- No new fonts beyond the two listed (JetBrains Mono, Playfair Display).
