"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertTriangle, ShieldAlert } from "lucide-react";
import { ModernAuthLayout } from "@/components/auth/ModernAuthLayout";
import { ModernAuthInput } from "@/components/auth/ModernAuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { signInAdminWithPassword } from "../actions";
import { useAuthStore } from "@/store/auth-store";

function AdminLoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "permission_denied") {
      setError("Permission Denied, Only Admins Allowed");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please put in both email and password.");
      setIsLoading(false);
      return;
    }

    // Call the dedicated Server Action for Admin Login
    const result = await signInAdminWithPassword(email, password);

    if (result.error || !result.success) {
      setError(result.error || "An unknown error occurred.");
      setIsLoading(false);
    } else {
      // Success, set the local auth state mimicking the other flows, but redirect to /admin
      setAuth("agent"); // We use 'agent' here broadly for the state as per context, but the backend is protecting the route
      router.push("/admin/dashboard");
    }
  };

  const subtitleNode = (
    <>
      This gateway handles central intelligence. If you are not an authorized architect, please return to the{" "}
      <button type="button" onClick={() => router.push("/")} className="text-[#7e56da] hover:underline font-medium">homepage</button>.
    </>
  );

  return (
    <ModernAuthLayout
      title="Admin Gateway"
      subtitle={subtitleNode}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <ModernAuthInput
            name="email"
            label="Admin Email"
            type="email"
            icon={Mail}
            required
            placeholder="architect@urekha.com"
          />
          <ModernAuthInput
            name="password"
            label="Security Passphrase"
            type="password"
            icon={Lock}
            required
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-50 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-500 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        <AuthButton 
          type="submit" 
          isLoading={isLoading}
          className="!bg-[#7e56da] hover:!bg-[#6543b5] border-none shadow-lg shadow-[#7e56da]/20 !text-white h-12 !rounded-xl"
        >
          Authenticate & Enter
        </AuthButton>

        {/* User/Agent Access Buttons */}
        <div className="pt-8 flex items-center justify-center gap-6">
          <Link 
            href="/auth/user/login" 
            className="text-[11px] font-medium tracking-widest uppercase text-slate-400 hover:text-[#7e56da] transition-colors border-b border-transparent hover:border-[#7e56da] pb-0.5"
          >
            User Login
          </Link>
          <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-zinc-800" />
          <Link 
            href="/auth/agent/login" 
            className="text-[11px] font-medium tracking-widest uppercase text-slate-400 hover:text-[#7e56da] transition-colors border-b border-transparent hover:border-[#7e56da] pb-0.5"
          >
            Agent Login
          </Link>
        </div>
      </form>
    </ModernAuthLayout>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050A0A] text-white">Loading Security Protocol...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}


