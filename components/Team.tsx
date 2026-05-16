"use client";

import React from "react";
import { motion } from "framer-motion";

const board = [
  { name: "Ashley Keller", role: "President", linkedin: "https://www.linkedin.com/in/keller-ashley/", image: "/team/ashley keller.jpg" },
  { name: "Leo Liu", role: "Vice President", linkedin: "https://www.linkedin.com/in/liuruogu/", image: "/team/leo.jpg" },
  { name: "Angela Jiang", role: "Director of Professional Development", linkedin: "#", image: "/team/angela.jpg" },
  { name: "Juju Zhao", role: "Director of Professional Events", linkedin: "#", image: "/team/juju.jpg" },
  { name: "Eason Zhang", role: "Co-Director of Recruitment", linkedin: "#", image: "/team/eason.jpg" },
  { name: "Rakshitha Akkala", role: "Co-Director of Recruitment", linkedin: "#", image: "/team/rakshitha.jpg" },
  { name: "Nathan Gong", role: "Director of Marketing", linkedin: "#", image: "/team/nathan.jpg" },
  { name: "Ryan Fue", role: "Director of Tech", linkedin: "#", image: "/team/ryan.jpg" },
  { name: "Nams Doan", role: "Co-Director of Internal Affairs", linkedin: "https://www.linkedin.com/in/nams-doan-628195259/", image: "/team/nams.jpg" },
  { name: "Tomoya Tanaka", role: "Co-Director of Internal Affairs", linkedin: "#", image: "/team/tomoya.jpg" },
];

const advisors = [
  { name: "Oliver Pohlenz", role: "Professional Advisor", linkedin: "#", image: "/team/oliver.jpg" },
  { name: "Daron Simitian", role: "Professional Advisor", linkedin: "#", image: "/team/daron.jpg" },
  { name: "Shveenita", role: "Professional Advisor", linkedin: "#", image: "/team/shveen.jpg" },
  { name: "Nayan", role: "Professional Advisor", linkedin: "#", image: "/team/nayan.jpg" },
  { name: "Sean Lu", role: "Professional Advisor", linkedin: "#", image: "/team/sean.jpg" },
];

const members = [
  { name: "Zach Bush", linkedin: "#", image: "/team/zach.jpg" },
  { name: "James Xu", linkedin: "#", image: "/team/james.jpg" },
  { name: "Anant", linkedin: "#", image: "/team/anant.jpg" },
  { name: "Kareina Zhao", linkedin: "#", image: "/team/kareina.jpg" },
  { name: "Abhi", linkedin: "#", image: "/team/abhi.jpg" },
  { name: "Annabelle", linkedin: "#", image: "/team/annabelle.jpg" },
  { name: "Andrew Guan", linkedin: "#", image: "/team/andrew guan.jpg" },
  { name: "Ana", linkedin: "#", image: "/team/ana.jpg" },
  { name: "John", linkedin: "#", image: "/team/john.jpg" },
  { name: "Jay", linkedin: "#", image: "/team/jay.jpg" },
  { name: "Harris", linkedin: "#", image: "/team/harris.jpg" },
  { name: "Emma", linkedin: "#", image: "/team/emma.jpg" },
  { name: "Rosalind", linkedin: "#", image: "/team/rosalind.jpg" },
  { name: "Viraj", linkedin: "#", image: "/team/viraj.jpg" },
  { name: "Nikhil", linkedin: "#", image: "/team/nikhil.jpg" },
  { name: "Keilee", linkedin: "#", image: "/team/keilee.jpg" },
];

function MemberCard({ member, index }: { member: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white dark:bg-glass border border-slate-200 dark:border-white/8 p-5 rounded-sm hover:border-bfb-blue/40 dark:hover:border-bfb-blue/30 shadow-sm dark:shadow-none transition-all duration-300"
    >
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full"
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
        {member.role && (
          <p className="text-bfb-blue text-[10px] font-bold uppercase tracking-[0.15em] mb-4 leading-snug">
            {member.role}
          </p>
        )}
      </a>
    </motion.div>
  );
}

export default function Team({ mode = "all" }: { mode?: "board" | "all" }) {
  return (
    <section id="team" className="relative">
      {/* Section header */}
      <div className="pt-32 pb-16 flex flex-col items-center justify-center bg-white dark:bg-midnight">
        <div className="text-center px-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-bfb-blue/70 mb-5"
          >
            {mode === "board" ? "Leadership" : "Our Community"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif text-slate-900 dark:text-silver mb-6"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {mode === "board" ? "Executive Board" : "The Team"}
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

      <div className="bg-white dark:bg-midnight pt-16 pb-28 px-4 sm:px-6 lg:px-8 space-y-32">
        {/* Executive Board */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif text-slate-900 dark:text-silver">Executive Board</h3>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {board.map((member, i) => <MemberCard key={member.name} member={member} index={i} />)}
          </div>
        </div>

        {mode === "all" && (
          <>
            {/* Professional Advisors */}
            <div>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif text-slate-900 dark:text-silver">Professional Advisors</h3>
              </div>
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {advisors.map((member, i) => <MemberCard key={member.name} member={member} index={i} />)}
              </div>
            </div>

            {/* General Members */}
            <div>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif text-slate-900 dark:text-silver">General Members</h3>
              </div>
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {members.map((member, i) => <MemberCard key={member.name} member={member} index={i} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
