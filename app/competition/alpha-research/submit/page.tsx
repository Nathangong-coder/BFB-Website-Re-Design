"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileCode,
  ShieldCheck,
  Hash,
  Loader2,
  AlertCircle,
  CheckCircle2,
  History,
  Sparkles,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type {
  CompetitionRegistration,
  CompetitionSubmission,
} from "@/lib/types/competition";
import CompetitionSubmissionPortal from "@/components/CompetitionSubmissionPortal";
import SubmissionHashInspector from "@/components/SubmissionHashInspector";

export default function AlphaResearchSubmitPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionUser, setSessionUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<CompetitionRegistration | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<CompetitionSubmission | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (!isSupabaseConfigured()) {
          setLoading(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setSessionUser(session.user);
          await fetchProfileAndSubmissions(session.user.id, session.user.email || "");
        } else {
          setSessionUser(null);
          setUserProfile(null);
          setLatestSubmission(null);
        }
      } catch (err) {
        console.error("Error loading submission page data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSessionUser(session.user);
        fetchProfileAndSubmissions(session.user.id, session.user.email || "");
      } else {
        setSessionUser(null);
        setUserProfile(null);
        setLatestSubmission(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshTrigger]);

  async function fetchProfileAndSubmissions(userId: string, userEmail: string) {
    try {
      // 1. Fetch user registration profile
      const { data: profile } = await supabase
        .from("competition_registrations")
        .select("*")
        .eq("id", userId)
        .single();

      if (profile) {
        setUserProfile(profile);

        // 2. Fetch latest submission if team exists
        if (profile.team_name) {
          const { data: subData } = await supabase
            .from("competition_submissions")
            .select("*")
            .ilike("team_name", profile.team_name.trim())
            .eq("is_latest", true)
            .order("version", { ascending: false })
            .limit(1)
            .single();

          if (subData) {
            setLatestSubmission(subData);
          }
        }
      } else {
        // Create initial fallback profile if not found
        setUserProfile({
          id: userId,
          full_name: userEmail.split("@")[0] || "Competitor",
          email: userEmail,
          class_year: "2027",
          team_name: null,
        });
      }
    } catch (err) {
      console.error("Error fetching user profile/submissions:", err);
    }
  }

  function handleSubmissionSuccess() {
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      {/* Top Header */}
      <section className="relative pt-page pb-8 px-gutter overflow-hidden border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01]">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/competition/alpha-research"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-silver/60 hover:text-bfb-blue dark:hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bfb-blue rounded-sm"
            >
              <ArrowLeft
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Alpha Research Competition Overview
            </Link>

            {userProfile?.team_name && latestSubmission && (
              <button
                onClick={() => setIsInspectorOpen(true)}
                className="px-3 py-1.5 bg-slate-900 text-accent font-mono text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-800 shadow-sm"
              >
                <Hash size={14} /> View Cryptographic SHA-256 Inspector
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue dark:text-accent flex items-center gap-2">
                <FileCode size={16} /> Strategy Deliverables Submission Portal
              </span>
              {latestSubmission && (
                <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active Version {latestSubmission.version} Submitted
                </span>
              )}
            </div>

            <h1 className="text-h1 font-serif text-slate-900 dark:text-silver leading-tight">
              Submit Alpha Strategy Deliverables
            </h1>
            <p className="text-slate-500 dark:text-silver/60 text-body leading-relaxed max-w-2xl">
              Submit your Research Memo, Python/C++ runnable strategy code, data provenance, and signed strategy freeze confirmation.
              Resubmit as many times as needed before <strong className="text-slate-900 dark:text-silver">Sun, Nov 22, 2026 at 11:59 PM PT</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-section px-gutter flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 size={28} className="animate-spin text-bfb-blue" />
              <span className="text-sm font-medium">Loading submission portal &amp; session status...</span>
            </div>
          ) : !sessionUser ? (
            /* STATE 1: NOT SIGNED IN */
            <div className="p-8 bg-white dark:bg-midnight border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl text-center space-y-5 max-w-xl mx-auto">
              <div className="w-12 h-12 bg-bfb-blue/10 text-bfb-blue dark:text-accent rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-silver">
                Sign In Required to Submit Strategy Deliverables
              </h3>
              <p className="text-xs text-slate-500 dark:text-silver/60 leading-relaxed">
                Please register your team and sign in to access the BFB at UCLA deliverables submission portal.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/competition/alpha-research/register"
                  className="px-6 py-3 bg-bfb-blue text-white font-bold text-xs rounded-xl hover:bg-bfb-blue/90 transition-colors shadow-md shadow-bfb-blue/20 flex items-center gap-2"
                >
                  <UserPlus size={16} /> Register / Sign In Now <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : !userProfile?.team_name ? (
            /* STATE 2: SIGNED IN BUT NO TEAM CREATED */
            <div className="p-8 bg-white dark:bg-midnight border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl text-center space-y-5 max-w-xl mx-auto">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto">
                <History size={24} />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-silver">
                Team Registration Required
              </h3>
              <p className="text-xs text-slate-500 dark:text-silver/60 leading-relaxed">
                You are signed in as <strong className="text-slate-900 dark:text-silver">{sessionUser.email}</strong>, but you have not created or joined a team yet. Each submission is tied to a registered team.
              </p>
              <div className="pt-2 flex justify-center">
                <Link
                  href="/competition/alpha-research/register"
                  className="px-6 py-3 bg-bfb-blue text-white font-bold text-xs rounded-xl hover:bg-bfb-blue/90 transition-colors shadow-md shadow-bfb-blue/20 flex items-center gap-2"
                >
                  Create or Join a Team <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            /* STATE 3: READY TO SUBMIT */
            <div className="space-y-6">
              {/* Submission Portal Component */}
              <CompetitionSubmissionPortal
                isOpen={true}
                isInline={true}
                onClose={() => {}}
                teamName={userProfile.team_name}
                userEmail={sessionUser.email || userProfile.email}
                userId={sessionUser.id}
                currentSubmission={latestSubmission}
                onSubmissionSuccess={handleSubmissionSuccess}
              />
            </div>
          )}
        </div>
      </section>

      {/* Cryptographic Hash Inspector Modal */}
      {latestSubmission && (
        <SubmissionHashInspector
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          submission={latestSubmission}
        />
      )}
    </div>
  );
}
