"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Terminal, 
  BookOpen, 
  Brain, 
  Cpu, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  Layers, 
  Code, 
  Users,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

export default function QuantPage() {
  const personas = [
    {
      title: "Quant Developer",
      role: "Build & Optimize",
      description: "Focuses on software engineering, computational efficiency, and pipeline architecture. Devs build the framework that strategies run on, managing data pipelines and system latency.",
      icon: Terminal,
      skills: ["Vectorized NumPy/Pandas", "Time Complexity (Big-O)", "Scaffolding Pipelines"],
      color: "text-blue-500 dark:text-blue-400 bg-blue-500/5"
    },
    {
      title: "Quant Trader",
      role: "Deploy & Monitor",
      description: "Focuses on execution mechanics, limit order books, and real-time risk controls. Traders oversee active portfolios, manage position sizing, and evaluate live market spreads.",
      icon: TrendingUp,
      skills: ["Limit Order Books", "Value at Risk (VaR)", "Execution Cost Analysis"],
      color: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/5"
    },
    {
      title: "Quant Researcher",
      role: "Model & Forecast",
      description: "Focuses on applied probability, statistical models, and pricing anomalies. Researchers formulate mathematical hypotheses and build models to extract alpha signals.",
      icon: Brain,
      skills: ["Bayes' Theorem", "OLS Cointegration", "Fat-Tailed Distributions"],
      color: "text-purple-500 dark:text-purple-400 bg-purple-500/5"
    }
  ];

  const syllabusBlocks = [
    {
      block: "Block 1",
      title: "Foundations & Implementation",
      weeks: "Weeks 1–3",
      description: "Establish baseline programming skills and adopt structured software development cycles in an introductory environment.",
      topics: [
        { week: "Week 1", title: "Python for Data Vectors", detail: "Introduction to basic control structures, numpy arrays, and calculating simple returns." },
        { week: "Week 2", title: "Scaffolding & Verification", detail: "Building baseline execution templates and running simple test assertions." },
        { week: "Week 3", title: "Algorithms & Efficiency", detail: "Introduction to basic algorithmic logic, Big-O notation, and code cleanliness." }
      ],
      theme: "border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]"
    },
    {
      block: "Block 2",
      title: "Statistics & Market Mechanics",
      weeks: "Weeks 4–6",
      description: "Approach probability, linear models, and order books through intuitive, introductory visual concepts.",
      topics: [
        { week: "Week 4", title: "Applied Probability Basics", detail: "Understanding basic probability, normal distributions, and conditional outcomes." },
        { week: "Week 5", title: "Linear Models & Regressions", detail: "Basics of Ordinary Least Squares (OLS) and hypothesis testing using simple pair-trading examples." },
        { week: "Week 6", title: "Market Mechanics & Roles", detail: "Visualizing limit order books, spreads, liquidity, and explaining the quant landscape." }
      ],
      theme: "border-bfb-blue/10 dark:border-bfb-blue/20 bg-slate-50/30 dark:bg-bfb-blue/[0.01]"
    },
    {
      block: "Block 3",
      title: "Backtesting & Capstone",
      weeks: "Weeks 7–10",
      description: "Run backtests on pre-built templates and collaborate on an approachable final project.",
      topics: [
        { week: "Week 7", title: "Backtesting Frameworks", detail: "Testing a strategy on past data using pre-built templates and avoiding basic pitfalls." },
        { week: "Week 8", title: "Performance Evaluation", detail: "Calculating simple, key metrics like Sharpe ratio and maximum drawdown." },
        { week: "Weeks 9-10", title: "Capstone Project & Defense", detail: "Putting together a basic backtest in teams, reviewed in a friendly, constructive feedback session." }
      ],
      theme: "border-accent/10 dark:border-accent/20 bg-slate-50/30 dark:bg-accent/[0.01]"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-midnight pt-nav text-slate-900 dark:text-silver relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-bfb-blue/[0.03] dark:bg-bfb-blue/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[30%] left-[-10%] w-[500px] h-[500px] bg-accent/[0.03] dark:bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Hero / Overview Section */}
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
            Quant Accelerator Program
          </motion.h1>
          <motion.div
            variants={fadeInUp}
            className="h-0.5 w-12 bg-gradient-to-r from-transparent via-bfb-blue to-transparent mb-8"
          />
          <motion.p
            variants={fadeInUp}
            className="text-slate-500 dark:text-silver/60 text-body-lg font-light leading-relaxed max-w-3xl mb-12"
          >
            The Quant Accelerator is a 10-week, quarter-long introductory course designed as the foundational gateway for undergraduates looking to break into quantitative finance. Serving as the primary feeder system for BFB's senior Bayesian Analysis (BAI) program, the course provides an baseline in vector programming, structured software workflows, applied statistics, and market mechanics. Every topic is structured to be highly approachable and introductory, requiring no prior quantitative or programming experience.
          </motion.p>
        </motion.div>
      </section>

      {/* Career Persona Callout */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-eyebrow font-bold tracking-[0.2em] uppercase text-bfb-blue/70 dark:text-accent/70">
              Target Disciplines
            </span>
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-2 mb-4">
              Foundations for Core Roles
            </h2>
            <p className="text-slate-500 dark:text-silver/55 text-body max-w-xl mx-auto font-light">
              Our single, unified curriculum is designed to prepare students with the fundamental tools, concepts, and analytical framework required across all three primary quantitative domains.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {personas.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  variants={fadeInUp}
                  className="flex flex-col p-card bg-white dark:bg-midnight/40 border border-slate-100 dark:border-white/5 rounded-xl transition-all duration-300 hover:border-slate-200 dark:hover:border-white/10 hover:shadow-lg dark:hover:shadow-none"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-lg ${p.color}`}>
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-h3 font-serif text-slate-900 dark:text-silver leading-tight">
                        {p.title}
                      </h3>
                      <span className="text-xs font-semibold text-slate-400 dark:text-silver/40">
                        {p.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-silver/55 text-body font-light leading-relaxed mb-6">
                    {p.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-silver/40 uppercase">
                      Featured Training
                    </span>
                    <ul className="space-y-1">
                      {p.skills.map((skill) => (
                        <li key={skill} className="flex items-center gap-2 text-slate-500 dark:text-silver/65 text-xs font-light">
                          <span className="h-1 w-1 rounded-full bg-bfb-blue dark:bg-accent flex-shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* The 10-Week Syllabus Timeline */}
      <section className="py-section px-gutter max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-eyebrow font-bold tracking-[0.2em] uppercase text-bfb-blue/70 dark:text-accent/70">
            Program Curriculum
          </span>
          <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-2 mb-4">
            The 10-Week Roadmap
          </h2>
          <p className="text-slate-500 dark:text-silver/55 text-body max-w-xl mx-auto font-light">
            Our curriculum is divided into three distinct operational blocks, progressing from computational fundamentals to statistical theories and project defense.
          </p>
        </div>

        <div className="space-y-8">
          {syllabusBlocks.map((block, bIdx) => (
            <motion.div
              key={block.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className={`p-card border rounded-2xl ${block.theme}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-bfb-blue dark:text-accent uppercase">
                    {block.block} • {block.weeks}
                  </span>
                  <h3 className="text-h3 font-serif text-slate-900 dark:text-silver leading-tight mt-1">
                    {block.title}
                  </h3>
                </div>
                <p className="text-slate-500 dark:text-silver/50 text-xs font-light max-w-sm md:text-right leading-relaxed">
                  {block.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {block.topics.map((topic, tIdx) => (
                  <div 
                    key={topic.week} 
                    className="p-4 bg-white dark:bg-midnight/60 border border-slate-100 dark:border-white/5 rounded-xl hover:border-bfb-blue/10 dark:hover:border-accent/10 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-bfb-blue dark:text-accent">
                        {topic.week}
                      </span>
                    </div>
                    <h4 className="text-body font-semibold text-slate-900 dark:text-silver mb-1 leading-snug">
                      {topic.title}
                    </h4>
                    <p className="text-slate-500 dark:text-silver/55 text-xs font-light leading-relaxed">
                      {topic.detail}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Program Philosophy & Methodology Section */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Philosophy overview */}
            <div className="lg:col-span-6 flex flex-col">
              <span className="text-eyebrow font-bold tracking-[0.2em] uppercase text-bfb-blue/70 dark:text-accent/70">
                Program Philosophy
              </span>
              <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-2 mb-6">
                Structured Quantitative Training
              </h2>
              <p className="text-slate-500 dark:text-silver/55 text-body font-light leading-relaxed mb-8">
                The Quant Accelerator prioritizes foundational understanding and methodological rigor. Rather than just learning formulas, students are taught how to translate mathematical frameworks into clean, verified software architectures that form the backbone of modern systematic trading.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 rounded-lg bg-white dark:bg-midnight border border-slate-100 dark:border-white/5 text-bfb-blue dark:text-accent flex-shrink-0">
                    <Layers size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-body font-semibold text-slate-900 dark:text-silver">
                      Sandboxed Architectures
                    </h4>
                    <p className="text-slate-500 dark:text-silver/55 text-xs font-light mt-1 leading-relaxed">
                      We make use of pre-built backtesting and strategy templates. This design isolates alpha logic from complex, back-end execution wrappers, allowing students to focus purely on strategy performance.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 rounded-lg bg-white dark:bg-midnight border border-slate-100 dark:border-white/5 text-bfb-blue dark:text-accent flex-shrink-0">
                    <Code size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-body font-semibold text-slate-900 dark:text-silver">
                      Role Foundations
                    </h4>
                    <p className="text-slate-500 dark:text-silver/55 text-xs font-light mt-1 leading-relaxed">
                      Though the curriculum follows a single, unified pipeline, assignments focus on distinct skills—allowing students to build specialized capabilities in software optimization, statistics, or execution.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pseudocode rule card */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-6 p-card bg-white dark:bg-midnight/40 border border-slate-100 dark:border-white/5 rounded-2xl relative shadow-xl dark:shadow-none overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/[0.05] rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-bfb-blue/10 text-bfb-blue">
                  <ShieldAlert size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-h3 font-serif text-slate-900 dark:text-silver leading-tight">
                    "Pseudocode Before Prompting"
                  </h3>
                  <span className="text-[10px] font-bold tracking-wider text-bfb-blue dark:text-accent uppercase">
                    Core Operational Rule
                  </span>
                </div>
              </div>

              <p className="text-slate-500 dark:text-silver/55 text-body font-light leading-relaxed mb-6">
                To build true structural ownership and logical independence, students must adhere to the <strong>Pseudocode Before Prompting</strong> rule. Analysts must understand each step of what they are doing and why it is being done in a certain way, drafting the logical sequence before writing any code.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-2 text-xs">
                <h4 className="font-semibold text-slate-700 dark:text-silver/80 uppercase tracking-wider mb-2">
                  The Understanding Loop
                </h4>
                <div className="flex items-start gap-2.5 text-slate-500 dark:text-silver/50">
                  <span className="font-bold text-bfb-blue dark:text-accent mt-0.5">01</span>
                  <span><strong>Understand the Why:</strong> Define the exact objective and rationale behind the choice of statistical or mathematical methodology.</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-500 dark:text-silver/50">
                  <span className="font-bold text-bfb-blue dark:text-accent mt-0.5">02</span>
                  <span><strong>Map the Steps:</strong> Outline the step-by-step logic and strategy execution path in plain language first.</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-500 dark:text-silver/50">
                  <span className="font-bold text-bfb-blue dark:text-accent mt-0.5">03</span>
                  <span><strong>Implement & Verify:</strong> Convert the verified logical structure into code and run explicit tests to confirm expected behavior.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer link/CTA to other areas */}
      <section className="py-section px-gutter text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-h3 font-serif text-slate-900 dark:text-silver mb-4">
            Ready for advanced research?
          </h3>
          <p className="text-slate-500 dark:text-silver/60 text-body font-light mb-8 max-w-md mx-auto">
            Once you master the Accelerator, advance to our quantitative research lab to construct Bayesian trading architectures.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="/tech/bai"
              className="inline-flex items-center gap-2 text-body font-semibold text-bfb-blue dark:text-accent hover:opacity-85 transition-opacity"
            >
              Bruin Algorithmic Insights (BAI) <ChevronRight size={16} />
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
