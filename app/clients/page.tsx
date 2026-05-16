"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Maximize2, X, CheckCircle2, ChevronLeft, ChevronRight, Target, Lightbulb } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function ClientsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    { src: "/decks/schwab/charles-schwab-title.png", title: "Title Slide" },
    { src: "/decks/schwab/charles-schwab-contents.png", title: "Table of Contents" },
    { src: "/decks/schwab/charles-schwab-why-now.png", title: "The Opportunity" },
    { src: "/decks/schwab/charles-schwab-industry-analysis.png", title: "Industry Analysis" },
    { src: "/decks/schwab/charles-schwab-types-of-coins.png", title: "Types of Digital Assets" },
    { src: "/decks/schwab/charles-schwab-comparisons.png", title: "Comparative Analysis" },
    { src: "/decks/schwab/charles-schwab-price-trends.png", title: "Market Price Trends" },
    { src: "/decks/schwab/charles-schwab-headwinds.png", title: "Market Headwinds" },
    { src: "/decks/schwab/charles-schwab-stablecoin-overview.png", title: "Stablecoin Overview" },
    { src: "/decks/schwab/charles-schwab-stablecoin-main-types.png", title: "Main Stablecoin Types" },
    { src: "/decks/schwab/charles-schwab-stablecoin-future.png", title: "The Future of Stablecoins" },
    { src: "/decks/schwab/charles-schwab-regulatory-future.png", title: "Regulatory Landscape" },
    { src: "/decks/schwab/charles-schwab-historical-breakdown.png", title: "Historical Performance" },
    { src: "/decks/schwab/charles-schwab-in-practice.png", title: "Institutional Implementation" },
    { src: "/decks/schwab/charles-schwab-client-education.png", title: "Client Education Strategy" },
    { src: "/decks/schwab/charles-schwab-thank-you.png", title: "Conclusion" },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 px-6 text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-50 dark:bg-midnight" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6"
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-bfb-blue dark:text-bfb-blue/70">
              Institutional Partnerships
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 dark:text-silver leading-tight">
              Bridging Talent and <span className="text-bfb-blue">Strategy</span>
            </h1>
            <p className="text-slate-500 dark:text-silver/60 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              BFB connects leading institutions with an elite pipeline of UCLA&apos;s most ambitious finance and technology talent to drive real-world impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-32 px-6 sm:px-6 lg:px-8 bg-white dark:bg-midnight">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8"
            >
              <h2 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver leading-tight">
                The BFB <span className="text-bfb-blue">Edge</span>
              </h2>
              <p className="text-slate-500 dark:text-silver/60 text-lg leading-relaxed">
                We don&apos;t just provide interns; we provide a specialized force of students trained in the intersection of finance, data science, and institutional strategy.
              </p>

              <div className="grid gap-6">
                {[
                  {
                    title: "Elite Talent Pipeline",
                    desc: "Direct access to the top 1% of UCLA undergraduates specializing in finance and banking."
                  },
                  {
                    title: "Technical Rigor",
                    desc: "Rigorous training in Quant, AI, and advanced financial modeling that exceeds standard academic curricula."
                  },
                  {
                    title: "Execution Excellence",
                    desc: "A proven track record of delivering high-stakes institutional projects with professional-grade precision."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="text-bfb-blue" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-silver">{item.title}</h4>
                      <p className="text-slate-500 dark:text-silver/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="relative z-10 aspect-square rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-12 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-bfb-blue/5 via-transparent to-gold/5" />

                <div className="relative z-10 text-center flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-bfb-blue rounded-2xl flex items-center justify-center shadow-lg shadow-bfb-blue/20 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    <Target className="text-white" size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif text-slate-900 dark:text-silver">Institutional Impact</h3>
                    <div className="h-1 w-12 bg-bfb-blue mx-auto rounded-full" />
                  </div>
                  <p className="text-slate-500 dark:text-silver/60 max-w-xs text-sm leading-relaxed">
                    Driving measurable value through data-driven insights and strategic talent integration.
                  </p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-gold/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-bfb-blue/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Studies Section - Exclusive Focus on Schwab */}
      <section className="py-32 px-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6">
              Featured Case Study
            </h2>
            <p className="text-slate-500 dark:text-silver/60 text-lg max-w-2xl mx-auto">
              A deep dive into our partnership with Charles Schwab, delivering strategic insights on alternative assets.
            </p>
          </div>

          {/* Updated Grid with items-stretch for equal height */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Left: Interactive Slide Viewer */}
            <div className="lg:col-span-7 flex">
              <div className="relative w-full aspect-[16/10] bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group flex">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={slides[currentSlide].src}
                      alt={slides[currentSlide].title}
                      className="w-full h-full object-contain bg-white dark:bg-midnight"
                    />
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded">
                      {slides[currentSlide].title}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute inset-y-0 left-0 flex items-center px-4 z-20">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white/80 dark:bg-midnight/80 text-slate-900 dark:text-silver shadow-md hover:bg-white dark:hover:bg-midnight transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 z-20">
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white/80 dark:bg-midnight/80 text-slate-900 dark:text-silver shadow-md hover:bg-white dark:hover:bg-midnight transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-bfb-blue transition-all duration-300 z-20" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
              </div>
            </div>

            {/* Right: Project Details - Now stretching to match viewer height */}
            <div className="lg:col-span-5 flex flex-col h-full gap-8">
              <div className="p-8 bg-white dark:bg-midnight rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-6 text-bfb-blue">
                  <Target size={20} />
                  <h4 className="font-bold uppercase tracking-wider text-sm">The Client Need</h4>
                </div>
                <p className="text-slate-600 dark:text-silver/70 leading-relaxed mb-8">
                  Charles Schwab sought a comprehensive rundown of alternative assets, specifically focusing on <span className="font-bold text-slate-900 dark:text-silver">futures markets</span>, to present as educational and strategic material for their high-net-worth clients.
                </p>

                <div className="flex items-center gap-3 mb-6 text-bfb-blue">
                  <Lightbulb size={20} />
                  <h4 className="font-bold uppercase tracking-wider text-sm">Our Approach</h4>
                </div>
                <p className="text-slate-600 dark:text-silver/70 leading-relaxed">
                  BFB delivered an institutional-grade analysis, synthesizing complex derivatives data into a client-facing narrative that balanced technical rigor with accessibility.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="/decks/schwab-deck.pptx"
                  download
                  className="flex items-center justify-center gap-2 w-full py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all hover:-translate-y-1 shadow-lg shadow-bfb-blue/20"
                >
                  <Download size={18} />
                  Download Full Deck
                </a>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="flex items-center justify-center gap-2 w-full py-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-silver/80 font-bold rounded-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <Maximize2 size={18} />
                  Open in Full Screen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center bg-white dark:bg-midnight border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-8">
            Ready to Scale Your Impact?
          </h2>
          <p className="text-slate-500 dark:text-silver/60 text-lg mb-12">
            Partner with BFB to access the next generation of financial leaders.
          </p>
          <a
            href="/contact"
            className="inline-block px-12 py-5 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-bfb-blue/20"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Full Screen Lightbox */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-8 right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[110]"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-6xl aspect-[16/10] group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src={slides[currentSlide].src}
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/1920x1080?text=Upload+Slide+Images+to+Public+Folder";
                  }}
                />
              </AnimatePresence>

              {/* Fullscreen Nav */}
              <div className="absolute inset-y-0 left-0 flex items-center px-4">
                <button
                  onClick={prevSlide}
                  className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={40} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center px-4">
                <button
                  onClick={nextSlide}
                  className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={40} />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 text-white">
              <span className="text-lg font-serif opacity-80">{slides[currentSlide].title}</span>
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${currentSlide === i ? "w-8 bg-bfb-blue" : "w-2 bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
