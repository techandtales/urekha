"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { ModernAuthLayout } from "@/components/auth/ModernAuthLayout";
import { ModernAuthInput } from "@/components/auth/ModernAuthInput";
import { AuthButton } from "@/components/auth/AuthButton";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/auth/agent/verify-otp");
        }, 1500);
    };

    const subtitleNode = (
        <>
            Remembered your Agent ID?{" "}
            <Link href="/auth/agent/login" className="text-[#7e56da] hover:text-[#6543b5] hover:underline underline-offset-2 transition-colors">
                Back to Login
            </Link>
        </>
    );

    return (
        <ModernAuthLayout
            title="Reset Password"
            subtitle={subtitleNode}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <ModernAuthInput
                        label="Email or Agent ID"
                        type="text"
                        icon={Mail}
                        required
                        placeholder="you@example.com"
                    />
                </div>

                <AuthButton 
                    type="submit" 
                    isLoading={isLoading}
                    className="!bg-[#7e56da] hover:!bg-[#6543b5] border-none shadow-lg shadow-[#7e56da]/20 !text-white h-12 !rounded-xl"
                >
                    Send Verification Code
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

