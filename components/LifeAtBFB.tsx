"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

const blocks = [
  {
    imageLeft: true,
    src: "/assorted/bfb-general-meeting.jpg",
    caption: "General Meetings",
    eyebrow: "Technical Mastery",
    title: "Education",
    body: "Our rigorous accelerator program equips members with the technical foundations of finance — from DCF modeling to complex valuation techniques — ensuring every member is career-ready from day one.",
  },
  {
    imageLeft: false,
    src: "/assorted/bfb-alum-speaker.jpg",
    caption: "Alumni Night",
    eyebrow: "Elite Networking",
    title: "Guest Speakers",
    body: "Direct access to industry leaders — from New York hedge funds to LA private credit firms. Our alumni speaker series bridges the gap between academic theory and professional practice.",
  },
  {
    imageLeft: true,
    src: "/capstone/bfb-capstone.jpg",
    caption: "Capstone Projects",
    eyebrow: "Applied Experience",
    title: "Member Projects",
    body: "Quarterly team-based challenges including investment pitches, M&A simulations, company partnerships, and quant modeling that mirror real-world institutional workflows.",
  },
  {
    imageLeft: false,
    src: "/group-photo/bfb-group-photo.jpg",
    caption: "BFB Community",
    eyebrow: "Work Hard, Play Hard",
    title: "Community",
    body: "A tight-knit group that extends beyond the boardroom — from retreat weekends to big/little traditions. We believe the best teams are built on genuine relationships.",
  },
] as const;

export default function LifeAtBFB() {
  return (
    <section id="approach" className="bg-white dark:bg-midnight">
      {/* Section header */}
      <div className="py-16 px-4 text-center">
        <motion.span
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-5"
        >
          Our Philosophy
        </motion.span>
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          The BFB Approach
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="h-0.5 w-10 bg-[var(--bfb-blue)] mx-auto"
        />
      </div>

      {/* Blocks */}
      <div className="max-w-[1300px] mx-auto w-full border-t border-slate-100 dark:border-white/8">
        {blocks.map((block, index) => (
          <motion.div
            key={block.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`flex flex-col border-b border-slate-100 dark:border-white/8 md:flex-row${
              !block.imageLeft ? " md:flex-row-reverse" : ""
            }`}
          >
            {/* Image half */}
            <div className="relative w-full md:w-[60%] min-h-[240px] md:min-h-[500px] overflow-hidden flex-shrink-0">
              <img
                src={block.src}
                alt={block.caption}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-midnight/40" />
              <span className="absolute bottom-4 left-4 text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 bg-black/40 px-2 py-1 rounded-sm">
                {block.caption}
              </span>
            </div>

            {/* Text half */}
            <div
              className={`w-full md:w-[40%] px-8 md:px-14 py-12 md:py-16 flex flex-col justify-center gap-4 ${
                index % 2 !== 0
                  ? "bg-slate-50 dark:bg-bg-secondary"
                  : "bg-white dark:bg-midnight"
              }`}
            >
              <h3 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-silver">
                {block.title}
              </h3>
              <p className="text-slate-500 dark:text-silver/55 leading-relaxed font-light text-sm max-w-md">
                {block.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
