"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Search, Filter, Calendar, ExternalLink } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function NewslettersArchive() {
  const [activeTab, setActiveTab] = useState<"annual" | "presentations" | "quarterly">("annual");

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Header Section */}
      <section className="pt-32 pb-12 px-6 text-center border-b border-slate-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-bfb-blue mb-4 block">
            Knowledge Base
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6">
            BFB Archives
          </h1>
          <p className="text-slate-500 dark:text-silver/60 text-lg font-light max-w-2xl mx-auto">
            Access our full library of institutional research, annual reports, and strategic briefings.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex justify-center py-12">
        <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-full flex gap-1">
          <button
            onClick={() => setActiveTab("annual")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "annual"
                ? "bg-white dark:bg-midnight text-bfb-blue shadow-sm"
                : "text-slate-500 dark:text-silver/60 hover:text-slate-700 dark:hover:text-silver"
            }`}
          >
            Annual Reports
          </button>
          <button
            onClick={() => setActiveTab("presentations")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "presentations"
                ? "bg-white dark:bg-midnight text-bfb-blue shadow-sm"
                : "text-slate-500 dark:text-silver/60 hover:text-slate-700 dark:hover:text-silver"
            }`}
          >
            Member Presentations
          </button>
          <button
            onClick={() => setActiveTab("quarterly")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "quarterly"
                ? "bg-white dark:bg-midnight text-bfb-blue shadow-sm"
                : "text-slate-500 dark:text-silver/60 hover:text-slate-700 dark:hover:text-silver"
            }`}
          >
            Quarterly Reports
          </button>
        </div>
      </div>

      {/* Content Section */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "annual" || activeTab === "quarterly" ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <div className="group relative bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:border-bfb-blue transition-all duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-bfb-blue">
                      <FileText size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Coming soon</span>
                  </div>
                  <h3 className="text-2xl font-serif text-slate-900 dark:text-silver mb-4">
                    {activeTab === "annual" ? "Annual Strategic Review" : "Quarterly Market Insights"}
                  </h3>
                  <p className="text-slate-500 dark:text-silver/60 text-sm mb-8 leading-relaxed">
                    Our deep-dive analysis into seasonal market trends and institutional shifts.
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-silver/80 text-xs font-bold rounded-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                      Coming soon
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="presentations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="group flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-midnight border border-slate-100 dark:border-white/5 rounded-2xl hover:border-bfb-blue/30 transition-all duration-300">
                  <div className="flex-shrink-0 w-full md:w-48 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-xs font-bold">
                      <Calendar size={14} /> Coming soon
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-serif text-slate-900 dark:text-silver mb-1 group-hover:text-bfb-blue transition-colors">
                      Member Presentation Title
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-silver/60 line-clamp-1">
                      A strategic technical deep-dive into specific market sectors and emerging trends.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-silver/80 text-xs font-bold rounded-full hover:bg-bfb-blue hover:text-white transition-all">
                      Coming soon
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
