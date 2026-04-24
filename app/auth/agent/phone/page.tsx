"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AgentPhonePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!phone || phone.length < 10) {
            setError("Please enter a valid phone number");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to OTP verification for AGENT
            router.push(`/auth/verify-otp?role=agent&phone=${encodeURIComponent(phone)}`);
        }, 1500);
    };

    return (
        <AuthLayout
            title="Agent Portal"
            description="Secure login for authorized agents via mobile."
        >
            <div className="flex justify-center mb-6">
                <div className="p-3 bg-brand-gold/10 rounded-full">
                    <ShieldCheck className="w-8 h-8 text-brand-gold" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <AuthInput
                        name="phone"
                        label="Registered Mobile Number"
                        type="tel"
                        icon={Phone}
                        placeholder="+91 98765 43210"
                        required
                        value={phone}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^\d+ ]/g, '');
                            setPhone(val);
                            setError("");
                        }}
                        error={error}
                    />
                    <p className="text-xs text-muted-foreground ml-1">
                        Enter the phone number linked to your agent profile.
                    </p>
                </div>

                <div className="pt-2">
                    <AuthButton type="submit" isLoading={isLoading} className="bg-brand-gold hover:bg-brand-gold/90 text-white">
                        Verify & Login
                        <ArrowRight className="w-4 h-4 ml-2 opacity-80" />
                    </AuthButton>
                </div>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    <div className="flex justify-center gap-6">
                        <Link
                            href="/auth/agent/login"
                            className="text-brand-gold hover:underline"
                        >
                            Back to Agent ID Login
                        </Link>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
