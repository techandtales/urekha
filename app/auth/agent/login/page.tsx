"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, AlertTriangle } from "lucide-react";
import { ModernAuthLayout } from "@/components/auth/ModernAuthLayout";
import { ModernAuthInput } from "@/components/auth/ModernAuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import {
  signInWithOtp,
  signInWithPassword,
  verifyAccountExists,
} from "@/app/auth/actions";
import { useAuthStore } from "@/store/auth-store";

export default function AgentLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId) return;

    setIsLoading(true);
    setError(null);

    // If an email matches, we use OTP. Else, fallback error for manual ID/Password systems.
    if (emailOrId.includes("@")) {
      if (password) {
        const result = await signInWithPassword(emailOrId, password, "agent");

        if (result?.error) {
          setError(result.error);
          setIsLoading(false);
        } else {
          // Verify agent account exists in agentdata table
          const verify = await verifyAccountExists("agent");
          if (verify?.error) {
            setError(verify.error);
            setIsLoading(false);
          } else {
            setAuth("agent");
            router.push("/dashboard");
          }
        }
      } else {
        const result = await signInWithOtp(emailOrId, false, "agent");

        if (result?.error) {
          setError(result.error);
          setIsLoading(false);
        } else {
          localStorage.setItem("authEmail", emailOrId);
          router.push(`/auth/agent/verify?type=magiclink`);
        }
      }
    } else {
      // Stubbing Agent ID/Password login since Supabase default is Email/Password or OTP.
      // If we used a real backend here for agents: e.g. await signInWithPassword(emailOrId, password)
      if (emailOrId === "admin123" && password === "urekha") {
        setAuth("agent");
        router.push("/dashboard");
      } else {
        setError("Invalid Agent ID or Password");
        setIsLoading(false);
      }
    }
  };

  return (
    <ModernAuthLayout
      title="Agent Portal"
      subtitle="Authorized agents only. Contact your administrator for access."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <ModernAuthInput
            label="Agent ID or Email"
            type="text"
            icon={User}
            required
            placeholder="AG-XXXXXX or email"
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
          />
          <ModernAuthInput
            label="Password (if using ID)"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end py-2">
          <Link
            href="/auth/agent/forgot-password"
            className="text-sm text-[#7e56da] hover:text-[#6543b5] hover:underline transition-all"
          >
            Forgot Agent ID?
          </Link>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-50 dark:bg-red-500/10 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-500 dark:text-red-400 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        <AuthButton
          type="submit"
          isLoading={isLoading}
          className="!bg-[#7e56da] hover:!bg-[#6543b5] border-none shadow-lg shadow-[#7e56da]/20 !text-white h-12 !rounded-xl"
        >
          {isLoading ? "Authenticating..." : "Log In"}
        </AuthButton>

        {/* User/Admin Access Buttons */}
        <div className="pt-8 flex items-center justify-center gap-6">
          <Link
            href="/auth/user/login"
            className="text-[11px] font-medium tracking-widest uppercase text-slate-400 hover:text-[#7e56da] transition-colors border-b border-transparent hover:border-[#7e56da] pb-0.5"
          >
            User Login
          </Link>
          <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-zinc-800" />
          <Link
            href="/auth/admin/login"
            className="text-[11px] font-medium tracking-widest uppercase text-slate-400 hover:text-[#7e56da] transition-colors border-b border-transparent hover:border-[#7e56da] pb-0.5"
          >
            Admin Access
          </Link>
        </div>
      </form>
    </ModernAuthLayout>
  );
}
