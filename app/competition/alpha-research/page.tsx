"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  LineChart,
  Users,
  Wallet,
  CalendarClock,
  FileText,
  Code2,
  BarChart3,
  Database,
  Lock,
  Trophy,
} from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const glance = [
  { icon: Users, label: "Team Size", value: "Up to 3 students" },
  { icon: Wallet, label: "Starting Capital", value: "$100,000 simulated" },
  { icon: LineChart, label: "Markets", value: "S&P 500 + Binance spot" },
  { icon: CalendarClock, label: "Forward Window", value: "Dec 2026 – Mar 2027" },
];

const workflow = [
  {
    step: "01",
    title: "Form a Research Question",
    desc: "Define the claimed source of edge, the economic rationale, the market, the horizon, and the failure modes you expect.",
  },
  {
    step: "02",
    title: "Acquire & Document Data",
    desc: "Record provenance, timestamps, licensing constraints, transformations, and known limitations for every source you touch.",
  },
  {
    step: "03",
    title: "Build the Signal",
    desc: "Translate the thesis into deterministic entry, exit, sizing, exposure, and risk logic.",
  },
  {
    step: "04",
    title: "Run Historical Validation",
    desc: "Separate development from out-of-sample testing, and include realistic trading frictions.",
  },
  {
    step: "05",
    title: "Submit & Freeze",
    desc: "Deliver code, configuration, documentation, and declared dependencies before the deadline. After the freeze, nothing changes.",
  },
  {
    step: "06",
    title: "Complete the Forward Window",
    desc: "Your unchanged strategy runs through the official evaluation environment and data feed.",
  },
  {
    step: "07",
    title: "Present & Defend",
    desc: "Explain the result, the attribution, the limitations, and the lessons to the judging panel.",
  },
];

const timeline = [
  {
    phase: "Registration & Orientation",
    timing: "September 2026",
    output: "Team registration, rules briefing, and technical onboarding",
  },
  {
    phase: "Research & Development",
    timing: "September – November 2026",
    output: "Thesis, data work, implementation, and historical testing",
  },
  {
    phase: "Submission & Freeze",
    timing: "Late November 2026",
    output: "Research memo, code package, results, and locked configuration",
  },
  {
    phase: "Unseen Forward Window",
    timing: "December 2026 – early March 2027",
    output: "Official simulated execution through the period before spring break",
  },
  {
    phase: "Verification & Finals",
    timing: "March – early spring quarter 2027",
    output: "Reproduction checks, then finalist presentations and awards",
  },
];

const deliverables = [
  {
    icon: FileText,
    title: "Research Memo",
    desc: "Your thesis, evidence, assumptions, portfolio construction, and limitations — stated plainly enough that a judge can attack them.",
  },
  {
    icon: Code2,
    title: "Runnable Strategy Code",
    desc: "A pinned environment, a configuration file, and a clear entry point. It has to run from documented inputs, with no manual adjustments.",
  },
  {
    icon: BarChart3,
    title: "Backtest Report",
    desc: "Returns, drawdowns, turnover, exposure, trade statistics, benchmarks, and sensitivity checks.",
  },
  {
    icon: Database,
    title: "Data Dictionary & Provenance",
    desc: "Source, fields, timestamp convention, and preprocessing for everything that feeds the signal.",
  },
  {
    icon: Lock,
    title: "Reproduction Instructions",
    desc: "Plus a signed confirmation that the post-freeze strategy will not be changed.",
  },
];

const scoring = [
  {
    weight: "30%",
    title: "Research Thesis & Implementation",
    desc: "Economic rationale, originality, signal clarity, and faithful translation into portfolio rules.",
  },
  {
    weight: "35%",
    title: "Backtest Rigor & Robustness",
    desc: "Leakage control, realistic frictions, out-of-sample design, sensitivity, attribution, and benchmark quality.",
  },
  {
    weight: "20%",
    title: "Unseen Forward-Window Performance",
    desc: "Absolute and risk-adjusted result, consistency, drawdown, execution quality, and behavior versus expectation.",
  },
  {
    weight: "15%",
    title: "Risk Controls & Reproducibility",
    desc: "Compliance, concentration and exposure control, code quality, documentation, and successful reproduction.",
  },
];

const awards = [
  { group: "Overall", items: ["First place", "Second place", "Third place"] },
  {
    group: "Research Awards",
    items: ["Best Research Thesis", "Best Backtest and Validation", "Best Risk Management"],
  },
  {
    group: "Performance Awards",
    items: ["Best Forward-Window Performance", "Best Risk-Adjusted Strategy"],
  },
];

function WorkflowStep({
  item,
  isOpen,
  onToggle,
  reduceMotion,
}: {
  item: (typeof workflow)[number];
  isOpen: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
}) {
  const panelId = `workflow-panel-${item.step}`;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={panelId}
      style={{ touchAction: "manipulation" }}
      className={`snap-start shrink-0 w-64 self-start text-left p-6 rounded-2xl border bg-white dark:bg-midnight/40 shadow-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-midnight ${
        isOpen
          ? "border-bfb-blue/40 dark:border-accent/40"
          : "border-slate-100 dark:border-white/5 hover:border-bfb-blue/30 dark:hover:border-accent/30"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="w-9 h-9 rounded-full border-2 border-bfb-blue flex items-center justify-center text-bfb-blue font-bold text-[11px] tabular-nums">
          {item.step}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`text-slate-400 dark:text-silver/40 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* min-height reserves two lines so every collapsed card is the same height */}
      <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-silver leading-tight text-pretty min-h-[2.5rem]">
        {item.title}
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-slate-500 dark:text-silver/60 leading-relaxed text-sm">
              {item.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function AlphaResearchCompetitionPage() {
  const reduceMotion = useReducedMotion() ?? false;
  const [openStep, setOpenStep] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Hero + Overview */}
      <section className="relative pt-page pb-section px-gutter overflow-hidden">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-4 text-center"
          >
            <span className="text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue dark:text-accent">
              Fall 2026 – Spring 2027
            </span>

            <h1 className="text-hero font-serif text-slate-900 dark:text-silver leading-tight text-balance">
              Alpha Research Competition
            </h1>

            <div className="w-24 h-px bg-gradient-to-r from-transparent via-bfb-blue to-transparent opacity-30" />

            <p className="text-slate-500 dark:text-silver/60 text-body-lg leading-relaxed max-w-2xl text-pretty">
              Turn an original market thesis into a documented, executable strategy — then freeze it
              and test it on data nobody has seen.
            </p>

            <div className="flex flex-col lap:flex-row items-center gap-4 mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center min-h-[52px] gap-2 px-8 py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2"
              >
                Register Interest <ChevronRight size={18} aria-hidden="true" />
              </Link>
              <a
                href="#timeline"
                className="inline-flex items-center justify-center min-h-[52px] gap-2 px-8 py-4 border border-slate-300 dark:border-white/15 text-slate-600 dark:text-silver/70 font-medium rounded-sm hover:border-slate-400 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-silver transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2"
              >
                See the Timeline
              </a>
            </div>
          </motion.div>

          {/* Overview stats */}
          <div className="mt-block lap:mt-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue dark:text-accent">
                Overview
              </span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
            </div>

            <div className="grid grid-cols-2 lap:grid-cols-4 gap-6">
              {glance.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm"
                >
                  <item.icon className="text-bfb-blue dark:text-accent mb-4" size={22} aria-hidden="true" />
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-2">
                    {item.label}
                  </p>
                  <p className="text-slate-900 dark:text-silver font-semibold leading-snug text-pretty">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="mt-6 text-sm text-slate-400 dark:text-silver/40">
              No participant capital is put at risk at any point in the competition.
            </p>
          </div>
        </div>
      </section>

      {/* Participant workflow */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue dark:text-accent">
              How It Works
            </span>
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-4 mb-3 text-balance">
              The Participant Workflow
            </h2>
            <p className="text-slate-500 dark:text-silver/60 text-body max-w-xl text-pretty">
              Seven stages, from an idea you can defend to a result you have to explain. Select a
              step to read what it involves.
            </p>
          </motion.div>

          <div className="-mx-gutter px-gutter overflow-x-auto pb-4 snap-x snap-mandatory">
            <div className="flex items-start gap-4 min-w-max">
              {workflow.map((item) => (
                <WorkflowStep
                  key={item.step}
                  item={item}
                  isOpen={openStep === item.step}
                  onToggle={() => setOpenStep(openStep === item.step ? null : item.step)}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="py-section px-gutter scroll-mt-nav">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue dark:text-accent">
              Schedule
            </span>
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-4 mb-3 text-balance">
              Competition Timeline
            </h2>
            <p className="text-slate-500 dark:text-silver/60 text-body max-w-xl text-pretty">
              Research through fall, freeze in late November, then an extended forward window that
              ends before spring break.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[720px]">
              <colgroup>
                <col style={{ width: "28%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "44%" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th scope="col" className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                    Phase
                  </th>
                  <th scope="col" className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                    Timing
                  </th>
                  <th scope="col" className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                    Primary Output
                  </th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((row) => (
                  <tr key={row.phase} className="border-b border-slate-100 dark:border-white/5">
                    <td className="py-4 pr-4 text-sm text-slate-900 dark:text-silver font-bold align-top">
                      {row.phase}
                    </td>
                    <td className="py-4 pr-4 text-sm text-bfb-blue dark:text-accent align-top">
                      {row.timing}
                    </td>
                    <td className="py-4 text-sm text-slate-500 dark:text-silver/60 align-top">
                      {row.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Submission package */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue dark:text-accent">
              Deliverables
            </span>
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-4 mb-3 text-balance">
              What You Submit
            </h2>
            <p className="text-slate-500 dark:text-silver/60 text-body max-w-xl text-pretty">
              Five pieces, due at the late-November freeze. Every submission receives a timestamped
              archive and a cryptographic hash.
            </p>
          </motion.div>

          <div className="grid lap:grid-cols-2 gap-6">
            {deliverables.map((item, i) => (
              <motion.div
                key={item.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm ${
                  i === deliverables.length - 1 ? "lap:col-span-2" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 p-2.5 rounded-xl bg-bfb-blue/10 text-bfb-blue dark:text-accent">
                    <item.icon size={20} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-silver mb-2 leading-tight text-pretty">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-silver/60 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring */}
      <section className="py-section px-gutter">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue dark:text-accent">
              Evaluation
            </span>
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-4 mb-3 text-balance">
              How You Are Scored
            </h2>
            <p className="text-slate-500 dark:text-silver/60 text-body max-w-xl text-pretty">
              Judges score independently against a written rubric before panel discussion. 65% of the
              weight sits on research and testing quality.
            </p>
          </motion.div>

          <div className="space-y-4">
            {scoring.map((row, i) => (
              <motion.div
                key={row.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm"
              >
                <div className="flex flex-col lap:flex-row lap:items-baseline gap-2 lap:gap-6 mb-3">
                  <span className="text-h3 font-serif text-bfb-blue dark:text-accent shrink-0 w-16 tabular-nums">
                    {row.weight}
                  </span>
                  <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-silver leading-tight text-pretty">
                    {row.title}
                  </h3>
                </div>
                <div className="lap:pl-[5.5rem]">
                  <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-white/5 mb-3 overflow-hidden">
                    <motion.div
                      initial={reduceMotion ? undefined : { width: 0 }}
                      whileInView={{ width: row.weight }}
                      viewport={{ once: true }}
                      transition={{ duration: reduceMotion ? 0 : 0.8, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-bfb-blue dark:bg-accent rounded-full"
                    />
                  </div>
                  <p className="text-slate-500 dark:text-silver/60 leading-relaxed text-sm">
                    {row.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Details link */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-h3 font-serif text-slate-900 dark:text-silver mb-3 text-balance">
            Want the Full Rules?
          </h2>
          <p className="text-slate-500 dark:text-silver/60 text-body mb-8 text-pretty">
            What a strong submission looks like, eligible markets and data, how the forward window is
            read, portfolio and risk limits, and what verification involves — all in one place.
          </p>
          <Link
            href="/competition/alpha-research/details"
            className="group inline-flex items-center gap-2 text-body font-semibold text-bfb-blue dark:text-accent hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-4 rounded-sm"
          >
            Read the Competition Details
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>

      {/* Awards */}
      <section className="py-section px-gutter">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue dark:text-accent">
              Recognition
            </span>
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-4 mb-3 text-balance">
              Awards
            </h2>
            <p className="text-slate-500 dark:text-silver/60 text-body max-w-xl text-pretty">
              There is more than one way to win. Research awards are open to strategies whose forward
              sample is too small for a performance award.
            </p>
          </motion.div>

          <div className="grid lap:grid-cols-3 gap-6">
            {awards.map((group, i) => (
              <motion.div
                key={group.group}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm"
              >
                <div className="inline-flex p-3 bg-bfb-blue/10 text-bfb-blue dark:text-accent rounded-full mb-4">
                  <Trophy size={20} aria-hidden="true" />
                </div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 mb-4">
                  {group.group}
                </p>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-slate-700 dark:text-silver/80 leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-section px-gutter">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mb-4 text-balance">
            Register Your Interest
          </h2>
          <p className="text-slate-500 dark:text-silver/60 text-body-lg mb-10 text-pretty">
            Teams of up to three UCLA students. We&apos;ll send the rules briefing, data conventions,
            and onboarding details as they are published.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[52px] gap-2 px-8 py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2"
          >
            Register Interest <ChevronRight size={18} aria-hidden="true" />
          </Link>

          <p className="mt-10 text-xs text-slate-400 dark:text-silver/40 leading-relaxed">
            Rules, scoring weights, and risk limits on this page are proposed. BFB publishes the
            final rubric, data conventions, and tie-break procedure before the strategy freeze.
          </p>
        </div>
      </section>
    </div>
  );
}
