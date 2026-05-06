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
