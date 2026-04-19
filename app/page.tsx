import Hero from "@/components/Hero";
import Approach from "@/components/Approach";
import Placements from "@/components/Placements";
import Team from "@/components/Team";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Approach />
      <Placements />
      <Team />

      {/* Apply Section */}
      <section id="apply" className="py-32 px-4 sm:px-6 lg:px-8 bg-midnight border-t border-glass">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-silver mb-8">Join the Legacy</h2>
          <p className="text-silver/60 text-lg mb-12">
            We recruit the most ambitious students at UCLA. Ready to take the first step?
          </p>
          <button className="px-12 py-5 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all transform hover:-translate-y-1 shadow-xl shadow-bfb-blue/20">
            Begin Application
          </button>
        </div>
      </section>
    </div>
  );
}
