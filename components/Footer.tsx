import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-midnight border-t border-slate-100 dark:border-white/8 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block">
              <img src="/bfb_bear.png" alt="BFB Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="mt-2 text-slate-500 dark:text-silver/50 text-sm">
              UCLA&apos;s Premier Finance Club.
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-500 dark:text-silver/60">
            <Link href="/#events" className="hover:text-bfb-blue transition-colors">Events</Link>
            <Link href="/team" className="hover:text-bfb-blue transition-colors">Team</Link>
            <Link href="/placements" className="hover:text-bfb-blue transition-colors">Placements</Link>
            <Link href="/training" className="hover:text-bfb-blue transition-colors">Training</Link>
            <Link href="/join" className="hover:text-bfb-blue transition-colors">Join Us</Link>
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
              href="mailto:bfbatucla@gmail.com"
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-silver/60 hover:text-bfb-blue hover:border-bfb-blue/40 dark:hover:text-silver transition-all duration-200"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/8 text-center text-slate-400 dark:text-silver/30 text-xs">
          &copy; {new Date().getFullYear()} Bruins in Finance and Banking. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
