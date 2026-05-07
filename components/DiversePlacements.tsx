"use client";

import React from "react";
import { motion } from "framer-motion";

const tracks = [
  { name: "Investment Banking", firms: "Morgan Stanley · JPMorgan · Barclays · Citi" },
  { name: "Asset Management", firms: "GIC · TCW · TPG · Almitas Capital" },
  { name: "Sales & Trading", firms: "UBS · Scotiabank · KeyBanc · Mizuho" },
  { name: "Consulting & Advisory", firms: "Deloitte · Altman Solon · Accenture · PwC" },
  { name: "Public Finance", firms: "Federal Reserve" },
  { name: "Private Equity", firms: "TPG · Ducera Partners" },
];

export default function DiversePlacements() {
  return (
    <section className="bg-slate-50 dark:bg-[#080C18] border-t border-slate-100 dark:border-white/8">
      <div className="max-w-[1300px] mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-midnight">
          <div className="flex flex-col md:flex-row">
            {/* Image half */}
            <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-[460px] overflow-hidden flex-shrink-0">
              <img
                src="/group-photo/bfb-group-photo-professional.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-75"
              />
            </div>

            {/* Text half */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 px-8 md:px-14 py-12 md:py-16 flex flex-col justify-center gap-5 bg-white dark:bg-midnight"
            >
              <div className="max-w-md mx-auto md:mx-0">
                <h2
                  className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-silver leading-tight"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  Diverse Placements
                </h2>
              </div>
              <p className="text-slate-500 dark:text-silver/50 text-sm font-light leading-relaxed max-w-sm">
                BFB alumni go on to some of the most competitive roles in the industry — across banking, markets, investments, and beyond.
              </p>
              <ul className="flex flex-col gap-3 mt-1">
                {tracks.map((track) => (
                  <li key={track.name} className="flex items-start gap-3">
                    <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-[var(--accent)] flex-shrink-0" />
                    <span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-silver">
                        {track.name}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-silver/40">
                        {" "}{track.firms}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
