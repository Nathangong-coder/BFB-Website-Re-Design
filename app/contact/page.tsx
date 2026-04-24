"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
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
    <div className="min-h-screen bg-white dark:bg-midnight pt-32 pb-24 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center mb-12">
            <span className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-bfb-blue mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-silver mb-4">
              Contact Us
            </h1>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-bfb-blue/40 to-transparent mx-auto mb-6" />
            <p className="text-slate-500 dark:text-silver/60 leading-relaxed text-sm">
              Have a question or want to learn more? We&apos;d love to hear from you.
            </p>
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
