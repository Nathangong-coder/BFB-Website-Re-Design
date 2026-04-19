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
    <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-midnight">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif text-silver mb-6"
          >
            Our Team
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1 w-24 bg-bfb-blue mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-glass border border-silver/10 p-6 rounded-sm hover:border-bfb-blue/50 transition-all duration-300"
            >
              <div className="aspect-square mb-6 overflow-hidden rounded-sm border border-silver/10">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0A0F1C&color=C5A059`;
                  }}
                />
              </div>
              <h3 className="text-xl font-serif text-silver mb-1">{member.name}</h3>
              <p className="text-bfb-blue text-xs font-bold uppercase tracking-widest mb-4">{member.role}</p>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-silver/50 hover:text-bfb-blue transition-colors text-xs font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2, 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
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
