"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import {
  Lock,
  Unlock,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  LogOut,
  Sparkles,
} from "lucide-react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (passwordInput: string, rememberDevice: boolean) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AUTH_STORAGE_KEY_SESSION = "bfb_admin_authenticated";
const AUTH_STORAGE_KEY_PERSIST = "bfb_admin_authenticated_persist";
const AUTH_EXPIRATION_KEY = "bfb_admin_auth_expires_at";

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getTargetPassword = () => {
    return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "bfb2026admin";
  };

  useEffect(() => {
    function checkAuth() {
      if (typeof window === "undefined") {
        setCheckingAuth(false);
        return;
      }

      // 1. Check Session Storage
      const sessionAuth = sessionStorage.getItem(AUTH_STORAGE_KEY_SESSION);
      if (sessionAuth === "true") {
        setIsAuthenticated(true);
        setCheckingAuth(false);
        return;
      }

      // 2. Check Persisted Storage with 24h expiration
      const persistAuth = localStorage.getItem(AUTH_STORAGE_KEY_PERSIST);
      const expiresAt = localStorage.getItem(AUTH_EXPIRATION_KEY);

      if (persistAuth === "true" && expiresAt) {
        const expTime = parseInt(expiresAt, 10);
        if (Date.now() < expTime) {
          setIsAuthenticated(true);
          setCheckingAuth(false);
          return;
        } else {
          // Expired
          localStorage.removeItem(AUTH_STORAGE_KEY_PERSIST);
          localStorage.removeItem(AUTH_EXPIRATION_KEY);
        }
      }

      setIsAuthenticated(false);
      setCheckingAuth(false);
    }

    checkAuth();
  }, []);

  function handleLogin(input: string, remember: boolean): boolean {
    const targetPass = getTargetPassword();
    if (input.trim() === targetPass) {
      setIsAuthenticated(true);
      setErrorMsg(null);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(AUTH_STORAGE_KEY_SESSION, "true");
        if (remember) {
          const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
          localStorage.setItem(AUTH_STORAGE_KEY_PERSIST, "true");
          localStorage.setItem(AUTH_EXPIRATION_KEY, expiresAt.toString());
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY_PERSIST);
          localStorage.removeItem(AUTH_EXPIRATION_KEY);
        }
      }
      return true;
    } else {
      setErrorMsg("Invalid Organizer Passcode. Please check password and try again.");
      return false;
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPasswordInput("");
    setErrorMsg(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY_SESSION);
      localStorage.removeItem(AUTH_STORAGE_KEY_PERSIST);
      localStorage.removeItem(AUTH_EXPIRATION_KEY);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleLogin(passwordInput, rememberDevice);
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-bfb-blue border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Verifying admin access credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
            <Lock size={14} className="text-amber-400" /> BFB Security Gate v1.0
          </div>
        </header>

        {/* Centered Passcode Gate Form */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6 backdrop-blur-xl">
            {/* Header Shield */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-bfb-blue/20 text-accent border border-bfb-blue/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-bfb-blue/10">
                <Shield size={28} />
              </div>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">
                BFB Admin Portal Locked
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Enter the official BFB Organizer Passcode to access competition submissions, strategy source code, and deliverables.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Organizer Passcode
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter passcode..."
                    autoFocus
                    required
                    className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-bfb-blue focus:ring-1 focus:ring-bfb-blue font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-white/20 bg-slate-950 text-bfb-blue focus:ring-bfb-blue"
                  />
                  Remember device for 24h
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-bfb-blue hover:bg-bfb-blue/90 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-bfb-blue/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
              >
                <Unlock size={16} /> Unlock Admin Submissions Portal
              </button>
            </form>
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
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
