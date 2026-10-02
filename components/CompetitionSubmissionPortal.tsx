"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Code2,
  Database,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Hash,
  UploadCloud,
  History,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Download } from "lucide-react";
import type {
  CompetitionSubmission,
  SubmissionDeliverables,
  LanguageType,
} from "@/lib/types/competition";
import { computeSubmissionHash } from "@/lib/crypto";

interface CompetitionSubmissionPortalProps {
  isOpen?: boolean;
  isInline?: boolean;
  onClose?: () => void;
  teamName: string;
  userEmail: string;
  userId: string;
  currentSubmission?: CompetitionSubmission | null;
  onSubmissionSuccess: () => void;
}

type TabType = "memo" | "code" | "provenance" | "reproduction";

const PYTHON_BOILERPLATE = `"""
BFB at UCLA - Alpha Research Competition
Python Strategy Starter Template
"""
import sys
import json
from typing import Dict, Any

def generate_signals(market_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Core Alpha Strategy Signal Generator.
    Returns portfolio target weights mapping symbols to allocation percentages.
    """
    target_weights: Dict[str, float] = {}
    prices = market_data.get("prices", {})
    if not prices:
        return target_weights

    # YOUR STRATEGY LOGIC HERE
    num_assets = len(prices)
    weight_per_asset = 0.50 / max(num_assets, 1)

    for symbol in prices.keys():
        target_weights[symbol] = round(weight_per_asset, 4)

    return target_weights

def main():
    if len(sys.argv) >= 3:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            data = json.load(f)
        signals = generate_signals(data)
        with open(sys.argv[2], "w", encoding="utf-8") as f:
            json.dump(signals, f, indent=2)

if __name__ == "__main__":
    main()
`;

const CPP_BOILERPLATE = `/**
 * BFB at UCLA - Alpha Research Competition
 * C++ Strategy Starter Template
 * Compilation: g++ -O3 -std=c++20 main.cpp -o strategy_runner
 */
#include <iostream>
#include <fstream>
#include <string>
#include <unordered_map>
#include <sstream>

std::unordered_map<std::string, double> generate_signals(const std::string& market_data_json) {
    std::unordered_map<std::string, double> target_weights;
    // YOUR STRATEGY LOGIC HERE
    target_weights["AAPL"] = 0.05;
    target_weights["MSFT"] = -0.03;
    target_weights["BTCUSDT"] = 0.02;
    return target_weights;
}

int main(int argc, char* argv[]) {
    if (argc >= 3) {
        std::ifstream input_file(argv[1]);
        std::stringstream buffer;
        buffer << input_file.rdbuf();
        auto weights = generate_signals(buffer.str());
        std::ofstream output_file(argv[2]);
        output_file << "{\n";
        size_t count = 0;
        for (const auto& [symbol, weight] : weights) {
            output_file << "  \"" << symbol << "\": " << weight;
            if (++count < weights.size()) output_file << ",";
            output_file << "\n";
        }
        output_file << "}\n";
    }
    return 0;
}
`;

export default function CompetitionSubmissionPortal({
  isOpen = true,
  isInline = false,
  onClose,
  teamName,
  userEmail,
  userId,
  currentSubmission,
  onSubmissionSuccess,
}: CompetitionSubmissionPortalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("memo");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Hash state preview
  const [liveHash, setLiveHash] = useState<string>("");
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [showCodePreview, setShowCodePreview] = useState<boolean>(false);

  // Deliverable Form States
  const [memoTitle, setMemoTitle] = useState<string>("");
  const [memoContent, setMemoContent] = useState<string>("");
  const [memoFileName, setMemoFileName] = useState<string>("");

  const [language, setLanguage] = useState<LanguageType>("python");
  const [codeFileName, setCodeFileName] = useState<string>("strategy.py");
  const [codeContent, setCodeContent] = useState<string>(PYTHON_BOILERPLATE);
  const [entryPoint, setEntryPoint] = useState<string>("strategy.py");
  const [dependencies, setDependencies] = useState<string>(
    "pandas>=2.0.0\nnumpy>=1.24.0\nscikit-learn>=1.2.0\n"
  );

  // Data Provenance State
  const [dataProvenance, setDataProvenance] = useState<string>(
    "1. S&P 500 Constituent Data: Adjusted daily close prices from official universe.\n2. Binance Spot OHLCV Data: 1-hour candles for top 100 instruments."
  );

  // Reproduction & Risk State
  const [reproductionInstructions, setReproductionInstructions] = useState<string>(
    "1. Install dependencies via pip install -r requirements.txt\n2. Run python strategy.py market_data.json signals.json\n3. Output signals are verified automatically by BFB Evaluation Harness"
  );
  const [signedConfirmation, setSignedConfirmation] = useState<boolean>(true);
  const [signedSecurityDisclaimer, setSignedSecurityDisclaimer] = useState<boolean>(true);

  const isResubmission = Boolean(currentSubmission);
  const nextVersion = (currentSubmission?.version || 0) + 1;

  // Language change handler
  function handleLanguageChange(newLang: LanguageType) {
    setLanguage(newLang);
    if (newLang === "python") {
      setCodeFileName("strategy.py");
      setEntryPoint("strategy.py");
      if (codeContent === CPP_BOILERPLATE) setCodeContent(PYTHON_BOILERPLATE);
      setDependencies("pandas>=2.0.0\nnumpy>=1.24.0\nscikit-learn>=1.2.0\n");
    } else {
      setCodeFileName("strategy.cpp");
      setEntryPoint("strategy.cpp");
      if (codeContent === PYTHON_BOILERPLATE) setCodeContent(CPP_BOILERPLATE);
      setDependencies("Makefile\ng++ >= 11 (C++17)\n");
    }
  }

  // Pre-fill fields if editing/resubmitting
  useEffect(() => {
    if (!currentSubmission) return;

    if (currentSubmission.language) {
      setLanguage(currentSubmission.language);
    }
    setMemoTitle(currentSubmission.research_memo_title || "");
    setMemoContent(currentSubmission.research_memo_content || "");
    setMemoFileName(currentSubmission.research_memo_file_name || "");

    const fn = currentSubmission.language === "cpp" ? "strategy.cpp" : "strategy.py";
    setCodeFileName(fn);
    setEntryPoint(fn);
    setCodeContent(currentSubmission.strategy_code_content || "");
    setDependencies(currentSubmission.dependencies || "");

    setDataProvenance(currentSubmission.data_provenance || "");
    setReproductionInstructions(currentSubmission.reproduction_instructions || "");
    setSignedConfirmation(currentSubmission.signed_confirmation ?? true);
  }, [currentSubmission]);

  const buildDeliverablesPayload = useCallback((): SubmissionDeliverables => {
    const targetFileName = language === "cpp" ? "strategy.cpp" : "strategy.py";

    return {
      research_memo_title: memoTitle.trim() || "Alpha Research Thesis & Strategy Specification",
      research_memo_content: memoContent.trim() || "Quantitative research thesis and empirical evidence.",
      research_memo_file_name: memoFileName.trim() || undefined,

      language,
      strategy_code_filename: targetFileName,
      strategy_code_content: codeContent.trim(),
      entry_point: targetFileName,
      dependencies: dependencies.trim(),

      data_provenance: dataProvenance.trim(),

      reproduction_instructions: reproductionInstructions.trim(),
      signed_confirmation: signedConfirmation,
    };
  }, [
    language,
    memoTitle,
    memoContent,
    memoFileName,
    codeContent,
    dependencies,
    dataProvenance,
    reproductionInstructions,
    signedConfirmation,
  ]);

  // Compute SHA-256 live preview digest (debounced by 750ms with requestIdleCallback for 0ms typing latency)
  useEffect(() => {
    let isSubscribed = true;
    let idleId: number | undefined;

    const timer = setTimeout(() => {
      const runHash = async () => {
        const deliverables = buildDeliverablesPayload();
        const hash = await computeSubmissionHash({
          team_name: teamName,
          submitted_at: new Date().toISOString().substring(0, 10) + "T00:00:00Z",
          submitted_by_email: userEmail,
          version: nextVersion,
          deliverables,
        });

        if (isSubscribed) {
          setLiveHash(hash);
        }
      };

      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        idleId = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(runHash);
      } else {
        runHash();
      }
    }, 750);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
      if (idleId && typeof window !== "undefined" && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, [teamName, userEmail, nextVersion, buildDeliverablesPayload]);

  async function handleSubmitSubmission(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signedConfirmation || !signedSecurityDisclaimer) {
      setErrorMsg(
        "Please check both required confirmation boxes: Strategy Freeze Agreement and the IP Privacy & 1-Click Disqualification Release."
      );
      return;
    }

    if (!memoTitle.trim() || !memoContent.trim()) {
      setErrorMsg("Please provide a title and text summary for your Research Memo.");
      return;
    }

    if (!codeContent.trim()) {
      setErrorMsg("Please provide your runnable strategy code or script.");
      return;
    }

    setLoading(true);

    try {
      const submittedAt = new Date().toISOString();
      const deliverables = buildDeliverablesPayload();

      // Compute exact 64-character SHA-256 cryptographic hash digest
      const cryptoHash = await computeSubmissionHash({
        team_name: teamName,
        submitted_at: submittedAt,
        submitted_by_email: userEmail,
        version: nextVersion,
        deliverables,
      });

      // 1. Mark previous team submissions as is_latest = false
      if (teamName) {
        await supabase
          .from("competition_submissions")
          .update({ is_latest: false })
          .ilike("team_name", teamName.trim());
      }

      // 2. Insert new submission version with SHA-256 cryptographic hash digest
      const { error: insertError } = await supabase
        .from("competition_submissions")
        .insert({
          team_name: teamName.trim(),
          submitted_by_id: userId,
          submitted_by_email: userEmail,
          version: nextVersion,
          is_latest: true,
          submitted_at: submittedAt,
          crypto_hash: cryptoHash,

          language: deliverables.language,
          research_memo_title: deliverables.research_memo_title,
          research_memo_content: deliverables.research_memo_content,
          research_memo_file_name: deliverables.research_memo_file_name || null,

          strategy_code_filename: deliverables.strategy_code_filename,
          strategy_code_content: deliverables.strategy_code_content,
          entry_point: deliverables.entry_point,
          dependencies: deliverables.dependencies,

          backtest_metrics: deliverables.backtest_metrics,

          data_provenance: deliverables.data_provenance,

          reproduction_instructions: deliverables.reproduction_instructions,
          signed_confirmation: deliverables.signed_confirmation,
        });

      if (insertError) throw insertError;

      setSuccessMsg(
        `Submission Version ${nextVersion} saved successfully! Timestamped & hashed (${cryptoHash.substring(0, 16)}...).`
      );

      onSubmissionSuccess();
    } catch (err: unknown) {
      console.error("Submission error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "An unexpected error occurred submitting deliverables.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  function copyHashToClipboard() {
    if (!liveHash) return;
    navigator.clipboard.writeText(liveHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMemoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      if (typeof text === "string") {
        setMemoContent((prev) =>
          prev ? `${prev}\n\n[Uploaded File: ${file.name}]\n${text.substring(0, 5000)}` : text.substring(0, 5000)
        );
      }
    };
    reader.readAsText(file);
  }

  function handleCodeFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    let targetLang: LanguageType = language;
    if (
      file.name.endsWith(".cpp") ||
      file.name.endsWith(".cc") ||
      file.name.endsWith(".cxx") ||
      file.name.endsWith(".h") ||
      file.name.endsWith(".hpp")
    ) {
      targetLang = "cpp";
      setLanguage("cpp");
    } else if (file.name.endsWith(".py")) {
      targetLang = "python";
      setLanguage("python");
    }

    const standardizedName = targetLang === "cpp" ? "strategy.cpp" : "strategy.py";
    setCodeFileName(standardizedName);
    setEntryPoint(standardizedName);
    setSuccessMsg(`Uploaded ${file.name} — auto-standardized entry point to ${standardizedName} for 1-click evaluation.`);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      if (typeof text === "string") {
        setCodeContent(text);
      }
    };
    reader.readAsText(file);
  }

  const codePreviewInfo = useMemo(() => {
    if (!codeContent) return { lineCount: 0, previewText: "", isTruncated: false };
    const lines = codeContent.split("\n");
    const lineCount = lines.length;
    const maxPreview = 200;
    if (lineCount > maxPreview) {
      return {
        lineCount,
        previewText:
          lines.slice(0, maxPreview).join("\n") +
          `\n\n... [Truncated preview: showing first 200 lines of ${lineCount} lines total]`,
        isTruncated: true,
      };
    }
    return {
      lineCount,
      previewText: codeContent,
      isTruncated: false,
    };
  }, [codeContent]);

  if (!isOpen && !isInline) return null;

  const content = (
    <div className={`relative z-10 w-full max-w-4xl bg-white dark:bg-midnight border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col ${isInline ? "" : "max-h-[92vh] will-change-transform"}`}>
      {/* Header */}
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-bfb-blue/10 rounded-xl text-bfb-blue dark:text-accent">
                <Sparkles size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-silver">
                    Submit Deliverables
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-bfb-blue/10 text-bfb-blue dark:text-accent rounded-md">
                    Team: {teamName}
                  </span>
                  {isResubmission && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md flex items-center gap-1">
                      <History size={10} /> Version {nextVersion}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-silver/60 mt-0.5">
                  Resubmit as many times as needed before Sun, Nov 22, 11:59 PM PT. Each package receives a cryptographic SHA-256 hash.
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

          {/* Cryptographic Hash Live Preview Banner */}
          <div className="px-6 py-2.5 bg-slate-900 text-slate-200 border-b border-slate-800 flex items-center justify-between text-xs shrink-0 font-mono">
            <div className="flex items-center gap-2 truncate pr-4">
              <Hash size={14} className="text-bfb-blue dark:text-accent shrink-0" />
              <span className="text-slate-400">SHA-256 Hash Digest:</span>
              <span className="text-accent truncate font-semibold">
                {liveHash || "Computing cryptographic digest..."}
              </span>
            </div>
            <button
              onClick={copyHashToClipboard}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-silver rounded flex items-center gap-1 shrink-0 text-[11px] transition-colors"
            >
              {copiedHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copiedHash ? "Copied" : "Copy Hash"}
            </button>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400 shrink-0">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex px-6 pt-4 border-b border-slate-100 dark:border-white/5 gap-2 overflow-x-auto shrink-0 bg-slate-50/30 dark:bg-midnight/20">
            <button
              type="button"
              onClick={() => setActiveTab("memo")}
              className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "memo"
                  ? "bg-white dark:bg-midnight border-t-2 border-bfb-blue text-bfb-blue dark:text-accent shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-silver"
              }`}
            >
              <FileText size={14} /> 1. Research Memo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "code"
                  ? "bg-white dark:bg-midnight border-t-2 border-bfb-blue text-bfb-blue dark:text-accent shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-silver"
              }`}
            >
              <Code2 size={14} /> 2. Strategy Code
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("provenance")}
              className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "provenance"
                  ? "bg-white dark:bg-midnight border-t-2 border-bfb-blue text-bfb-blue dark:text-accent shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-silver"
              }`}
            >
              <Database size={14} /> 3. Data Provenance
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reproduction")}
              className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "reproduction"
                  ? "bg-white dark:bg-midnight border-t-2 border-bfb-blue text-bfb-blue dark:text-accent shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-silver"
              }`}
            >
              <Lock size={14} /> 4. Reproduction &amp; Freeze
            </button>
          </div>

          {/* Form Body - Hardware Accelerated Scroll Container */}
          <form
            onSubmit={handleSubmitSubmission}
            style={{
              transform: "translateZ(0)",
              willChange: "scroll-position",
              contain: "layout style",
              WebkitOverflowScrolling: "touch",
            }}
            className="p-6 overflow-y-auto flex-1 space-y-5 overscroll-contain"
          >
            {activeTab === "memo" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Research Thesis Title
                  </label>
                  <input
                    type="text"
                    required
                    value={memoTitle}
                    onChange={(e) => setMemoTitle(e.target.value)}
                    placeholder="e.g. Cross-Sectional Momentum in S&P 500 Constituent Rebalances"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Research Memo Summary / Full Text
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={memoContent}
                    onChange={(e) => setMemoContent(e.target.value)}
                    placeholder="Detail your thesis, economic mechanism, data provenance, portfolio construction, failure modes, and sensitivity checks..."
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Attach Memo File (Optional PDF / DOCX / TXT)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-silver text-xs font-semibold rounded-xl cursor-pointer transition-colors border border-slate-200 dark:border-slate-700">
                      <UploadCloud size={16} /> Choose File
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.md"
                      />
                    </label>
                    <span className="text-xs text-slate-400 truncate">
                      {memoFileName ? memoFileName : "No file attached"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div className="space-y-4">
                {/* Disqualification Warning Banner */}
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-xs text-red-700 dark:text-red-400">
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                  <div className="space-y-1">
                    <p className="font-bold text-red-600 dark:text-red-400 uppercase tracking-wider text-[11px]">
                      ⚠️ Disqualification Warning (1-Click Execution Requirement)
                    </p>
                    <p className="leading-relaxed text-[11px]">
                      All strategy code is evaluated strictly via the automated 1-click command:{" "}
                      <code className="px-1.5 py-0.5 bg-slate-950 text-emerald-400 font-mono rounded border border-white/10 font-bold">
                        {language === "cpp"
                          ? "make && ./strategy_runner market_data.json output_signals.json"
                          : "python3 strategy.py market_data.json output_signals.json"}
                      </code>
                      . If your submission fails to compile, throws uncaught errors, or fails to output target signals under this command, <strong>the strategy will be automatically disqualified</strong>.
                    </p>
                  </div>
                </div>

                {/* Language Selection & Download Templates Header */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Select Submission Language
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleLanguageChange("python")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            language === "python"
                              ? "bg-bfb-blue text-white shadow-md shadow-bfb-blue/20"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-silver hover:bg-slate-300"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          Python (.py)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLanguageChange("cpp")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            language === "cpp"
                              ? "bg-bfb-blue text-white shadow-md shadow-bfb-blue/20"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-silver hover:bg-slate-300"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          C++ (.cpp)
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={language === "cpp" ? "/templates/strategy.cpp" : "/templates/strategy.py"}
                        download
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-silver border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Download size={13} className="text-bfb-blue dark:text-accent" />
                        {language === "cpp" ? "strategy.cpp" : "strategy.py"}
                      </a>
                      <a
                        href={language === "cpp" ? "/templates/Makefile" : "/templates/requirements.txt"}
                        download
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-silver border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Download size={13} className="text-bfb-blue dark:text-accent" />
                        {language === "cpp" ? "Makefile" : "requirements.txt"}
                      </a>
                      <a
                        href="/templates/market_data.json"
                        download
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-silver border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Download size={13} className="text-bfb-blue dark:text-accent" />
                        market_data.json
                      </a>
                      <a
                        href="/templates/signals.json"
                        download
                        className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-silver border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Download size={13} className="text-bfb-blue dark:text-accent" />
                        signals.json
                      </a>
                    </div>
                  </div>
                </div>



                {/* File Upload Box */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Upload Strategy Implementation File ({language === "cpp" ? ".cpp / .h" : ".py"})
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/40 text-center hover:border-bfb-blue dark:hover:border-accent transition-colors">
                    <input
                      type="file"
                      id="code-file-input"
                      onChange={handleCodeFileUpload}
                      accept={language === "cpp" ? ".cpp,.cc,.cxx,.h,.hpp,.txt" : ".py,.txt"}
                      className="hidden"
                    />
                    <label
                      htmlFor="code-file-input"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <div className="p-3 bg-bfb-blue/10 dark:bg-accent/10 rounded-full text-bfb-blue dark:text-accent">
                        <UploadCloud size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-silver">
                          {codeFileName ? `Uploaded File: ${codeFileName}` : `Upload your ${language === "cpp" ? "C++ (.cpp)" : "Python (.py)"} strategy file`}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-silver/60 mt-0.5">
                          Click to browse or drag &amp; drop your completed template file
                        </p>
                      </div>
                      <span className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 bg-bfb-blue text-white font-semibold text-xs rounded-xl hover:bg-bfb-blue/90 transition-colors shadow-sm">
                        <UploadCloud size={14} /> Choose Strategy File
                      </span>
                    </label>
                  </div>
                </div>

                {/* Uploaded File Content Preview */}
                {codeContent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Strategy File: <span className="text-slate-900 dark:text-silver font-mono">{codeFileName}</span>
                        </label>
                        <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-silver/80 px-2 py-0.5 rounded-md">
                          {codePreviewInfo.lineCount} lines · {(new Blob([codeContent]).size / 1024).toFixed(1)} KB
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCodePreview((prev) => !prev)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-silver text-[11px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        {showCodePreview ? <EyeOff size={13} /> : <Eye size={13} />}
                        {showCodePreview ? "Hide Preview" : "View Code Preview"}
                      </button>
                    </div>

                    {showCodePreview && (
                      <div style={{ contain: "paint layout" }}>
                        <textarea
                          rows={6}
                          readOnly
                          value={codePreviewInfo.previewText}
                          className="w-full p-3.5 bg-slate-900 text-emerald-400 border border-slate-800 rounded-xl text-xs font-mono focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {language === "cpp" ? "Build & Compilation Dependencies (Makefile / Compiler flags)" : "Dependencies (`requirements.txt`)"}
                  </label>
                  <textarea
                    rows={3}
                    value={dependencies}
                    onChange={(e) => setDependencies(e.target.value)}
                    placeholder={language === "cpp" ? "g++ -O3 -std=c++20 main.cpp -o strategy_runner" : "pandas>=2.0.0\nnumpy>=1.24.0"}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                  />
                </div>
              </div>
            )}



            {activeTab === "provenance" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Data Sources & Provenance Record
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={dataProvenance}
                    onChange={(e) => setDataProvenance(e.target.value)}
                    placeholder="Specify data source, fields, timestamping convention, publication lag, and transformations for every data stream feeding your algorithm..."
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue font-mono"
                  />
                </div>
              </div>
            )}

            {activeTab === "reproduction" && (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider">
                    <span>Enforced 1-Click Evaluation Command</span>
                    <span className="text-emerald-400">Standardized</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg text-slate-200 text-xs overflow-x-auto border border-white/5">
                    {language === "cpp"
                      ? "make && ./strategy_runner market_data.json signals.json"
                      : "python strategy.py market_data.json signals.json"}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    All strategy submissions are automatically tested by the BFB Evaluation Harness using entry point <strong className="text-slate-200">{language === "cpp" ? "strategy.cpp" : "strategy.py"}</strong>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Reproduction & Execution Instructions
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={reproductionInstructions}
                    onChange={(e) => setReproductionInstructions(e.target.value)}
                    placeholder="Provide step-by-step commands for BFB organizers to execute your code from clean data..."
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue font-mono"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="signedConfirmation"
                      checked={signedConfirmation}
                      onChange={(e) => setSignedConfirmation(e.target.checked)}
                      className="mt-1 w-4 h-4 text-bfb-blue rounded border-slate-300 focus:ring-bfb-blue cursor-pointer"
                    />
                    <label
                      htmlFor="signedConfirmation"
                      className="text-xs text-slate-700 dark:text-silver leading-relaxed cursor-pointer"
                    >
                      <span className="font-bold">1. Strategy Freeze Confirmation:</span> I confirm that our team&apos;s code and configuration will be locked at the submission deadline (Nov 22, 11:59 PM PT). No modifications will be made to the strategy logic during the forward window (Nov 30, 2026 – Mar 19, 2027).
                    </label>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="signedSecurityDisclaimer"
                      checked={signedSecurityDisclaimer}
                      onChange={(e) => setSignedSecurityDisclaimer(e.target.checked)}
                      className="mt-1 w-4 h-4 text-bfb-blue rounded border-slate-300 focus:ring-bfb-blue cursor-pointer"
                    />
                    <label
                      htmlFor="signedSecurityDisclaimer"
                      className="text-xs text-slate-700 dark:text-silver leading-relaxed cursor-pointer"
                    >
                      <span className="font-bold text-amber-600 dark:text-amber-400">2. IP Privacy &amp; 1-Click Disqualification Release:</span> I understand that our code must execute cleanly via the 1-click evaluation command or face automatic disqualification. I acknowledge that BFB at UCLA does not guarantee enterprise-grade confidentiality or cybersecurity protection for proprietary trading models, and disclaims all liability for strategy privacy or IP disclosure.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Timestamped &amp; Crypto-Hashed Digest</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-bfb-blue text-white font-bold text-sm rounded-xl hover:bg-bfb-blue/90 transition-colors shadow-lg shadow-bfb-blue/20"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {isResubmission ? `Resubmit Package (Version ${nextVersion})` : "Submit Strategy Deliverables"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <AnimatePresence>
      <div key="submission-portal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Static Isolated Backdrop Layer */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{ transform: "translateZ(0)", contain: "layout style" }}
          className="relative z-10 w-full max-w-3xl"
        >
          {content}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
