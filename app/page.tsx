import Link from "next/link";
import Hero from "@/components/Hero";
import LifeAtBFB from "@/components/LifeAtBFB";
import DiversePlacements from "@/components/DiversePlacements";
import PlacementsTicker from "@/components/PlacementsTicker";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <LifeAtBFB />
      <DiversePlacements />
      <PlacementsTicker />

      {/* Apply CTA */}
      <section id="apply" className="relative py-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-midnight" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bfb-blue/25 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-bfb-blue/[0.05] dark:bg-bfb-blue/[0.07] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-6">
            Applications Open
          </span>
          <h2
            className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6 leading-tight"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Join the Legacy
          </h2>
          <p className="text-slate-500 dark:text-silver/50 text-lg mb-12 max-w-md mx-auto leading-relaxed font-light">
            We recruit the most ambitious students at UCLA. Ready to take the first step?
          </p>
          <Link
            href="/join"
            className="inline-block px-12 py-5 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-bfb-blue/20"
          >
            Begin Application
          </Link>
        </div>
      </section>
    </div>
  );
}
