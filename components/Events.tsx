"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/assorted/bfb-general-meeting.jpg",
    label: "General Meetings",
    description: "Weekly sessions covering markets, modeling, and career strategy",
  },
  {
    src: "/assorted/bfb-alum-speaker.jpg",
    label: "Alumni Speakers",
    description: "Industry professionals sharing firsthand experience from top firms",
  },
  {
    src: "/capstone/bfb-capstone.jpg",
    label: "Self-Selected Projects",
    description: "Company partnerships, quant modeling, teaching, and more",
  },
];

const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Events() {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="bg-slate-50 dark:bg-[#080C18] pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto pt-16">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-bfb-blue mb-4 block">
            Events &amp; Community
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-silver">
            Life at BFB
          </h2>
        </div>

        {/* Slide container */}
        <div className="relative rounded-sm overflow-hidden aspect-[4/3] md:aspect-[16/9]">
          <AnimatePresence mode="sync">
            <motion.div
              key={current}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={slides[current].src}
                alt={slides[current].label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/25 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7 md:p-10">
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-bfb-blue/90 mb-2">
                  {slides[current].label}
                </p>
                <p className="text-white/85 text-sm leading-relaxed max-w-md font-light">
                  {slides[current].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/25 text-white hover:bg-black/45 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/25 text-white hover:bg-black/45 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-bfb-blue w-6"
                  : "bg-slate-300 dark:bg-white/25 w-1.5 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
