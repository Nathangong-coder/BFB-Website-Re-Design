"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import ThemeToggle from "./ThemeToggle";

type NavItem = {
  name: string;
  href?: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Team",
    children: [
      { name: "Executive Board", href: "/executive-board" },
      { name: "Members", href: "/members" },
      { name: "Placements", href: "/placements" },
    ],
  },
  { name: "Clients", href: "/clients" },
  {
    name: "Events",
    children: [
      { name: "Calendar", href: "/events" },
      { name: "Recruitment", href: "/join" },
    ],
  },
  {
    name: "Resources",
    children: [
      {
        name: "Tech",
        children: [
          { name: "BAI", href: "/tech/bai" },
          { name: "Quant Accelerator", href: "/tech/quant" },
        ],
      },
      {
        name: "Newsletters",
        children: [
          { name: "Hub", href: "/resources/newsletters" },
          { name: "Archives", href: "/resources/newsletters-2" },
        ],
      },
      { name: "Training", href: "/training" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

function DropdownMenu({ items }: { items: NavItem[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white dark:bg-[#0D1323] border border-slate-100 dark:border-white/8 rounded-sm shadow-lg shadow-slate-200/60 dark:shadow-none py-1 z-50"
    >
      {items.map((item) => (
        <div key={item.name} className="relative group">
          {item.children ? (
            <>
              <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 dark:text-silver/70 hover:text-bfb-blue dark:hover:text-silver hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
                {item.name}
                <ChevronRight size={14} />
              </button>
              {/* Sub-dropdown - Only visible on hover of the parent group */}
              <div className="absolute top-0 left-full pl-1 w-48 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                <div className="bg-white dark:bg-[#0D1323] border border-slate-100 dark:border-white/8 rounded-sm shadow-lg py-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href || "#"}
                      className="block px-4 py-2.5 text-sm text-slate-600 dark:text-silver/70 hover:text-bfb-blue dark:hover:text-silver hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Link
              href={item.href || "#"}
              className="block px-4 py-2.5 text-sm text-slate-600 dark:text-silver/70 hover:text-bfb-blue dark:hover:text-silver hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </motion.div>
  );
}

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  // Close the overlay on navigation and lock body scroll while it is open
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting UI state on route change is intentional, not derived render state
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Release the mobile overlay if the viewport crosses into the desktop breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 80);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/92 dark:bg-midnight/90 backdrop-blur-md border-b border-slate-100 dark:border-white/8">
      <div className="max-w-[1400px] mx-auto px-gutter">
        <div className="flex justify-between h-nav items-center">
          <Link href="/" className="flex items-center">
            <>
              <img
                src="/bfb-transparent.png"
                alt="BFB Logo"
                className="h-logo w-auto object-contain dark:hidden"
              />
              <img
                src="/dark-blue-BFB-logo.png"
                alt="BFB Logo"
                className="h-logo w-auto object-contain hidden dark:block"
              />
            </>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="text-[15px] text-slate-600 dark:text-silver/60 hover:text-slate-900 dark:hover:text-silver transition-colors py-1">
                    {item.name}
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.name && (
                      <DropdownMenu items={item.children} />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href || "#"}
                  className={`text-[15px] transition-colors ${
                    pathname === item.href
                      ? "text-bfb-blue font-medium"
                      : "text-slate-600 dark:text-silver/60 hover:text-slate-900 dark:hover:text-silver"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-bfb-blue text-white text-[15px] font-semibold rounded-sm hover:bg-bfb-blue/90 transition-colors"
            >
              Contact Us
            </Link>
            <button
              className="md:hidden p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 dark:text-silver/70 hover:text-slate-900 dark:hover:text-silver transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="md:hidden fixed top-0 left-0 w-screen h-[100dvh] z-[70] bg-white dark:bg-[#080C18] flex flex-col"
          >
            {/* Overlay header */}
            <div className="flex items-center justify-between h-nav px-gutter border-b border-slate-100 dark:border-white/8 flex-shrink-0">
              <img
                src="/bfb-transparent.png"
                alt="BFB Logo"
                className="h-logo w-auto object-contain dark:hidden"
              />
              <img
                src="/dark-blue-BFB-logo.png"
                alt="BFB Logo"
                className="h-logo w-auto object-contain hidden dark:block"
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-2 -mr-2 text-slate-600 dark:text-silver/70 hover:text-slate-900 dark:hover:text-silver transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                <X size={26} />
              </button>
            </div>

            {/* Scrollable nav list */}
            <motion.nav
              variants={reduceMotion ? undefined : staggerContainer}
              initial={reduceMotion ? undefined : "hidden"}
              animate={reduceMotion ? undefined : "visible"}
              className="flex-1 overflow-y-auto px-gutter py-6 flex flex-col gap-1"
            >
              {navItems.map((item) => (
                <motion.div key={item.name} variants={reduceMotion ? undefined : fadeInUp}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === item.name ? null : item.name)
                        }
                        className="flex items-center justify-between w-full min-h-[52px] px-2 text-lg text-slate-800 dark:text-silver"
                      >
                        {item.name}
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-200 ${
                            mobileExpanded === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.2 }}
                            className="overflow-hidden pl-4 border-l border-bfb-blue/20 ml-2"
                          >
                            {item.children.map((child) =>
                              child.children ? (
                                <div key={child.name} className="py-1">
                                  <span className="block px-2 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    {child.name}
                                  </span>
                                  {child.children.map((sub) => (
                                    <Link
                                      key={sub.name}
                                      href={sub.href || "#"}
                                      onClick={() => setMobileOpen(false)}
                                      className="flex items-center min-h-[48px] px-2 text-base text-slate-500 dark:text-silver/60 hover:text-bfb-blue dark:hover:text-silver transition-colors"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <Link
                                  key={child.name}
                                  href={child.href || "#"}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center min-h-[48px] px-2 text-base text-slate-600 dark:text-silver/70 hover:text-bfb-blue dark:hover:text-silver transition-colors"
                                >
                                  {child.name}
                                </Link>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center min-h-[52px] px-2 text-lg text-slate-800 dark:text-silver hover:text-bfb-blue transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.nav>

            {/* Pinned primary CTA */}
            <div className="flex-shrink-0 px-gutter py-5 border-t border-slate-100 dark:border-white/8">
              <Link
                href="/join"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-bfb-blue text-white py-4 rounded-sm text-base font-semibold hover:bg-bfb-blue/90 transition-colors"
              >
                Join Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
