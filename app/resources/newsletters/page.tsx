"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, ExternalLink, Eye, X, Hourglass } from "lucide-react";

type Tab = "annual" | "presentations" | "quarterly";

const ANNUAL_REPORT_2026 = {
  title: "2026 Annual Report",
  year: "2026",
  description:
    "A full-year review of BFB's research, placements, events, and community — covering everything the organization built and delivered this year.",
  href: "/reports/BFB-Annual-Report-2026.pdf",
};

const TABS: { id: Tab; label: string }[] = [
  { id: "annual", label: "Annual Reports" },
  { id: "presentations", label: "Member Presentations" },
  { id: "quarterly", label: "Quarterly Reports" },
];

function InDevelopment({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-16 px-6 bg-slate-50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
      <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-bfb-blue">
        <Hourglass size={22} />
      </div>
      <h3 className="text-2xl font-serif text-slate-900 dark:text-silver">
        {label} are in development
      </h3>
      <p className="text-slate-500 dark:text-silver/60 text-sm max-w-md leading-relaxed">
        We&apos;re still putting this section together. Stay tuned for updates.
      </p>
      <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
        <div className="w-2 h-2 bg-bfb-blue rounded-full animate-pulse" />
        Coming soon
      </div>
    </div>
  );
}

export default function NewslettersArchive() {
  const [activeTab, setActiveTab] = useState<Tab>("annual");
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Header Section */}
      <section className="pt-32 pb-12 px-6 text-center border-b border-slate-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <span className="block w-full text-center text-eyebrow font-bold tracking-[0.3em] uppercase text-bfb-blue mb-4">
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
      <div className="flex justify-center py-12 px-6">
        <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-full flex flex-wrap justify-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white dark:bg-midnight text-bfb-blue shadow-sm"
                  : "text-slate-500 dark:text-silver/60 hover:text-slate-700 dark:hover:text-silver"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="group relative bg-white dark:bg-midnight border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:border-bfb-blue transition-all duration-300">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-bfb-blue">
                        <FileText size={24} />
                      </div>
                      <span className="text-xs font-bold text-bfb-blue tracking-widest uppercase">
                        {ANNUAL_REPORT_2026.year}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif text-slate-900 dark:text-silver mb-4">
                      {ANNUAL_REPORT_2026.title}
                    </h3>
                    <p className="text-slate-500 dark:text-silver/60 text-sm mb-8 leading-relaxed">
                      {ANNUAL_REPORT_2026.description}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setViewerOpen((open) => !open)}
                        className="flex-1 py-3 bg-bfb-blue text-white text-xs font-bold rounded-sm hover:bg-bfb-blue/90 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye size={14} />
                        {viewerOpen ? "Hide Report" : "View Report"}
                      </button>
                      <a
                        href={ANNUAL_REPORT_2026.href}
                        download
                        className="py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-silver/80 text-xs font-bold rounded-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                        aria-label="Download 2026 Annual Report"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Inline PDF Viewer */}
                <AnimatePresence>
                  {viewerOpen && (
                    <motion.div
                      key="viewer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-midnight">
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText size={16} className="text-bfb-blue shrink-0" />
                            <span className="text-sm font-bold text-slate-900 dark:text-silver truncate">
                              {ANNUAL_REPORT_2026.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={ANNUAL_REPORT_2026.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-silver/80 hover:text-bfb-blue transition-colors"
                            >
                              <ExternalLink size={14} />
                              Open in new tab
                            </a>
                            <button
                              onClick={() => setViewerOpen(false)}
                              className="p-1.5 rounded-full text-slate-500 dark:text-silver/60 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                              aria-label="Close viewer"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                        <iframe
                          src={`${ANNUAL_REPORT_2026.href}#view=FitH`}
                          title={ANNUAL_REPORT_2026.title}
                          className="w-full h-[70vh] min-h-[480px] bg-slate-100 dark:bg-slate-900"
                        />
                        <p className="sm:hidden px-5 py-3 text-xs text-slate-500 dark:text-silver/60 border-t border-slate-200 dark:border-slate-800">
                          Having trouble viewing?{" "}
                          <a
                            href={ANNUAL_REPORT_2026.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-bfb-blue font-bold"
                          >
                            Open the PDF in a new tab
                          </a>
                          .
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <InDevelopment
                  label={activeTab === "presentations" ? "Member Presentations" : "Quarterly Reports"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
