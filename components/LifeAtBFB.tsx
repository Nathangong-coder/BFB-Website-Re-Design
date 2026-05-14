"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { SpeakerSlideshow } from "./SpeakerSlideshow";

const blocks = [
  {
    title: "Intensive Training",
    eyebrow: "Foundational Excellence",
    body: "Our rigorous accelerator program equips members with the technical foundations of finance — from DCF modeling to complex valuation techniques. This culminates in intensive capstone projects, often spanning two quarters, and professional member presentations that mirror institutional standards.",
    images: [
      "/capstone/bfb-capstone.jpg",
      "/assorted/bfb-general-meeting.jpg",
    ],
    captions: ["Capstone Projects", "General Meetings"],
    imageLeft: true,
  },
  {
    title: "Experiential Learning",
    eyebrow: "Applied Practice",
    body: "We bridge the gap between theory and practice through real-world applications. Members engage in high-stakes client projects and competitive stock pitches, applying quantitative frameworks to actual market data and industry challenges.",
    src: "/capstone/bfb-capstone.jpg",
    caption: "Capstone Projects",
    imageLeft: false,
  },
  {
    title: "Professional Network",
    eyebrow: "Elite Access",
    body: "Direct access to industry leaders — from New York hedge funds to LA private credit firms. Our alumni speaker series and extensive placement network bridge the gap between academic theory and professional practice, connecting members with some of the most competitive roles in the industry.",
    images: [
      "/speakers/Horizontal Anderson Speaker Photo.jpeg",
      "/speakers/jpm speaker.jpeg",
    ],
    captions: ["Anderson Professor", "JP Morgan Alumni"],
    imageLeft: true,
  },
  {
    title: "Quantitative Rigor",
    eyebrow: "Advanced Analytics",
    body: "Pushing the boundaries of traditional finance, our quantitative track focuses on Bayesian Analysis and Investing (BAI) and algorithmic strategies. Members compete in quant trading competitions, developing the mathematical rigor necessary for modern electronic markets.",
    src: "/quant/quant-photo.jpg",
    caption: "Quantitative Analysis",
    imageLeft: false,
  },
  {
    title: "Dynamic Community",
    eyebrow: "Culture & Connection",
    body: "At BFB, we believe that our greatest strengths are found in our collective community. We prioritize the development of the person behind the professional, ensuring that every member is backed by a network of peers who are as invested in each other's success as they are in their own. This spirit of camaraderie is the heartbeat of our organization. Through collaborative group projects, big-little pairings, weekly social events, and quarterly retreats, we aim to create an environment where mentorship happens naturally and friendships run deep.\n\nOur goal isn't to just simply prepare you for the future of the industry; we are trying to build a lifelong community where every member has the support, confidence, and connection to thrive.",
    src: "/group-photo/joshua-tree-social.jpeg",
    caption: "Joshua Tree Retreat",
    imageLeft: true,
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
      <div className="max-w-[1300px] mx-auto w-full flex flex-col gap-12 py-12">
        {blocks.map((block, index) => (
          <motion.div
            key={block.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`flex flex-col border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden md:flex-row${
              !block.imageLeft ? " md:flex-row-reverse" : ""
            }`}
          >
            {/* Image half */}
              <div className="relative w-full md:w-[60%] min-h-[240px] md:min-h-[500px] overflow-hidden flex-shrink-0">
                {"images" in block ? (
                  <SpeakerSlideshow images={block.images} captions={block.captions} />
                ) : (
                  <>
                    <img
                      src={block.src}
                      alt={block.caption}
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-midnight/40" />
                  </>
                )}
                {! ("images" in block) && (
                  <span className="absolute bottom-4 left-4 text-[9px] font-bold tracking-[0.2em] uppercase text-white/50 bg-black/40 px-2 py-1 rounded-sm">
                    {block.caption}
                  </span>
                )}
              </div>

            {/* Text half */}
            <div
              className="w-full md:w-[40%] px-8 md:px-14 py-12 md:py-16 flex flex-col justify-center gap-4 bg-white dark:bg-midnight"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-bfb-blue/70">
                  {block.eyebrow}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-silver">
                  {block.title}
                </h3>
              </div>
              <p className="text-slate-500 dark:text-silver/55 leading-relaxed font-light text-sm max-w-md whitespace-pre-line">
                {block.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
