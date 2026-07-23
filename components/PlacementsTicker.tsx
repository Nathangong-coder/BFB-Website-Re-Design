"use client";

import React from "react";
import { motion } from "framer-motion";

  const logoMap: Record<string, string> = {
    "Goldman Sachs": "/companies/goldman-sachs.webp",
    "Guggenheim": "/companies/guggenheim.webp",
    "Perella-Weinberg": "/companies/perella-weinberg.avif",
    "Rothschild": "/companies/rothschild.jpg",
    "Wells Fargo": "/companies/wells-fargo.webp",
    "Pimco": "/companies/pimco.png",
    "Mizuho": "/companies/mizuho.jpg",
    "Morgan Stanley": "/companies/morgan stanley.jpg",
    "JP Morgan": "/companies/jp morgan.jpg",
    "Charles Schwab": "/companies/charles-schwab.webp",
    "HP": "/companies/hp.jpg",
    "PwC": "/companies/pwc.jpg",
    "Piper Sandler": "/companies/piper-sandler.jpg",
    "Barclays": "/companies/barclays.jpg",
    "Amazon": "/companies/Amazon.png",
    "Google": "/companies/google.webp",
    "UBS": "/companies/ubs.jpg",
  };

  const firms = Object.keys(logoMap);
  const doubled = [...firms, ...firms];

export default function PlacementsTicker() {
  return (
    <section className="py-section border-t border-slate-100 dark:border-white/8 bg-white dark:bg-midnight overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-h2 font-serif text-slate-900 dark:text-silver"
        >
          Our Placements
        </motion.h2>
        <p className="text-slate-500 dark:text-silver/50 text-body mt-2 font-light max-w-2xl mx-auto">
          By actively fostering a deep-rooted culture of mentorship and learning, BFB members continuously attain outstanding careers across all major fields of finance.   
        </p>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="h-0.5 w-10 bg-[var(--bfb-blue)] mx-auto mt-5"
        />
      </div>

      {/* Marquee */}
      <div className="max-w-[1400px] mx-auto px-gutter overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-midnight to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-midnight to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 w-max animate-ticker hover:[animation-play-state:paused] px-3 items-center">
          {doubled.map((firm, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-[clamp(6rem,12vw,10rem)] h-[clamp(6rem,12vw,10rem)] bg-white border border-slate-200 dark:border-white/15 shadow-sm dark:shadow-lg dark:shadow-black/20 rounded-sm overflow-hidden p-[clamp(0.75rem,2vw,1.5rem)] transition-transform duration-300 hover:scale-105"
            >
              <img
                src={logoMap[firm]}
                alt={firm}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
