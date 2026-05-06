"use client";

import React from "react";
import { motion } from "framer-motion";

const team = [
  { name: "Alan Whitmoyer", role: "President", linkedin: "https://www.linkedin.com/in/alan-whitmoyer/", image: "https://bfbatucla.com/assets/images/image65.jpg" },
  { name: "Ashley Hinkel", role: "Vice President", linkedin: "http://www.linkedin.com/in/ashleyhinkel", image: "https://bfbatucla.com/assets/images/image66.jpg" },
  { name: "Heschel Fernando", role: "Director of Finance", linkedin: "https://www.linkedin.com/in/heschel-fernando/", image: "https://bfbatucla.com/assets/images/image67.jpg" },
  { name: "Nams Doan", role: "Director of Finance", linkedin: "https://www.linkedin.com/in/nams-doan-628195259/", image: "https://bfbatucla.com/assets/images/image02.jpg" },
  { name: "Michael Sun", role: "Director of Outreach", linkedin: "https://www.linkedin.com/in/michael-sun-239a3b30a/", image: "https://bfbatucla.com/assets/images/image10.jpg" },
  { name: "Joanna Zhang", role: "Director of Outreach", linkedin: "https://www.linkedin.com/in/joannaucla/", image: "https://bfbatucla.com/assets/images/image11.jpg" },
  { name: "Nandini Singh", role: "Director of Professional Development", linkedin: "https://www.linkedin.com/in/nandinisingh7/", image: "https://bfbatucla.com/assets/images/image16.jpg" },
  { name: "Leo Liu", role: "Director of Professional Development", linkedin: "https://www.linkedin.com/in/liuruogu/", image: "https://bfbatucla.com/assets/images/image17.jpg" },
  { name: "Jack Ren", role: "Director of Events", linkedin: "https://www.linkedin.com/in/jack-ren-434b42255/", image: "https://bfbatucla.com/assets/images/image18.jpg" },
  { name: "Richard Tucholski", role: "Director of Events", linkedin: "https://www.linkedin.com/in/richard-tucholski-931418211/", image: "https://bfbatucla.com/assets/images/image20.jpg" },
  { name: "Ashley Keller", role: "Director of Marketing", linkedin: "https://www.linkedin.com/in/keller-ashley/", image: "https://bfbatucla.com/assets/images/image21.jpg" },
];

export default function Team() {
  return (
    <section id="team" className="relative">
      {/* Photo header block */}
      <div className="relative h-[55vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
        <img
          src="/group-photo/bfb-group-photo-professional.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-midnight/75" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white dark:from-midnight to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white dark:from-midnight to-transparent" />

        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-bfb-blue/70 mb-5"
          >
            Leadership
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif text-silver mb-6"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Our Team
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-px w-20 bg-gradient-to-r from-transparent via-bfb-blue/40 to-transparent mx-auto"
          />
        </div>
      </div>

      {/* Team cards */}
      <div className="bg-white dark:bg-midnight pt-16 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white dark:bg-glass border border-slate-200 dark:border-white/8 p-5 rounded-sm hover:border-bfb-blue/40 dark:hover:border-bfb-blue/30 shadow-sm dark:shadow-none transition-all duration-300"
            >
              <div className="aspect-square mb-5 overflow-hidden rounded-sm border border-slate-100 dark:border-white/8">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=F8FAFC&color=2774AE`;
                  }}
                />
              </div>
              <h3 className="text-base font-serif text-slate-900 dark:text-silver mb-1">{member.name}</h3>
              <p className="text-bfb-blue text-[10px] font-bold uppercase tracking-[0.15em] mb-4 leading-snug">
                {member.role}
              </p>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="inline-flex items-center gap-2 text-slate-400 dark:text-silver/40 hover:text-bfb-blue transition-colors text-xs font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                Connect
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
