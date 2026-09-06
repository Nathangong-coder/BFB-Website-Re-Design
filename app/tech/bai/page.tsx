"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Clock, ChevronRight, Sparkles } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function BAIPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-midnight pt-nav text-slate-900 dark:text-silver relative overflow-hidden flex flex-col justify-between">
      {/* Background ambient glows */}
      <div className="absolute top-[25%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-bfb-blue/[0.04] dark:bg-bfb-blue/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-accent/[0.03] dark:bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Section */}
      <section className="relative py-24 px-gutter max-w-4xl mx-auto text-center z-10 my-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          {/* Coming Soon Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bfb-blue/5 dark:bg-accent/10 border border-bfb-blue/15 dark:border-accent/20 mb-8"
          >
            <Sparkles size={14} className="text-bfb-blue dark:text-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-bfb-blue dark:text-accent uppercase">
              Coming Soon
            </span>
          </motion.div>

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

          {/* Vague high-level summary */}
          <motion.p
            variants={fadeInUp}
            className="text-slate-600 dark:text-silver/70 text-body-lg font-light leading-relaxed max-w-2xl mb-10"
          >
            Bruin Algorithmic Insights is BFB's project-based quantitative research initiative dedicated to exploring algorithmic trading models, data analysis frameworks, and quantitative research strategies in financial markets.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="p-6 rounded-2xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 max-w-md w-full backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-3 text-slate-500 dark:text-silver/50 text-sm font-light">
              <Clock size={16} className="text-bfb-blue dark:text-accent" />
              <span>Full platform details and project developments coming soon.</span>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-col sm:flex-row items-center gap-4 text-sm font-medium text-slate-500 dark:text-silver/60"
          >
            <span>Explore other initiatives:</span>
            <div className="flex items-center gap-4">
              <a
                href="/tech/quant"
                className="inline-flex items-center gap-1 text-bfb-blue dark:text-accent hover:underline"
              >
                Quant Accelerator <ChevronRight size={14} />
              </a>
              <span className="text-slate-300 dark:text-silver/20">|</span>
              <a
                href="/tech/smartcomps"
                className="inline-flex items-center gap-1 text-bfb-blue dark:text-accent hover:underline"
              >
                smartComps <ChevronRight size={14} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
