"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Briefcase, Users } from "lucide-react";
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
];

export default function Approach() {
  return (
    <section id="approach" className="py-24 px-4 sm:px-6 lg:px-8 bg-midnight">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif text-silver mb-6"
          >
            Our Approach
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1 w-24 bg-gold mx-auto rounded-full"
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {approachItems.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="group relative p-8 bg-glass border border-silver/10 rounded-sm hover:border-gold/50 transition-all duration-300"
            >
              <div className="mb-6 inline-flex p-3 rounded-sm bg-gold/10 text-gold group-hover:bg-gold group-hover:text-midnight transition-colors duration-300">
                <item.icon size={28} />
              </div>
              <h3 className="text-2xl font-serif text-silver mb-4">{item.title}</h3>
              <p className="text-silver/60 leading-relaxed mb-6 font-light">
                {item.description}
              </p>
              <div className="text-xs font-bold tracking-widest uppercase text-gold/80">
                {item.highlight}
              </div>

              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-gold rounded-full" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
