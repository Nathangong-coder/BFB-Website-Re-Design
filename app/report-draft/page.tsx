import React from 'react';

export default function AnnualReportDraft() {
  return (
    <div className="min-h-screen bg-zinc-900 py-12 px-4 flex flex-col items-center gap-12">
      {/* Wrapper to simulate Portrait Pages (A4 Aspect Ratio) */}
      <div className="flex flex-col gap-12 w-full max-w-[800px]">

        {/* PAGE 1: COVER */}
        <section className="relative aspect-[1/1.414] w-full bg-white shadow-2xl overflow-hidden flex items-center justify-start">
          <div className="absolute inset-0 z-0">
            <img
              src="/report-draft/1.png"
              alt="Report Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-midnight/30"></div>
          </div>

          <div className="relative w-1/3 h-full bg-white/95 p-12 flex flex-col justify-center backdrop-blur-sm z-10 shadow-xl">
            <div className="text-bfb-blue text-xs font-bold tracking-widest uppercase mb-4">UCLA BFB</div>
            <h1 className="font-serif text-5xl text-midnight leading-tight mb-8">
              Bruins in<br />
              Finance and<br />
              Banking
            </h1>
            <div className="font-sans font-bold text-md text-midnight/80">
              2026 ANNUAL REPORT
            </div>
          </div>
        </section>

        {/* PAGE 2: TOC */}
        <section className="relative aspect-[1/1.414] w-full bg-slate-100 shadow-2xl overflow-hidden p-16">
          <h2 className="font-sans font-black text-8xl text-midnight/10 uppercase tracking-tighter mb-12">
            Contents
          </h2>

          <div className="space-y-12">
            {[
              { num: "01", title: "Our Leadership", desc: "A letter from our President and overview of our 2026-2027 board", img: "/report-draft/5.png" },
              { num: "02", title: "Club Overview", desc: "Insights into our club structure and recruitment", img: "/report-draft/3.png" },
              { num: "03", title: "Class of 2029", desc: "Introducing our new member cohorts", img: "/report-draft/4.png" },
              { num: "04", title: "Training Program", desc: "Preparing members for finance careers", img: "/report-draft/2.png" },
            ].map((item, idx) => (
              <div key={idx} className="group relative flex items-center gap-8">
                <span className="font-sans text-7xl font-black text-midnight/10 absolute -left-4 -top-4 select-none pointer-events-none">
                  {item.num}
                </span>
                <div className="relative z-10 flex items-center gap-8 pt-4">
                  <img
                    src={item.img}
                    className="w-16 h-16 rounded-full object-cover border-2 border-bfb-blue shadow-md group-hover:scale-110 transition-transform"
                    alt={item.title}
                  />
                  <div>
                    <h3 className="font-sans text-2xl font-bold text-bfb-blue mb-1 group-hover:translate-x-2 transition-transform">
                      {item.title}
                    </h3>
                    <p className="font-serif text-md text-midnight/70">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAGE 3: LEADERSHIP (The "Asymmetric" Layout) */}
        <section className="relative aspect-[1/1.414] w-full bg-white shadow-2xl overflow-hidden p-16">
          <div className="relative">
            <h2 className="font-sans font-black text-7xl text-midnight leading-none mb-16">
              Our<br />
              <span className="text-bfb-blue">Leadership</span>
            </h2>

            <div className="grid grid-cols-12 gap-8 items-start">
              {/* Featured Leader (President) */}
              <div className="col-span-5 relative group">
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-bfb-blue z-0"></div>
                <img
                  src="/report-draft/5.png"
                  className="relative z-10 w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="President"
                />
                <div className="mt-4">
                  <h4 className="font-sans font-bold text-xl text-midnight">Ashley Keller</h4>
                  <p className="font-serif italic text-bfb-blue">Président</p>
                </div>
              </div>

              {/* The "Offset" Grid for others */}
              <div className="col-span-7 grid grid-cols-2 gap-6">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`relative ${i % 2 === 0 ? 'mt-8' : ''}`}>
                    <img
                      src="/report-draft/5.png"
                      className="w-full h-40 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all"
                      alt="Board Member"
                    />
                    <div className="mt-2">
                      <h4 className="font-sans font-bold text-sm text-midnight">Board Member {i}</h4>
                      <p className="font-serif text-xs text-midnight/60">Director of Operations</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 4: PHOTO SLIDE (The "Moodboard" Layout) */}
        <section className="relative aspect-[1/1.414] w-full bg-slate-100 shadow-2xl overflow-hidden p-12">
          <div className="relative h-full w-full">
            {/* Anchor Image */}
            <img
              src="/report-draft/10.png"
              className="absolute top-10 left-10 w-2/3 h-1/2 object-cover shadow-2xl z-10 border-8 border-white"
              alt="Main Photo"
            />

            {/* Overlapping candid images */}
            <img
              src="/report-draft/11.png"
              className="absolute top-40 right-10 w-1/3 h-1/3 object-cover shadow-xl z-20 border-4 border-white rotate-3"
              alt="Photo 2"
            />
            <img
              src="/report-draft/12.png"
              className="absolute bottom-20 left-20 w-1/3 h-1/3 object-cover shadow-xl z-20 border-4 border-white -rotate-6"
              alt="Photo 3"
            />

            {/* Elegant Caption */}
            <div className="absolute bottom-12 right-12 max-w-xs text-right">
              <p className="font-serif italic text-lg text-midnight/80 leading-relaxed">
                "Capturing the moments that define our professional growth and lifelong bonds."
              </p>
              <div className="w-12 h-1 bg-bfb-blue ml-auto mt-4"></div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
