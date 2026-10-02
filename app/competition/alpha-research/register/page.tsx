"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Users, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import CompetitionAuthPortal from "@/components/CompetitionAuthPortal";

export default function AlphaResearchRegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Top Hero / Header Section */}
      <section className="relative pt-page pb-8 px-gutter overflow-hidden border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01]">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <Link
            href="/competition/alpha-research"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-silver/60 hover:text-bfb-blue dark:hover:text-accent transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue rounded-sm"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Alpha Research Competition Overview
          </Link>

          <div className="flex flex-col gap-3">
            <span className="text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue dark:text-accent flex items-center gap-2">
              <Users size={16} /> Competitor Registration &amp; Team Setup
            </span>
            <h1 className="text-h1 font-serif text-slate-900 dark:text-silver leading-tight">
              Register for BFB at UCLA Competition
            </h1>
            <p className="text-slate-500 dark:text-silver/60 text-body leading-relaxed max-w-2xl">
              Create your account, complete your profile, and register your team (1 to 3 undergraduates).
              Registration and strategy submission close on <strong className="text-slate-900 dark:text-silver">Sun, Nov 22, 2026 at 11:59 PM PT</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Main Registration Content Container */}
      <section className="py-section px-gutter flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-3xl mx-auto">
          <CompetitionAuthPortal isInline={true} />
        </div>
      </section>
    </div>
  );
}
