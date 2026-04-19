import React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Approach", href: "/#approach" },
  { name: "Placements", href: "/#placements" },
  { name: "Team", href: "/#team" },
  { name: "Training", href: "/training" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-glass bg-midnight/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo - Replacing Text with BFB Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://bfbatucla.com/assets/images/favicon.png" alt="BFB Logo" className="w-10 h-10 object-contain" />
              <span className="text-silver font-serif text-2xl font-bold tracking-tighter">
                BFB
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-silver/70 hover:text-bfb-blue transition-colors duration-200 text-sm font-medium tracking-wide"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="#apply"
              className="bg-bfb-blue text-white px-5 py-2 rounded-sm text-sm font-bold hover:bg-bfb-blue/90 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-bfb-blue/20"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-silver hover:text-bfb-blue transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* ... (Mobile Nav remains the same) */}
    </nav>
  );
}
