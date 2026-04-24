"use client";

import { useState, useEffect, Suspense } from "react";
import {
  verifyOtp,
  signInWithOtp,
  ensureAccountAfterSignup,
} from "@/app/auth/actions";
import { useRouter, useSearchParams } from "next/navigation";
import {
  KeyRound,
  ArrowRight,
  Loader2,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { type EmailOtpType } from "@supabase/supabase-js";

function VerifyContent() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as EmailOtpType) || "magiclink";
  const redirect = searchParams.get("redirect");
  const isSignup = searchParams.get("signup") === "true";

  useEffect(() => {
    // Retrieve the email saved during the initial login/signup step
    const storedEmail = localStorage.getItem("authEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If we somehow got here without an email, kick back to login
      const loginUrl = `/auth/user/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;
      router.push(loginUrl);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6 || !email) return;

    setLoading(true);
    setError(null);

    // During signup, skip the role check — account row doesn't exist yet
    const result = await verifyOtp(email, code, type, isSignup ? undefined : "user");

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      const signupRole = localStorage.getItem("signupRole");
      localStorage.removeItem("authEmail");

      // If recovering, send to update password
      if (type === "recovery") {
        router.push("/auth/user/update-password");
      } else if (signupRole === "user") {
        // This was a signup — ensure userdata & roles are created
        localStorage.removeItem("signupRole");
        const ensure = await ensureAccountAfterSignup("user");
        if (ensure?.error) {
          setError(ensure.error);
          setLoading(false);
        } else {
          const completeUrl = `/profile/complete${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;
          router.push(completeUrl);
        }
      } else {
        // Regular login OTP — just redirect
        router.push(redirect || "/profile");
      }
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setError(null);

    const result = await signInWithOtp(email);

    if (result?.error) {
      setError(result.error);
    } else {
      // Give some visual feedback that it sent, maybe an alert or toast in a real app
    }
    setResendLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative z-10 shadow-2xl backdrop-blur-xl group hover:border-[#A78BFA]/20 transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#A78BFA]/30 to-transparent" />

      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <span className="w-8 h-8 rounded-full bg-[#A78BFA]/10 flex items-center justify-center border border-[#A78BFA]/20">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          </span>
          <span className="font-serif font-bold text-xl text-white tracking-widest">
            UREKHA
          </span>
        </Link>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">
          Verify Identity
        </h1>
        <p className="text-white/40 text-sm font-light">
          Enter the 6-digit transmission code sent to
          <br />
          <span className="text-[#A78BFA] font-medium">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm leading-relaxed text-left">
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-semibold text-white/50 ml-1">
            Authentication Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <KeyRound className="w-5 h-5 text-white/30" />
            </div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#A78BFA]/50 focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(167,139,250,0.15)] transition-all font-mono tracking-[1em] text-center text-lg"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full py-4 bg-[#A78BFA] text-black rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-[0_0_20px_rgba(167,139,250,0.15)] hover:shadow-[0_0_30px_rgba(167,139,250,0.3)]"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Verify & Enter{" "}
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center flex flex-col gap-3">
        <p className="text-white/40 text-sm">
          Didn't receive the transmission?{" "}
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-[#A78BFA] hover:text-white transition-colors underline decoration-[#A78BFA]/30 hover:decoration-white disabled:opacity-50"
          >
            {resendLoading ? "Resending..." : "Resend code"}
          </button>
        </p>
        <p className="text-white/40 text-sm">
          Wrong node?{" "}
          <Link
            href={`/auth/user/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="text-white/60 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white"
          >
            Change email
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen bg-[#050A0A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="dash-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dash-grid)" />
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A78BFA]/[0.05] rounded-full blur-[100px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="text-white/50 animate-pulse flex items-center gap-2">
            <Loader2 className="animate-spin" />
            Loading Interface...
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </main>
  );
}