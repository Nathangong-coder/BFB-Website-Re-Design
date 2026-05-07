"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

type NavChild = { name: string; href: string };
type NavItem =
  | { name: string; href: string; children?: undefined }
  | { name: string; href?: undefined; children: NavChild[] };

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Team",
    children: [
      { name: "Executive Board", href: "/team" },
      { name: "Members", href: "/team/members" },
      { name: "Placements", href: "/placements" },
    ],
  },
  { name: "Events", href: "/events" },
  {
    name: "Resources",
    children: [
      { name: "Training", href: "/training" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

function DropdownMenu({ items }: { items: NavChild[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white dark:bg-[#0D1323] border border-slate-100 dark:border-white/8 rounded-sm shadow-lg shadow-slate-200/60 dark:shadow-none py-1 z-50"
    >
      {items.map((child) => (
        <Link
          key={child.name}
          href={child.href}
          className="block px-4 py-2.5 text-sm text-slate-600 dark:text-silver/70 hover:text-bfb-blue dark:hover:text-silver hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
        >
          {child.name}
        </Link>
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

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 80);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/92 dark:bg-midnight/90 backdrop-blur-md border-b border-slate-100 dark:border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/bfb_bear.png"
              alt="BFB Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
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
                  href={item.href}
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

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/join"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-bfb-blue text-white text-[15px] font-semibold rounded-sm hover:bg-bfb-blue/90 transition-colors"
            >
              Join Us
            </Link>
            <button
              className="md:hidden p-1.5 text-slate-600 dark:text-silver/70 hover:text-slate-900 dark:hover:text-silver transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-slate-100 dark:border-white/5"
          >
            <div className="px-4 py-4 space-y-0.5 bg-white dark:bg-[#080C18]">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.name}>
                    <button
                      onClick={() =>
                        setMobileExpanded(
                          mobileExpanded === item.name ? null : item.name
                        )
                      }
                      className="flex items-center justify-between w-full px-3 py-3 text-sm text-slate-700 dark:text-silver/70 hover:text-bfb-blue dark:hover:text-silver transition-colors"
                    >
                      {item.name}
                    </button>
                    <AnimatePresence>
                      {mobileExpanded === item.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pl-4 border-l-2 border-bfb-blue/20 ml-3"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block px-3 py-2.5 text-sm text-slate-500 dark:text-silver/60 hover:text-bfb-blue dark:hover:text-silver transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-sm text-slate-700 dark:text-silver/70 hover:text-bfb-blue dark:hover:text-silver transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              )}
              <div className="pt-3 pb-1 px-3">
                <Link
                  href="/join"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-bfb-blue text-white px-5 py-3 rounded-sm text-sm font-semibold hover:bg-bfb-blue/90 transition-colors"
                >
                  Join Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
