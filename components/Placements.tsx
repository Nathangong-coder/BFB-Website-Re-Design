"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Year assignments based on bfbatucla.com groupings (2026: 10, 2025: 12, 2024: 6).
// Verify and reorder within each year array as needed.
const placementsByYear: Record<number, { name: string; member: string; industry: string; group: string; filename: string; type: "full-time" | "internship"; location: string }[]> = {
  2026: [
    { name: "Mizuho", member: "Jack Ren", industry: "Finance", group: "Investment Banking", filename: "mizuho.jpg", type: "full-time", location: "TBD" },
    { name: "Federal Reserve", member: "Jordan Lee", industry: "Economics", group: "Research", filename: "fed reserve.jpg", type: "full-time", location: "New York, NY" },
    { name: "UBS", member: "Miguel Quinones", industry: "Finance", group: "Investment Banking", filename: "ubs.jpg", type: "full-time", location: "New York, NY" },
    { name: "World Bank Group", member: "Zachary Pelikh", industry: "Finance", group: "Development", filename: "world-bank-group.webp", type: "internship", location: "Los Angeles, CA" },
    { name: "Google", member: "Harris Song", industry: "Tech", group: "Software Engineering", filename: "google.webp", type: "internship", location: "TBD" },
    { name: "Accenture", member: "Nams Doan", industry: "Consulting", group: "Consulting", filename: "accenture.jpg", type: "internship", location: "TBD" },
    { name: "BMO Capital Markets", member: "Jenaro Rodriguez", industry: "Finance", group: "Investment Banking", filename: "bmo.jpg", type: "internship", location: "New York, NY" },
    { name: "Amazon", member: "Alain Izawa", industry: "Tech", group: "Product Management", filename: "Amazon.png", type: "internship", location: "TBD" },
    { name: "Siemens Healthineers", member: "Kareina Zhao", industry: "Healthcare", group: "Financial Development", filename: "siemens healthineers.jpg", type: "internship", location: "TBD" },
    { name: "Barclays", member: "Ashley Hinkel", industry: "Finance", group: "Sales & Trading", filename: "barclays.jpg", type: "internship", location: "TBD" },
    { name: "Waymo", member: "Henry McNamara", industry: "Tech", group: "Software Engineering", filename: "waymo.jpg", type: "internship", location: "TBD" },
  ],
  2025: [
    { name: "JP Morgan Chase", member: "Charlotte Humphreys", industry: "Finance", group: "Risk Management", filename: "jp morgan.jpg", type: "full-time", location: "Newark, Delaware" },
    { name: "Charles Schwab", member: "Luke Garlick", industry: "Finance", group: "FP&A", filename: "charles-schwab.webp", type: "full-time", location: "Phoenix, AZ" },
    { name: "Deloitte", member: "Kartik Parab", industry: "Consulting", group: "Consulting", filename: "deloitte.jpg", type: "full-time", location: "Los Angeles, CA" },
    { name: "Georgia Tech", member: "Michael Thompson", industry: "Education", group: "Academic", filename: "Georgia-Tech.png", type: "full-time", location: "Atlanta, GA" },
    { name: "Hilltop", member: "Oriana Van Den Handel", industry: "Finance", group: "Investment Banking", filename: "hilltop.png", type: "full-time", location: "Austin, TX" },
    { name: "Imperial College London", member: "Francesca Moulds", industry: "Education", group: "Academic", filename: "imperial-college.jpg", type: "full-time", location: "London, England" },
    { name: "JP Morgan", member: "Christopher Dolak", industry: "Finance", group: "Investment Banking", filename: "jp morgan.jpg", type: "full-time", location: "New York, NY" },
    { name: "JP Morgan", member: "Katelyn Pool", industry: "Finance", group: "Commercial Banking", filename: "jp morgan.jpg", type: "full-time", location: "New York, NY" },
    { name: "Deloitte", member: "Gursahil Sran", industry: "Consulting", group: "Consulting", filename: "deloitte.jpg", type: "full-time", location: "Los Angeles, CA" },
    { name: "TCW", member: "Kyle Jurkowski", industry: "Finance", group: "Fixed Income", filename: "tcw.jpg", type: "full-time", location: "Los Angeles, CA" },
    { name: "Carollo", member: "Saksham Makin", industry: "Finance", group: "Investment Banking", filename: "carollo.jpg", type: "internship", location: "Los Angeles, CA" },
    { name: "Federal Reserve of New York", member: "Jordan Lee", industry: "Economics", group: "Economics Research", filename: "fed reserve.jpg", type: "internship", location: "New York, NY" },
    { name: "Stifel", member: "Alan Whitmoyer", industry: "Finance", group: "Wealth Management", filename: "stifel.jpg", type: "internship", location: "Brookfield, WI" },
    { name: "Deloitte", member: "Heschel Fernando", industry: "Finance", group: "Investment Banking", filename: "deloitte.jpg", type: "internship", location: "Los Angeles, CA" },
    { name: "Rivian", member: "Yulia Anashkina", industry: "Tech", group: "Software Engineering", filename: "rivian.webp", type: "internship", location: "Palo Alto, CA" },
    { name: "Scotiabank", member: "Jack Ren", industry: "Finance", group: "Corporate Banking", filename: "scotiabank.jpg", type: "internship", location: "New York, NY" },
    { name: "HCVT", member: "Richard Tucholski", industry: "Finance", group: "Investment Banking", filename: "hcvt.png", type: "internship", location: "Los Angeles, CA" },
    { name: "PwC", member: "Richard Tucholski", industry: "Finance", group: "Deal Analytics", filename: "pwc.jpg", type: "internship", location: "San Francisco, CA" },
    { name: "GIC", member: "Joanna Zhang", industry: "Finance", group: "Private Credit", filename: "gic.jpg", type: "internship", location: "Singapore" },
    { name: "Barclays", member: "Nandini Singh", industry: "Finance", group: "Investment Banking", filename: "barclays.jpg", type: "internship", location: "New York, NY" },
    { name: "TCW", member: "Shveenita Kanapathy", industry: "Finance", group: "Fixed Income", filename: "tcw.jpg", type: "internship", location: "Los Angeles, CA" },
    { name: "Hyundai", member: "Megan Nakasone", industry: "Automotive", group: "Product Planning", filename: "hyundai.webp", type: "internship", location: "TBD" },
    { name: "Citi", member: "Maria Bozhkova", industry: "Finance", group: "Investment Banking", filename: "citi.jpg", type: "internship", location: "New York, NY" },
    { name: "LinkedIn", member: "Lucie Plantevin", industry: "Tech", group: "Product Strategy", filename: "LinkedIn.png", type: "internship", location: "Sunnyvale, CA" },
    { name: "First Capital Securities", member: "Kareina Zhao", industry: "Finance", group: "Asset Management", filename: "first-capital-securities.webp", type: "internship", location: "Shenzhen, CN" },
  ],
  2024: [
    { name: "JP Morgan", member: "Natalie Smith", industry: "Finance", group: "Commercial Banking", filename: "jp morgan.jpg", type: "full-time", location: "Houston, TX" },
    { name: "Max Banjamin Partners", member: "Sanjum Dhaliwal", industry: "Real Estate", group: "Investment", filename: "MBP Partners.webp", type: "full-time", location: "Los Angeles, CA" },
    { name: "IEQ Capital", member: "Adit Gorawara", industry: "Finance", group: "Research", filename: "ieq-capital.png", type: "full-time", location: "Foster City, CA" },
    { name: "Morgan Stanley", member: "Kalani Seymore", industry: "Finance", group: "S&T", filename: "morgan stanley.jpg", type: "full-time", location: "New York, NY" },
    { name: "BMO", member: "Joanna Zhang", industry: "Finance", group: "Investment", filename: "bmo.jpg", type: "internship", location: "Los Angeles, CA" },
    { name: "KPMG", member: "Saksham Makin", industry: "Consulting", group: "Strategy", filename: "kpmg.jpg", type: "internship", location: "Los Angeles, CA" },
    { name: "Clifford Swan", member: "Luke Garlick", industry: "Finance", group: "Wealth Management", filename: "clifford-swan.webp", type: "internship", location: "Pasadena, CA" },
    { name: "Deloitte", member: "Kartik Parab", industry: "Consulting", group: "Consulting", filename: "deloitte.jpg", type: "internship", location: "Los Angeles, CA" },
    { name: "Stifel", member: "Michael Thompson", industry: "Finance", group: "Investment Banking", filename: "stifel.jpg", type: "internship", location: "Century City, CA" },
    { name: "Piper Sandler", member: "Oriana Van Den Handel", industry: "Finance", group: "Public Finance", filename: "piper-sandler.jpg", type: "internship", location: "Minneapolis, MN" },
    { name: "Avalerian Capital", member: "Francesca Moulds", industry: "Finance", group: "Private Equity", filename: "avalerian.webp", type: "internship", location: "Remote" },
    { name: "The O'Hagan Group", member: "Charlotte Humphreys", industry: "Finance", group: "Wealth Management", filename: "o-hagan-group.webp", type: "internship", location: "Bethlehem, PA" },
    { name: "JP Morgan", member: "Christopher Dolak", industry: "Finance", group: "Investment Banking", filename: "jp morgan.jpg", type: "internship", location: "New York, NY" },
    { name: "City National Bank", member: "Abel Mengistu", industry: "Finance", group: "FP&A", filename: "city-national-bank.png", type: "internship", location: "Los Angeles, CA" },
    { name: "Pimco", member: "Kyle Jurkowski", industry: "Finance", group: "Wealth Management", filename: "pimco.png", type: "internship", location: "Newport Beach, CA" },
    { name: "Deloitte", member: "Jacob Schultz", industry: "Consulting", group: "Consulting", filename: "deloitte.jpg", type: "internship", location: "Los Angeles, CA" },
    { name: "PWC", member: "Katelyn Pool", industry: "Finance", group: "Accounting", filename: "pwc.jpg", type: "internship", location: "Santa Cruz, Bolivia" },
  ],
};

const Switch = ({ viewMode, setViewMode }: { viewMode: "grid" | "list"; setViewMode: (mode: "grid" | "list") => void }) => (
  <div className="flex items-center gap-3">
    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${viewMode === 'grid' ? 'text-bfb-blue' : 'text-slate-400'}`}>Logos</span>
    <button
      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
      className="w-12 h-6 bg-slate-200 dark:bg-white/10 rounded-full relative transition-colors focus:outline-none"
    >
      <div className={`absolute top-1 w-4 h-4 bg-white dark:bg-silver rounded-full shadow transition-all duration-300 ${viewMode === 'list' ? 'left-7' : 'left-1'}`} />
    </button>
    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${viewMode === 'list' ? 'text-bfb-blue' : 'text-slate-400'}`}>Spreadsheet</span>
  </div>
);

const years = [2026, 2025, 2024];

// Featured logos for Select Placements
const featuredLogos = [
  { name: "Goldman Sachs", filename: "goldman-sachs.webp" },
  { name: "Guggenheim", filename: "guggenheim.webp" },
  { name: "Perella-Weinberg", filename: "perella-weinberg.avif" },
  { name: "Rothschild", filename: "rothschild.jpg" },
  { name: "Wells Fargo", filename: "wells-fargo.webp" },
  { name: "Pimco", filename: "pimco.png" },
  { name: "Mizuho", filename: "mizuho.jpg" },
  { name: "Morgan Stanley", filename: "morgan stanley.jpg" },
  { name: "JP Morgan", filename: "jp morgan.jpg" },
  { name: "Charles Schwab", filename: "charles-schwab.webp" },
  { name: "HP", filename: "hp.jpg" },
  { name: "PwC", filename: "pwc.jpg" },
  { name: "Piper Sandler", filename: "piper-sandler.jpg" },
  { name: "Barclays", filename: "barclays.jpg" },
  { name: "Amazon", filename: "Amazon.png" },
  { name: "Google", filename: "google.webp" },
  { name: "UBS", filename: "ubs.jpg" },
];

export default function Placements() {
  const [activeYear, setActiveYear] = useState<number | "all">("all");
  const [activeType, setActiveType] = useState<"all" | "full-time" | "internship">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const displayYears = activeYear === "all" ? years : [activeYear as number];

  // Helper to get unique logos
  const getUniquePlacements = (placements: typeof placementsByYear[2026]) => {
    const seen = new Set();
    return placements.filter(p => {
      if (seen.has(p.filename)) return false;
      seen.add(p.filename);
      return true;
    });
  };

  const getFilteredPlacements = (year: number) => {
    return placementsByYear[year].filter((p) => activeType === "all" || p.type === activeType);
  };

  return (
    <section id="placements" className="relative bg-white dark:bg-midnight">
      {/* Simplistic Header */}
      <div className="pt-32 pb-16 px-4 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-bfb-blue mb-5"
        >
          Career Outcomes
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-8"
        >
          Our Placements
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="h-px w-12 bg-bfb-blue/30 mx-auto"
        />
      </div>

      <div className="pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Controls */}
          <div className="flex flex-col items-center gap-8 mb-16">
            <Switch viewMode={viewMode} setViewMode={setViewMode} />
            <div className="flex justify-center gap-2">
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} onClick={() => setActiveYear("all")} className={`px-5 py-2 rounded-sm text-[10px] font-bold tracking-[0.15em] uppercase border ${activeYear === "all" ? "bg-bfb-blue text-white" : "border-slate-200"}`}>All Years</motion.button>
              {years.map(year => (
                <motion.button key={year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} onClick={() => setActiveYear(year)} className={`px-5 py-2 rounded-sm text-[10px] font-bold tracking-[0.15em] uppercase border ${activeYear === year ? "bg-bfb-blue text-white" : "border-slate-200"}`}>{year}</motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-24">
            {/* Select Placements Sub-section (only in Grid mode) */}
            {viewMode === "grid" && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex-shrink-0">Select Placements</h3>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {featuredLogos.map((logo, i) => (
                    <div key={i} className="bg-white dark:bg-[#0D1323] border border-slate-100 dark:border-white/8 rounded-sm h-40 flex items-center justify-center p-8">
                      <img src={`/companies/${encodeURIComponent(logo.filename)}`} alt={logo.name} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {displayYears.map((year) => {
              const allPlacements = placementsByYear[year] || [];
              const fullTime = allPlacements.filter(p => p.type === "full-time");
              const internships = allPlacements.filter(p => p.type === "internship");

              if (allPlacements.length === 0) return null;

              return (
                <motion.div key={year} className="space-y-12">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-serif text-slate-900 dark:text-silver">{year} Placements</h3>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
                  </div>

                  {/* Full-Time Section */}
                  {fullTime.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-bfb-blue/70">Full-Time</h4>
                      {viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {getUniquePlacements(fullTime).map((firm, i) => (
                            <div key={i} className="bg-white dark:bg-[#0D1323] border border-slate-100 dark:border-white/8 rounded-sm h-32 flex items-center justify-center p-6">
                              <img src={`/companies/${encodeURIComponent(firm.filename)}`} alt={firm.name} className="w-full h-full object-contain" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-white/10">
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Member</th>
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Company</th>
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Industry</th>
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Group</th>
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Location</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fullTime.map((firm, i) => (
                                <tr key={i} className="border-b border-slate-100 dark:border-white/5">
                                  <td className="py-4 text-sm text-slate-900 dark:text-silver">{firm.member}</td>
                                  <td className="py-4 text-sm text-slate-900 dark:text-silver font-bold">{firm.name}</td>
                                  <td className="py-4 text-sm text-slate-500">{firm.industry}</td>
                                  <td className="py-4 text-sm text-slate-500">{firm.group}</td>
                                  <td className="py-4 text-sm text-slate-500">{firm.location}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Internships Section */}
                  {internships.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-bfb-blue/70">Internships</h4>
                      {viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {getUniquePlacements(internships).map((firm, i) => (
                            <div key={i} className="bg-white dark:bg-[#0D1323] border border-slate-100 dark:border-white/8 rounded-sm h-32 flex items-center justify-center p-6">
                              <img src={`/companies/${encodeURIComponent(firm.filename)}`} alt={firm.name} className="w-full h-full object-contain" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-white/10">
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Member</th>
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Company</th>
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Industry</th>
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Group</th>
                                <th className="py-4 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">Location</th>
                              </tr>
                            </thead>
                            <tbody>
                              {internships.map((firm, i) => (
                                <tr key={i} className="border-b border-slate-100 dark:border-white/5">
                                  <td className="py-4 text-sm text-slate-900 dark:text-silver">{firm.member}</td>
                                  <td className="py-4 text-sm text-slate-900 dark:text-silver font-bold">{firm.name}</td>
                                  <td className="py-4 text-sm text-slate-500">{firm.industry}</td>
                                  <td className="py-4 text-sm text-slate-500">{firm.group}</td>
                                  <td className="py-4 text-sm text-slate-500">{firm.location}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}


          </div>
        </div>
      </div>
    </section>
  );
}
