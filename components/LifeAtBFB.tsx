"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { SpeakerSlideshow } from "./SpeakerSlideshow";

const blocks = [
  {
    title: "Intensive Training",
    body: "We train our members on the fundamentals of finance. It starts with our 10-week accelerator program. Instead of simply learning theory, we focus on practical skills like real-time Excel modeling & a final capstone project, where recruits have to pitch a company of their choice. \n\nAfter graduating, members are required either to join a client project (see below) or present on a finance topic they’re passionate about. Through getting hands-on experience and learning to verbalize what they’ve learned, we reinforce their attained knowledge so they can use it in their future careers.",
    images: [
      "/capstone/bfb-capstone.jpg",
      "/assorted/bfb-general-meeting.jpg",
    ],
    captions: ["Capstone Projects", "General Meetings"],
    imageLeft: true,
  },
  {
    title: "Experiential Learning",
    body: "We believe that the best way to learn is with hands-on opportunities, which we offer via member-led quarterly & overarching projects. Overarching projects are major internal-facing year-long projects (like our algorithmic trading team), while quarterly projects are shorter, external-facing projects that include real-money pitch competitions & real client projects. \n\nWith all these opportunities, our members attain a hands-on understanding of the industry they’re interested in.",
    images: [
      "/group-photo/Berkshire Hathaway.jpg",
      "/assorted/Quarterly Project - Private Credit.jpeg",
      "/assorted/Quarterly Project - Stock Pitch.jpeg",
    ],
    captions: [
      "Annual Berkshire Hathaway Trip",
      "Quarterly Project - Private Credit",
      "Quarterly Project - Stock Pitch",
    ],
    imageLeft: false,
  },
  {
    title: "Professional Network",
    body: "Joining BFB means tapping into a vast professional network, as BFB alumni go on to some of the most competitive roles in the industry across banking, markets, investments, and beyond.",
    list: [
      "Investment Banking",
      "Sales & Trading",
      "Economic Research",
      "Asset Management",
      "Consulting & Advisory",
      "Private Equity",
    ],
    images: [
      "/speakers/Horizontal Anderson Speaker Photo.jpeg",
      "/speakers/jpm speaker.jpeg",
    ],
    captions: ["Anderson Professor", "Goldman Sachs Speaker"],
    imageLeft: true,
  },
  {
    title: "Quantitative Rigor",
    body: "For those interested in diving deeper into quantitative finance, the Bruin Algorithmic Insights (BAI) Team is a perfect fit. From hands-on, year-long projects like smartComps (a ML-based valuation tool) to our annual algorithmic trading competition, there is a project perfect for everyone. \n\nWe take pride in fostering a culture of innovation and learning, where both novices and experts can contribute and grow. So, no matter where you're at, there are plenty of opportunities to challenge yourself in quantitative finance.",
    images: ["/quant/quant-photo.jpg", "/quant/smartComps-photo.png"],
    captions: ["AI Overview Presentation", "'25/'26 Project - smartComps"],
    imageLeft: false,
  },
  {
    title: "Dynamic Community",
    body: "At BFB, we believe that our greatest strengths are found in our collective community. We prioritize the development of the person behind the professional, ensuring that every member is backed by a network of peers who are as invested in each other's success as they are in their own. \n\nThis spirit of camaraderie is the heartbeat of our organization. Through collaborative group projects, big-little pairings, weekly social events, and quarterly retreats, we create an environment where mentorship happens naturally and friendships run deep.",
    images: ["/group-photo/joshua-tree-social.jpeg", "/group-photo/TopGolf-group-photo.jpeg"],
    captions: ["Joshua Tree Retreat", "Top Golf"],
    imageLeft: true,
  },
] as const;

export default function LifeAtBFB() {
  return (
    <section id="approach" className="bg-white dark:bg-midnight">
      {/* Section header */}
      <div className="py-section px-gutter text-center">
        <motion.span
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="block w-full text-center text-eyebrow font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-3"
        >
          Our Philosophy
        </motion.span>
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-h2 font-serif text-slate-900 dark:text-silver mb-4"
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
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-block py-section px-gutter">
        {blocks.map((block) => (
          <motion.div
            key={block.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`flex flex-col border border-slate-100 dark:border-white/10 rounded-xl overflow-hidden lap:flex-row ${
              !block.imageLeft ? "lap:flex-row-reverse" : ""
            }`}
          >
            {/* Image half */}
            <div className="relative w-full mx-auto lap:w-[55%] lap:self-center h-[34svh] lap:h-auto lap:aspect-[16/10] overflow-hidden">
              <SpeakerSlideshow images={block.images} captions={block.captions} />
            </div>

            {/* Text half */}
            <div className="w-full lap:w-[45%] p-card flex flex-col justify-center gap-5 bg-white dark:bg-midnight">
              <h3 className="text-h3 font-serif text-slate-900 dark:text-silver leading-tight">
                {block.title}
              </h3>
              <div className="flex flex-col gap-4">
                <p className="text-slate-500 dark:text-silver/55 leading-relaxed font-light text-body max-w-xl whitespace-pre-line">
                  {block.body}
                </p>
                {"list" in block && block.list && (
                  <ul className="space-y-2 text-slate-600 dark:text-silver/70 text-body font-light">
                    {block.list.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-bfb-blue mt-1.5 h-1.5 w-1.5 rounded-full bg-bfb-blue flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
