"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Year assignments based on bfbatucla.com groupings (2026: 10, 2025: 12, 2024: 6).
// Verify and reorder within each year array as needed.
const placementsByYear: Record<number, { name: string; filename: string }[]> = {
  2026: [
    { name: "Morgan Stanley", filename: "morgan stanley.jpg" },
    { name: "Citi", filename: "citi.jpg" },
    { name: "Barclays", filename: "barclays.jpg" },
    {name: "UBS", filename: "ubs.jpg"},
    { name: "Ducera Partners", filename: "ducera.jpg" },
    { name: "Federal Reserve", filename: "fed reserve.jpg" },
    { name: "Mizuhoki Financial Group", filename: "mizuho.jpg" },
    { name: "Altman Solon", filename: "altman solon.jpg" },
    { name: "Waymo", filename: "waymo.jpg" },
    { name: "Siemens Healthineers", filename: "siemens healthineers.jpg" },
  ],
  2025: [
    { name: "Morgan Stanley", filename: "morgan stanley.jpg" },
    { name: "Citi", filename: "citi.jpg" },
    { name: "JPMorgan", filename: "jpmorgan.jpg" },
    { name: "Scotiabank", filename: "scotiabank.jpg" },
    { name: "Barclays", filename: "barclays.jpg" },
    { name: "KeyBanc Capital Markets", filename: "keybanc capital markets.jpg" },
    { name: "GIC", filename: "gic.jpg" },
    { name: "TPG", filename: "tpg.jpg" },
    { name: "Almitas Capital", filename: "almitas capital.jpg" },
    { name: "TCW", filename: "tcw.jpg" },
    { name: "Federal Reserve", filename: "fed reserve.jpg" },
    { name: "Deloitte", filename: "deloitte.jpg" },
  ],
  2024: [
    { name: "morgan stanley", filename: "morgan stanley.jpg" },
    { name: "jpmc", filename: "jpmc.jpg" },
    { name: "lazard", filename: "lazard.jpg" },
    { name: "bmo", filename: "bmo.jpg" },
    { name: "deloitte", filename: "deloitte.jpg" },
    { name: "stifel", filename: "stifel.jpg" },
    { name: "accenture", filename: "accenture.jpg" },
    { name: "kpmg", filename: "kpmg.jpg" },
    { name: "pwc", filename: "pwc.jpg" },
    { name: "adobe", filename: "adobe.jpg" },
    { name: "hp", filename: "hp.jpg" },
    { name: "lockton", filename: "lockton.jpg" },
  ],
};

const years = [2026, 2025, 2024];

export default function Placements() {
  const [activeYear, setActiveYear] = useState<number | "all">("all");

  const displayYears = activeYear === "all" ? years : [activeYear as number];

  return (
    <section id="placements" className="relative">
      {/* Photo header block */}
      <div className="relative h-[55vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
        <img
          src="/capstone/bfb-capstone.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-midnight/78" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white dark:from-midnight to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white dark:from-midnight to-transparent" />

        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-bfb-blue/70 mb-5"
          >
            Career Outcomes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif text-silver mb-6"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Our Placements
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-px w-20 bg-gradient-to-r from-transparent via-bfb-blue/40 to-transparent mx-auto"
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-midnight pt-16 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Year filter tabs */}
          <div className="flex justify-center gap-2 mb-16">
            <button
              onClick={() => setActiveYear("all")}
              className={`px-5 py-2 rounded-sm text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 border ${
                activeYear === "all"
                  ? "bg-bfb-blue text-white border-bfb-blue"
                  : "bg-transparent text-slate-500 dark:text-silver/50 border-slate-200 dark:border-white/15 hover:border-bfb-blue/40 hover:text-bfb-blue"
              }`}
            >
              All Years
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-5 py-2 rounded-sm text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 border ${
                  activeYear === year
                    ? "bg-bfb-blue text-white border-bfb-blue"
                    : "bg-transparent text-slate-500 dark:text-silver/50 border-slate-200 dark:border-white/15 hover:border-bfb-blue/40 hover:text-bfb-blue"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Year sections */}
          <div className="space-y-16">
            {displayYears.map((year) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 dark:text-silver/40">
                    {year} Internships
                  </h3>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-white/8" />
                  <span className="text-[10px] text-slate-300 dark:text-silver/25 tracking-wider">
                    {placementsByYear[year].length} placements
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {placementsByYear[year].map((firm, index) => (
                    <motion.div
                      key={firm.name}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04, duration: 0.4 }}
                      className="group bg-white dark:bg-[#0D1323] border border-slate-100 dark:border-white/8 rounded-sm p-6 flex items-center justify-center hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-none hover:border-slate-200 dark:hover:border-white/15 transition-all duration-200"
                    >
                      <img
                        src={`/companies/${encodeURIComponent(firm.filename)}`}
                        alt={firm.name}
                        className="max-h-14 max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = document.createElement("span");
                          fallback.className = "text-sm font-serif font-bold text-slate-400 dark:text-silver/50 text-center";
                          fallback.textContent = firm.name;
                          e.currentTarget.parentElement?.appendChild(fallback);
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
