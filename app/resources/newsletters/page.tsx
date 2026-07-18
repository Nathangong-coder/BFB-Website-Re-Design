"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function NewslettersHub() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      <section className="relative flex-1 flex flex-col items-center justify-center pt-page pb-section px-gutter text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-50 dark:bg-midnight" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-4"
          >
            <div className="p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <BookOpen className="text-bfb-blue" size={28} />
            </div>
            <span className="block w-full text-center text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue">
              Resources
            </span>
            <h1 className="text-hero font-serif text-slate-900 dark:text-silver leading-tight text-center">
              BFB Newsletters
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-bfb-blue to-transparent opacity-30" />
            <p className="italic font-light text-slate-400 dark:text-silver/40 text-body-lg leading-relaxed">
              We&apos;re putting together our newsletter archive. Check back soon.
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
