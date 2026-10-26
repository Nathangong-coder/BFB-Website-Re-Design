"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { Lock, Shield, AlertCircle, ArrowRight, ArrowLeft, LogOut } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  logout: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

type AdminStatus = "checking" | "signed_out" | "not_admin" | "admin";

// Admin access is decided by the database: the signed-in user's confirmed email
// must be listed in competition_admins (see supabase_security_setup.sql). The
// same check gates the data itself through RLS, so this guard is only the UI.
export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  // Without Supabase the dashboard only shows bundled sample data
  const [status, setStatus] = useState<AdminStatus>(() =>
    isSupabaseConfigured() ? "checking" : "admin"
  );
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let active = true;

    async function checkSession(session: Session | null) {
      if (!session?.user) {
        if (active) {
          setSignedInEmail(null);
          setStatus("signed_out");
        }
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");
      if (!active) return;
      setSignedInEmail(session.user.email ?? null);
      setStatus(!error && data === true ? "admin" : "not_admin");
    }

    supabase.auth.getSession().then(({ data: { session } }) => checkSession(session));

    // Handles sign-out in another tab and expired sessions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setSignedInEmail(null);
    setStatus("signed_out");
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-bfb-blue border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Verifying admin access credentials...</span>
        </div>
      </div>
    );
  }

  if (status !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-bfb-blue/10 rounded-full blur-3xl" />
        </div>

        {/* Top Minimal Bar */}
        <header className="relative z-10 p-6 flex items-center justify-between">
          <Link
            href="/competition/alpha-research"
            className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft size={16} /> Competition Overview
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Lock size={14} className="text-amber-400" /> BFB Security Gate v2.0
          </div>
        </header>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 backdrop-blur-xl">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-bfb-blue/20 text-accent border border-bfb-blue/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-bfb-blue/10">
                <Shield size={28} />
              </div>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">
                BFB Admin Portal Locked
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                {status === "signed_out"
                  ? "Sign in with your organizer account to access competition submissions, strategy source code, and deliverables."
                  : "Your account isn't on the organizer list. Ask a BFB organizer to add your email, or sign in with a different account."}
              </p>
            </div>

            {status === "not_admin" && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                <span>Signed in as {signedInEmail ?? "an unknown account"} (not an organizer).</span>
              </div>
            )}

            {status === "signed_out" ? (
              <Link
                href="/competition/alpha-research/register"
                className="w-full py-3 bg-bfb-blue hover:bg-bfb-blue/90 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-bfb-blue/25 flex items-center justify-center gap-2"
              >
                Sign In <ArrowRight size={16} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 p-6 text-center text-xs text-slate-600">
          Bruin Finance Society &amp; BFB at UCLA &copy; {new Date().getFullYear()} Quantitative Engineering
        </footer>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: true,
        logout: handleLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
