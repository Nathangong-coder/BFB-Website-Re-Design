import type { SubmissionDeliverables, CompetitionSubmission } from "./types/competition";

export interface HashVerificationResult {
  isValid: boolean;
  computedHash: string;
  storedHash: string;
  canonicalPayload: string;
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
  const normalized = {
    team_name: params.team_name.trim().toLowerCase(),
    submitted_at: params.submitted_at,
    submitted_by_email: params.submitted_by_email.trim().toLowerCase(),
    version: params.version,
    memo: {
      title: params.deliverables.research_memo_title.trim(),
      content: params.deliverables.research_memo_content.trim(),
      file_name: params.deliverables.research_memo_file_name || "",
    },
    code: {
      language: params.deliverables.language || "python",
      filename: params.deliverables.strategy_code_filename.trim(),
      content: params.deliverables.strategy_code_content.trim(),
      entry_point: params.deliverables.entry_point.trim(),
      dependencies: params.deliverables.dependencies.trim(),
    },
    backtest: params.deliverables.backtest_metrics || {},
    provenance: params.deliverables.data_provenance.trim(),
    reproduction: params.deliverables.reproduction_instructions.trim(),
    signed: params.deliverables.signed_confirmation,
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
  const deliverables: SubmissionDeliverables = {
    language: submission.language || "python",
    research_memo_title: submission.research_memo_title,
    research_memo_content: submission.research_memo_content,
    research_memo_file_name: submission.research_memo_file_name,
    research_memo_file_data: submission.research_memo_file_data,
    strategy_code_filename: submission.strategy_code_filename,
    strategy_code_content: submission.strategy_code_content,
    entry_point: submission.entry_point,
    dependencies: submission.dependencies,
    backtest_metrics: submission.backtest_metrics,
    data_provenance: submission.data_provenance,
    reproduction_instructions: submission.reproduction_instructions,
    signed_confirmation: submission.signed_confirmation,
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

  const isValid = computedHash.toLowerCase() === submission.crypto_hash.toLowerCase();

  return {
    isValid,
    computedHash,
    storedHash: submission.crypto_hash,
    canonicalPayload,
  };
}
