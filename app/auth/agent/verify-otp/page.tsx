"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Timer } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthButton } from "@/components/auth/AuthButton";
import { OtpInput } from "@/components/auth/OtpInput";

export default function VerifyOtpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);
    const router = useRouter();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = () => {
        if (timer > 0) return;
        setTimer(30);
        // Add resend logic here
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API verification
        setTimeout(() => {
            setIsLoading(false);
            router.push("/auth/agent/login");
        }, 1500);
    };

    return (
        <AuthLayout
            title="Verify OTP"
            description="Please enter the 6-digit code sent to your device."
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <p className="text-center text-sm text-white/60 mb-6">
                        Enter the code below to verify your account.
                    </p>
                    <OtpInput value={otp} onChange={setOtp} />
                </div>

                <AuthButton type="submit" isLoading={isLoading} disabled={otp.length !== 6}>
                    Verify & Proceed
                </AuthButton>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={timer > 0}
                        className="inline-flex items-center text-sm text-white/60 hover:text-brand-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Timer size={14} className="mr-1.5" />
                        {timer > 0 ? `Resend Code in ${timer}s` : "Resend Code Now"}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}

