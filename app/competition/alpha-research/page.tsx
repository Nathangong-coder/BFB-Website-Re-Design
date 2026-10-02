"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
  UserPlus,
  UploadCloud,
} from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const glance = [
  { icon: Users, label: "Team Size", value: "1–3 undergraduates, any school" },
  { icon: Wallet, label: "Starting Capital", value: "$100,000 simulated" },
  { icon: LineChart, label: "Markets", value: "S&P 500 + Binance spot" },
  { icon: CalendarClock, label: "Forward Window", value: "Nov 30, 2026 – Mar 19, 2027" },
  { icon: CalendarClock, label: "Register & submit by", value: "Nov 22, 2026 · 11:59 PM PT" },
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
    desc: "Deliver code, configuration, documentation, and declared dependencies by Sun, Nov 22, 2026, 11:59 PM PT. After the freeze, nothing changes.",
  },
  {
    step: "06",
    title: "Complete the Forward Window",
    desc: "From Mon, Nov 30, 2026, 6:30 AM PT to Fri, Mar 19, 2027, 1:00 PM PT, your unchanged strategy runs through the official evaluation environment and data feed.",
  },
  {
    step: "07",
    title: "Present & Defend",
    desc: "The Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams present in spring quarter: 3 minutes, plus 3 minutes of Q&A. Explain the result, the attribution, the limitations, and the lessons to the judging panel.",
  },
];

const timeline = [
  {
    phase: "Registration",
    timing: "September – Sun, Nov 22, 2026, 11:59 PM PT",
    output: "Register to receive the detailed instructions by email",
  },
  {
    phase: "Research & Development",
    timing: "September – Nov 22, 2026",
    output: "Thesis, data work, implementation, and historical testing",
  },
  {
    phase: "Submission & Freeze",
    timing: "Sun, Nov 22, 2026, 11:59 PM PT",
    output: "Research memo, code package, results, and locked configuration",
  },
  {
    phase: "Unseen Forward Window",
    timing: "Mon, Nov 30, 2026, 6:30 AM PT – Fri, Mar 19, 2027, 1:00 PM PT",
    output: "Official simulated execution through the period before spring break",
  },
  {
    phase: "Verification & Finals",
    timing: "Late March – early spring quarter 2027",
    output: "Reproduction checks; the Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams present; awards",
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
  {
    title: "Best Sharpe",
    body: "Highest forward-window Sharpe ratio among eligible strategies.",
    tag: "Cash prize",
  },
  {
    title: "Best Calmar",
    body: "Highest forward-window return per unit of max drawdown (drawdown floored at 2%) among eligible strategies.",
    tag: "Cash prize",
  },
  {
    title: "Best Rigor",
    body: "Judged by the panel on the full rubric. The top 5 teams present, and the winner is decided after the presentations.",
    tag: "Cash prize",
  },
];

const faq = [
  {
    id: "a-1",
    q: "Who can enter?",
    a: "Any undergraduate student from any school. You can enter solo or as a team of up to 3.",
  },
  {
    id: "a-2",
    q: "How do I register, and when does registration close?",
    a: "Register on this page by Sun, Nov 22, 2026, 11:59 PM PT. Detailed instructions are emailed after you register, so registering early gives you more time to prepare.",
  },
  {
    id: "a-3",
    q: "When is the submission deadline?",
    a: "Also Sun, Nov 22, 2026, 11:59 PM PT. Registration and submission close at the same time.",
  },
  {
    id: "a-4",
    q: "What do I submit?",
    a: "One package with five parts: a research memo; runnable strategy code with a pinned environment, a configuration file, and a clear entry point; a backtest report; a data dictionary and provenance record; and reproduction instructions with a signed confirmation that nothing changes after the freeze.",
  },
  {
    id: "a-5",
    q: "Which markets can I trade?",
    a: "A frozen S&P 500 constituent universe and up to 1,000 Binance spot instruments. Long and short positions are allowed within the risk limits.",
  },
  {
    id: "a-6",
    q: "Is real money involved?",
    a: "No. Every team starts with $100,000 of simulated capital.",
  },
  {
    id: "a-7",
    q: "What are the risk limits?",
    a: "At most 20% of the portfolio in any single position, at most 150% gross exposure, net exposure between −100% and +100%, and a maximum drawdown of 35% in the forward window.",
  },
  {
    id: "a-8",
    q: "Can I use my own data?",
    a: "Yes, for research. Obtain it lawfully and disclose every source. The official evaluation uses BFB's market data and published conventions.",
  },
  {
    id: "a-9",
    q: "Can I change my strategy after the deadline?",
    a: "No. Your package is timestamped and hashed at the deadline, and only the frozen package runs. Emergency fixes need organizer approval and are disclosed to everyone.",
  },
  {
    id: "a-10",
    q: "When does the forward window run, and do I need to do anything?",
    a: "From Mon, Nov 30, 2026, 6:30 AM PT to Fri, Mar 19, 2027, 1:00 PM PT. BFB runs your frozen strategy, so you don't need to do anything during the window.",
  },
  {
    id: "a-11",
    q: "How are the awards decided?",
    a: "Best Sharpe and Best Calmar go to the eligible strategies with the highest forward-window Sharpe and Calmar ratios. Best Rigor is judged on the rubric: thesis and implementation 30%, backtest rigor and robustness 35%, forward-window performance 20%, and risk controls and reproducibility 15%.",
  },
  {
    id: "a-12",
    q: "What makes a strategy eligible for Best Sharpe or Best Calmar?",
    a: "At least 30 independent completed trades (at least 10 in the forward window), average gross exposure of at least 25% across the window, a forward drawdown within 35%, and no rule breach, prohibited data use, material post-freeze change, or failed reproduction. Calmar floors max drawdown at 2%.",
  },
  {
    id: "a-13",
    q: "My strategy trades rarely or uses a single asset. Can I still compete?",
    a: "Yes. Best Rigor has no minimum trade count. Single-asset, infrequent-event, long-holding, or unique-data strategies can request a Specialized Research Designation before the freeze.",
  },
  {
    id: "a-14",
    q: "Can one team win more than one award?",
    a: "Yes.",
  },
  {
    id: "a-15",
    q: "What happens at the finals?",
    a: "In spring quarter, the Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams each present for 3 minutes, plus 3 minutes of Q&A. The Best Rigor winner is decided after the presentations.",
  },
  {
    id: "a-16",
    q: "Do the presentations change Best Sharpe or Best Calmar?",
    a: "No. Those two awards are decided by the forward-window metrics once BFB has verified the results. Only Best Rigor is decided after the presentations.",
  },
  {
    id: "a-17",
    q: "Who owns my strategy?",
    a: "You keep ownership of your original research and code. Source code and non-public research are shared only with your consent.",
  },
  {
    id: "a-18",
    q: "Who do I contact with questions?",
    a: "Email bfbatucla@gmail.com",
  },
];

function WorkflowStep({ item }: { item: (typeof workflow)[number] }) {
  return (
    <div className="snap-start shrink-0 w-72 self-stretch text-left p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm flex flex-col justify-start">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-9 h-9 rounded-full border-2 border-bfb-blue flex items-center justify-center text-bfb-blue font-bold text-[11px] tabular-nums">
          {item.step}
        </span>
      </div>

      <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-silver leading-tight text-pretty mb-3">
        {item.title}
      </h3>

      <p className="text-slate-500 dark:text-silver/60 leading-relaxed text-sm text-pretty">
        {item.desc}
      </p>
    </div>
  );
}

export default function AlphaResearchCompetitionPage() {
  const reduceMotion = useReducedMotion() ?? false;

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
                href="/competition/alpha-research/register"
                className="inline-flex items-center justify-center min-h-[52px] gap-2 px-8 py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2 cursor-pointer shadow-lg shadow-bfb-blue/20"
              >
                Register Team <UserPlus size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/competition/alpha-research/submit"
                className="inline-flex items-center justify-center min-h-[52px] gap-2 px-8 py-4 border border-bfb-blue text-bfb-blue dark:text-accent font-bold rounded-sm hover:bg-bfb-blue/10 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2 cursor-pointer"
              >
                Submit Strategy <UploadCloud size={18} aria-hidden="true" />
              </Link>
              <a
                href="#timeline"
                className="inline-flex items-center justify-center min-h-[52px] gap-2 px-6 py-4 border border-slate-300 dark:border-white/15 text-slate-600 dark:text-silver/70 font-medium rounded-sm hover:border-slate-400 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-silver transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2"
              >
                See Timeline
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

            <div className="grid grid-cols-2 lap:grid-cols-3 desktop:grid-cols-5 gap-6">
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
              Seven stages, from an idea you can defend to a result you have to explain.
            </p>
          </motion.div>

          <div className="-mx-gutter px-gutter overflow-x-auto pb-4 snap-x snap-mandatory">
            <div className="flex items-stretch gap-4 min-w-max">
              {workflow.map((item) => (
                <WorkflowStep key={item.step} item={item} />
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
              Research through fall, register and submit by Sun, Nov 22, then a forward window from Nov 30 to Mar 19 that ends before spring break.
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
              Five pieces, due Sun, Nov 22, 2026, 11:59 PM PT. Every submission receives a timestamped archive and a cryptographic hash.
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
              How Awards Are Decided
            </h2>
            <p className="text-slate-500 dark:text-silver/60 text-body max-w-xl text-pretty">
              Best Sharpe and Best Calmar are computed from the forward window for eligible strategies. Best Rigor is judged against the written rubric below: judges score independently before panel discussion, and 65% of the weight sits on research and testing quality.
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
              Three awards, each with a cash prize. One team can win more than one. Best Rigor has no minimum trade count, so low-frequency strategies stay eligible.
            </p>
          </motion.div>

          <div className="grid lap:grid-cols-3 gap-6">
            {awards.map((award, i) => (
              <motion.div
                key={award.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="inline-flex p-3 bg-bfb-blue/10 text-bfb-blue dark:text-accent rounded-full">
                      <Trophy size={20} aria-hidden="true" />
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-bfb-blue dark:text-accent bg-bfb-blue/10 dark:bg-accent/10 rounded-full">
                      {award.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-silver mb-2 leading-tight text-pretty">
                    {award.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-silver/60 leading-relaxed text-pretty">
                    {award.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-sm text-slate-500 dark:text-silver/60 leading-relaxed text-pretty">
            Finals (spring quarter): the Best Sharpe and Best Calmar teams and the top 5 Best Rigor teams each present for 3 minutes, plus 3 minutes of Q&amp;A. The Best Rigor winner is decided after the presentations.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01] scroll-mt-nav">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue dark:text-accent">
              FAQ
            </span>
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-4 mb-3 text-balance">
              Common Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faq.map((item) => (
              <details
                key={item.id}
                className="group rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-slate-900 dark:text-silver text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2 rounded-sm">
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-slate-400 dark:text-silver/40 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-sm text-slate-500 dark:text-silver/60 leading-relaxed text-pretty">
                  {item.id === "a-18" ? (
                    <p>
                      Email{" "}
                      <a
                        href="mailto:bfbatucla@gmail.com"
                        className="text-bfb-blue dark:text-accent font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue rounded-sm"
                      >
                        bfbatucla@gmail.com
                      </a>
                    </p>
                  ) : (
                    <p>{item.a}</p>
                  )}
                </div>
              </details>
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
            Open to undergraduates from any school, solo or in teams of up to 3. Register by Sun, Nov 22, 2026, 11:59 PM PT. Detailed instructions are emailed after you register.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/competition/alpha-research/register"
              className="inline-flex items-center justify-center min-h-[52px] gap-2 px-8 py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2 cursor-pointer shadow-lg shadow-bfb-blue/20"
            >
              Register Team / Sign In <ChevronRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/competition/alpha-research/submit"
              className="inline-flex items-center justify-center min-h-[52px] gap-2 px-8 py-4 border border-slate-300 dark:border-white/15 text-slate-700 dark:text-silver font-semibold rounded-sm hover:border-slate-400 dark:hover:border-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue focus-visible:ring-offset-2 cursor-pointer"
            >
              Submit Deliverables <UploadCloud size={18} aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-silver/60">
            Questions? Email{" "}
            <a
              href="mailto:bfbatucla@gmail.com"
              className="text-bfb-blue dark:text-accent font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue rounded-sm"
            >
              bfbatucla@gmail.com
            </a>
          </p>

          <p className="mt-10 text-xs text-slate-400 dark:text-silver/40 leading-relaxed">
            Full rules and data conventions are emailed to registered participants. BFB publishes the tie-break procedure before the strategy freeze.
          </p>
        </div>
      </section>
    </div>
  );
}
