"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "50+", label: "Placements" },
  { value: "100%", label: "Commitment" },
  { value: "Top-Tier", label: "Alumni Network" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Real photo background */}
      <div className="absolute inset-0">
        <img
          src="/group-photo/bfb-group-photo.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-midnight/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/25 to-midnight" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/40 via-transparent to-midnight/40" />
      </div>

      {/* Editorial side-rule accents */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 opacity-25">
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-silver/60" />
        <div className="w-1 h-1 rounded-full bg-silver/50" />
        <div className="w-px h-20 bg-gradient-to-t from-transparent to-silver/60" />
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 opacity-25">
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-silver/60" />
        <div className="w-1 h-1 rounded-full bg-silver/50" />
        <div className="w-px h-20 bg-gradient-to-t from-transparent to-silver/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex-grow flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-bfb-blue/60" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-bfb-blue">
              UCLA&apos;s Premier Finance Club
            </span>
            <div className="h-px w-12 bg-bfb-blue/60" />
          </div>

          <h1
            className="text-5xl md:text-[5.5rem] font-serif text-silver leading-[1.08] tracking-tight mb-8"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Forging the{" "}
            <span className="text-bfb-blue italic">Future</span>
            <br />
            of Finance &amp; Banking
          </h1>

          <p className="max-w-xl mx-auto text-silver/70 text-lg leading-relaxed mb-12 font-light">
            Preparing UCLA undergraduates for elite careers in investment banking,
            private equity, and hedge funds through technical rigor and
            unmatched networking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="#apply"
              className="group relative px-9 py-4 bg-bfb-blue text-white font-bold rounded-sm overflow-hidden transition-all duration-300 shadow-lg shadow-bfb-blue/25 w-full sm:w-auto text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Join the Cohort{" "}
                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </span>
              <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            <Link
              href="#approach"
              className="px-9 py-4 border border-silver/25 text-silver/75 hover:text-silver hover:border-silver/45 transition-all duration-300 rounded-sm font-medium w-full sm:w-auto text-center text-sm backdrop-blur-sm"
            >
              Explore Our Approach
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-20 w-full max-w-lg mx-auto"
      >
        <div className="flex justify-center divide-x divide-silver/10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex-1 flex flex-col items-center gap-1 px-6">
              <span className="text-2xl font-serif font-bold text-silver">
                {stat.value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-silver/40 text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
