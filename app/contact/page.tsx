"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Mail } from "lucide-react";
import { sendContactEmail } from "@/app/actions/contact";

export default function ContactPage() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await sendContactEmail(formData);
      setResult(res);
    });
  }

  if (result?.success) {
    return (
      <div className="min-h-screen bg-white dark:bg-midnight flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 mb-6">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-serif text-slate-900 dark:text-silver mb-4">Message Sent</h2>
          <p className="text-slate-500 dark:text-silver/60 leading-relaxed">
            Thanks for reaching out — we&apos;ll be in touch with you soon.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-midnight pt-page pb-section px-gutter overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center mb-12">
            <span className="block w-full text-center text-eyebrow font-bold tracking-[0.3em] uppercase text-bfb-blue mb-4">
              Get In Touch
            </span>
            <h1 className="text-hero font-serif text-slate-900 dark:text-silver mb-4">
              Contact Us
            </h1>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-bfb-blue/40 to-transparent mx-auto mb-6" />
            <p className="italic font-light text-slate-400 dark:text-silver/40 leading-relaxed text-sm max-w-sm mx-auto">
              Have a question or want to learn more? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="mb-12">
            <span className="block text-center text-xs font-bold tracking-[0.25em] uppercase text-bfb-blue mb-5">
              Connect With Us
            </span>
            <div className="flex justify-center items-center gap-4">
              <a
                href="mailto:bfbatucla@gmail.com"
                aria-label="Email"
                className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-silver/60 hover:text-bfb-blue hover:border-bfb-blue/40 dark:hover:text-silver transition-all duration-200"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://instagram.com/bfbatucla"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-silver/60 hover:text-bfb-blue hover:border-bfb-blue/40 dark:hover:text-silver transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/bruins-in-finance-and-banking"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-silver/60 hover:text-bfb-blue hover:border-bfb-blue/40 dark:hover:text-silver transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="4" width="4" height="16" rx="2"></rect>
                  <path d="M2 8h4"></path>
                  <path d="M2 16h4"></path>
                </svg>
              </a>
            </div>

            <div className="mt-4 text-center text-sm text-slate-500 dark:text-silver/60 space-x-3">
              <a href="mailto:bfbatucla@gmail.com" className="hover:text-bfb-blue transition-colors">
                bfbatucla@gmail.com
              </a>
              <span className="text-slate-300 dark:text-silver/20">|</span>
              <a href="tel:+14253943467" className="hover:text-bfb-blue transition-colors">
                (425) 394-3467
              </a>
            </div>
          </div>

          <div className="mb-6">
            <span className="block text-center text-xs font-bold tracking-[0.25em] uppercase text-bfb-blue mb-1">
              Send a Message
            </span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-bfb-blue/40 to-transparent mx-auto" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-silver/80 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver placeholder-slate-400 dark:placeholder-silver/30 focus:outline-none focus:border-bfb-blue transition-colors text-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-silver/80 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver placeholder-slate-400 dark:placeholder-silver/30 focus:outline-none focus:border-bfb-blue transition-colors text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-silver/80 mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={6}
                className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver placeholder-slate-400 dark:placeholder-silver/30 focus:outline-none focus:border-bfb-blue transition-colors resize-none text-sm"
                placeholder="Tell us about yourself, your year, your major, and why you want to join BFB..."
              />
            </div>

            {result?.error && (
              <p className="text-red-500 text-sm">{result.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-bfb-blue/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
            >
              {pending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
