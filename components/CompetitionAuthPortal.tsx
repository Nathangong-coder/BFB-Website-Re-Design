"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Lock,
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Loader2,
  ShieldCheck,
  PlusCircle,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  ClassYear,
  CompetitionRegistration,
  TeamMember,
} from "@/lib/types/competition";

interface CompetitionAuthPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLASS_YEARS: ClassYear[] = [
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "Graduate / Other",
];

function getGoogleName(user: SupabaseUser | null): { firstName: string; lastName: string } {
  if (!user) return { firstName: "", lastName: "" };
  const meta = user.user_metadata || {};
  const identityMeta = user.identities?.[0]?.identity_data || {};

  const givenName =
    meta.given_name ||
    meta.first_name ||
    identityMeta.given_name ||
    identityMeta.first_name ||
    "";
  const familyName =
    meta.family_name ||
    meta.last_name ||
    identityMeta.family_name ||
    identityMeta.last_name ||
    "";

  if (givenName || familyName) {
    return {
      firstName: String(givenName).trim(),
      lastName: String(familyName).trim(),
    };
  }

  const fullName =
    meta.full_name ||
    meta.name ||
    identityMeta.full_name ||
    identityMeta.name ||
    "";
  if (fullName) {
    const parts = String(fullName).trim().split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: "" };
    }
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  }

  return { firstName: "", lastName: "" };
}

function getErrorMessage(err: unknown): string {
  if (!err) return "An error occurred. Please try again.";
  if (typeof err === "string") return err;

  const errObj = err as Record<string, unknown>;
  const rawMsg =
    (errObj.message as string) ||
    (errObj.error_description as string) ||
    (errObj.msg as string) ||
    (typeof err === "object" ? JSON.stringify(err) : "");

  if (
    errObj.code === "42P17" ||
    (typeof rawMsg === "string" && rawMsg.includes("infinite recursion"))
  ) {
    return "Supabase RLS Infinite Recursion Error (42P17): An RLS policy on 'competition_registrations' in Supabase is querying itself. Please run the SQL script in 'supabase_setup.sql' in your Supabase SQL Editor to replace recursive policies with non-recursive ones.";
  }

  if (errObj.message && typeof errObj.message === "string" && errObj.message.trim() !== "") {
    return errObj.message;
  }
  if (errObj.error_description && typeof errObj.error_description === "string") {
    return errObj.error_description;
  }
  if (errObj.msg && typeof errObj.msg === "string") {
    return errObj.msg;
  }
  try {
    const str = JSON.stringify(err);
    if (str !== "{}" && str !== "[]" && str !== '""') return str;
  } catch {
    // ignore
  }
  return "An unexpected error occurred. Please check your network or try again.";
}

export default function CompetitionAuthPortal({
  isOpen,
  onClose,
}: CompetitionAuthPortalProps) {
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");
  const [teamTab, setTeamTab] = useState<"create" | "join">("create");

  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingSession, setFetchingSession] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // User state
  const [sessionUser, setSessionUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<CompetitionRegistration | null>(
    null
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [existingTeams, setExistingTeams] = useState<string[]>([]);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState<boolean>(false);

  // Form states - Auth
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [classYear, setClassYear] = useState<ClassYear>("2027");
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);

  // Form states - Google Profile Setup
  const [googleFirstName, setGoogleFirstName] = useState<string>("");
  const [googleLastName, setGoogleLastName] = useState<string>("");
  const [googleClassYear, setGoogleClassYear] = useState<ClassYear>("2027");
  const [isSettingUpProfile, setIsSettingUpProfile] = useState<boolean>(false);

  // Form states - Team
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [joinTeamName, setJoinTeamName] = useState<string>("");

  // Check active session and fetch profile
  useEffect(() => {
    if (!isOpen) return;

    async function loadSession() {
      setFetchingSession(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      try {
        if (!isSupabaseConfigured()) {
          setFetchingSession(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setSessionUser(session.user);
          await fetchProfile(session.user.id, session.user);
        } else {
          setSessionUser(null);
          setUserProfile(null);
          setTeamMembers([]);
          setIsSettingUpProfile(false);
        }

        // Fetch list of existing unique team names for the Join dropdown/autocomplete
        fetchExistingTeams();
      } catch (err: unknown) {
        console.error("Session check error:", err);
      } finally {
        setFetchingSession(false);
      }
    }

    loadSession();

    // Listen to Supabase Auth state changes (handles post-Google OAuth redirect)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSessionUser(session.user);
        fetchProfile(session.user.id, session.user);
      } else {
        setSessionUser(null);
        setUserProfile(null);
        setTeamMembers([]);
        setIsSettingUpProfile(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isOpen]);

  async function fetchExistingTeams() {
    try {
      const { data, error } = await supabase
        .from("competition_registrations")
        .select("team_name")
        .not("team_name", "is", null);

      if (!error && data) {
        const unique = Array.from(
          new Set(
            data
              .map((d: { team_name: string | null }) => d.team_name)
              .filter((name: string | null): name is string => Boolean(name && name.trim() !== ""))
          )
        );
        setExistingTeams(unique);
      }
    } catch (err: unknown) {
      console.error("Error fetching existing teams:", err);
    }
  }

  async function fetchProfile(userId: string, currentUserObj?: SupabaseUser) {
    try {
      const { data } = await supabase
        .from("competition_registrations")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (data && data.class_year) {
        setUserProfile(data as CompetitionRegistration);
        setIsSettingUpProfile(false);
        if (data.team_name) {
          fetchTeamMembers(data.team_name);
        }
      } else {
        // User logged in via Google (or row missing class_year) -> prompt for Google profile setup
        setUserProfile(null);
        setIsSettingUpProfile(true);

        const targetUser = currentUserObj || sessionUser;
        if (targetUser) {
          const { firstName, lastName } = getGoogleName(targetUser);
          setGoogleFirstName(firstName);
          setGoogleLastName(lastName);
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }

  async function handleSaveGoogleProfile(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!sessionUser) {
      setErrorMsg("No active user session found. Please sign in again.");
      return;
    }

    const cleanFirst = googleFirstName.trim();
    const cleanLast = googleLastName.trim();

    if (!cleanFirst || !cleanLast) {
      setErrorMsg("Please enter both your First Name and Last Name.");
      return;
    }

    if (!googleClassYear) {
      setErrorMsg("Please select your graduation year.");
      return;
    }

    setLoading(true);

    try {
      const combinedFullName = `${cleanFirst} ${cleanLast}`;
      const userEmail = sessionUser.email || email;

      const { error: dbError } = await supabase
        .from("competition_registrations")
        .upsert({
          id: sessionUser.id,
          full_name: combinedFullName,
          email: userEmail,
          class_year: googleClassYear,
          team_name: null,
          updated_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      const newProfile: CompetitionRegistration = {
        id: sessionUser.id,
        full_name: combinedFullName,
        email: userEmail,
        class_year: googleClassYear,
        team_name: null,
      };

      setUserProfile(newProfile);
      setIsSettingUpProfile(false);
      setSuccessMsg("Profile saved successfully! Now create or join a team below.");
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeamMembers(teamName: string) {
    try {
      const { data, error } = await supabase
        .from("competition_registrations")
        .select("full_name, email, class_year")
        .ilike("team_name", teamName);

      if (!error && data) {
        setTeamMembers(data as TeamMember[]);
      }
    } catch (err) {
      console.error("Error loading team members:", err);
    }
  }

  // Handle Google OAuth Sign In
  async function handleGoogleSignIn() {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isSupabaseConfigured()) {
      setErrorMsg(
        "Supabase credentials are not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/competition/alpha-research`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
      setLoading(false);
    }
  }

  // STEP 1: Handle User Registration (Strict pre-validation for email format & duplicates)
  async function handleRegisterUser(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isSupabaseConfigured()) {
      setErrorMsg(
        "Supabase credentials are not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
      );
      return;
    }

    if (!fullName || !email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg(
        "Please confirm ownership of your email address and agree to competition updates to register."
      );
      return;
    }

    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length !== 2 || !nameParts[0] || !nameParts[1]) {
      setErrorMsg("Please enter only your First and Last name (e.g. John Doe).");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    // Pre-check if email already exists in DB before attempting registration
    try {
      const { data: existingEmail } = await supabase
        .from("competition_registrations")
        .select("id")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (existingEmail) {
        setErrorMsg(
          `An account with email '${cleanEmail}' is already registered. Please sign in instead.`
        );
        return;
      }
    } catch (err) {
      // Continue if table is not yet created
    }

    setLoading(true);

    try {
      // 1. Sign up user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            class_year: classYear,
          },
        },
      });

      if (authError) {
        if (
          authError.message.includes("already registered") ||
          authError.message.includes("already exists")
        ) {
          throw new Error(
            `An account with email '${cleanEmail}' is already registered. Please sign in instead.`
          );
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Registration failed. Please try again.");
      }

      const userId = authData.user.id;

      // 2. Insert user record into competition_registrations table
      const { error: dbError } = await supabase
        .from("competition_registrations")
        .upsert({
          id: userId,
          full_name: fullName,
          email: cleanEmail,
          class_year: classYear,
          team_name: null,
          updated_at: new Date().toISOString(),
        });

      if (dbError) {
        console.warn("Profile DB Insert warning:", dbError.message);
      }

      if (!authData.session && authData.user) {
        setSuccessMsg(
          `Account created! A confirmation link has been sent to ${cleanEmail}. Please check your inbox and click the link to confirm your registration.`
        );
      } else {
        setSessionUser(authData.user);
        setUserProfile({
          id: userId,
          full_name: fullName,
          email: cleanEmail,
          class_year: classYear,
          team_name: null,
        });

        setSuccessMsg(
          "Account created successfully! Now please create or join a team below to complete your competition registration."
        );
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // STEP 1: Handle User Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isSupabaseConfigured()) {
      setErrorMsg(
        "Supabase credentials are not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
      );
      return;
    }

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        setSessionUser(data.user);
        await fetchProfile(data.user.id);
        setSuccessMsg("Successfully signed in!");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // STEP 2A: Create a New Team (Enforce No Duplicate Team Names)
  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!sessionUser) {
      setErrorMsg("You must be logged in to create a team.");
      return;
    }

    if (!newTeamName || newTeamName.trim() === "") {
      setErrorMsg("Please enter a valid team name.");
      return;
    }

    setLoading(true);

    try {
      const cleanTeamName = newTeamName.trim();

      // Check if team name already exists (case-insensitive)
      const { data: existingTeam, error: checkError } = await supabase
        .from("competition_registrations")
        .select("team_name")
        .ilike("team_name", cleanTeamName)
        .limit(1);

      if (checkError) throw checkError;

      if (existingTeam && existingTeam.length > 0) {
        throw new Error(
          `Team name '${cleanTeamName}' is already taken. Please choose a different team name or join the existing team.`
        );
      }

      // Assign user to new team (use upsert to support users whose initial DB insert failed due to previous RLS)
      const meta = sessionUser.user_metadata || {};
      const { error: updateError } = await supabase
        .from("competition_registrations")
        .upsert({
          id: sessionUser.id,
          full_name: userProfile?.full_name || (meta.full_name as string) || fullName || "Participant",
          email: sessionUser.email || email,
          class_year: userProfile?.class_year || (meta.class_year as ClassYear) || classYear || "2027",
          team_name: cleanTeamName,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      const updatedProfile: CompetitionRegistration = {
        id: sessionUser.id,
        full_name: userProfile?.full_name || (meta.full_name as string) || fullName || "Participant",
        email: sessionUser.email || email,
        class_year: userProfile?.class_year || (meta.class_year as ClassYear) || classYear || "2027",
        team_name: cleanTeamName,
      };

      setUserProfile(updatedProfile);
      fetchTeamMembers(cleanTeamName);
      fetchExistingTeams();

      setSuccessMsg(
        `Team '${cleanTeamName}' created successfully! You are registered for the competition. More details will be sent to your email soon.`
      );
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // STEP 2B: Join an Existing Team (Max 3 members per team)
  async function handleJoinTeam(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!sessionUser) {
      setErrorMsg("You must be logged in to join a team.");
      return;
    }

    if (!joinTeamName || joinTeamName.trim() === "") {
      setErrorMsg("Please select or enter an existing team name.");
      return;
    }

    setLoading(true);

    try {
      const cleanTeamName = joinTeamName.trim();

      // Check if team exists and count current members
      const { data: teamMembersData, error: teamCheckError } = await supabase
        .from("competition_registrations")
        .select("id, full_name")
        .ilike("team_name", cleanTeamName);

      if (teamCheckError) throw teamCheckError;

      if (!teamMembersData || teamMembersData.length === 0) {
        throw new Error(
          `Team '${cleanTeamName}' was not found. Please check the spelling or create a new team.`
        );
      }

      if (teamMembersData.length >= 3) {
        throw new Error(
          `Team '${cleanTeamName}' is full (maximum 3 members per team reached).`
        );
      }

      // Add user to team (use upsert to support users whose initial DB insert failed due to previous RLS)
      const meta = sessionUser.user_metadata || {};
      const { error: updateError } = await supabase
        .from("competition_registrations")
        .upsert({
          id: sessionUser.id,
          full_name: userProfile?.full_name || (meta.full_name as string) || fullName || "Participant",
          email: sessionUser.email || email,
          class_year: userProfile?.class_year || (meta.class_year as ClassYear) || classYear || "2027",
          team_name: cleanTeamName,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      const updatedProfile = {
        ...userProfile!,
        team_name: cleanTeamName,
      };

      setUserProfile(updatedProfile);
      fetchTeamMembers(cleanTeamName);

      setSuccessMsg(
        `Successfully joined Team '${cleanTeamName}'! More competition details will be sent to your email soon.`
      );
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // Leave Team
  async function handleLeaveTeam() {
    if (!sessionUser) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await supabase
        .from("competition_registrations")
        .update({ team_name: null })
        .eq("id", sessionUser.id);

      setUserProfile((prev) => (prev ? { ...prev, team_name: null } : null));
      setTeamMembers([]);
      setSuccessMsg("You have left your team. Please create or join a new team below.");
    } catch (err: unknown) {
      setErrorMsg("Failed to leave team.");
    } finally {
      setLoading(false);
      setShowLeaveConfirm(false);
    }
  }

  async function handleSignOut() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setSessionUser(null);
      setUserProfile(null);
      setTeamMembers([]);
      setSuccessMsg("Signed out successfully.");
    } catch (err: unknown) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-midnight border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Quick Team Change Confirmation Overlay Popup */}
          <AnimatePresence>
            {showLeaveConfirm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 z-30 bg-white/95 dark:bg-midnight/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-silver">
                    Leave Team &apos;{userProfile?.team_name}&apos;?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-silver/60 mt-1.5 max-w-xs leading-relaxed">
                    Are you sure you want to leave your team? You will be unassigned and directed to create or join a new team.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full max-w-xs pt-2">
                  <button
                    onClick={() => setShowLeaveConfirm(false)}
                    className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-silver text-xs font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLeaveTeam}
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Yes, Leave Team"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-bfb-blue/10 rounded-lg text-bfb-blue dark:text-accent">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-silver">
                  Alpha Research Competition
                </h3>
                <p className="text-xs text-slate-500 dark:text-silver/60">
                  {sessionUser
                    ? isSettingUpProfile || !userProfile
                      ? "Step 1.5: Profile & Graduation Year"
                      : userProfile?.team_name
                      ? "Registration Dashboard"
                      : "Step 2: Team Setup"
                    : "Student Sign-up & Login Portal"}
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

          {/* Warning Banner if credentials missing */}
          {!isSupabaseConfigured() && (
            <div className="mx-6 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-600 dark:text-amber-400 shrink-0">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold">Supabase Setup Required:</span>{" "}
                Add your real Supabase URL and Anon Key to{" "}
                <code className="px-1 py-0.5 bg-amber-500/20 rounded font-mono">
                  .env.local
                </code>{" "}
                to activate live database authentication.
              </div>
            </div>
          )}

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

          <div className="p-6 overflow-y-auto">
            {fetchingSession ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                <Loader2 size={24} className="animate-spin text-bfb-blue" />
                <span className="text-sm font-medium">Checking session...</span>
              </div>
            ) : sessionUser ? (
              isSettingUpProfile || !userProfile ? (
                /* STEP 1.5: GOOGLE USER PROFILE & GRADUATION YEAR INPUT */
                <div className="space-y-5">
                  <div className="p-4 bg-bfb-blue/10 border border-bfb-blue/20 rounded-xl flex items-start gap-3">
                    <User className="text-bfb-blue dark:text-accent mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-silver">
                        Complete Your Profile
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-silver/60 mt-0.5 leading-relaxed">
                        Signed in as <span className="font-semibold text-slate-700 dark:text-silver">{sessionUser.email}</span>. Please confirm your first and last name and select your graduation year.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveGoogleProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          First Name
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                          />
                          <input
                            type="text"
                            required
                            value={googleFirstName}
                            onChange={(e) => setGoogleFirstName(e.target.value)}
                            placeholder="First Name"
                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Last Name
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                          />
                          <input
                            type="text"
                            required
                            value={googleLastName}
                            onChange={(e) => setGoogleLastName(e.target.value)}
                            placeholder="Last Name"
                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Graduation Year
                      </label>
                      <div className="relative">
                        <GraduationCap
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <select
                          value={googleClassYear}
                          onChange={(e) =>
                            setGoogleClassYear(e.target.value as ClassYear)
                          }
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue appearance-none"
                        >
                          {CLASS_YEARS.map((yr) => (
                            <option key={yr} value={yr}>
                              {yr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-bfb-blue text-white font-bold text-sm rounded-xl hover:bg-bfb-blue/90 transition-colors shadow-lg shadow-bfb-blue/20"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          Save Profile & Continue <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-xs text-slate-400">
                    <span>Logged in as {sessionUser.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="text-red-500 hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : userProfile?.team_name ? (
                /* STATE 3: LOGGED IN & TEAM ASSIGNED (CONFIRMED DASHBOARD) */
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                    <ShieldCheck size={24} className="text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-silver">
                        Registration Confirmed
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-silver/60 mt-0.5 leading-relaxed">
                        You are registered for the Alpha Research Competition.
                        Further rules, data conventions, and onboarding details
                        will be sent to your email soon!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        Full Name
                      </span>
                      <span className="font-medium text-slate-900 dark:text-silver">
                        {userProfile.full_name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        Email
                      </span>
                      <span className="font-medium text-slate-900 dark:text-silver">
                        {userProfile.email}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        Graduation Year
                      </span>
                      <span className="font-medium text-slate-900 dark:text-silver">
                        {userProfile.class_year}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        Assigned Team
                      </span>
                      <span className="font-bold text-bfb-blue dark:text-accent">
                        {userProfile.team_name}
                      </span>
                    </div>

                    {/* Team Members List */}
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                          Team Roster ({teamMembers.length}/3 Members)
                        </span>
                        <button
                          onClick={() => setShowLeaveConfirm(true)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Change Team
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {teamMembers.map((member, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-white dark:bg-midnight/60 rounded-lg text-xs border border-slate-200/50 dark:border-white/5"
                          >
                            <span className="font-medium text-slate-900 dark:text-silver">
                              {member.full_name} ({member.class_year})
                            </span>
                            <span className="text-slate-400">
                              {member.email}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-silver font-medium text-sm rounded-xl transition-colors"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <LogOut size={16} /> Sign Out
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* STATE 2: LOGGED IN BUT NO TEAM (POST-LOGIN TEAM SETUP) */
                <div className="space-y-5">
                  <div className="p-4 bg-bfb-blue/10 border border-bfb-blue/20 rounded-xl">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-silver">
                      Welcome, {userProfile?.full_name || sessionUser.email}!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-silver/60 mt-1">
                      Step 2: Create a unique team or join an existing team below to complete your registration.
                    </p>
                  </div>

                  {/* Team Sub-tabs */}
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl">
                    <button
                      onClick={() => {
                        setTeamTab("create");
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        teamTab === "create"
                          ? "bg-white dark:bg-midnight text-bfb-blue dark:text-accent shadow-sm"
                          : "text-slate-500 dark:text-silver/60 hover:text-slate-900 dark:hover:text-silver"
                      }`}
                    >
                      <PlusCircle size={14} /> Create New Team
                    </button>
                    <button
                      onClick={() => {
                        setTeamTab("join");
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        teamTab === "join"
                          ? "bg-white dark:bg-midnight text-bfb-blue dark:text-accent shadow-sm"
                          : "text-slate-500 dark:text-silver/60 hover:text-slate-900 dark:hover:text-silver"
                      }`}
                    >
                      <UserPlus size={14} /> Join Existing Team
                    </button>
                  </div>

                  {teamTab === "create" ? (
                    <form onSubmit={handleCreateTeam} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Unique Team Name
                        </label>
                        <div className="relative">
                          <Users
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                          />
                          <input
                            type="text"
                            required
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            placeholder="e.g. Quant Bruins"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Team names must be unique across the competition.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-bfb-blue text-white font-bold text-sm rounded-xl hover:bg-bfb-blue/90 transition-colors shadow-lg shadow-bfb-blue/20"
                      >
                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            Create Team & Complete Registration <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleJoinTeam} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Type or Select Team Name
                        </label>
                        <div className="relative">
                          <Users
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                          />
                          <input
                            type="text"
                            required
                            list="existing-teams-list"
                            value={joinTeamName}
                            onChange={(e) => setJoinTeamName(e.target.value)}
                            placeholder="Type team name to join..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                          />
                          <datalist id="existing-teams-list">
                            {existingTeams.map((name) => (
                              <option key={name} value={name} />
                            ))}
                          </datalist>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Type the exact name of the team created by your teammate (max 3 students per team).
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-bfb-blue text-white font-bold text-sm rounded-xl hover:bg-bfb-blue/90 transition-colors shadow-lg shadow-bfb-blue/20"
                      >
                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            Join Team <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-xs text-slate-400">
                    <span>Logged in as {sessionUser.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="text-red-500 hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )
            ) : (
              /* STATE 1: UNAUTHENTICATED SIGN UP / SIGN IN FORMS */
              <div>
                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-silver font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer mb-5 focus:outline-none focus:ring-2 focus:ring-bfb-blue"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center mb-6">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  <span className="bg-white dark:bg-midnight px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
                    Or with email
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl mb-6">
                  <button
                    onClick={() => {
                      setActiveTab("register");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === "register"
                        ? "bg-white dark:bg-midnight text-bfb-blue dark:text-accent shadow-sm"
                        : "text-slate-500 dark:text-silver/60 hover:text-slate-900 dark:hover:text-silver"
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("login");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === "login"
                        ? "bg-white dark:bg-midnight text-bfb-blue dark:text-accent shadow-sm"
                        : "text-slate-500 dark:text-silver/60 hover:text-slate-900 dark:hover:text-silver"
                    }`}
                  >
                    Sign In
                  </button>
                </div>

                {activeTab === "register" ? (
                  <form onSubmit={handleRegisterUser} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Graduation Year
                      </label>
                      <div className="relative">
                        <GraduationCap
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <select
                          value={classYear}
                          onChange={(e) =>
                            setClassYear(e.target.value as ClassYear)
                          }
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue appearance-none"
                        >
                          {CLASS_YEARS.map((yr) => (
                            <option key={yr} value={yr}>
                              {yr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="agreedToTerms"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-bfb-blue rounded border-slate-300 focus:ring-bfb-blue cursor-pointer"
                      />
                      <label
                        htmlFor="agreedToTerms"
                        className="text-[11px] text-slate-500 dark:text-silver/60 leading-tight cursor-pointer"
                      >
                        I confirm I own this email address and agree to receive official competition rules, announcements, and updates from Blockchain at UCLA.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-bfb-blue text-white font-bold text-sm rounded-xl hover:bg-bfb-blue/90 transition-colors shadow-lg shadow-bfb-blue/20 mt-2"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          Next: Team Selection <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-bfb-blue text-white font-bold text-sm rounded-xl hover:bg-bfb-blue/90 transition-colors shadow-lg shadow-bfb-blue/20 mt-2"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        "Sign In to Dashboard"
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
