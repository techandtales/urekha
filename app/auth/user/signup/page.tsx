"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, Mail, AlertTriangle } from "lucide-react";
import { ModernAuthLayout } from "@/components/auth/ModernAuthLayout";
import { ModernAuthInput } from "@/components/auth/ModernAuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import {
  signUpWithPassword,
  signInWithGoogleIdToken,
} from "@/app/auth/actions";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "@/store/auth-store";

function SignupContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all sections.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    const result = await signUpWithPassword(email, password, "user", fullName);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Signup successful — user needs to verify email
      localStorage.setItem("authEmail", email);
      localStorage.setItem("signupRole", "user");
      const verifyUrl = `/auth/user/verify?type=signup&signup=true${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`;
      router.push(verifyUrl);
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
    setError("");

    const result = await signInWithGoogleIdToken(
      credentialResponse.credential,
      "user",
      "signup",
    );

    if (result?.error) {
      setError(result.error);
      setGoogleLoading(false);
    } else {
      setAuth("user");
      router.push(redirect || "/profile/complete");
    }
  };

  const subtitleNode = (
    <>
      Already have an account?{" "}
      <Link
        href={`/auth/user/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
        className="text-[#7e56da] hover:text-[#6543b5] hover:underline underline-offset-2"
      >
        Log in
      </Link>
    </>
  );

  return (
    <ModernAuthLayout title="Create Account" subtitle={subtitleNode}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <ModernAuthInput
            name="fullName"
            label="Full Name"
            type="text"
            icon={User}
            required
            placeholder="John Doe"
          />
          <ModernAuthInput
            name="email"
            label="Email Address"
            type="email"
            icon={Mail}
            required
            placeholder="john@example.com"
          />

          <div className="space-y-1">
            <ModernAuthInput
              name="password"
              label="Password"
              type="password"
              icon={Lock}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div className="px-1 scale-90 origin-left">
              <PasswordStrengthIndicator password={password} />
            </div>
          </div>

          <ModernAuthInput
            label="Confirm Password"
            type="password"
            icon={Lock}
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="••••••••"
            error={error === "Passwords do not match" ? error : undefined}
          />
        </div>

        {error && error !== "Passwords do not match" && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-50 dark:bg-red-500/10 flex items-start gap-3 transition-colors">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="pt-2">
          <AuthButton
            type="submit"
            isLoading={isLoading}
            disabled={googleLoading}
            className="!bg-[#7e56da] hover:!bg-[#6543b5] border-none shadow-lg shadow-[#7e56da]/20 !text-white h-12 !rounded-xl"
          >
            Sign Up
          </AuthButton>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1 transition-colors" />
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase">
            Or register with
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
            text="signup_with"
            context="signup"
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
            Agent Login
          </Link>
        </div>
      </form>
    </ModernAuthLayout>
  );
}

export default function UserSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white/50">
          Loading Auth...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
