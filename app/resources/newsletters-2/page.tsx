"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Search, Filter, Calendar, ExternalLink } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function NewslettersArchive() {
  const [activeTab, setActiveTab] = useState<"annual" | "monthly">("annual");

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Header Section */}
      <section className="pt-32 pb-12 px-6 text-center border-b border-slate-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-bfb-blue mb-4 block">
            Knowledge Base
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6">
            BFB <span className="text-bfb-blue">Archives</span>
          </h1>
          <p className="text-slate-500 dark:text-silver/60 text-lg font-light max-w-2xl mx-auto">
            Access our full library of institutional research, annual reports, and monthly strategic briefings.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex justify-center py-12">
        <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-full flex gap-1">
          <button
            onClick={() => setActiveTab("annual")}
            className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "annual"
                ? "bg-white dark:bg-midnight text-bfb-blue shadow-sm"
                : "text-slate-500 dark:text-silver/60 hover:text-slate-700 dark:hover:text-silver"
            }`}
          >
            Annual Reports
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "monthly"
                ? "bg-white dark:bg-midnight text-bfb-blue shadow-sm"
                : "text-slate-500 dark:text-silver/60 hover:text-slate-700 dark:hover:text-silver"
            }`}
          >
            Monthly Briefings
          </button>
        </div>
      </div>

      {/* Content Section */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "annual" ? (
              <motion.div
                key="annual"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[2025, 2024, 2023].map((year) => (
                  <div key={year} className="group relative bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:border-bfb-blue transition-all duration-300">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-bfb-blue">
                        <FileText size={24} />
                      </div>
                      <span className="text-xs font-bold text-slate-400">{year} Edition</span>
                    </div>
                    <h3 className="text-2xl font-serif text-slate-900 dark:text-silver mb-4">
                      Annual Strategic Review
                    </h3>
                    <p className="text-slate-500 dark:text-silver/60 text-sm mb-8 leading-relaxed">
                      A deep dive into the year&apos;s market trends, BFB&apos;s internal growth, and forecasts for the coming cycle.
                    </p>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-bfb-blue text-white text-xs font-bold rounded-sm hover:bg-bfb-blue/90 transition-all flex items-center justify-center gap-2">
                        <ExternalLink size={14} /> Read Interactive
                      </button>
                      <button className="p-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-silver/80 rounded-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="monthly"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search briefings..."
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border-transparent focus:border-bfb-blue focus:ring-0 rounded-full text-sm"
                    />
                  </div>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 rounded-full text-sm font-bold text-slate-600 dark:text-silver/80 hover:border-bfb-blue transition-all">
                    <Filter size={18} /> Filter
                  </button>
                </div>

                {/* Monthly List */}
                <div className="grid gap-4">
                  {[
                    { date: "May 2026", title: "Alternative Assets: The Future of Futures", excerpt: "Analyzing the pivot towards managed futures in institutional portfolios." },
                    { date: "April 2026", title: "The Quant-AI Synthesis", excerpt: "How large language models are redefining risk parity strategies." },
                    { date: "March 2026", title: "UCLA Talent Trends Q1", excerpt: "A report on the shifting skillsets of the 2026 graduating class." },
                    { date: "February 2026", title: "Stablecoin Infrastructure", excerpt: "Comparing the efficiency of USDC vs USDT in cross-border settlements." },
                    { date: "January 2026", title: "2026 Strategic Outlook", excerpt: "Setting the stage for the most volatile year in a decade." },
                  ].map((item, i) => (
                    <div key={i} className="group flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-midnight border border-slate-100 dark:border-white/5 rounded-2xl hover:border-bfb-blue/30 transition-all duration-300">
                      <div className="flex-shrink-0 w-full md:w-48 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-xs font-bold">
                          <Calendar size={14} /> {item.date}
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-serif text-slate-900 dark:text-silver mb-1 group-hover:text-bfb-blue transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-silver/60 line-clamp-1">{item.excerpt}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-silver/80 text-xs font-bold rounded-full hover:bg-bfb-blue hover:text-white transition-all">
                          Read Briefing
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
