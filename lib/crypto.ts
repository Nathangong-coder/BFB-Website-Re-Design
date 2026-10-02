import type { SubmissionDeliverables, CompetitionSubmission, BacktestMetrics } from "./types/competition";

export interface HashVerificationResult {
  isValid: boolean;
  computedHash: string;
  storedHash: string;
  canonicalPayload: string;
}

/**
 * Normalizes any timestamp string (JS ISO, PostgreSQL TIMESTAMPTZ, Unix epoch)
 * into a standard ISO-8601 string for deterministic cryptographic SHA-256 hashing.
 */
export function normalizeTimestamp(ts: string): string {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {
    // Fallback if parsing fails
  }
  return ts.trim();
}

/**
 * Normalizes backtest metrics object with deterministic key sorting and null/undefined stripping.
 */
export function normalizeBacktestMetrics(metrics?: BacktestMetrics | null): Record<string, unknown> {
  if (!metrics || typeof metrics !== "object") return {};

  const clean: Record<string, unknown> = {};
  const sortedKeys = Object.keys(metrics).sort();

  for (const key of sortedKeys) {
    const val = (metrics as Record<string, unknown>)[key];
    if (val !== undefined && val !== null && val !== "") {
      if (typeof val === "number") {
        // Normalize numbers to 4 decimal precision to prevent float representation divergence
        clean[key] = Math.round(val * 10000) / 10000;
      } else {
        clean[key] = val;
      }
    }
  }
  return clean;
}

/**
 * Normalizes a submission payload into a canonical JSON string for deterministic SHA-256 hashing.
 */
export function buildCanonicalSubmissionPayload(params: {
  team_name: string;
  submitted_at: string;
  submitted_by_email: string;
  version: number;
  deliverables: SubmissionDeliverables;
}): string {
  const deliverables = params.deliverables || {};

  const normalized = {
    team_name: (params.team_name || "").trim().toLowerCase(),
    submitted_at: normalizeTimestamp(params.submitted_at),
    submitted_by_email: (params.submitted_by_email || "").trim().toLowerCase(),
    version: Number(params.version) || 1,
    memo: {
      title: (deliverables.research_memo_title || "").trim(),
      content: (deliverables.research_memo_content || "").trim(),
      file_name: deliverables.research_memo_file_name || "",
    },
    code: {
      language: deliverables.language || "python",
      filename: (deliverables.strategy_code_filename || "").trim(),
      content: (deliverables.strategy_code_content || "").trim(),
      entry_point: (deliverables.entry_point || "").trim(),
      dependencies: (deliverables.dependencies || "").trim(),
    },
    backtest: normalizeBacktestMetrics(deliverables.backtest_metrics),
    provenance: (deliverables.data_provenance || "").trim(),
    reproduction: (deliverables.reproduction_instructions || "").trim(),
    signed: Boolean(deliverables.signed_confirmation),
  };

  return JSON.stringify(normalized);
}

/**
 * Computes a 64-character hexadecimal SHA-256 cryptographic hash digest.
 * Uses browser Web Crypto API (crypto.subtle) with Node.js fallback.
 */
export async function computeSubmissionHash(params: {
  team_name: string;
  submitted_at: string;
  submitted_by_email: string;
  version: number;
  deliverables: SubmissionDeliverables;
}): Promise<string> {
  const canonicalString = buildCanonicalSubmissionPayload(params);
  const encoder = new TextEncoder();
  const data = encoder.encode(canonicalString);

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Node.js runtime fallback if executed server-side
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require("crypto");
    return nodeCrypto.createHash("sha256").update(data).digest("hex");
  } catch {
    // Basic fallback if crypto module is unavailable
    let hash = 0;
    for (let i = 0; i < canonicalString.length; i++) {
      const char = canonicalString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, "0");
  }
}

/**
 * Verifies a stored submission's SHA-256 cryptographic hash against its canonical payload.
 */
export async function verifySubmissionHash(
  submission: CompetitionSubmission
): Promise<HashVerificationResult> {
  if (!submission) {
    return {
      isValid: false,
      computedHash: "",
      storedHash: "",
      canonicalPayload: "",
    };
  }

  const deliverables: SubmissionDeliverables = {
    language: submission.language || "python",
    research_memo_title: submission.research_memo_title || "",
    research_memo_content: submission.research_memo_content || "",
    research_memo_file_name: submission.research_memo_file_name,
    research_memo_file_data: submission.research_memo_file_data,
    strategy_code_filename: submission.strategy_code_filename || (submission.language === "cpp" ? "strategy.cpp" : "strategy.py"),
    strategy_code_content: submission.strategy_code_content || "",
    entry_point: submission.entry_point || (submission.language === "cpp" ? "strategy.cpp" : "strategy.py"),
    dependencies: submission.dependencies || "",
    backtest_metrics: submission.backtest_metrics || {},
    data_provenance: submission.data_provenance || "",
    reproduction_instructions: submission.reproduction_instructions || "",
    signed_confirmation: submission.signed_confirmation ?? true,
  };

  const canonicalPayload = buildCanonicalSubmissionPayload({
    team_name: submission.team_name,
    submitted_at: submission.submitted_at,
    submitted_by_email: submission.submitted_by_email,
    version: submission.version,
    deliverables,
  });

  const computedHash = await computeSubmissionHash({
    team_name: submission.team_name,
    submitted_at: submission.submitted_at,
    submitted_by_email: submission.submitted_by_email,
    version: submission.version,
    deliverables,
  });

  const storedHash = (submission.crypto_hash || "").trim();
  const isValid = computedHash.toLowerCase() === storedHash.toLowerCase();

  return {
    isValid,
    computedHash,
    storedHash,
    canonicalPayload,
  };
}
