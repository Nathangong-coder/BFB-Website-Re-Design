"use client";

import React from "react";
import { motion } from "framer-motion";

const board = [
  { name: "Ashley Keller", role: "President", linkedin: "https://www.linkedin.com/in/keller-ashley/", image: "/team/ashley keller.jpg" },
  { name: "Leo Liu", role: "Vice President", linkedin: "https://www.linkedin.com/in/liuruogu/", image: "/team/leo.jpg" },
  { name: "Angela Jiang", role: "Director of Professional Development", linkedin: "https://www.linkedin.com/in/angela-leyi-jiang/", image: "/team/angela.jpg" },
  { name: "Juju Zhao", role: "Director of Professional Events", linkedin: "http://linkedin.com/in/jujuzhao", image: "/team/juju.jpg" },
  { name: "Eason Zhang", role: "Co-Director of Recruitment", linkedin: "https://www.linkedin.com/in/eason-zhang-b9a087328/", image: "/team/eason.jpg" },
  { name: "Rakshitha Akkala", role: "Co-Director of Recruitment", linkedin: "http://linkedin.com/in/rakshitha-akkala-b2a417378", image: "/team/rakshitha.jpg" },
  { name: "Nathan Gong", role: "Director of Marketing", linkedin: "http://linkedin.com/in/nathan-gong-796642259", image: "/team/nathan.jpg" },
  { name: "Ryan Fue", role: "Director of Tech", linkedin: "https://www.linkedin.com/in/ryanfue/", image: "/team/ryan.jpg" },
  { name: "Nams Doan", role: "Co-Director of Internal Affairs", linkedin: "https://www.linkedin.com/in/nams-doan-628195259/", image: "/team/nams.jpg" },
  { name: "Tomoya Tanaka", role: "Co-Director of Internal Affairs", linkedin: "https://www.linkedin.com/in/tanaka-tomoya/", image: "/team/tomoya.jpg" },
];

const advisors = [
  { name: "Oliver Pohlenz", role: "Professional Advisor", linkedin: "https://www.linkedin.com/in/oliver-pohlenz8/", image: "/team/oliver.jpg" },
  { name: "Daron Simitian", role: "Professional Advisor", linkedin: "https://www.linkedin.com/in/daronsimitian/", image: "/team/daron.jpg" },
  { name: "Shveenita Kanapathy", role: "Professional Advisor", linkedin: "https://www.linkedin.com/in/shveenitakanapathy/", image: "/team/shveen.jpg" },
  { name: "Nayan Petrime", role: "Professional Advisor", linkedin: "https://www.linkedin.com/in/nayanpetrime/", image: "/team/nayan.jpg" },
  { name: "Sean Lu", role: "Professional Advisor", linkedin: "https://www.linkedin.com/in/sean-lu-4b24a333a/", image: "/team/sean.jpg" },
];

const members = [
  { name: "Zach Bush", linkedin: "http://linkedin.com/in/zacharymbush", image: "/team/zach.jpg" },
  { name: "James Xu", linkedin: "http://linkedin.com/in/jamesxu1", image: "/team/james.jpg" },
  { name: "Anant Bhartia", linkedin: "https://www.linkedin.com/in/anant-bhartia-644aab28b/", image: "/team/anant.jpg" },
  { name: "Kareina Zhao", linkedin: "https://www.linkedin.com/in/kareina-zhao-06a498269/", image: "/team/kareina.jpg" },
  { name: "Abhi Kumar", linkedin: "https://www.linkedin.com/in/abhi-kumar-/", image: "/team/abhi.jpg" },
  { name: "Annabelle Chen", linkedin: "https://www.linkedin.com/in/annabellechen01/", image: "/team/annabelle.jpg" },
  { name: "Andrew Guan", linkedin: "http://linkedin.com/in/andrewguan30", image: "/team/andrew guan.jpg" },
  { name: "Ana Santana", linkedin: "https://www.linkedin.com/in/ana-laura-santana-27a702279/", image: "/team/ana.jpg" },
  { name: "John Diepenbrock", linkedin: "https://www.linkedin.com/in/john-diepenbrock/", image: "/team/john.jpg" },
  { name: "Jay Lee", linkedin: "http://linkedin.com/in/jay-lee-kr", image: "/team/jay.jpg" },
  { name: "Harris Song", linkedin: "https://www.linkedin.com/in/harris-song/", image: "/team/harris.jpg" },
  { name: "Emma Luo", linkedin: "https://www.linkedin.com/in/emma-luo-221458318/", image: "/team/emma.jpg" },
  { name: "Rosalind Goldman", linkedin: "https://www.linkedin.com/in/rosalind-goldman/", image: "/team/rosalind.jpg" },
  { name: "Viraj Nigam", linkedin: "https://www.linkedin.com/in/viraj-nigam/", image: "/team/viraj.jpg" },
  { name: "Nikhil Vijay", linkedin: "https://www.linkedin.com/in/nikhil-vijay-855b81270/", image: "/team/nikhil.jpg" },
  { name: "Keilee Hane", linkedin: "https://www.linkedin.com/in/keilee-hane/", image: "/team/keilee hane.jpg" },
  { name: "Ashley Hinkel", linkedin: "http://www.linkedin.com/in/ashleyhinkel", image: "/team/ashley-hinkel.jpg" },
  { name: "Daniel Shahryari", linkedin: "https://www.linkedin.com/in/danielshahryari/", image: "/team/daniel.jpg" },
  { name: "Henry McNamara", linkedin: "https://www.linkedin.com/in/hmac213/", image: "/team/henry.jpg" },
  { name: "Jenaro Rodriguez", linkedin: "https://www.linkedin.com/in/jenaro-rodriquez/", image: "/team/jenaro.jpg" },
  { name: "Michael Sun", linkedin: "https://www.linkedin.com/in/michael-sun-239a3b30a/", image: "/team/michael.jpg" },
  { name: "Richard Tucholski", linkedin: "https://www.linkedin.com/in/richard-tucholski-931418211/", image: "/team/richard.jpg" },
  { name: "Roshni Sen", linkedin: "https://www.linkedin.com/in/roshni-sen-ucla/", image: "/team/roshni.jpg" },
  { name: "Samuel Oh", linkedin: "https://www.linkedin.com/in/samuel-oh-ucla/", image: "/team/samuel.jpg" },
  { name: "Aarnav Yedla", linkedin: "https://www.linkedin.com/in/aarnav-yedla/", image: "/team/aarnav.jpg" },
  { name: "Misheka Bhagat", linkedin: "https://www.linkedin.com/in/misheka-bhagat/", image: "/team/misheka.jpg" },
  { name: "Annie Huang", linkedin: "https://www.linkedin.com/in/anniehuanng/", image: "/team/annie huang.jpg" },
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
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center max-w-2xl mx-auto">
                  {advisors.slice(0, 2).map((member, i) => <MemberCard key={member.name} member={member} index={i} />)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center max-w-4xl mx-auto">
                  {advisors.slice(2).map((member, i) => <MemberCard key={member.name} member={member} index={i + 2} />)}
                </div>
              </div>
            </div>

            {/* General Members */}
            <div>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif text-slate-900 dark:text-silver">General Members</h3>
              </div>
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((member, i) => <MemberCard key={member.name} member={member} index={i} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
