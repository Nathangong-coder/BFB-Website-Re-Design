"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Mail, Download, BookOpen } from "lucide-react";
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
              BFB <span className="text-bfb-blue">Newsletters</span>
            </h1>
            <p className="text-slate-500 dark:text-silver/60 text-lg font-light leading-relaxed">
              From monthly market snapshots to our comprehensive annual review, stay informed on the strategies shaping the future of finance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Annual Report - Featured Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative group bg-slate-900 dark:bg-midnight rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center">
            {/* Visual Side */}
            <div className="w-full lg:w-1/2 aspect-square lg:aspect-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-bfb-blue/40 to-transparent z-10" />
              <div className="w-full h-full bg-slate-800 flex items-center justify-center p-12">
                <div className="relative w-full aspect-[3/4] bg-white rounded-lg shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500 flex flex-col p-8">
                  <div className="w-12 h-1 bg-bfb-blue mb-4" />
                  <div className="space-y-4">
                    <div className="h-8 w-3/4 bg-slate-100 rounded" />
                    <div className="h-4 w-full bg-slate-50 rounded" />
                    <div className="h-4 w-5/6 bg-slate-50 rounded" />
                    <div className="mt-12 grid grid-cols-3 gap-2">
                      <div className="h-16 bg-slate-100 rounded" />
                      <div className="h-16 bg-slate-100 rounded" />
                      <div className="h-16 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 p-8 md:p-16 text-white">
              <div className="flex items-center gap-3 mb-6 text-gold">
                <BookOpen size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Annual Review 2025</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
                The State of <br />
                <span className="text-bfb-blue">Institutional Finance</span>
              </h2>
              <p className="text-white/60 text-lg mb-10 font-light leading-relaxed">
                Our comprehensive annual analysis of market shifts, talent trends, and the emerging intersection of AI and quantitative strategy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all flex items-center justify-center gap-2">
                  Read Interactive Version <ArrowRight size={18} />
                </button>
                <button className="px-8 py-4 border border-white/20 text-white font-bold rounded-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Newsletter Feed */}
      <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4 text-bfb-blue">
                <Mail size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Monthly Briefings</span>
              </div>
              <h2 className="text-4xl font-serif text-slate-900 dark:text-silver">Market Snapshots</h2>
            </div>
            <button className="text-bfb-blue font-bold text-sm hover:underline flex items-center gap-2">
              View Archive <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { date: "May 2026", title: "The Rise of Alternative Assets", category: "Analysis" },
              { date: "April 2026", title: "Quant Strategies in Volatile Markets", category: "Technique" },
              { date: "March 2026", title: "The Next Gen of Talent Pipelines", category: "Insights" },
              { date: "February 2026", title: "AI's Role in Risk Management", category: "Analysis" },
              { date: "January 2026", title: "2026 Outlook: The BFB Perspective", category: "Outlook" },
              { date: "December 2025", title: "Year-End Recap & Performance", category: "Recap" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.date}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-silver/60 rounded">{item.category}</span>
                </div>
                <h3 className="text-xl font-serif text-slate-900 dark:text-silver mb-6 group-hover:text-bfb-blue transition-colors">
                  {item.title}
                </h3>
                <button className="flex items-center gap-2 text-sm font-bold text-bfb-blue group-hover:gap-3 transition-all">
                  Read Newsletter <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
