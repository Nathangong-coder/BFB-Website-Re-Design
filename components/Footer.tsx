import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-midnight border-t border-glass py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-silver font-serif text-2xl font-bold tracking-tighter">
              BFB<span className="text-gold">.</span>
            </Link>
            <p className="mt-2 text-silver/50 text-sm">
              UCLA&apos;s Premier Finance Club.
            </p>
          </div>

          {/* Links */}
          <div className="flex justify-center space-x-6 text-sm font-medium text-silver/70">
            <Link href="#about" className="hover:text-gold transition-colors">About</Link>
            <Link href="#approach" className="hover:text-gold transition-colors">Approach</Link>
            <Link href="#placements" className="hover:text-gold transition-colors">Placements</Link>
            <Link href="#team" className="hover:text-gold transition-colors">Team</Link>
          </div>

          {/* Socials */}
          <div className="flex justify-center md:justify-end space-x-4">
            <a
              href="https://instagram.com/bfbatucla"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-glass text-silver hover:text-gold hover:border-gold transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="mailto:contact@bfbatucla.com"
              className="p-2 rounded-full border border-glass text-silver hover:text-gold hover:border-gold transition-all duration-200"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-glass text-center text-silver/30 text-xs">
          &copy; {new Date().getFullYear()} Bruins in Finance and Banking. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
