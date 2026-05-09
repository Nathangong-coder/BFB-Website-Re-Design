import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="h-20 bg-slate-50 dark:bg-midnight border-t border-slate-100 dark:border-white/8 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="text-center md:text-left text-sm text-slate-500 dark:text-silver/50 font-light">
          © 2026 Bruins in Finance and Banking
        </div>

        <div className="flex justify-center md:justify-end space-x-4">
          <a
            href="https://instagram.com/bfbatucla"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-silver/60 hover:text-bfb-blue hover:border-bfb-blue/40 dark:hover:text-silver transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/company/bruins-in-finance-and-banking"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-silver/60 hover:text-bfb-blue hover:border-bfb-blue/40 dark:hover:text-silver transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="4" width="4" height="16" rx="2"></rect>
              <path d="M2 8h4"></path>
              <path d="M2 16h4"></path>
            </svg>
          </a>
          <a
            href="mailto:bfbatucla@gmail.com"
            className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-silver/60 hover:text-bfb-blue hover:border-bfb-blue/40 dark:hover:text-silver transition-all duration-200"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
