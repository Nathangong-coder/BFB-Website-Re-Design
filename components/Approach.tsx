"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Briefcase, Users, Heart } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const approachItems = [
  {
    title: "Education",
    description: "Our rigorous accelerator program equips members with the technical foundations of finance, from DCF modeling to complex valuation techniques, ensuring every member is career-ready.",
    icon: BookOpen,
    highlight: "Technical Mastery",
  },
  {
    title: "Member Projects",
    description: "Quarterly team-based challenges including investment pitches, M&A simulations, and fixed-income case studies that mirror real-world institutional workflows.",
    icon: Briefcase,
    highlight: "Applied Experience",
  },
  {
    title: "Guest Speakers",
    description: "Direct access to industry leaders from New York hedge funds to LA private credit firms, bridging the gap between academic theory and professional practice.",
    icon: Users,
    highlight: "Elite Networking",
  },
  {
    title: "Community",
    description: "A tight-knit group that extends beyond the boardroom — from retreat weekends to big/little traditions, we believe the best teams are built on genuine relationships. We work hard, play hard.",
    icon: Heart,
    highlight: "Work Hard, Play Hard",
  },
];

export default function Approach() {
  return (
    <section id="approach" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-midnight">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-gold/70 mb-5"
          >
            Our Philosophy
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            The Approach
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto"
          />
        </div>

        {/* Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {approachItems.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="group relative p-7 bg-white dark:bg-glass border border-slate-200 dark:border-white/8 rounded-sm hover:border-gold/40 dark:hover:border-gold/30 shadow-sm dark:shadow-none transition-all duration-300"
            >
              <div className="mb-5 inline-flex p-3 rounded-sm bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white dark:group-hover:text-midnight transition-colors duration-300">
                <item.icon size={22} />
              </div>
              <h3 className="text-base font-serif text-slate-900 dark:text-silver mb-3">{item.title}</h3>
              <p className="text-slate-500 dark:text-silver/55 leading-relaxed mb-5 font-light text-sm">
                {item.description}
              </p>
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold/70">
                {item.highlight}
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-1.5 h-1.5 bg-gold rounded-full" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
