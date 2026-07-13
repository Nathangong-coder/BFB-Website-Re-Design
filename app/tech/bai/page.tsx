"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  GitBranch, 
  Activity, 
  Terminal, 
  Clock, 
  Database, 
  ShieldAlert, 
  TrendingUp,
  Users,
  ChevronRight,
  Code
} from "lucide-react";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

export default function BAIPage() {
  const lifecyclePhases = [
    {
      phase: "Phase 1",
      title: "The Pitch",
      timeline: "Weeks 1–2",
      description: "Analysts present a formal abstract outlining a market anomaly, proposed dataset (traditional or alternative), and the underlying Bayesian priors and hypotheses.",
      icon: Brain,
    },
    {
      phase: "Phase 2",
      title: "Data & Infrastructure",
      timeline: "Weeks 3–4",
      description: "Collaborative sourcing, ingestion, data cleaning, and mapping features to minimize common lookahead and data-snooping biases.",
      icon: Database,
    },
    {
      phase: "Phase 3",
      title: "Modeling & Backtesting",
      timeline: "Weeks 5–8",
      description: "Core development. Iterative parameter optimization, resolving computational bottlenecks (such as MCMC convergence), and tracking predictive density.",
      icon: Terminal,
    },
    {
      phase: "Phase 4",
      title: "Peer Review & Defense",
      timeline: "Weeks 9–10",
      description: "A collaborative paper defense evaluating out-of-sample performance, risk-management constraints, and robustness against backtest overfitting.",
      icon: ShieldAlert,
    },
  ];

  const labSchedule = [
    {
      title: "The Quantitative Standup",
      duration: "First 20 Minutes",
      description: "Agile-style, rapid updates from each analyst or project team. Focus is strictly restricted to progress made, mathematical or coding bottlenecks, and next actionable steps to accelerate cross-team debugging.",
      icon: Clock,
      theme: "border-bfb-blue/10 dark:border-bfb-blue/20 bg-slate-50/50 dark:bg-bfb-blue/[0.01]"
    },
    {
      title: "The Working Lab",
      duration: "Remaining Time",
      description: "An unscripted, high-energy whiteboard and co-working session. Analysts collaborate on mathematical formulations, peer-review code repositories, and troubleshoot statistical models in real-time.",
      icon: Users,
      theme: "border-accent/10 dark:border-accent/20 bg-slate-50/50 dark:bg-accent/[0.01]"
    }
  ];

  const infrastructureTools = [
    {
      title: "Data Pipelines",
      description: "Boilerplate code for standardized data fetching, cleaning, and formatting to minimize time spent on data engineering.",
      icon: Database
    },
    {
      title: "Bayesian Baseline Models",
      description: "Starter scripts for Bayesian regressions, regime-switching architectures, or Black-Litterman allocation using PyMC or Stan.",
      icon: Brain
    },
    {
      title: "Evaluation Harnesses",
      description: "Standardized evaluation scripts to compute risk-adjusted metrics, including Sharpe ratios, Sortino ratios, and maximum drawdown.",
      icon: Activity
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-midnight pt-nav text-slate-900 dark:text-silver relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-bfb-blue/[0.03] dark:bg-bfb-blue/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[-10%] w-[500px] h-[500px] bg-accent/[0.03] dark:bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Hero / About Section */}
      <section className="relative py-section px-gutter max-w-5xl mx-auto text-center z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <motion.span
            variants={fadeInUp}
            className="block text-eyebrow font-bold tracking-[0.3em] uppercase text-bfb-blue dark:text-accent mb-4"
          >
            Bruins in Finance and Banking
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="text-hero font-serif text-slate-900 dark:text-silver mb-6 leading-tight max-w-3xl"
          >
            Bruin Algorithmic Insights (BAI)
          </motion.h1>
          <motion.div
            variants={fadeInUp}
            className="h-0.5 w-12 bg-gradient-to-r from-transparent via-bfb-blue to-transparent mb-8"
          />
          <motion.p
            variants={fadeInUp}
            className="text-slate-500 dark:text-silver/60 text-body-lg font-light leading-relaxed max-w-3xl mb-12"
          >
            BAI is UCLA's premier quantitative research incubator. Moving away from passive, lecture-heavy structures, the program operates as a collaborative, research-lab style forum where undergraduate analysts develop and peer-review custom quantitative trading models. Our focus centers on Bayesian methods, probability forecasting, and uncertainty quantification in complex financial markets.
          </motion.p>
        </motion.div>
      </section>

      {/* Timeline Section: The Idea-to-Alpha Project Lifecycle */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-eyebrow font-bold tracking-[0.2em] uppercase text-bfb-blue/70 dark:text-accent/70">
              Operational Roadmap
            </span>
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-2 mb-4">
              The Idea-to-Alpha Project Lifecycle
            </h2>
            <p className="text-slate-500 dark:text-silver/55 text-body max-w-xl mx-auto font-light">
              All research projects progress through a structured, four-phase lifecycle designed to maintain rigorous standards and full team accountability.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {lifecyclePhases.map((phase, idx) => {
              const Icon = phase.icon;
              return (
                <motion.div
                  key={phase.phase}
                  variants={fadeInUp}
                  className="relative group flex flex-col p-card bg-white dark:bg-midnight/40 border border-slate-100 dark:border-white/5 rounded-xl transition-all duration-300 hover:border-bfb-blue/30 dark:hover:border-accent/30 hover:shadow-lg dark:hover:shadow-none"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-wider text-bfb-blue/50 dark:text-accent/50 uppercase">
                      {phase.phase}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 dark:text-silver/40">
                      {phase.timeline}
                    </span>
                  </div>
                  <div className="mb-4 p-2.5 w-fit rounded-lg bg-slate-50 dark:bg-white/[0.03] text-bfb-blue dark:text-accent group-hover:bg-bfb-blue/5 dark:group-hover:bg-accent/5 transition-colors duration-300">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-h3 font-serif text-slate-900 dark:text-silver mb-2 leading-tight">
                    {phase.title}
                  </h3>
                  <p className="text-slate-500 dark:text-silver/55 text-body font-light leading-relaxed mt-auto">
                    {phase.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Meeting Format Section: A Week in the Lab */}
      <section className="py-section px-gutter max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-eyebrow font-bold tracking-[0.2em] uppercase text-bfb-blue/70 dark:text-accent/70">
            Collaborative Structure
          </span>
          <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-2 mb-4">
            A Week in the Lab
          </h2>
          <p className="text-slate-500 dark:text-silver/55 text-body max-w-xl mx-auto font-light">
            Weekly forum sessions operate as a dynamic laboratory rather than traditional classrooms, optimizing for interactive troubleshooting and real-time collaboration.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {labSchedule.map((segment) => {
            const Icon = segment.icon;
            return (
              <motion.div
                key={segment.title}
                variants={fadeInUp}
                className={`p-card border rounded-xl flex flex-col justify-between transition-all duration-300 hover:shadow-md dark:hover:shadow-none ${segment.theme}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 text-bfb-blue dark:text-accent">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-h3 font-serif text-slate-900 dark:text-silver leading-tight">
                        {segment.title}
                      </h3>
                      <span className="text-xs font-semibold text-bfb-blue/70 dark:text-accent/70 uppercase tracking-wider block mt-0.5">
                        {segment.duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-silver/55 text-body font-light leading-relaxed">
                    {segment.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Shared Core Quantitative Infrastructure & Regime Shifts */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Infrastructure Text */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-eyebrow font-bold tracking-[0.2em] uppercase text-bfb-blue/70 dark:text-accent/70">
                Shared Developer Ecosystem
              </span>
              <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-2 mb-6">
                Centralized Infrastructure
              </h2>
              <p className="text-slate-500 dark:text-silver/55 text-body font-light leading-relaxed mb-8">
                To maximize time spent on actual alpha generation rather than repetitive data engineering, BAI provides members with access to a centralized, internal repository featuring essential boilerplates, standard setups, and utilities.
              </p>
              
              <div className="space-y-4">
                {infrastructureTools.map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <div key={tool.title} className="flex gap-4 items-start">
                      <div className="mt-1 p-2 rounded-lg bg-white dark:bg-midnight border border-slate-100 dark:border-white/5 text-bfb-blue dark:text-accent flex-shrink-0">
                        <ToolIcon size={16} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-body font-semibold text-slate-900 dark:text-silver">
                          {tool.title}
                        </h4>
                        <p className="text-slate-500 dark:text-silver/55 text-xs font-light mt-0.5 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regime shifts showcase card */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 p-card bg-white dark:bg-midnight/40 border border-slate-100 dark:border-white/5 rounded-2xl relative shadow-xl dark:shadow-none overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/[0.05] rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ShieldAlert size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-h3 font-serif text-slate-900 dark:text-silver leading-tight">
                    Regime Shift Stress Testing
                  </h3>
                  <span className="text-[10px] font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                    Core Validation Protocol
                  </span>
                </div>
              </div>

              <p className="text-slate-500 dark:text-silver/55 text-body font-light leading-relaxed mb-6">
                Models cannot rely solely on historical in-sample performance or stable environments. Before any strategy completes its lifecycle, analysts must subject their models to a rigorous <strong>Regime Shift Stress Test</strong>.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-silver/80 uppercase tracking-wider">
                  Test Scenarios & Parameter Stability
                </h4>
                <ul className="space-y-2 text-slate-500 dark:text-silver/50 text-xs font-light leading-relaxed">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span><strong>High Volatility Windows:</strong> Running predictive models against historic liquidity shocks (e.g., 2020).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span><strong>Structural Breaks:</strong> Evaluating parameter drift during abrupt market pivots (e.g., 2022 rate pivots).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span><strong>Tail-Risk Quantification:</strong> Verifying how effectively the model calculates probability distributions under high uncertainty.</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer link/CTA to other areas */}
      <section className="py-section px-gutter text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-h3 font-serif text-slate-900 dark:text-silver mb-4">
            Curious about other initiatives?
          </h3>
          <p className="text-slate-500 dark:text-silver/60 text-body font-light mb-8 max-w-md mx-auto">
            Discover the other quantitative projects and accelerator cohorts driving innovation within Bruins in Finance and Banking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="/tech/quant"
              className="inline-flex items-center gap-2 text-body font-semibold text-bfb-blue dark:text-accent hover:opacity-85 transition-opacity"
            >
              Quant Accelerator <ChevronRight size={16} />
            </a>
            <span className="hidden sm:inline text-slate-300 dark:text-silver/20">|</span>
            <a
              href="/tech/smartcomps"
              className="inline-flex items-center gap-2 text-body font-semibold text-bfb-blue dark:text-accent hover:opacity-85 transition-opacity"
            >
              smartComps <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
