import { useEffect, useState } from "react";

// Sun, Nov 22, 2026 11:59 PM PT (PST = UTC-8). The server enforces the same
// cutoff from competition_settings; this copy only drives the UI.
// NEXT_PUBLIC_SUBMISSION_DEADLINE (ISO 8601) overrides it for testing.
const DEFAULT_DEADLINE = "2026-11-23T08:00:00Z";

const override = process.env.NEXT_PUBLIC_SUBMISSION_DEADLINE;
const overrideTime = override ? Date.parse(override) : NaN;

export const SUBMISSION_DEADLINE = new Date(
  Number.isNaN(overrideTime) ? DEFAULT_DEADLINE : overrideTime
);

export function isPastDeadline(now: number = Date.now()): boolean {
  return now >= SUBMISSION_DEADLINE.getTime();
}

// Re-checks every 30 s so a page left open across the deadline closes
export function useSubmissionsClosed(): boolean {
  const [closed, setClosed] = useState<boolean>(() => isPastDeadline());

  useEffect(() => {
    const id = setInterval(() => setClosed(isPastDeadline()), 30_000);
    return () => clearInterval(id);
  }, []);

  return closed;
}
