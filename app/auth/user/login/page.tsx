"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, AlertTriangle } from "lucide-react";
import { ModernAuthLayout } from "@/components/auth/ModernAuthLayout";
import { ModernAuthInput } from "@/components/auth/ModernAuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

import {
  signInWithOtp,
  signInWithGoogleIdToken,
  signInWithPassword,
  verifyAccountExists,
} from "@/app/auth/actions";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "@/store/auth-store";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    const redirectPath = redirect || "/profile";

    const result = await signInWithPassword(email, password, "user");

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Verify user account exists in userdata table
      const verify = await verifyAccountExists("user");
      if (verify?.error) {
        setError(verify.error);
        setIsLoading(false);
      } else {
        setAuth("user");
        router.push(redirectPath);
      }
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) {
      setError("Failed to retrieve Google credentials.");
      return;
    }

    setGoogleLoading(true);
    setError(null);

    const result = await signInWithGoogleIdToken(
      credentialResponse.credential,
      "user",
    );

    if (result?.error) {
      setError(result.error);
      setGoogleLoading(false);
    } else {
      setAuth("user");
      router.push(redirect || "/profile");
    }
  };

  const subtitleNode = (
    <>
      No account yet?{" "}
      <Link
        href={`/auth/user/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
        className="text-[#7e56da] hover:text-[#6543b5] hover:underline underline-offset-2"
      >
        Create an Account
      </Link>
    </>
  );

  return (
    <ModernAuthLayout title="Welcome Back" subtitle={subtitleNode}>
      <form onSubmit={handleEmailSubmit} className="space-y-5">
        <div className="space-y-4">
          <ModernAuthInput
            label="Email Address"
            type="email"
            icon={Mail}
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ModernAuthInput
            label="Password"
            type="password"
            icon={Lock}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded-sm border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#7e56da] focus:ring-[#7e56da] focus:ring-offset-white dark:focus:ring-offset-zinc-900 transition-colors"
            />
            <label
              htmlFor="remember"
              className="text-sm text-slate-500 dark:text-slate-400 transition-colors"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/auth/user/forgot-password"
            className="text-sm text-[#7e56da] hover:text-[#6543b5] hover:underline transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-50 dark:bg-red-500/10 flex items-start gap-3 transition-colors">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <AuthButton
          type="submit"
          isLoading={isLoading}
          disabled={googleLoading}
          className="!bg-[#7e56da] hover:!bg-[#6543b5] border-none shadow-lg shadow-[#7e56da]/20 !text-white h-12 !rounded-xl"
        >
          {isLoading ? "Authenticating..." : "Log In"}
        </AuthButton>

        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1 transition-colors" />
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase">
            Or continue with
          </span>
          <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1 transition-colors" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError("Google authentication failed. Please try again.");
              setGoogleLoading(false);
            }}
            useOneTap={false}
            theme="filled_black"
            shape="rectangular"
            size="large"
            width={400}
            text="continue_with"
            context="signin"
          />
        </div>

        {/* Admin/Agent Access Buttons */}
        <div className="pt-8 flex items-center justify-center gap-6">
          <Link
            href="/auth/admin/login"
            className="text-[11px] font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400 hover:text-[#7e56da] dark:hover:text-[#9e7df2] transition-colors border-b border-transparent hover:border-[#7e56da] pb-0.5"
          >
            Admin Access
          </Link>
          <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-zinc-800" />
          <Link
            href="/auth/agent/login"
            className="text-[11px] font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400 hover:text-[#7e56da] dark:hover:text-[#9e7df2] transition-colors border-b border-transparent hover:border-[#7e56da] pb-0.5"
          >
            Agent Access
          </Link>
        </div>
      </form>
    </ModernAuthLayout>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white/50">
          Loading Auth...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
