"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, GraduationCap } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const timeline = [
  {
    step: "01",
    title: "Info Session",
    desc: "Students attend our info session to learn more about the club and network with current members.",
  },
  {
    step: "02",
    title: "Applications Open",
    desc: "Our application process consists of a resume submission followed by two short essay questions.",
  },
  {
    step: "03",
    title: "Coffee Chats",
    desc: "After the application closes, selected candidates participate in a two hour behavioral interview.",
  },
  {
    step: "04",
    title: "Office Hours",
    desc: "Selected candidates can choose to reach out to current members for advice before the final round.",
  },
  {
    step: "05",
    title: "Final Round Interviews",
    desc: "Selected candidates participate in a final interview covering market knowledge, a case study, and financial technicals.",
  },
];

const importantDates = [
  {
    date: "September 22",
    title: "Applications Open",
    desc: "Submit a resume and two short essay responses through our application form.",
    optional: false,
  },
  {
    date: "September 30",
    time: "6:00–8:00 PM",
    title: "UBS Fall Business Showcase",
    desc: "An evening with UBS covering the firm, its businesses, and how to position yourself for recruiting.",
    optional: true,
  },
  {
    date: "October 2",
    title: "Info Session",
    desc: "Learn more about the club, our process, and what we look for — and meet current members.",
    optional: true,
  },
  {
    date: "October 2",
    time: "11:59 PM",
    title: "Applications Due",
    desc: "Resume and essay responses must be submitted before the deadline.",
    optional: false,
  },
  {
    date: "October 5",
    title: "Coffee Chats",
    desc: "Selected candidates participate in a two hour behavioral interview.",
    optional: false,
  },
  {
    date: "Between rounds",
    title: "Office Hours",
    desc: "Reach out to current members for advice before the final round.",
    optional: true,
  },
  {
    date: "October 8–9",
    title: "Final Round Interviews",
    desc: "A final interview covering market knowledge, a case study, and financial technicals.",
    optional: false,
  },
];

export default function RecruitmentPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden pt-page pb-section px-gutter text-center bg-white dark:bg-midnight">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-4"
          >
            <span className="block w-full text-center text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue dark:text-bfb-blue/70">
              Get Involved
            </span>

            <h1 className="text-hero font-serif text-slate-900 dark:text-silver leading-tight text-center">
              Recruitment
            </h1>

            <div className="w-24 h-px bg-gradient-to-r from-transparent via-bfb-blue to-transparent opacity-30" />

            <p className="italic font-light text-slate-400 dark:text-silver/40 text-body-lg leading-relaxed max-w-2xl mx-auto">
              Although recruitment may seem daunting, we&apos;re just seeing if you&apos;ll be a fit for the club on a professional and personal level. At the end of the day, we&apos;re looking for people who are willing to put in the work to study for interviews and will fit into our club culture of excellence and belonging.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Recruiting Timeline */}
      <section className="py-section px-gutter border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mb-4">
              Recruiting Timeline
            </h2>
            <p className="text-slate-500 dark:text-silver/60 text-body max-w-xl mx-auto">
              What to expect from info session through final round interviews.
            </p>
          </motion.div>

          <div className="relative overflow-x-auto pb-4">
            <div className="flex items-stretch gap-8 lap:gap-6 px-2 lap:px-0 min-w-max lap:min-w-0 lap:grid lap:grid-cols-5 relative">
              <div className="hidden lap:block absolute top-6 left-[10%] right-[10%] h-px bg-slate-200 dark:bg-slate-800 z-0" />

              {timeline.map((item, i) => (
                <div key={item.step} className="relative z-10 flex flex-col items-center gap-6 shrink-0 w-64 lap:w-auto">
                  <div className="flex items-center justify-center shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-midnight border-2 border-bfb-blue flex items-center justify-center shadow-sm">
                      <span className="text-bfb-blue font-bold text-xs">{item.step}</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-midnight/40 shadow-sm hover:border-bfb-blue/30 dark:hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 text-center h-full w-full"
                  >
                    <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-silver mb-2 leading-tight">{item.title}</h3>
                    <p className="text-slate-500 dark:text-silver/60 leading-relaxed text-sm">{item.desc}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-section px-gutter">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue dark:text-accent">
              Mark Your Calendar
            </span>
            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mt-4 mb-4">
              Important Dates — Fall 2026
            </h2>
            <p className="text-slate-500 dark:text-silver/60 text-body max-w-xl mx-auto">
              Events marked <span className="font-semibold text-slate-600 dark:text-silver/80">Optional</span> are
              open to attend but are not part of the evaluation.
            </p>
          </motion.div>

          <ul className="divide-y divide-slate-100 dark:divide-white/5 border-y border-slate-100 dark:border-white/5">
            {importantDates.map((item, i) => (
              <motion.li
                key={`${item.title}-${item.date}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col lap:flex-row lap:items-baseline gap-2 lap:gap-8 py-5"
              >
                <div className="lap:w-48 shrink-0">
                  <p className="text-sm font-bold text-bfb-blue dark:text-accent tabular-nums">
                    {item.date}
                  </p>
                  {item.time ? (
                    <p className="text-xs text-slate-400 dark:text-silver/40 tabular-nums mt-0.5">
                      {item.time}
                    </p>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-silver leading-tight">
                      {item.title}
                    </h3>
                    {item.optional ? (
                      <span className="shrink-0 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-silver/40">
                        Optional
                      </span>
                    ) : null}
                  </div>
                  <p className="text-slate-500 dark:text-silver/60 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Test Your Skills CTA */}
      <section className="py-section px-gutter">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-8 py-14 lap:px-16 lap:py-16 text-center"
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-bfb-blue/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 p-3 bg-white dark:bg-midnight rounded-xl shadow-sm">
                <GraduationCap className="text-bfb-blue dark:text-accent" size={28} />
              </div>

              <span className="text-eyebrow font-bold uppercase tracking-[0.3em] text-bfb-blue mb-4">
                Test Your Skills
              </span>
              <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mb-4">
                Knowledge Assessment
              </h2>
              <p className="text-slate-500 dark:text-silver/60 text-body-lg max-w-xl mx-auto mb-10">
                Put your technical knowledge to the test with our finance modules on DCF, LBO, and accounting.
              </p>

              <Link
                href="/recruitment/training"
                className="inline-flex items-center justify-center min-h-[52px] gap-2 px-8 py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-bfb-blue/20"
              >
                Take the Assessment <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
