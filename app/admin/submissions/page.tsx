"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import JSZip from "jszip";
import {
  Shield,
  Search,
  Filter,
  Download,
  FileText,
  Code2,
  BarChart3,
  Database,
  Lock,
  CheckCircle2,
  AlertCircle,
  Hash,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Eye,
  Copy,
  Check,
  Cpu,
  Layers,
  Terminal,
  FolderDown,
  Archive,
  Loader2,
  LogOut,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { CompetitionSubmission, LanguageType } from "@/lib/types/competition";
import { computeSubmissionHash } from "@/lib/crypto";
import AdminAuthGuard, { useAdminAuth } from "@/components/AdminAuthGuard";

const SAMPLE_ADMIN_SUBMISSIONS: CompetitionSubmission[] = [
  {
    id: "sample-python-001",
    team_name: "Bruin Alpha Research",
    submitted_by_id: "user-py-01",
    submitted_by_email: "alex.bruin@ucla.edu",
    version: 1,
    is_latest: true,
    submitted_at: "2026-10-01T14:32:00Z",
    crypto_hash: "f6a552e52770b2baf09b95a430fe1659bed07769cc9b8006754bfe0451c396dc",
    language: "python",
    research_memo_title: "Statistical Arbitrage via Cointegration & Volatility Targeting",
    research_memo_content: `# Statistical Arbitrage via Cointegration & Volatility Targeting

## Executive Summary
This paper introduces an end-to-end quantitative trading strategy combining mean-reversion pairs trading with Dynamic Volatility Scaling.

## Key Strategy Mechanics
1. **Engle-Granger Cointegration Test**: Filters asset pairs with p-value < 0.01 over a 60-day rolling lookback.
2. **Dynamic Volatility Scaling**: Scales overall leverage inversely with 20-day realized parkinson volatility.

## Risk Controls
- Max position sizing capped at 10% per ticker.
- Stop-loss triggered if spread z-score exceeds |3.5|.`,
    strategy_code_filename: "strategy.py",
    strategy_code_content: `"""
BFB at UCLA - Alpha Research Competition
Python Strategy Submission: Bruin Alpha Research
"""
import sys
import json
import numpy as np
import pandas as pd
from typing import Dict, Any

def generate_signals(market_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Core Alpha Strategy Signal Generator.
    Calculates target allocation weights based on rolling mean-reversion.
    """
    target_weights: Dict[str, float] = {}
    prices = market_data.get("prices", {})
    if not prices:
        return target_weights

    df = pd.DataFrame(prices)
    returns = df.pct_change().dropna()
    mean_rev = -1.0 * returns.tail(5).mean()
    
    # Normalize weights to sum to gross exposure 1.0
    norm_sum = mean_rev.abs().sum()
    if norm_sum > 0:
        weights = mean_rev / norm_sum
        for col in weights.index:
            target_weights[col] = float(np.round(weights[col], 4))
    
    return target_weights

def main():
    if len(sys.argv) >= 3:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            data = json.load(f)
        signals = generate_signals(data)
        with open(sys.argv[2], "w", encoding="utf-8") as f:
            json.dump(signals, f, indent=2)

if __name__ == "__main__":
    main()`,
    entry_point: "strategy.py",
    dependencies: "numpy>=1.24.0\npandas>=2.0.0\nscipy>=1.10.0",
    backtest_metrics: {
      expected_sharpe: 2.14,
      expected_calmar: 2.85,
      max_drawdown_pct: 7.2,
      gross_exposure_pct: 100.0,
      net_exposure_pct: 0.5,
      annual_turnover_pct: 420.0,
      trade_count: 1240,
      win_rate_pct: 56.4,
      benchmark_name: "S&P 500 ETF (SPY)",
    },
    data_provenance: "Tested on 5-minute bar equities data from Polygon.io and Alpha Vantage covering 2021-2025. No forward bias; clean train/test split.",
    reproduction_instructions: "# Reproduction Instructions\n1. Ensure Python 3.10+ is installed.\n2. Install requirements: `pip install -r requirements.txt`.\n3. Execute strategy: `python3 strategy.py market_data.json output_signals.json`.",
    signed_confirmation: true,
  },
  {
    id: "sample-cpp-002",
    team_name: "Apex High Frequency",
    submitted_by_id: "user-cpp-02",
    submitted_by_email: "sam.cpp@ucla.edu",
    version: 2,
    is_latest: true,
    submitted_at: "2026-10-01T16:15:00Z",
    crypto_hash: "36dbe6ebe940b61f3865a2317f9549839fb226dbb80610cda83b31e7aca03a83",
    language: "cpp",
    research_memo_title: "Ultra-Low Latency Order Flow Imbalance (OFI) Predictor",
    research_memo_content: `# Ultra-Low Latency Order Flow Imbalance (OFI) Predictor

## Executive Summary
This submission presents a C++20 implementation of high-frequency order flow imbalance features optimized for microsecond latency execution.

## System Architecture
- Zero-allocation memory pool for L1 order book updates.
- SIMD vectorization for cross-sectional signal aggregation.`,
    strategy_code_filename: "strategy.cpp",
    strategy_code_content: `/**
 * BFB at UCLA - Alpha Research Competition
 * C++ Strategy Submission: Apex High Frequency
 */
#include <iostream>
#include <fstream>
#include <string>
#include <unordered_map>

std::unordered_map<std::string, double> generate_signals(const std::string& market_data_json) {
    std::unordered_map<std::string, double> target_weights;
    target_weights["AAPL"] = 0.25;
    target_weights["MSFT"] = 0.25;
    target_weights["NVDA"] = 0.25;
    target_weights["GOOGL"] = 0.25;
    return target_weights;
}

int main(int argc, char* argv[]) {
    if (argc >= 3) {
        std::ifstream in(argv[1]);
        std::string content((std::istreambuf_iterator<char>(in)), std::istreambuf_iterator<char>());
        auto signals = generate_signals(content);
        
        std::ofstream out(argv[2]);
        out << "{\n";
        bool first = true;
        for (const auto& [ticker, weight] : signals) {
            if (!first) out << ",\n";
            out << "  \"" << ticker << "\": " << weight;
            first = false;
        }
        out << "\n}\n";
    }
    return 0;
}`,
    entry_point: "strategy.cpp",
    dependencies: "g++ -O3 -std=c++20 strategy.cpp -o strategy_runner",
    backtest_metrics: {
      expected_sharpe: 2.89,
      expected_calmar: 3.42,
      max_drawdown_pct: 4.8,
      gross_exposure_pct: 100.0,
      net_exposure_pct: 0.0,
      annual_turnover_pct: 1250.0,
      trade_count: 8900,
      win_rate_pct: 59.8,
      benchmark_name: "S&P 500 ETF (SPY)",
    },
    data_provenance: "High-frequency tick data backtested using custom C++ market simulator with 50-microsecond synthetic queue latency.",
    reproduction_instructions: "# Reproduction Instructions\n1. Compile with Makefile: `make` or `g++ -O3 -std=c++20 strategy.cpp -o strategy_runner`.\n2. Execute strategy: `./strategy_runner market_data.json output_signals.json`.",
    signed_confirmation: true,
  },
];

type ModalTab = "memo" | "code" | "metrics" | "provenance" | "reproduction";

function AdminSubmissionsDashboardContent() {
  const { logout } = useAdminAuth();
  const [submissions, setSubmissions] = useState<CompetitionSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<"all" | "python" | "cpp">("all");
  const [latestOnly, setLatestOnly] = useState(true);

  // Download ZIP loading states
  const [downloadingZipId, setDownloadingZipId] = useState<string | null>(null);
  const [downloadingAllZip, setDownloadingAllZip] = useState<boolean>(false);

  // Inspector Modal state
  const [selectedSubmission, setSelectedSubmission] = useState<CompetitionSubmission | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<ModalTab>("memo");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Hash verification audit state
  const [verifyingHash, setVerifyingHash] = useState(false);
  const [hashVerificationResult, setHashVerificationResult] = useState<{
    computedHash: string;
    matches: boolean;
  } | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error: sbError } = await supabase
          .from("competition_submissions")
          .select("*")
          .order("submitted_at", { ascending: false });

        if (sbError) {
          console.warn("Supabase fetch failed, falling back to local/sample data:", sbError.message);
          loadFallbackSubmissions();
        } else if (data && data.length > 0) {
          setSubmissions(data as CompetitionSubmission[]);
        } else {
          loadFallbackSubmissions();
        }
      } else {
        loadFallbackSubmissions();
      }
    } catch (err) {
      console.warn("Error fetching submissions:", err);
      loadFallbackSubmissions();
    } finally {
      setLoading(false);
    }
  }, []);

  function loadFallbackSubmissions() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bfb_competition_submissions");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSubmissions(parsed);
            return;
          }
        } catch (e) {
          console.error("Failed to parse local submissions", e);
        }
      }
    }
    setSubmissions(SAMPLE_ADMIN_SUBMISSIONS);
  }

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (latestOnly && !sub.is_latest) return false;
      if (languageFilter !== "all" && sub.language !== languageFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTeam = sub.team_name.toLowerCase().includes(q);
        const matchEmail = sub.submitted_by_email.toLowerCase().includes(q);
        const matchHash = sub.crypto_hash.toLowerCase().includes(q);
        const matchTitle = sub.research_memo_title?.toLowerCase().includes(q);
        if (!matchTeam && !matchEmail && !matchHash && !matchTitle) return false;
      }
      return true;
    });
  }, [submissions, searchQuery, languageFilter, latestOnly]);

  // Statistics
  const stats = useMemo(() => {
    const total = submissions.length;
    const uniqueTeams = new Set(submissions.map((s) => s.team_name)).size;
    const pythonCount = submissions.filter((s) => s.language === "python").length;
    const cppCount = submissions.filter((s) => s.language === "cpp").length;
    return { total, uniqueTeams, pythonCount, cppCount };
  }, [submissions]);

  // Cryptographic Hash Audit function
  async function runHashVerification(sub: CompetitionSubmission) {
    setVerifyingHash(true);
    setHashVerificationResult(null);
    try {
      const computed = await computeSubmissionHash({
        team_name: sub.team_name,
        submitted_at: sub.submitted_at,
        submitted_by_email: sub.submitted_by_email,
        version: sub.version,
        deliverables: {
          research_memo_title: sub.research_memo_title,
          research_memo_content: sub.research_memo_content,
          research_memo_file_name: sub.research_memo_file_name,
          language: sub.language as LanguageType,
          strategy_code_filename: sub.strategy_code_filename,
          strategy_code_content: sub.strategy_code_content,
          entry_point: sub.entry_point,
          dependencies: sub.dependencies,
          backtest_metrics: sub.backtest_metrics,
          data_provenance: sub.data_provenance,
          reproduction_instructions: sub.reproduction_instructions,
          signed_confirmation: sub.signed_confirmation,
        },
      });

      const matches = computed.toLowerCase() === (sub.crypto_hash || "").toLowerCase();
      setHashVerificationResult({ computedHash: computed, matches });
    } catch (e) {
      console.error("Hash verification error", e);
    } finally {
      setVerifyingHash(false);
    }
  }

  function handleOpenModal(sub: CompetitionSubmission) {
    setSelectedSubmission(sub);
    setActiveModalTab("memo");
    setHashVerificationResult(null);
    runHashVerification(sub);
  }

  function downloadSubmissionFile(filename: string, content: string, mimeType: string = "text/plain") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Generates and downloads a real .ZIP archive containing all individual deliverable files:
   * - research_memo.md
   * - strategy.py / strategy.cpp
   * - requirements.txt / Makefile
   * - backtest_metrics.json
   * - data_provenance.md
   * - reproduction_instructions.md
   * - submission_manifest.json
   */
  async function downloadSubmissionZIP(sub: CompetitionSubmission) {
    setDownloadingZipId(sub.id);
    try {
      const zip = new JSZip();
      const safeTeamName = (sub.team_name || "Team").replace(/\s+/g, "_");
      const folderName = `${safeTeamName}_v${sub.version}`;
      const folder = zip.folder(folderName) || zip;

      // 1. Research Memo (.md)
      folder.file(
        "research_memo.md",
        sub.research_memo_content || "# Research Memo\n\nNo memo text provided."
      );

      // 2. Strategy Code (.py / .cpp)
      const codeFileName =
        sub.strategy_code_filename || (sub.language === "cpp" ? "strategy.cpp" : "strategy.py");
      folder.file(codeFileName, sub.strategy_code_content || "");

      // 3. Dependencies / Makefile
      const depsFileName = sub.language === "cpp" ? "Makefile" : "requirements.txt";
      folder.file(depsFileName, sub.dependencies || "");

      // 4. Backtest Metrics (.json)
      folder.file("backtest_metrics.json", JSON.stringify(sub.backtest_metrics || {}, null, 2));

      // 5. Data Provenance (.md)
      folder.file("data_provenance.md", sub.data_provenance || "");

      // 6. Reproduction Instructions (.md)
      folder.file("reproduction_instructions.md", sub.reproduction_instructions || "");

      // 7. Submission Manifest (.json)
      const manifest = {
        team_name: sub.team_name,
        version: sub.version,
        submitted_at: sub.submitted_at,
        submitted_by_email: sub.submitted_by_email,
        crypto_hash: sub.crypto_hash,
        language: sub.language,
        entry_point: sub.entry_point || codeFileName,
      };
      folder.file("submission_manifest.json", JSON.stringify(manifest, null, 2));

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${folderName}_package.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP download error:", err);
    } finally {
      setDownloadingZipId(null);
    }
  }

  /**
   * Bundles all team submissions into a master ZIP archive containing structured sub-folders.
   */
  async function exportAllSubmissionsZIP() {
    if (submissions.length === 0) return;
    setDownloadingAllZip(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder("submissions_archive") || zip;

      for (const sub of submissions) {
        const safeTeamName = (sub.team_name || "Team").replace(/\s+/g, "_");
        const folderName = `${safeTeamName}_v${sub.version}`;
        const subFolder = rootFolder.folder(folderName);
        if (!subFolder) continue;

        subFolder.file("research_memo.md", sub.research_memo_content || "");
        const codeFileName =
          sub.strategy_code_filename || (sub.language === "cpp" ? "strategy.cpp" : "strategy.py");
        subFolder.file(codeFileName, sub.strategy_code_content || "");
        const depsFileName = sub.language === "cpp" ? "Makefile" : "requirements.txt";
        subFolder.file(depsFileName, sub.dependencies || "");
        subFolder.file("backtest_metrics.json", JSON.stringify(sub.backtest_metrics || {}, null, 2));
        subFolder.file("data_provenance.md", sub.data_provenance || "");
        subFolder.file("reproduction_instructions.md", sub.reproduction_instructions || "");
        subFolder.file(
          "submission_manifest.json",
          JSON.stringify(
            {
              team_name: sub.team_name,
              version: sub.version,
              submitted_at: sub.submitted_at,
              submitted_by_email: sub.submitted_by_email,
              crypto_hash: sub.crypto_hash,
              language: sub.language,
              entry_point: sub.entry_point || codeFileName,
            },
            null,
            2
          )
        );
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BFB_Alpha_Research_All_Submissions_${new Date().toISOString().substring(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Bulk ZIP export error:", err);
    } finally {
      setDownloadingAllZip(false);
    }
  }

  function copyTextToClipboard(text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/competition/alpha-research"
            className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft size={16} /> Back to Competition
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Shield className="text-bfb-blue dark:text-accent" size={20} />
            <h1 className="font-serif text-lg font-bold text-white tracking-tight">
              Admin Submissions Dashboard
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent rounded-full">
              BFB Organizers & Judges
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg bg-white/5 flex items-center gap-1.5 text-xs font-medium"
            title="Refresh Submissions"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>

          <button
            onClick={exportAllSubmissionsZIP}
            disabled={downloadingAllZip || submissions.length === 0}
            className="px-3.5 py-2 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/40 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {downloadingAllZip ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Archive size={14} />
            )}
            <span>
              {downloadingAllZip
                ? "Packaging All ZIPs..."
                : `Export All ZIPs Archive (${submissions.length})`}
            </span>
          </button>

          {/* 1-Click Lock Portal Button */}
          <button
            onClick={logout}
            className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center gap-1.5 text-xs font-semibold"
            title="Lock Admin Portal & Logout"
          >
            <LogOut size={14} /> Lock Portal
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Stats Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-white/10 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Submissions</p>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">{stats.total}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Layers size={22} />
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-white/10 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Registered Teams</p>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">{stats.uniqueTeams}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Shield size={22} />
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-white/10 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Python Strategies</p>
              <h3 className="text-2xl font-bold font-serif text-sky-400 mt-1">{stats.pythonCount}</h3>
            </div>
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
              <Code2 size={22} />
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-white/10 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">C++ Strategies</p>
              <h3 className="text-2xl font-bold font-serif text-purple-400 mt-1">{stats.cppCount}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <Cpu size={22} />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-900/80 border border-white/10 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team name, submitter email, or SHA-256 hash..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-white/10 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-bfb-blue placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Language Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-white/10 rounded-lg">
              <button
                onClick={() => setLanguageFilter("all")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  languageFilter === "all" ? "bg-bfb-blue text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                All Languages
              </button>
              <button
                onClick={() => setLanguageFilter("python")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  languageFilter === "python" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setLanguageFilter("cpp")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  languageFilter === "cpp" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                C++
              </button>
            </div>

            {/* Latest Only Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={latestOnly}
                onChange={(e) => setLatestOnly(e.target.checked)}
                className="rounded border-white/20 bg-slate-950 text-bfb-blue focus:ring-bfb-blue"
              />
              Latest Versions Only
            </label>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Team & Version</th>
                  <th className="py-3.5 px-4">Submitter Email</th>
                  <th className="py-3.5 px-4">Language / Entry</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-4">Sharpe / MaxDD</th>
                  <th className="py-3.5 px-4">SHA-256 Hash Digest</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw size={24} className="animate-spin text-bfb-blue" />
                        <span>Loading team submissions from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle size={24} className="text-amber-400" />
                        <span>No strategy submissions found matching your filters.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{sub.team_name}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 text-slate-300 rounded">
                            v{sub.version}
                          </span>
                          {sub.is_latest && (
                            <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                              LATEST
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[220px] mt-0.5">
                          {sub.research_memo_title || "Untitled Research Memo"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {sub.submitted_by_email}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {sub.language === "python" ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded flex items-center gap-1">
                              <Code2 size={11} /> Python
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded flex items-center gap-1">
                              <Cpu size={11} /> C++
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-slate-400">
                            {sub.entry_point || (sub.language === "cpp" ? "strategy.cpp" : "strategy.py")}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(sub.submitted_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        {sub.backtest_metrics?.expected_sharpe != null ? (
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-bold">
                              {sub.backtest_metrics.expected_sharpe.toFixed(2)} Sharpe
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              -{sub.backtest_metrics.max_drawdown_pct ?? 0}% MaxDD
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-sans">Unspecified</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Hash size={12} className="text-accent shrink-0" />
                          <span className="text-accent truncate max-w-[140px]" title={sub.crypto_hash}>
                            {sub.crypto_hash ? `${sub.crypto_hash.substring(0, 12)}...` : "None"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Prominent High-Visibility View Button */}
                          <button
                            onClick={() => handleOpenModal(sub)}
                            className="px-3.5 py-1.5 bg-bfb-blue hover:bg-bfb-blue/90 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-bfb-blue/25 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95"
                          >
                            <Eye size={14} className="text-white" /> Inspect Deliverables
                          </button>

                          {/* True .ZIP Archive Downloader */}
                          <button
                            onClick={() => downloadSubmissionZIP(sub)}
                            disabled={downloadingZipId === sub.id}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
                            title="Download ZIP Archive Package containing all deliverables"
                          >
                            {downloadingZipId === sub.id ? (
                              <Loader2 size={13} className="animate-spin text-accent" />
                            ) : (
                              <FolderDown size={13} className="text-accent" />
                            )}
                            <span>{downloadingZipId === sub.id ? "Zipping..." : "Download ZIP"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Interactive Submissions Inspector Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-bfb-blue/20 text-accent rounded-xl">
                  <Shield size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-serif font-bold text-white">
                      {selectedSubmission.team_name}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 text-slate-300 rounded">
                      Version {selectedSubmission.version}
                    </span>
                    {selectedSubmission.language === "python" ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded">
                        Python (strategy.py)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                        C++ (strategy.cpp)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Submitter: {selectedSubmission.submitted_by_email} | Submitted: {new Date(selectedSubmission.submitted_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadSubmissionZIP(selectedSubmission)}
                  disabled={downloadingZipId === selectedSubmission.id}
                  className="px-3 py-1.5 bg-bfb-blue hover:bg-bfb-blue/90 text-white border border-bfb-blue/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-bfb-blue/20"
                >
                  {downloadingZipId === selectedSubmission.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <FolderDown size={14} />
                  )}
                  <span>{downloadingZipId === selectedSubmission.id ? "Zipping..." : "Download ZIP Package"}</span>
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg bg-white/5"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Cryptographic SHA-256 Digest Verification Banner */}
            <div className="px-5 py-2.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 truncate pr-4">
                <Hash size={14} className="text-accent shrink-0" />
                <span className="text-slate-400">SHA-256 Checksum:</span>
                <span className="text-accent truncate font-semibold">
                  {selectedSubmission.crypto_hash}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {verifyingHash ? (
                  <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                    <RefreshCw size={12} className="animate-spin" /> Verifying...
                  </span>
                ) : hashVerificationResult ? (
                  hashVerificationResult.matches ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded flex items-center gap-1">
                      <CheckCircle2 size={12} /> Hash Verified Intact
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded flex items-center gap-1">
                      <AlertCircle size={12} /> Hash Mismatch
                    </span>
                  )
                ) : null}
                <button
                  onClick={() => copyTextToClipboard(selectedSubmission.crypto_hash, setCopiedHash)}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded flex items-center gap-1 text-[11px]"
                >
                  {copiedHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  {copiedHash ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex px-5 pt-3 border-b border-white/10 gap-2 bg-slate-950/40 overflow-x-auto">
              <button
                onClick={() => setActiveModalTab("memo")}
                className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeModalTab === "memo"
                    ? "bg-slate-900 border-t-2 border-bfb-blue text-accent shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText size={14} /> 1. Research Memo
              </button>

              <button
                onClick={() => setActiveModalTab("code")}
                className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeModalTab === "code"
                    ? "bg-slate-900 border-t-2 border-bfb-blue text-accent shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Code2 size={14} /> 2. Strategy Code ({selectedSubmission.entry_point || (selectedSubmission.language === "cpp" ? "strategy.cpp" : "strategy.py")})
              </button>

              <button
                onClick={() => setActiveModalTab("metrics")}
                className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeModalTab === "metrics"
                    ? "bg-slate-900 border-t-2 border-bfb-blue text-accent shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BarChart3 size={14} /> 3. Backtest Metrics
              </button>

              <button
                onClick={() => setActiveModalTab("provenance")}
                className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeModalTab === "provenance"
                    ? "bg-slate-900 border-t-2 border-bfb-blue text-accent shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Database size={14} /> 4. Data Provenance
              </button>

              <button
                onClick={() => setActiveModalTab("reproduction")}
                className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeModalTab === "reproduction"
                    ? "bg-slate-900 border-t-2 border-bfb-blue text-accent shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Terminal size={14} /> 5. Reproduction Instructions
              </button>
            </div>

            {/* Modal Body Tab Content */}
            <div className="p-6 overflow-y-auto flex-1 text-slate-200 text-sm space-y-4">
              {/* Tab 1: Research Memo */}
              {activeModalTab === "memo" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="text-lg font-bold font-serif text-white">
                      {selectedSubmission.research_memo_title || "Research Memo"}
                    </h4>
                    <button
                      onClick={() =>
                        downloadSubmissionFile(
                          `${selectedSubmission.team_name.replace(/\s+/g, "_")}_research_memo.md`,
                          selectedSubmission.research_memo_content
                        )
                      }
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded flex items-center gap-1 text-xs font-medium"
                    >
                      <Download size={13} /> Download .md
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 border border-white/10 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                    {selectedSubmission.research_memo_content || "No research memo content provided."}
                  </pre>
                </div>
              )}

              {/* Tab 2: Strategy Code */}
              {activeModalTab === "code" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-accent text-sm">
                        {selectedSubmission.entry_point || (selectedSubmission.language === "cpp" ? "strategy.cpp" : "strategy.py")}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({selectedSubmission.strategy_code_content.split("\n").length} lines)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          copyTextToClipboard(selectedSubmission.strategy_code_content, setCopiedCode)
                        }
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded flex items-center gap-1 text-xs font-medium"
                      >
                        {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        {copiedCode ? "Copied Code" : "Copy Code"}
                      </button>
                      <button
                        onClick={() =>
                          downloadSubmissionFile(
                            selectedSubmission.entry_point || (selectedSubmission.language === "cpp" ? "strategy.cpp" : "strategy.py"),
                            selectedSubmission.strategy_code_content
                          )
                        }
                        className="px-2.5 py-1 bg-bfb-blue hover:bg-bfb-blue/90 text-white rounded flex items-center gap-1 text-xs font-semibold"
                      >
                        <Download size={13} /> Download Code
                      </button>
                    </div>
                  </div>

                  {/* 1-Click Local Execution Snippet Box */}
                  <div className="p-3 bg-slate-950 border border-bfb-blue/30 rounded-xl flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-accent shrink-0" />
                      <span className="text-slate-400">Local Execution Command:</span>
                      <code className="text-emerald-400 font-bold">
                        {selectedSubmission.language === "cpp"
                          ? "make && ./strategy_runner market_data.json output_signals.json"
                          : "python3 strategy.py market_data.json output_signals.json"}
                      </code>
                    </div>
                  </div>

                  <pre className="p-4 bg-slate-950 border border-white/10 rounded-xl font-mono text-xs text-slate-200 whitespace-pre overflow-x-auto leading-relaxed max-h-[400px]">
                    {selectedSubmission.strategy_code_content}
                  </pre>

                  {selectedSubmission.dependencies && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Dependencies / Build Config ({selectedSubmission.language === "cpp" ? "Makefile" : "requirements.txt"})
                      </h5>
                      <pre className="p-3 bg-slate-950 border border-white/10 rounded-lg font-mono text-xs text-slate-300">
                        {selectedSubmission.dependencies}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Backtest Metrics */}
              {activeModalTab === "metrics" && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold font-serif text-white">Self-Reported Backtest Metrics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-950 border border-white/10 rounded-xl">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Expected Sharpe</span>
                      <p className="text-xl font-bold font-serif text-emerald-400 mt-1">
                        {selectedSubmission.backtest_metrics?.expected_sharpe?.toFixed(2) ?? "N/A"}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-950 border border-white/10 rounded-xl">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Calmar Ratio</span>
                      <p className="text-xl font-bold font-serif text-sky-400 mt-1">
                        {selectedSubmission.backtest_metrics?.expected_calmar?.toFixed(2) ?? "N/A"}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-950 border border-white/10 rounded-xl">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Max Drawdown</span>
                      <p className="text-xl font-bold font-serif text-red-400 mt-1">
                        {selectedSubmission.backtest_metrics?.max_drawdown_pct != null
                          ? `-${selectedSubmission.backtest_metrics.max_drawdown_pct}%`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-950 border border-white/10 rounded-xl">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Win Rate</span>
                      <p className="text-xl font-bold font-serif text-purple-400 mt-1">
                        {selectedSubmission.backtest_metrics?.win_rate_pct != null
                          ? `${selectedSubmission.backtest_metrics.win_rate_pct}%`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-white/10 rounded-xl space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Gross Exposure:</span>
                      <span className="text-white font-bold">{selectedSubmission.backtest_metrics?.gross_exposure_pct ?? 100}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Net Exposure:</span>
                      <span className="text-white font-bold">{selectedSubmission.backtest_metrics?.net_exposure_pct ?? 0}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Annual Turnover:</span>
                      <span className="text-white font-bold">{selectedSubmission.backtest_metrics?.annual_turnover_pct ?? "N/A"}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Benchmark Asset:</span>
                      <span className="text-accent font-bold">{selectedSubmission.backtest_metrics?.benchmark_name || "S&P 500 ETF (SPY)"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Data Provenance */}
              {activeModalTab === "provenance" && (
                <div className="space-y-3">
                  <h4 className="text-base font-bold font-serif text-white">Data Sources & Provenance Statement</h4>
                  <pre className="p-4 bg-slate-950 border border-white/10 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedSubmission.data_provenance || "No data provenance statement provided."}
                  </pre>
                </div>
              )}

              {/* Tab 5: Reproduction Instructions */}
              {activeModalTab === "reproduction" && (
                <div className="space-y-3">
                  <h4 className="text-base font-bold font-serif text-white">Standardized Reproduction Instructions</h4>
                  <pre className="p-4 bg-slate-950 border border-white/10 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedSubmission.reproduction_instructions || "No reproduction instructions provided."}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSubmissionsPage() {
  return (
    <AdminAuthGuard>
      <AdminSubmissionsDashboardContent />
    </AdminAuthGuard>
  );
}
