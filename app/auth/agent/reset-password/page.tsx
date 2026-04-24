"use client";

import { useState } from "react";
import { resetPasswordOtp } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    const result = await resetPasswordOtp(email);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      localStorage.setItem("authEmail", email);
      router.push(`/auth/agent/verify?type=recovery`);
    }
  };

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative z-10 shadow-2xl backdrop-blur-xl group hover:border-red-500/10 transition-colors duration-500">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <ShieldAlert className="w-4 h-4 text-red-500" />
            </span>
            <span className="font-serif font-bold text-xl text-white tracking-widest">
              UREKHA
            </span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            System Override
          </h1>
          <p className="text-white/40 text-sm font-light">
            Initiate a secure password reset sequence.
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

        {/* Email Auth */}
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-white/50 ml-1">
              Registered Node Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-white/30" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@urekha.com"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all font-sans"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Request Recovery OTP{" "}
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-white/40 text-sm">
            Remembered your credentials?{" "}
            <Link
              href="/auth/agent/login"
              className="text-white/60 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white"
            >
              Return to Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
