"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

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
    <section className="bg-white dark:bg-midnight">
      <div className="max-w-[1300px] mx-auto w-full px-4">
        <div className="overflow-hidden">
          <div className="flex flex-col md:flex-row border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden">
            {/* Image half */}
            <div className="relative w-full md:w-[60%] min-h-[240px] md:min-h-[500px] overflow-hidden flex-shrink-0">
              <img
                src="/group-photo/bfb-group-photo-professional.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-75"
              />
              <div className="absolute inset-0 bg-midnight/40" />
              <span className="absolute bottom-4 left-4 text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 bg-black/40 px-2 py-1 rounded-sm">Our Network</span>
            </div>

            {/* Text half */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full md:w-[40%] px-8 md:px-14 py-12 md:py-16 flex flex-col justify-center gap-5 bg-white dark:bg-midnight"
            >
              <div className="max-w-md mx-auto md:mx-0">
                <h2
                  className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-silver leading-tight"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  Diverse Placements
                </h2>
              </div>
              <p className="text-slate-500 dark:text-silver/50 text-base font-light leading-relaxed max-w-sm">
                BFB alumni go on to some of the most competitive roles in the industry — across banking, markets, investments, and beyond.
              </p>











































              <ul className="flex flex-col gap-3 mt-1">
                {tracks.map((track) => (
                  <li key={track.name} className="flex items-start gap-3">
                    <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-accent flex-shrink-0" />
                    <span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-silver">
                        {track.name}
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
