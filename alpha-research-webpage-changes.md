# Alpha Research Competition: webpage update spec

Implementation spec for a coding agent working in the Bruins in Finance and Banking (BFB) website repo. It brings two pages in line with the competition info-session deck.

| | |
|---|---|
| Pages | `/competition/alpha-research` (overview) and `/competition/alpha-research/details` (details) |
| Live site | https://www.bfbatucla.com/competition/alpha-research |
| Source of truth | BFB info-session deck, Sep 27, 2026. The live pages were checked against it the same day. |
| Scope | 33 tasks, all ready to implement. New FAQ content is in Appendix A. |

## Why these changes

The competition rules changed after the pages were written:

- **Awards:** seven awards (overall 1st–3rd, three research awards, two performance awards) became three: Best Sharpe, Best Calmar, and Best Rigor.
- **Eligibility:** open to undergraduates from any school, no longer UCLA only.
- **Dates:** registration and submission both close Sun, Nov 22, 2026, 11:59 PM PT. The forward window is fixed at Nov 30, 2026 – Mar 19, 2027.
- **Finals:** the Best Sharpe team, the Best Calmar team, and the top 5 Best Rigor teams present.
- **Sponsors:** there are none, so sponsor references go.

## Canonical facts

Use these exact values anywhere the site states them.

| Fact | Value |
|---|---|
| Eligibility | Undergraduates from any school, solo or in teams of up to 3 |
| Registration | Opens in September; closes Sun, Nov 22, 2026, 11:59 PM PT |
| Submission deadline | Sun, Nov 22, 2026, 11:59 PM PT (same moment as registration) |
| Instructions | Emailed to each participant after they register |
| Forward window | Mon, Nov 30, 2026, 6:30 AM PT – Fri, Mar 19, 2027, 1:00 PM PT |
| Verification | Late March 2027 |
| Finals and awards | Early spring quarter 2027 |
| Awards | Best Sharpe, Best Calmar, Best Rigor. Each has a cash prize (never publish amounts). One team can win more than one. |
| Best Sharpe | Highest forward-window Sharpe ratio among eligible strategies |
| Best Calmar | Highest forward-window return per unit of max drawdown among eligible strategies; max drawdown is floored at 2% |
| Sharpe and Calmar eligibility | ≥ 30 independent completed trades (≥ 10 in the forward window); average gross exposure ≥ 25% across the forward window; forward drawdown ≤ 35%; no rule breach, prohibited data use, material post-freeze change, or failed reproduction |
| Best Rigor | Judged by the panel on the full rubric: 30% research thesis & implementation, 35% backtest rigor & robustness, 20% unseen forward-window performance, 15% risk controls & reproducibility. No minimum trade count. |
| Finals format | The Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams each present for 3 minutes, plus 3 minutes of Q&A. The Best Rigor winner is decided after the presentations. |
| Sponsors | None |
| Contact | bfbatucla@gmail.com |

## Rules for implementing

1. Change text, not design. Reuse the existing component for each section (stat card, timeline row, award card, list item, table row). Don't restyle anything else.
2. The **Find** strings are copied from the rendered pages. In source they may be split across lines or JSX expressions, use HTML entities (`&amp;`, `&ndash;`, `&mdash;`, `&apos;`, `&rsquo;`), or differ in case because labels are uppercased with CSS `text-transform`. Search for a distinctive substring, case-insensitively.
3. Keep the characters used in the replacement strings: en dash (–) in date ranges, em dash (—) where shown, minus sign (−) in "−100%", "≥", and middle dot (·).
4. Don't touch the Register buttons or their links, the four rubric cards, the five deliverable cards, the memo checklist, the execution-model list, or the markets section, except where a task says so.
5. The step descriptions in "How It Works" (tasks 4–6) render only when a step is clicked. They probably live in a data array behind the tab component.
6. The same stale values may appear elsewhere in the repo: homepage or events cards, page metadata, Open Graph tags, JSON-LD. Search the whole repo for the strings under [Verification](#verification) and fix every occurrence using the canonical facts.
7. Optional: if one fact (such as a date) is hardcoded in several components, you may move it into a single shared constant. Keep that refactor minimal.
8. The rules are final. Remove every "proposed" qualifier about the rules, scoring weights, or risk limits (tasks 21 and 26).

---

## Overview page tasks (`/competition/alpha-research`)

### Overview stats

#### 1. Forward window stat value

**Find**

```text
Dec 2026 – Mar 2027
```

**Replace with**

```text
Nov 30, 2026 – Mar 19, 2027
```

#### 2. Team size stat value

Leave the "Team size" label as it is.

**Find**

```text
Up to 3 students
```

**Replace with**

```text
1–3 undergraduates, any school
```

#### 3. New deadline stat (insert)

Add a fifth stat after "Forward window", using the same stat component. If the grid assumes four columns, let it wrap or fit five, matching how the grid already behaves on small screens.

- **Label:** `Register & submit by`
- **Value:** `Nov 22, 2026 · 11:59 PM PT`

### How It Works (step descriptions)

#### 4. Step 05, "Submit & Freeze"

**Find**

```text
Deliver code, configuration, documentation, and declared dependencies before the deadline. After the freeze, nothing changes.
```

**Replace with**

```text
Deliver code, configuration, documentation, and declared dependencies by Sun, Nov 22, 2026, 11:59 PM PT. After the freeze, nothing changes.
```

#### 5. Step 06, "Complete the Forward Window"

**Find**

```text
Your unchanged strategy runs through the official evaluation environment and data feed.
```

**Replace with**

```text
From Mon, Nov 30, 2026, 6:30 AM PT to Fri, Mar 19, 2027, 1:00 PM PT, your unchanged strategy runs through the official evaluation environment and data feed.
```

#### 6. Step 07, "Present & Defend"

**Find**

```text
Explain the result, the attribution, the limitations, and the lessons to the judging panel.
```

**Replace with**

```text
The Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams present in spring quarter: 3 minutes, plus 3 minutes of Q&A. Explain the result, the attribution, the limitations, and the lessons to the judging panel.
```

### Competition Timeline

#### 7. Timeline intro

**Find**

```text
Research through fall, freeze in late November, then an extended forward window that ends before spring break.
```

**Replace with**

```text
Research through fall, register and submit by Sun, Nov 22, then a forward window from Nov 30 to Mar 19 that ends before spring break.
```

#### 8. Row "Registration & Orientation" (replace all three cells)

| Column | Now | Change to |
|---|---|---|
| Phase | `Registration & Orientation` | `Registration` |
| Timing | `September 2026` | `September – Sun, Nov 22, 2026, 11:59 PM PT` |
| Primary output | `Team registration, rules briefing, and technical onboarding` | `Register to receive the detailed instructions by email` |

#### 9. Row "Research & Development", timing cell only

**Find**

```text
September – November 2026
```

**Replace with**

```text
September – Nov 22, 2026
```

#### 10. Row "Submission & Freeze", timing cell only

**Find**

```text
Late November 2026
```

**Replace with**

```text
Sun, Nov 22, 2026, 11:59 PM PT
```

#### 11. Row "Unseen Forward Window", timing cell only

**Find**

```text
December 2026 – early March 2027
```

**Replace with**

```text
Mon, Nov 30, 2026, 6:30 AM PT – Fri, Mar 19, 2027, 1:00 PM PT
```

#### 12. Row "Verification & Finals", timing and output cells

| Column | Now | Change to |
|---|---|---|
| Timing | `March – early spring quarter 2027` | `Late March – early spring quarter 2027` |
| Primary output | `Reproduction checks, then finalist presentations and awards` | `Reproduction checks; the Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams present; awards` |

### What You Submit

#### 13. Section intro, first sentence only

Keep the second sentence ("Every submission receives a timestamped archive and a cryptographic hash.").

**Find**

```text
Five pieces, due at the late-November freeze.
```

**Replace with**

```text
Five pieces, due Sun, Nov 22, 2026, 11:59 PM PT.
```

### Evaluation

#### 14. Section heading and intro

Keep the four rubric cards and their percentages exactly as they are. If the heading text generates an anchor ID that other links use, keep the existing ID.

**Heading: find**

```text
How You Are Scored
```

**Heading: replace with**

```text
How Awards Are Decided
```

**Intro: find**

```text
Judges score independently against a written rubric before panel discussion. 65% of the weight sits on research and testing quality.
```

**Intro: replace with**

```text
Best Sharpe and Best Calmar are computed from the forward window for eligible strategies. Best Rigor is judged against the written rubric below: judges score independently before panel discussion, and 65% of the weight sits on research and testing quality.
```

### Awards

#### 15. Awards intro

**Find**

```text
There is more than one way to win. Research awards are open to strategies whose forward sample is too small for a performance award.
```

**Replace with**

```text
Three awards, each with a cash prize. One team can win more than one. Best Rigor has no minimum trade count, so low-frequency strategies stay eligible.
```

#### 16. Replace the three award groups with three award cards

**Remove** all three groups and their items:

- `Overall`: `First place`, `Second place`, `Third place`
- `Research Awards`: `Best Research Thesis`, `Best Backtest and Validation`, `Best Risk Management`
- `Performance Awards`: `Best Forward-Window Performance`, `Best Risk-Adjusted Strategy`

**Add** three cards using the same card component, one per award:

| Title | Body | Tag |
|---|---|---|
| `Best Sharpe` | `Highest forward-window Sharpe ratio among eligible strategies.` | `Cash prize` |
| `Best Calmar` | `Highest forward-window return per unit of max drawdown (drawdown floored at 2%) among eligible strategies.` | `Cash prize` |
| `Best Rigor` | `Judged by the panel on the full rubric. The top 5 teams present, and the winner is decided after the presentations.` | `Cash prize` |

Don't show prize amounts.

#### 17. Finals note (insert)

Place directly below the three award cards, in the section's body text style.

```text
Finals (spring quarter): the Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams each present for 3 minutes, plus 3 minutes of Q&A. The Best Rigor winner is decided after the presentations.
```

### Register Your Interest

#### 18. Body text above the "Register Team / Sign In" button

In source the apostrophe in "We'll" may be `'`, `’`, `&apos;`, or `&rsquo;`. Search for `send the rules briefing`.

**Find**

```text
Teams of up to three UCLA students. We'll send the rules briefing, data conventions, and onboarding details as they are published.
```

**Replace with**

```text
Open to undergraduates from any school, solo or in teams of up to 3. Register by Sun, Nov 22, 2026, 11:59 PM PT. Detailed instructions are emailed after you register.
```

#### 19. Contact line (insert)

Place below the "Register Team / Sign In" button. Make the address a `mailto:bfbatucla@gmail.com` link. Also add the same line near the bottom of the details page, above "Back to the Competition Overview".

```text
Questions? Email bfbatucla@gmail.com
```

#### 20. FAQ section (insert)

- **Placement:** overview page, a new section immediately before "Register Your Interest".
- **Structure:** follow the page's existing section pattern. Eyebrow `FAQ`, heading `Common Questions`, and `id="faq"` on the section so it can be linked.
- **Content:** the 18 entries in [Appendix A](#appendix-a-faq-content), in order.
- **Behavior:** each answer must be readable without JavaScript and reachable by keyboard. A native `<details>`/`<summary>` accordion or a plain definition list both work.

The info-session deck tells students that the full rules and the FAQ are on this page, so this section needs to be live before the session.

### Footer note

#### 21. Footer note: drop "proposed" (on both pages)

The same note appears at the bottom of the overview page and the details page. Replace both.

**Find**

```text
Rules, scoring weights, and risk limits on this page are proposed. BFB publishes the final rubric, data conventions, and tie-break procedure before the strategy freeze.
```

**Replace with**

```text
Full rules and data conventions are emailed to registered participants. BFB publishes the tie-break procedure before the strategy freeze.
```

---

## Details page tasks (`/competition/alpha-research/details`)

### What a Strong Submission Looks Like

#### 22. "How Your Backtest Gets Stress-Tested": add the benchmark item (insert)

Insert as a new list item immediately before the item that starts with `Return, volatility, drawdown, turnover`.

```text
Comparison with a relevant benchmark and simple baselines, separating market beta from the claimed alpha.
```

### How the Forward Window Is Read

#### 23. Section intro

**Find**

```text
A December-to-March window gives far more evidence than a five-week test, but it is still too short to make an annualized Sharpe or Calmar ratio statistically decisive — especially for low-turnover equity strategies. Forward performance complements the research record; it does not replace it.
```

**Replace with**

```text
The Nov 30 – Mar 19 window (16 weeks) gives far more evidence than a five-week test, but it is still too short to make an annualized Sharpe or Calmar ratio statistically decisive, especially for low-turnover equity strategies. That is why Best Sharpe and Best Calmar have minimum-activity rules, and why forward performance is 20% of the Best Rigor rubric rather than the whole score.
```

#### 24. "What the Panel Weighs": first bullet

As written, this bullet contradicts Best Sharpe and Best Calmar, which are decided by a single ratio.

**Find**

```text
No single annualized ratio or roughly three-month return decides the winner.
```

**Replace with**

```text
For Best Rigor, no single ratio or 16-week return decides the result.
```

#### 25. "What the Panel Weighs": last bullet

**Find**

```text
Low-frequency strategies stay eligible for research awards even when the forward sample is too small for a performance award.
```

**Replace with**

```text
Low-frequency strategies stay eligible for Best Rigor even when the forward sample is too small for Best Sharpe or Best Calmar.
```

### Portfolio & Risk Limits

#### 26. Section intro: drop the "proposed" sentence

**Find**

```text
These baselines make results comparable and stop a short sample from rewarding a single concentrated bet. They remain proposed until the final handbook is published before launch.
```

**Replace with**

```text
These limits make results comparable and stop a short sample from rewarding a single concentrated bet.
```

#### 27. Table row "Forward drawdown", Application cell

**Find**

```text
A breach removes eligibility for overall and performance-based awards, subject to incident review
```

**Replace with**

```text
A breach removes eligibility for Best Sharpe and Best Calmar, subject to incident review
```

#### 28. Table row "Risk-adjusted award sample"

| Column | Now | Change to |
|---|---|---|
| Control | `Risk-adjusted award sample` | `Best Sharpe & Best Calmar sample` |
| Baseline | `≥ 30 independent completed trades (≥ 10 in the forward window)` | unchanged |
| Application | `Applies to metric-based awards; trades split mechanically to inflate the count are consolidated` | `Applies to Best Sharpe and Best Calmar; trades split mechanically to inflate the count are consolidated, and repeated partial fills are not new trades` |

#### 29. Two new table rows (insert)

Insert directly after the row from task 28, using the same row component.

| Control | Baseline | Application |
|---|---|---|
| `Capital at work` | `Average gross exposure ≥ 25% across the forward window` | `Required for Best Sharpe and Best Calmar` |
| `Calmar drawdown floor` | `Max drawdown floored at 2%` | `Stops a tiny drawdown from inflating the Calmar ratio` |

#### 30. "Specialized Research Designation": two bullets

**Find**

```text
Approved teams stay eligible for thesis, validation, and risk-management awards.
```

**Replace with**

```text
Approved teams stay eligible for Best Rigor.
```

**Find**

```text
Metric-based awards may be unavailable when the sample is too small.
```

**Replace with**

```text
Best Sharpe and Best Calmar may be unavailable when the sample is too small.
```

### Verification & Your Work

#### 31. "Finalist Verification": new first bullet (insert)

```text
Finalists are the Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams.
```

#### 32. "Intellectual Property": delete the sponsor bullet

Remove this whole list item. There are no sponsors.

```text
Sponsors receive only what is described in the agreed partnership scope.
```

#### 33. "Intellectual Property": consent bullet

**Find**

```text
Source code, non-public research, resumes, and contact details are shared only with your consent.
```

**Replace with**

```text
Source code and non-public research are shared only with your consent.
```

---

## Verification

Run these checks against the rendered pages (dev server or preview deployment), then search the whole repo for the same strings.

### Must not appear on either page (case-insensitive)

- `UCLA students`
- `late November`, `late-November`
- `Dec 2026`, `December 2026`, `December-to-March`
- `early March`
- `First place`, `Second place`, `Third place`
- `Best Research Thesis`, `Best Backtest and Validation`, `Best Risk Management`
- `Best Forward-Window Performance`, `Best Risk-Adjusted Strategy`
- `research awards`, `performance award`, `metric-based awards`, `overall and performance-based`
- `roughly three-month`
- `Sponsors receive`
- `How You Are Scored`
- `Risk-adjusted award sample`
- `are proposed`, `remain proposed`

### Must appear

- **Overview page:** `Nov 22, 2026`, `11:59 PM PT`, `Nov 30, 2026`, `Mar 19, 2027`, `any school`, `Best Sharpe`, `Best Calmar`, `Best Rigor`, `top 5`, `bfbatucla@gmail.com`, `Common Questions`
- **Details page:** `Nov 30 – Mar 19`, `Best Sharpe and Best Calmar`, `Best Rigor`, `Capital at work`, `Calmar drawdown floor`, `bfbatucla@gmail.com`

### Manual checks

- Click each of the seven "How It Works" steps. Steps 05–07 show the new text.
- The new deadline stat, the award cards, the finals note, the FAQ, and the contact line look right at phone width and on desktop.
- The FAQ works with the keyboard alone, and every answer is readable without JavaScript.
- The Register buttons still go to the same place.

## Out of scope

Don't write FAQ answers about any of the following. The organizers haven't decided them yet:

- entry fees
- joining more than one team
- allowed programming languages
- AI-tool policy
- prize amounts
- who judges

---

## Appendix A: FAQ content

Add all 18 entries in this order.

**A.1 Who can enter?**
Any undergraduate student from any school. You can enter solo or as a team of up to 3.

**A.2 How do I register, and when does registration close?**
Register on this page by Sun, Nov 22, 2026, 11:59 PM PT. Detailed instructions are emailed after you register, so registering early gives you more time to prepare.

**A.3 When is the submission deadline?**
Also Sun, Nov 22, 2026, 11:59 PM PT. Registration and submission close at the same time.

**A.4 What do I submit?**
One package with five parts: a research memo; runnable strategy code with a pinned environment, a configuration file, and a clear entry point; a backtest report; a data dictionary and provenance record; and reproduction instructions with a signed confirmation that nothing changes after the freeze.

**A.5 Which markets can I trade?**
A frozen S&P 500 constituent universe and up to 1,000 Binance spot instruments. Long and short positions are allowed within the risk limits.

**A.6 Is real money involved?**
No. Every team starts with $100,000 of simulated capital.

**A.7 What are the risk limits?**
At most 20% of the portfolio in any single position, at most 150% gross exposure, net exposure between −100% and +100%, and a maximum drawdown of 35% in the forward window.

**A.8 Can I use my own data?**
Yes, for research. Obtain it lawfully and disclose every source. The official evaluation uses BFB's market data and published conventions.

**A.9 Can I change my strategy after the deadline?**
No. Your package is timestamped and hashed at the deadline, and only the frozen package runs. Emergency fixes need organizer approval and are disclosed to everyone.

**A.10 When does the forward window run, and do I need to do anything?**
From Mon, Nov 30, 2026, 6:30 AM PT to Fri, Mar 19, 2027, 1:00 PM PT. BFB runs your frozen strategy, so you don't need to do anything during the window.

**A.11 How are the awards decided?**
Best Sharpe and Best Calmar go to the eligible strategies with the highest forward-window Sharpe and Calmar ratios. Best Rigor is judged on the rubric: thesis and implementation 30%, backtest rigor and robustness 35%, forward-window performance 20%, and risk controls and reproducibility 15%.

**A.12 What makes a strategy eligible for Best Sharpe or Best Calmar?**
At least 30 independent completed trades (at least 10 in the forward window), average gross exposure of at least 25% across the window, a forward drawdown within 35%, and no rule breach, prohibited data use, material post-freeze change, or failed reproduction. Calmar floors max drawdown at 2%.

**A.13 My strategy trades rarely or uses a single asset. Can I still compete?**
Yes. Best Rigor has no minimum trade count. Single-asset, infrequent-event, long-holding, or unique-data strategies can request a Specialized Research Designation before the freeze.

**A.14 Can one team win more than one award?**
Yes.

**A.15 What happens at the finals?**
In spring quarter, the Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams each present for 3 minutes, plus 3 minutes of Q&A. The Best Rigor winner is decided after the presentations.

**A.16 Do the presentations change Best Sharpe or Best Calmar?**
No. Those two awards are decided by the forward-window metrics once BFB has verified the results. Only Best Rigor is decided after the presentations.

**A.17 Who owns my strategy?**
You keep ownership of your original research and code. Source code and non-public research are shared only with your consent.

**A.18 Who do I contact with questions?**
Email bfbatucla@gmail.com (link it as `mailto:bfbatucla@gmail.com`).
