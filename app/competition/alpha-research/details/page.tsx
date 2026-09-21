"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Gauge, ShieldCheck, Lock, FileText, Info, Globe, Microscope } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const markets = [
  {
    label: "Equities",
    body: "A frozen S&P 500 constituent universe specified by the organizers, to reduce ambiguity and survivorship leakage.",
  },
  {
    label: "Crypto",
    body: "Up to 1,000 Binance spot instruments, selected under published liquidity and data-availability criteria.",
  },
  {
    label: "Your Responsibility",
    body: "Lawfully obtain and disclose your research-phase data. Official evaluation data and conventions are standardized by BFB.",
  },
];

const standards = [
  {
    title: "What the Memo Must Establish",
    points: [
      "Thesis and mechanism — why the return source should persist after costs.",
      "Data provenance — source, field, timestamp, publication lag, transformation, licensing.",
      "Signal construction — feature, forecast, rebalance frequency, lookbacks, stale-data handling.",
      "Portfolio construction — selection, sizing, diversification, cash, leverage, rebalancing.",
      "Execution assumptions — order timing, prices, fees, spread or slippage, liquidity filters.",
      "Validation plan — development, parameter selection, validation, and untouched out-of-sample evidence.",
      "Risk and limitations — concentration, crowding, regime, liquidity, capacity, model, operational.",
    ],
  },
  {
    title: "How Your Backtest Gets Stress-Tested",
    points: [
      "Chronological train, validation, and out-of-sample segments — random shuffling is unsuitable here.",
      "Only information available at each decision timestamp, including publication and constituent dates.",
      "Survivorship bias, delistings, splits, dividends, symbol changes, and venue changes addressed.",
      "Transaction costs and slippage matched to instrument liquidity and turnover; zero-cost results disclosed separately.",
      "Parameter sensitivity and adjacent specifications, so a narrow optimum is visible rather than hidden.",
      "Subperiod, regime, and instrument-level attribution — aggregate performance alone is not enough.",
      "Return, volatility, drawdown, turnover, exposure, hit rate, and trade count — not Sharpe alone.",
    ],
  },
];

const forwardWindow = [
  "No single annualized ratio or roughly three-month return decides the winner.",
  "Drawdown path, concentration, implementation errors, and unexplained deviations can outweigh a strong headline return.",
  "Trade count and independence are considered before any Sharpe, Calmar, or hit-rate figure is interpreted.",
  "Low-frequency strategies stay eligible for research awards even when the forward sample is too small for a performance award.",
];

const riskControls = [
  {
    control: "Single-position size",
    baseline: "Max 20% of portfolio value",
    application: "Measured after each rebalance; excess exposure must be reduced at the next permitted execution",
  },
  {
    control: "Gross exposure",
    baseline: "Max 150%",
    application: "Long absolute exposure plus short absolute exposure; derivatives, if allowed, use defined notional treatment",
  },
  {
    control: "Net exposure",
    baseline: "−100% to +100%",
    application: "Measured consistently across instruments and cash; no hidden leverage through offsetting positions",
  },
  {
    control: "Forward drawdown",
    baseline: "Max 35%",
    application: "A breach removes eligibility for overall and performance-based awards, subject to incident review",
  },
  {
    control: "Risk-adjusted award sample",
    baseline: "≥ 30 independent completed trades (≥ 10 in the forward window)",
    application: "Applies to metric-based awards; trades split mechanically to inflate the count are consolidated",
  },
];

const executionModel = [
  "Every portfolio uses the same simulated capital and published fees, spread or slippage, and fill conventions.",
  "Orders are timestamped and evaluated against data available at the decision time. Same-bar look-ahead is prohibited.",
  "Liquidity screens, participation limits, and rejected-fill logic are applied consistently across teams.",
  "Corporate actions, delistings, halts, symbol changes, and missing prices follow a written market-specific policy.",
];

const designation = [
  "Explain why the general concentration or trade-count rule would distort your research design, and propose an alternative risk limit.",
  "Approved teams stay eligible for thesis, validation, and risk-management awards.",
  "Metric-based awards may be unavailable when the sample is too small.",
  "Decisions are recorded before evaluation, so exceptions cannot be granted after performance is known.",
];

const verification = [
  {
    icon: Lock,
    title: "Freeze & Logging",
    points: [
      "The frozen package is the only package used for the forward window.",
      "Emergency fixes require organizer approval and are fully disclosed.",
      "Official runs record inputs, signals, orders, fills, positions, cash, exposure, and exceptions.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Finalist Verification",
    points: [
      "BFB reproduces headline metrics from your archived package and the official logs.",
      "Finalists reconcile return, P&L, drawdown, exposure, and trade count to a common methodology.",
      "Judges may inspect a sample of signals and trades for timestamp integrity and rule compliance.",
    ],
  },
  {
    icon: FileText,
    title: "Intellectual Property",
    points: [
      "You retain ownership of your original research and code, subject to competition rules and third-party data terms.",
      "Source code, non-public research, resumes, and contact details are shared only with your consent.",
      "Sponsors receive only what is described in the agreed partnership scope.",
    ],
  },
];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((point) => (
        <li key={point} className="flex items-start gap-3">
          <span
            className="mt-2 w-1.5 h-1.5 rounded-full bg-bfb-blue/60 dark:bg-accent/60 shrink-0"
            aria-hidden="true"
          />
          <span className="text-sm text-slate-500 dark:text-silver/60 leading-relaxed">{point}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mb-10"
    >
      <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue dark:text-accent">
        {eyebrow}
      </span>
      <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-4 mb-3 text-balance">
        {title}
      </h2>
      <p className="text-slate-500 dark:text-silver/60 text-body max-w-2xl text-pretty">{lead}</p>
    </motion.div>
  );
}

export default function AlphaResearchDetailsPage() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Hero */}
      <section className="relative pt-page pb-section px-gutter overflow-hidden">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <Link
            href="/competition/alpha-research"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-silver/60 hover:text-bfb-blue dark:hover:text-accent transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-4 rounded-sm"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Alpha Research Competition
          </Link>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            <span className="text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue dark:text-accent">
              Competition Details
            </span>
            <h1 className="text-hero font-serif text-slate-900 dark:text-silver leading-tight text-balance">
              Rules &amp; Operating Model
            </h1>
            <p className="text-slate-500 dark:text-silver/60 text-body-lg leading-relaxed max-w-2xl text-pretty">
              The markets you can trade, what a strong submission looks like, how the forward window
              is interpreted, the risk limits every portfolio operates under, and what verification
              involves if you reach the finals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Eligible markets and data */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Scope"
            title="Eligible Markets & Data"
            lead="Two markets, both with organizer-specified universes so results stay comparable across teams."
          />

          <div className="grid lap:grid-cols-3 gap-6">
            {markets.map((item, i) => (
              <motion.div
                key={item.label}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm"
              >
                <Globe className="text-bfb-blue dark:text-accent mb-4" size={20} aria-hidden="true" />
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                  {item.label}
                </p>
                <p className="text-sm text-slate-500 dark:text-silver/60 leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What a strong submission looks like */}
      <section className="py-section px-gutter">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Standards"
            title="What a Strong Submission Looks Like"
            lead="A judge should be able to understand what you are predicting, why the effect could exist, how it becomes a portfolio, and whether your evidence survives reasonable attempts to break it."
          />

          <div className="grid lap:grid-cols-2 gap-6">
            {standards.map((col, i) => (
              <motion.div
                key={col.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-card rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Microscope className="text-bfb-blue dark:text-accent" size={20} aria-hidden="true" />
                  <h3 className="text-h3 font-serif text-slate-900 dark:text-silver text-pretty">
                    {col.title}
                  </h3>
                </div>
                <Bullets items={col.points} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How the forward window is read */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Interpretation"
            title="How the Forward Window Is Read"
            lead="A December-to-March window gives far more evidence than a five-week test, but it is still too short to make an annualized Sharpe or Calmar ratio statistically decisive — especially for low-turnover equity strategies. Forward performance complements the research record; it does not replace it."
          />

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-card rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Info className="text-bfb-blue dark:text-accent" size={20} aria-hidden="true" />
              <h3 className="text-h3 font-serif text-slate-900 dark:text-silver">
                What the Panel Weighs
              </h3>
            </div>
            <Bullets items={forwardWindow} />
          </motion.div>
        </div>
      </section>

      {/* Portfolio and risk limits */}
      <section className="py-section px-gutter">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Guardrails"
            title="Portfolio & Risk Limits"
            lead="These baselines make results comparable and stop a short sample from rewarding a single concentrated bet. They remain proposed until the final handbook is published before launch."
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[760px]">
              <colgroup>
                <col style={{ width: "24%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "46%" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th scope="col" className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                    Control
                  </th>
                  <th scope="col" className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                    Baseline
                  </th>
                  <th scope="col" className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                    Application
                  </th>
                </tr>
              </thead>
              <tbody>
                {riskControls.map((row) => (
                  <tr key={row.control} className="border-b border-slate-100 dark:border-white/5">
                    <td className="py-4 pr-4 text-sm text-slate-900 dark:text-silver font-bold align-top">
                      {row.control}
                    </td>
                    <td className="py-4 pr-4 text-sm text-bfb-blue dark:text-accent align-top tabular-nums">
                      {row.baseline}
                    </td>
                    <td className="py-4 text-sm text-slate-500 dark:text-silver/60 align-top">
                      {row.application}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid lap:grid-cols-2 gap-6 mt-12">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-card rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <Gauge className="text-bfb-blue dark:text-accent" size={20} aria-hidden="true" />
                <h3 className="text-h3 font-serif text-slate-900 dark:text-silver">
                  Execution Model
                </h3>
              </div>
              <Bullets items={executionModel} />
            </motion.div>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-card rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck className="text-bfb-blue dark:text-accent" size={20} aria-hidden="true" />
                <h3 className="text-h3 font-serif text-slate-900 dark:text-silver text-pretty">
                  Specialized Research Designation
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-silver/60 leading-relaxed mb-4">
                Running a single-asset, infrequent-event, long-holding-period, or unique-data
                strategy? Request the designation before the freeze.
              </p>
              <Bullets items={designation} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Verification and your work */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Integrity"
            title="Verification & Your Work"
            lead="An auditable chain from data and code to orders, positions, and final metrics — and a clear answer on who owns what."
          />

          <div className="grid lap:grid-cols-3 gap-6">
            {verification.map((card, i) => (
              <motion.div
                key={card.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm"
              >
                <card.icon className="text-bfb-blue dark:text-accent mb-4" size={20} aria-hidden="true" />
                <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-silver mb-4 leading-tight text-pretty">
                  {card.title}
                </h3>
                <Bullets items={card.points} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/competition/alpha-research"
            className="group inline-flex items-center gap-2 text-body font-semibold text-bfb-blue dark:text-accent hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-4 rounded-sm"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to the Competition Overview
          </Link>

          <p className="mt-10 text-xs text-slate-400 dark:text-silver/40 leading-relaxed max-w-lg mx-auto">
            Rules, scoring weights, and risk limits on this page are proposed. BFB publishes the
            final rubric, data conventions, and tie-break procedure before the strategy freeze.
          </p>
        </div>
      </section>
    </div>
  );
}
