"use client";

import React from "react";
import { motion } from "framer-motion";

  const logoMap: Record<string, string> = {
    "Morgan Stanley": "/companies/morgan stanley.jpg",
    "Citi": "/companies/citi.jpg",
    "Barclays": "/companies/barclays.jpg",
    "UBS": "/companies/ubs.jpg",
    "Ducera Partners": "/companies/ducera.jpg",
    "Federal Reserve": "/companies/fed reserve.jpg",
    "Mizuho Financial Group": "/companies/mizuho.jpg",
    "Altman Solon": "/companies/altman solon.jpg",
    "Waymo": "/companies/waymo.jpg",
    "Siemens Healthineers": "/companies/siemens healthineers.jpg",
    "JPMorgan": "/companies/jpmc.jpg",
    "Scotiabank": "/companies/scotiabank.jpg",
    "KeyBanc Capital Markets": "/companies/keybanc capital markets.jpg",
    "GIC": "/companies/gic.jpg",
    "TPG": "/companies/tpg.jpg",
    "Almitas Capital": "/companies/almitas capital.jpg",
    "TCW": "/companies/tcw.jpg",
    "Deloitte": "/companies/deloitte.jpg",
    "Lazard": "/companies/lazard.jpg",
    "BMO": "/companies/bmo.jpg",
    "Stifel": "/companies/stifel.jpg",
    "Accenture": "/companies/accenture.jpg",
    "KPMG": "/companies/kpmg.jpg",
    "PwC": "/companies/pwc.jpg",
    "Adobe": "/companies/adobe.jpg",
    "HP": "/companies/hp.jpg",
    "Lockton": "/companies/lockton.jpg",
  };

  const firms = Object.keys(logoMap);
  const doubled = [...firms, ...firms];

export default function PlacementsTicker() {
  return (
    <section className="py-16 border-t border-slate-100 dark:border-white/8 bg-white dark:bg-midnight overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-silver"
        >
          Our Placements
        </motion.h2>
        <p className="text-slate-500 dark:text-silver/50 text-sm mt-2 font-light">
          PLACEHOLDER TEXT
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
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-midnight to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-midnight to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 w-max animate-ticker hover:[animation-play-state:paused] px-3 items-center">
          {doubled.map((firm, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-32 h-16 bg-white dark:bg-glass border border-slate-200 dark:border-white/8 rounded-sm overflow-hidden p-2 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={logoMap[firm]}
                alt={firm}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
