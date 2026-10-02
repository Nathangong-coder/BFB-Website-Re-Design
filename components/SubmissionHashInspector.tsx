"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Hash,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Calendar,
  Users,
  ShieldCheck,
  Code2,
  FileText,
  Loader2,
} from "lucide-react";
import type { CompetitionSubmission } from "@/lib/types/competition";
import { verifySubmissionHash, HashVerificationResult } from "@/lib/crypto";

interface SubmissionHashInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  submission: CompetitionSubmission | null;
}

export default function SubmissionHashInspector({
  isOpen,
  onClose,
  submission,
}: SubmissionHashInspectorProps) {
  const [verificationResult, setVerificationResult] = useState<HashVerificationResult | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  useEffect(() => {
    if (!submission || !isOpen) return;

    async function runVerification() {
      if (!submission) return;
      setVerifying(true);
      try {
        const result = await verifySubmissionHash(submission);
        setVerificationResult(result);
      } catch (err) {
        console.error("Verification error:", err);
      } finally {
        setVerifying(false);
      }
    }

    runVerification();
  }, [submission, isOpen]);

  if (!isOpen || !submission) return null;

  function copyHash() {
    if (!submission) return;
    navigator.clipboard.writeText(submission.crypto_hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  }

  function copyPayload() {
    if (!verificationResult) return;
    navigator.clipboard.writeText(verificationResult.canonicalPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  }

  function downloadPackage() {
    if (!submission) return;
    const jsonStr = JSON.stringify(submission, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submission_${submission.team_name.replace(/\s+/g, "_")}_v${submission.version}_${submission.crypto_hash.substring(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <AnimatePresence>
      <div key="inspector-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Static Isolated Backdrop Layer */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{ transform: "translateZ(0)", contain: "layout style" }}
          className="relative z-10 w-full max-w-2xl bg-white dark:bg-midnight border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col will-change-transform"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-bfb-blue/10 rounded-xl text-bfb-blue dark:text-accent">
                <Hash size={22} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-silver">
                  Cryptographic Hash Verification Inspector
                </h3>
                <p className="text-xs text-slate-500 dark:text-silver/60">
                  Team: <span className="font-semibold">{submission.team_name}</span> · Version {submission.version}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-silver transition-colors rounded-lg focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-5">
            {/* Hash Status Box */}
            <div
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                verifying
                  ? "bg-slate-100 dark:bg-slate-900 border-slate-200"
                  : verificationResult?.isValid
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
              }`}
            >
              <div className="flex items-start gap-3">
                {verifying ? (
                  <Loader2 size={22} className="animate-spin text-bfb-blue mt-0.5 shrink-0" />
                ) : verificationResult?.isValid ? (
                  <ShieldCheck size={24} className="text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle size={24} className="text-red-500 mt-0.5 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-silver">
                    {verifying
                      ? "Re-computing SHA-256 Digest..."
                      : verificationResult?.isValid
                      ? "SHA-256 Hash Integrity Verified"
                      : "Hash Verification Warning"}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-silver/60 mt-0.5 leading-relaxed">
                    {verifying
                      ? "Running canonical payload normalization and Web Crypto SHA-256 digest..."
                      : verificationResult?.isValid
                      ? "The computed cryptographic digest matches the stored submission hash with 100% integrity. The submission payload is authentic and un-tampered."
                      : `The computed hash (${verificationResult?.computedHash.substring(0, 12)}...) differs from the stored hash (${verificationResult?.storedHash.substring(0, 12)}...).`}
                  </p>
                </div>
              </div>

              <button
                onClick={downloadPackage}
                className="px-3 py-1.5 bg-bfb-blue text-white text-xs font-semibold rounded-lg hover:bg-bfb-blue/90 transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <Download size={14} /> Download Package
              </button>
            </div>

            {/* Digest Details */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                SHA-256 Cryptographic Hash Digest
              </label>
              <div className="p-3 bg-slate-900 text-accent font-mono text-xs rounded-xl flex items-center justify-between border border-slate-800">
                <span className="truncate pr-2">{submission.crypto_hash}</span>
                <button
                  onClick={copyHash}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-silver rounded flex items-center gap-1 shrink-0 text-[11px] transition-colors"
                >
                  {copiedHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copiedHash ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar size={12} /> Submitted At
                </span>
                <p className="text-xs font-semibold text-slate-900 dark:text-silver mt-1 truncate">
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Users size={12} /> Team Name
                </span>
                <p className="text-xs font-semibold text-slate-900 dark:text-silver mt-1 truncate">
                  {submission.team_name}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Code2 size={12} /> Language
                </span>
                <p className="text-xs font-semibold text-bfb-blue dark:text-accent mt-1 truncate uppercase flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${submission.language === "cpp" ? "bg-blue-400" : "bg-emerald-400"}`} />
                  {submission.language === "cpp" ? "C++ (.cpp)" : "Python (.py)"}
                </p>
              </div>
            </div>

            {/* Deliverables Overview */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText size={14} /> Submission Package Summary
              </h4>

              <div className="text-xs space-y-2 text-slate-700 dark:text-silver">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-silver">Thesis Title:</span>{" "}
                  {submission.research_memo_title}
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-silver">Entry Point &amp; Strategy File:</span>{" "}
                  <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">
                    {submission.entry_point || (submission.language === "cpp" ? "strategy.cpp" : "strategy.py")}
                  </code>{" "}
                  →{" "}
                  <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">
                    {submission.strategy_code_filename}
                  </code>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-silver">Data Sources:</span>{" "}
                  {submission.data_provenance}
                </div>
              </div>
            </div>

            {/* Canonical Hash Payload Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Canonical SHA-256 Input Payload
                </label>
                <button
                  onClick={copyPayload}
                  className="text-xs text-bfb-blue dark:text-accent hover:underline flex items-center gap-1"
                >
                  {copiedPayload ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copiedPayload ? "Copied Payload" : "Copy Payload"}
                </button>
              </div>
              <textarea
                rows={5}
                readOnly
                value={verificationResult?.canonicalPayload || ""}
                className="w-full p-3 bg-slate-900 text-slate-300 border border-slate-800 rounded-xl text-xs font-mono focus:outline-none"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
