"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      {/* Background Element: Subtle Gradient Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bfb-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex-grow flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block py-1 px-3 rounded-full border border-bfb-blue/30 bg-bfb-blue/10 text-bfb-blue text-xs font-bold tracking-widest uppercase mb-6">
            UCLA&apos;s Premier Finance Club
          </span>

          <h1 className="text-5xl md:text-8xl font-serif text-silver leading-[1.1] tracking-tight mb-8">
            Forging the <span className="text-bfb-blue italic">Future</span> of <br />
            Finance and Banking
          </h1>

          <p className="max-w-2xl mx-auto text-silver/60 text-lg md:text-xl leading-relaxed mb-12 font-light">
            Dedicated to preparing undergraduates for elite careers in investment banking,
            private equity, and hedge funds through technical rigor and unmatched networking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <Link
              href="#apply"
              className="group relative px-8 py-4 bg-bfb-blue text-white font-bold rounded-sm overflow-hidden transition-all duration-300 shadow-lg shadow-bfb-blue/20 w-full sm:w-auto text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Join the Cohort <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              />
            </Link>

            <Link
              href="#approach"
              className="px-8 py-4 border border-silver/20 text-silver hover:text-bfb-blue hover:border-bfb-blue transition-all duration-300 rounded-sm font-medium w-full sm:w-auto text-center"
            >
              Explore Our Approach
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom Detail: Floating Statistics - Now relative to avoid overlap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="relative z-10 mt-20 flex justify-center gap-8 md:gap-20 text-silver/40 text-xs uppercase tracking-[0.2em] font-medium"
      >
        <div className="flex flex-col items-center">
          <span className="text-silver text-xl font-serif font-bold">50+</span>
          <span>Placements</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-silver text-xl font-serif font-bold">100%</span>
          <span>Commitment</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-silver text-xl font-serif font-bold">Top-Tier</span>
          <span>Alumni</span>
        </div>
      </motion.div>
    </section>
  );
}
