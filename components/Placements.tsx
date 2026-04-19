"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Investment Banking", "Private Equity", "Hedge Funds", "VC"];

const placements = [
  { name: "Goldman Sachs", category: "Investment Banking", logo: "https://www.goldmansachs.com/a/pgs/navigation/assets/images/gs-logo.svg" },
  { name: "J.P. Morgan", category: "Investment Banking", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/JPMorgan_logo.svg" },
  { name: "Morgan Stanley", category: "Investment Banking", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Morgan_Stanley_Logo_2024.svg" },
  { name: "Blackstone", category: "Private Equity", logo: "https://img.logokit.com/blackstone.com" },
  { name: "KKR", category: "Private Equity", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Kohlberg_Kravis_Roberts_%28logo%29.svg" },
  { name: "The Carlyle Group", category: "Private Equity", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/The_Carlyle_Group_logo.svg" },
  { name: "Bridgewater Associates", category: "Hedge Funds", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Bridgewater_Associates_logo.svg" },
  { name: "Citadel", category: "Hedge Funds", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Citadel_LLC_Logo.svg" },
  { name: "Point72", category: "Hedge Funds", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Point72_Asset_Management_logo.png" },
  { name: "Sequoia Capital", category: "VC", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Sequoia_Capital_logo.svg" },
  { name: "Andreessen Horowitz", category: "VC", logo: "https://www.a16z.com" },
  { name: "Benchmark", category: "VC", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Benchmark_logo.jpg" },
];

export default function Placements() {
  const [filter, setFilter] = useState("All");

  const filteredPlacements = filter === "All"
    ? placements
    : placements.filter(p => p.category === filter);

  return (
    <section id="placements" className="py-24 px-4 sm:px-6 lg:px-8 bg-midnight">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif text-silver mb-6"
          >
            Our Placements
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1 w-24 bg-bfb-blue mx-auto rounded-full mb-12"
          />

          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-sm text-xs font-bold tracking-widest uppercase transition-all duration-200 border ${
                  filter === cat
                    ? "bg-bfb-blue text-white border-bfb-blue shadow-lg shadow-bfb-blue/20"
                    : "bg-transparent text-silver/60 border-silver/20 hover:border-bfb-blue/50 hover:text-bfb-blue"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPlacements.map((firm) => (
              <motion.div
                key={firm.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-video bg-glass border border-silver/10 rounded-sm flex items-center justify-center p-6 overflow-hidden hover:border-bfb-blue/50 transition-colors duration-300"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={firm.logo}
                    alt={firm.name}
                    className="max-h-12 max-w-full grayscale group-hover:grayscale-0 transition-all duration-300 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = document.createElement('div');
                      fallback.className = "flex flex-col items-center text-center";
                      fallback.innerHTML = `
                        <span class="text-silver/40 font-serif text-lg font-bold">${firm.name.charAt(0)}</span>
                        <span class="text-[8px] uppercase tracking-tighter text-silver/20">${firm.name}</span>
                      `;
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
                </div>
                <div className="absolute bottom-2 right-3 text-[10px] uppercase tracking-tighter text-silver/20 group-hover:text-bfb-blue/40 transition-colors">
                  {firm.category}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
