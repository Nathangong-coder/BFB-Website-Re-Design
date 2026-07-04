"use client";

	import React, { useState, useEffect } from "react";
	import { motion, AnimatePresence } from "framer-motion";
	import { Download, Maximize2, X, CheckCircle2, ChevronLeft, ChevronRight, Target, Lightbulb } from "lucide-react";
	import { fadeInUp } from "@/lib/animations";

	export default function ClientsPage() {
	  const [currentSlide, setCurrentSlide] = useState(0);
	  const [isFullscreen, setIsFullscreen] = useState(false);

	  const slides = [
	    {
	      src: "/decks/schwab/charles-schwab-title.png",
	      title: "Overview",
	      purpose: "Establish the need for a professional framework to bridge the gap between HNW client interest and the technical complexity of crypto.",
	      problemSolution: "Problem: Charles Schwab's high-net-worth clients are increasingly interested in alternative assets but find them too complex to navigate safely. Solution: BFB developed an institutional-grade education framework to demystify crypto, translating technical jargon into strategic insights for portfolio integration."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-contents.png",
	      title: "Table of Contents",
	      purpose: "Structuring the educational journey into a logical roadmap to reduce cognitive load and set clear expectations for the client engagement."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-why-now.png",
	      title: "The Opportunity",
	      purpose: "Identifying timely macro-economic catalysts—such as inflation hedging, real-world asset tokenization, and shifting political legitimacy—that make crypto a strategic priority."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-industry-analysis.png",
	      title: "Industry Analysis",
	      purpose: "Defining the fundamental mechanics of blockchain and digital currency to remove the 'black box' perception and build a technical foundation for HNW clients."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-types-of-coins.png",
	      title: "Types of Digital Assets",
	      purpose: "Categorizing assets into Store of Value (BTC), Smart Contract Platforms (ETH), and Speculative assets to help clients align investments with their specific risk profiles."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-comparisons.png",
	      title: "Comparative Analysis",
	      purpose: "Providing an empirical side-by-side analysis of value bases and risk profiles, allowing for precise weighting within a diversified institutional portfolio."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-price-trends.png",
	      title: "Market Price Trends",
	      purpose: "Visualizing historical performance to shift the narrative from short-term speculation to the long-term structural growth of the digital asset ecosystem."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-headwinds.png",
	      title: "Market Headwinds",
	      purpose: "Proactively addressing regulatory uncertainty, volatility, and security risks to maintain institutional trust through transparent and rigorous risk disclosure."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-stablecoin-overview.png",
	      title: "Stablecoin Overview",
	      purpose: "Introducing the 'liquidity bridge'—explaining how dollar-pegged assets enable the benefits of crypto utility while mitigating traditional market volatility."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-stablecoin-main-types.png",
	      title: "Main Stablecoin Types",
	      purpose: "Differentiating between fiat-backed and crypto-collateralized models to emphasize the importance of reserve transparency and systemic capital safety."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-stablecoin-future.png",
	      title: "The Future of Stablecoins",
	      purpose: "Projecting the evolution of stablecoins into core global payment infrastructure as regulatory clarity improves and institutional adoption scales."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-regulatory-future.png",
	      title: "Regulatory Landscape",
	      purpose: "Navigating legal shifts—including US Spot ETFs and the GENIUS Act—to demonstrate crypto's transition from a fringe asset to a regulated security class."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-historical-breakdown.png",
	      title: "Historical Performance",
	      purpose: "Framing crypto not as a transient fad, but as a 15-year maturing structural shift that is increasingly integrated into global financial systems."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-in-practice.png",
	      title: "Institutional Implementation",
	      purpose: "Translating theory into action by providing concrete 1-5% allocation targets and defining the specific portfolio roles of return enhancers and liquidity tools."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-client-education.png",
	      title: "Client Education Strategy",
	      purpose: "Equipping wealth managers with the narrative tools and suitability frameworks necessary to communicate complex risk-fit profiles to HNW clients."
	    },
	    {
	      src: "/decks/schwab/charles-schwab-thank-you.png",
	      title: "Conclusion",
	      purpose: "Synthesizing the core thesis into a final professional call to action, emphasizing BFB's role in delivering institutional-grade strategic value."
	    },
	  ];

	  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
	  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

	  useEffect(() => {
	    if (!isFullscreen) return;
	    document.body.style.overflow = "hidden";
	    const handleKeyDown = (e: KeyboardEvent) => {
	      if (e.key === "ArrowRight") nextSlide();
	      if (e.key === "ArrowLeft") prevSlide();
	      if (e.key === "Escape") setIsFullscreen(false);
	    };
	    window.addEventListener("keydown", handleKeyDown);
	    return () => {
	      document.body.style.overflow = "";
	      window.removeEventListener("keydown", handleKeyDown);
	    };
	  }, [isFullscreen]);

	  return (
	    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
	      {/* Hero Section */}
	      <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 px-6 text-center bg-white dark:bg-midnight">
	        <div className="absolute inset-0 z-0">
	          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.03] via-transparent to-transparent" />
	          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl opacity-50" />
	          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
	        </div>

	        <div className="relative z-10 max-w-4xl mx-auto">
	          <motion.div
	            variants={fadeInUp}
	            initial="hidden"
	            animate="visible"
	            className="flex flex-col items-center gap-8"
	          >
	            <div className="flex flex-col items-center gap-3">
	              <span className="block w-full text-center text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue dark:text-bfb-blue/70">
	                Institutional Partnerships
	              </span>
	            </div>

	            <h1 className="text-hero font-serif text-slate-900 dark:text-silver leading-tight text-center">
	              Work With Us
	            </h1>

	            <div className="w-24 h-px bg-gradient-to-r from-transparent via-bfb-blue to-transparent opacity-30" />

	            <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50">
	              <p className="text-body-lg font-light leading-relaxed">
	                With members specialized in all fields of finance, our club brings together a powerhouse of student talent specializing in all types of finance, creating an intellectual hub ready to tackle any challenge with fresh, innovative perspectives. Backed by advanced financial modeling skills and a strict standard of professionalism, this blend of technical expertise and diverse viewpoints uniquely positions us to provide premier pro bono financial and strategic support to firms navigating today&apos;s economic landscape.
	              </p>
	            </div>
	          </motion.div>
	        </div>
	      </section>

	      {/* Capabilities Section */}
	      <section className="py-section px-gutter bg-white dark:bg-midnight">
	        <div className="max-w-7xl mx-auto">
	          <div className="text-center mb-12">
	            <motion.h2
	              variants={fadeInUp}
	              initial="hidden"
	              whileInView="visible"
	              className="text-h2 font-serif text-slate-900 dark:text-silver mb-6"
	            >
	              Our Capabilities
	            </motion.h2>
	            <motion.p
	              variants={fadeInUp}
	              initial="hidden"
	              whileInView="visible"
	              className="text-slate-500 dark:text-silver/60 text-body max-w-2xl mx-auto"
	            >
	              We provide high-impact financial and strategic support across diverse domains.
	            </motion.p>
	          </div>

	          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
	            {[
	              {
	                title: "Financial Modeling",
	                desc: "Advanced DCF, LBO, and Three-Statement models tailored for institutional decision-making.",
	                icon: <Target className="text-bfb-blue" size={24} />
	              },
	              {
	                title: "Strategic Analysis",
	                desc: "Deep-dive industry research and competitive benchmarking to identify growth opportunities.",
	                icon: <Lightbulb className="text-bfb-blue" size={24} />
	              },
	              {
	                title: "Quantitative Research",
	                desc: "Data-driven insights leveraging Python and AI to analyze complex market trends.",
	                icon: <Maximize2 className="text-bfb-blue" size={24} />
	              },
	              {
	                title: "Institutional Strategy",
	                desc: "Designing frameworks for asset allocation and operational efficiency.",
	                icon: <CheckCircle2 className="text-bfb-blue" size={24} />
	              },
	              {
	                title: "Market Intelligence",
	                desc: "Real-time tracking of macroeconomic shifts and alternative asset classes.",
                icon: <Target className="text-bfb-blue" size={24} />
	              },
	              {
	                title: "Professional Execution",
	                desc: "Deliverables crafted to institutional standards of precision and professionalism.",
	                icon: <CheckCircle2 className="text-bfb-blue" size={24} />
	              }
	            ].map((item, i) => (
	              <motion.div
	                key={i}
	                initial={{ opacity: 0, y: 20 }}
	                whileInView={{ opacity: 1, y: 0 }}
	                transition={{ delay: i * 0.1 }}
	                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-bfb-blue/50 transition-colors group"
	              >
	                <div className="mb-4 p-3 bg-white dark:bg-midnight rounded-lg w-fit shadow-sm group-hover:scale-110 transition-transform">
	                  {item.icon}
	                </div>
	                <h3 className="text-body-lg font-serif font-bold text-slate-900 dark:text-silver mb-3 text-center md:text-left">{item.title}</h3>
	                <p className="text-slate-500 dark:text-silver/60 leading-relaxed text-center md:text-left">{item.desc}</p>
	              </motion.div>
	            ))}
	          </div>
	        </div>
	      </section>

	      {/* Process Timeline Section */}
	      <section className="py-section px-gutter bg-white dark:bg-midnight">
	        <div className="max-w-7xl mx-auto">
	          <div className="text-center mb-16">
	            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mb-6">
	              Engagement Process
	            </h2>
	            <p className="text-slate-500 dark:text-silver/60 text-body max-w-2xl mx-auto">
	              Our structured approach ensures institutional-grade results from kickoff to final delivery.
	            </p>
	          </div>

	          <div className="relative overflow-x-auto pb-12">
	            <div className="flex items-center gap-12 px-12 min-w-max relative">
	              {/* Horizontal Line */}
	              <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

	              {[
	                {
	                  step: "01",
	                  title: "Strategic Alignment",
	                  desc: "We define core objectives, key deliverables, and success metrics with our partners."
	                },
	                {
	                  step: "02",
	                  title: "Deep-Dive Research",
	                  desc: "Our team conducts exhaustive market analysis and data gathering across specialized domains."
	                },
	                {
	                  step: "03",
	                  title: "Iterative Development",
	                  desc: "We build models and frameworks, refining them through rigorous internal review."
	                },
	                {
	                  step: "04",
	                  title: "Final Delivery",
	                  desc: "Presentation of high-fidelity deliverables and strategic recommendations."
	                },
	              ].map((item, i) => (
	                <div key={i} className="relative z-10 flex flex-col items-center gap-8 shrink-0 w-72">
	                  <motion.div
	                    initial={{ opacity: 0, y: 10 }}
	                    whileInView={{ opacity: 1, y: 0 }}
	                    transition={{ duration: 0.5, delay: i * 0.1 }}
	                    className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 shadow-sm text-center"
	                  >
	                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-silver mb-2">{item.title}</h3>
	                    <p className="text-slate-500 dark:text-silver/60 leading-relaxed text-sm">{item.desc}</p>
	                  </motion.div>

	                  <div className="relative z-20 flex items-center justify-center shrink-0">
	                    <div className="w-12 h-12 rounded-full bg-white dark:bg-midnight border-2 border-bfb-blue flex items-center justify-center shadow-sm">
	                      <span className="text-bfb-blue font-bold text-xs">{item.step}</span>
	                    </div>
	                  </div>
	                  <div className="h-24" /> {/* Spacer to balance the layout */}
	                </div>
	              ))}
	            </div>
	          </div>
	        </div>
	      </section>

	      {/* Featured Work Section */}
	      <section className="py-section px-gutter bg-white dark:bg-midnight overflow-hidden">
	        <div className="max-w-7xl mx-auto">
	          <div className="text-center mb-6">
	            <h2 className="text-h2 font-serif text-slate-900 dark:text-silver mb-6">
	              Featured Work
	            </h2>
	            <p className="text-slate-500 dark:text-silver/60 text-body max-w-2xl mx-auto mb-12">
	              A look at how we translate technical expertise into strategic value.
	            </p>
	            <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto mb-4">
	              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 w-full">
	                <h4 className="font-bold uppercase tracking-wider text-sm text-bfb-blue mb-3 text-center">Project Overview</h4>
	                <p className="text-body text-slate-600 dark:text-silver/70 leading-relaxed">
	                  High-net-worth clients often perceive alternative investments as overly speculative. BFB developed an institutional-grade educational framework to demystify these complex assets and provide a clear, technical rationale for their inclusion in a diversified portfolio.
	                </p>
	              </div>
	            </div>
	          </div>

	          <div className="flex flex-col items-center gap-12">
	            <div className="relative w-full max-w-5xl group">
	              <div className="relative aspect-[16/10] bg-white dark:bg-midnight rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
	                <AnimatePresence mode="wait">
	                  <motion.img
	                    key={currentSlide}
	                    initial={{ opacity: 0, scale: 0.98 }}
	                    animate={{ opacity: 1, scale: 1 }}
	                    exit={{ opacity: 0, scale: 1.02 }}
	                    transition={{ duration: 0.4 }}
	                    src={slides[currentSlide].src}
	                    alt={slides[currentSlide].title}
	                    className="w-full h-full object-contain"
	                  />
				</AnimatePresence>

	                {/* Navigation Overlay */}
	                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
	                  <button
	                    onClick={prevSlide}
	                    className="p-3 rounded-full bg-black/50 text-white shadow-lg backdrop-blur-md hover:scale-110 transition-transform z-30 pointer-events-auto"
	                  >
	                    <ChevronLeft size={24} />
	                  </button>
	                  <button
	                    onClick={nextSlide}
	                    className="p-3 rounded-full bg-black/50 text-white shadow-lg backdrop-blur-md hover:scale-110 transition-transform z-30 pointer-events-auto"
	                    >
	                    <ChevronRight size={24} />
	                  </button>
	                </div>

	                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full z-10">
	                  Slide {currentSlide + 1} of {slides.length}
	                </div>
	              </div>

	              {/* Viewer Actions */}
	              <div className="flex items-center justify-between mt-6 px-2">
	                <div className="flex gap-2">
	                  {slides.map((_, i) => (
	                    <button
	                      key={i}
	                      onClick={() => setCurrentSlide(i)}
	                      className={`h-1.5 rounded-full transition-all ${currentSlide === i ? "w-8 bg-bfb-blue" : "w-2 bg-slate-300 dark:bg-slate-700"}`}
	                    />
	                  ))}
	                </div>
	                <button
	                  onClick={() => setIsFullscreen(true)}
	                  className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-silver/60 hover:text-bfb-blue transition-colors"
	                >
	                  <Maximize2 size={16} />
	                  Enter Case Study Analysis
	                </button>
	              </div>
	            </div>

	            <a
	              href="/decks/schwab-deck.pptx"
	              download
	              className="flex items-center justify-center gap-2 px-12 py-5 bg-bfb-blue text-white font-bold rounded-xl hover:bg-bfb-blue/90 transition-all hover:-translate-y-1 shadow-lg shadow-bfb-blue/20"
	            >
	              <Download size={18} />
	              Download Full Deck
	            </a>
	          </div>
	        </div>
	      </section>

	      {/* Full Screen Case Study Reader */}
	      <AnimatePresence>
	        {isFullscreen && (
	          <motion.div
	            initial={{ opacity: 0 }}
	            animate={{ opacity: 1 }}
	            exit={{ opacity: 0 }}
	            className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
	          >
	            <button
	              onClick={() => setIsFullscreen(false)}
	              className="absolute top-8 right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[110]"
	            >
	              <X size={32} />
	            </button>

	            {/* Main Content Area */}
	            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 md:p-12 gap-6 lg:gap-12 max-w-[1600px] mx-auto w-full">
	              {/* Analysis Panel */}
	              <div className="w-full lg:w-1/3 flex flex-col gap-4 md:gap-8 text-white order-1 lg:order-2">
	                <motion.div
	                  initial={{ opacity: 0, x: 20 }}
	                  animate={{ opacity: 1, x: 0 }}
	                  key={`title-${currentSlide}`}
	                  className="space-y-2 text-center lg:text-left"
	                >
	                  <span className="text-bfb-blue font-bold uppercase tracking-widest text-xs">Case Study Analysis</span>
	                  <h3 className="text-2xl md:text-3xl font-serif font-bold">{slides[currentSlide].title}</h3>
	                </motion.div>
	                <div className="space-y-6">
	                  <motion.div
	                    initial={{ opacity: 0, x: 20 }}
	                    animate={{ opacity: 1, x: 0 }}
	                    key={`purpose-${currentSlide}`}
	                    className="p-4 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
	                  >
	                    <div className="flex items-center gap-2 text-bfb-blue mb-4 justify-center lg:justify-start">
	                      <Target size={18} />
	                      <span className="text-xs font-bold uppercase tracking-[0.2em]">
	                        {currentSlide === 0 ? "Strategic Problem & Solution" : "Strategic Reasoning"}
	                      </span>
	                    </div>
	                    <p className="text-sm md:text-lg text-white/80 leading-relaxed font-light text-center lg:text-left">
	                      {currentSlide === 0
	                        ? (slides[currentSlide] as any).problemSolution
	                        : slides[currentSlide].purpose}
	                    </p>
	                  </motion.div>
				</div>
	              </div>
	              {/* Slide Viewer */}
	              <div className="relative w-full lg:w-2/3 aspect-[16/10] group order-2 lg:order-1">
	                <AnimatePresence mode="wait">
	                  <motion.img
	                    key={currentSlide}
	                    initial={{ opacity: 0, scale: 0.95 }}
	                    animate={{ opacity: 1, scale: 1 }}
	                    exit={{ opacity: 0, scale: 1.05 }}
	                    transition={{ duration: 0.4 }}
	                    src={slides[currentSlide].src}
	                    alt={slides[currentSlide].title}
	                    className="w-full h-full object-contain rounded-lg shadow-2xl"
	                  />
				</AnimatePresence>
	              </div>
	            </div>

	            {/* Bottom Control Bar */}
	            <div className="w-full bg-black/80 backdrop-blur-2xl border-t border-white/10 p-4 md:p-6 pb-12 flex flex-wrap items-center justify-center gap-6 max-w-7xl mx-auto">
	              <div className="flex items-center gap-4">
	                <button
	                  onClick={prevSlide}
	                  className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
	                >
	                  <ChevronLeft size={24} />
	                </button>
	                <div className="text-white/60 text-sm font-medium whitespace-nowrap">
	                  Slide <span className="text-white font-bold">{currentSlide + 1}</span> of {slides.length}
	                </div>
	                <button
	                  onClick={nextSlide}
	                  className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
	                >
	                  <ChevronRight size={24} />
	                </button>
	              </div>
	              <div className="flex gap-2 justify-center">
					{slides.map((_, i) => (
	                  <button
	                    key={i}
	                    onClick={() => setCurrentSlide(i)}
	                    className={`h-1.5 rounded-full transition-all ${currentSlide === i ? "w-8 bg-bfb-blue" : "w-2 bg-white/30"}`}
	                  />
	                ))}
	              </div>
	              <div className="flex items-center gap-4">
	                <button
	                  onClick={() => setIsFullscreen(false)}
	                  className="px-6 py-2 rounded-full bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors whitespace-nowrap"
	                >
	                  Exit Analysis
	                </button>
	              </div>
	            </div>
	          </motion.div>
	        )}
	      </AnimatePresence>
	    </div>
	  );
	}
