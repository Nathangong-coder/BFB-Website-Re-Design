"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, BookOpen, Presentation, Calendar } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function NewslettersHub() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-50 dark:bg-midnight" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6"
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-bfb-blue">
              Insights & Intelligence
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver leading-tight">
              BFB Newsletters
            </h1>
            <p className="text-slate-500 dark:text-silver/60 text-lg font-light leading-relaxed">
              From quarterly strategic syntheses to our comprehensive annual review, stay informed on the institutional strategies shaping the future of finance.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-32 w-full">
        {/* Featured: Annual Review - Now at the top for maximum impact */}
        <div className="relative group p-10 bg-slate-900 dark:bg-midnight rounded-3xl border border-slate-800 overflow-hidden shadow-xl mb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-bfb-blue/10 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 text-bfb-blue">
                <BookOpen size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Annual Review</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight">
                The State of Institutional Finance
              </h2>
              <p className="text-white/60 text-lg mb-10 font-light leading-relaxed">
                Our most comprehensive annual analysis of market shifts, talent trends, and the emerging intersection of AI and quantitative strategy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all flex items-center justify-center gap-2">
                  Read Interactive Version <ArrowRight size={18} />
                </button>
                <button className="px-8 py-4 border border-white/20 text-white font-bold rounded-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
            <div className="hidden lg:block relative w-64 h-80 bg-white rounded-lg shadow-2xl transform rotate-3 flex flex-col p-6 overflow-hidden">
               <div className="w-10 h-1 bg-bfb-blue mb-4" />
               <div className="space-y-3">
                 <div className="h-4 w-3/4 bg-slate-100 rounded" />
                 <div className="h-3 w-full bg-slate-50 rounded" />
                 <div className="h-3 w-5/6 bg-slate-50 rounded" />
                 <div className="mt-8 grid grid-cols-2 gap-2">
                   <div className="h-12 bg-slate-100 rounded" />
                   <div className="h-12 bg-slate-100 rounded" />
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Strategic Intelligence Section */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-silver/40 whitespace-nowrap">
              Strategic Intelligence
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Member Presentations */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-6 text-bfb-blue">
                <Presentation size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Member Presentations</span>
              </div>
              <h2 className="text-3xl font-serif text-slate-900 dark:text-silver mb-4">Strategic Deep Dives</h2>
              <p className="text-slate-500 dark:text-silver/60 text-lg mb-10 font-light leading-relaxed">
                Detailed technical presentations developed by our analysts on emerging market trends and institutional frameworks.
              </p>
              <div className="flex items-center gap-3 text-slate-400 font-medium italic">
                <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse" />
                Coming soon
              </div>
            </motion.div>

            {/* Quarterly Briefings */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-10 bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-3xl transition-all duration-300 group shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6 text-bfb-blue">
                <Calendar size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Quarterly Briefings</span>
              </div>
              <h2 className="text-3xl font-serif text-slate-900 dark:text-silver mb-4">Strategic Reviews</h2>
              <p className="text-slate-500 dark:text-silver/60 text-lg mb-10 font-light leading-relaxed">
                Comprehensive quarterly syntheses of institutional trends and BFB research.
              </p>
              <div className="flex items-center gap-3 text-slate-400 font-medium italic">
                <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse" />
                Coming soon
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
