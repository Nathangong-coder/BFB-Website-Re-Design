"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function QuantProgramsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      <section className="relative flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-50 dark:bg-midnight" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6"
          >
            <div className="p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <Brain className="text-bfb-blue" size={28} />
            </div>
            <h1 className="text-h2 font-serif text-slate-900 dark:text-silver leading-tight">
              BAI &amp; Quant Accelerator
            </h1>
            <p className="text-slate-500 dark:text-silver/60 text-body-lg font-light leading-relaxed">
              We&apos;re putting together a new page for our quant programs. Check back soon.
            </p>
            <div className="flex items-center gap-3 text-slate-400 font-medium italic">
              <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse" />
              Coming soon
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
