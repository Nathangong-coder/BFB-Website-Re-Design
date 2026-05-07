"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const phrases = [
  "Real Clients.",
  "Real Fields.",
  "Real Placements.",
  "Bruins in Finance and Banking.",
];
const TYPE_MS = 60;
const DELETE_MS = 30;
const PAUSE_MS = 1500;

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (settled) return;
    const target = phrases[idx];

    if (!deleting) {
      if (text.length < target.length) {
        const t = setTimeout(() => setText(target.slice(0, text.length + 1)), TYPE_MS);
        return () => clearTimeout(t);
      }
      if (idx === phrases.length - 1) {
        setSettled(true);
        return;
      }
      const t = setTimeout(() => setDeleting(true), PAUSE_MS);
      return () => clearTimeout(t);
    }

    if (text.length > 0) {
      const t = setTimeout(() => setText(text.slice(0, -1)), DELETE_MS);
      return () => clearTimeout(t);
    }
    setIdx((i) => i + 1);
    setDeleting(false);
  }, [text, deleting, idx, settled]);

  return (
    <section className="relative h-[880px] flex flex-col items-center justify-center overflow-hidden pt-20 pb-8 bg-midnight">
      {/* Background Photo Section */}
      <div className="absolute inset-0 z-0">
        <img
          src="/group-photo/bfb-group-photo.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-[center_20%] opacity-40 grayscale-[0.5]"
        />
        {/* Dark blue overlay for maximum text pop */}
        <div className="absolute inset-0 bg-midnight/70" />
        <div className="absolute inset-0 bg-bfb-blue/30" />
      </div>

      {/* Text Section - Centered Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-10"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/60">
            UCLA&apos;s Only All-Encompassing Finance Organization
          </span>

          <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] min-h-[1.2em] flex items-center justify-center max-w-6xl mx-auto">
            <span>{text}</span>
            {!settled && (
              <span className="ml-1 inline-block w-[3px] h-[0.8em] bg-white align-middle animate-pulse" />
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: settled ? 1 : 0 }}
            transition={{ duration: 0.7 }}
            className="text-white/55 text-base leading-relaxed font-light max-w-2xl"
          >
            Preparing UCLA undergraduates for elite careers across finance — through
            technical rigor, real-world exposure, and an unmatched alumni network.
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator - positioned at the bottom of the section */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        onClick={() =>
          window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })
        }
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40 hover:text-white/75 transition-colors duration-300 z-20"
        aria-label="Scroll down"
      >
        <span className="text-[9px] font-bold tracking-[0.25em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </section>
  );
}
