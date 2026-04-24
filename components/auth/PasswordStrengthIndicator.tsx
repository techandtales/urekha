"use client";

import { cn } from "@/lib/utils";
import { calculateStrength, passwordRequirements, strengthColors, strengthLabels } from "@/lib/passwordUtils";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface PasswordStrengthIndicatorProps {
    password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
    const strength = calculateStrength(password);

    return (
        <div className="space-y-3 mt-2">
            {/* Strength Bar */}
            <div className="flex gap-1 h-1 w-full">
                {[0, 1, 2, 3].map((level) => (
                    <div
                        key={level}
                        className={cn(
                            "h-full flex-1 rounded-full transition-colors duration-300",
                            password.length > 0 && strength > level
                                ? strengthColors[strength]
                                : "bg-zinc-200 dark:bg-zinc-800"
                        )}
                    />
                ))}
            </div>

            {/* Label */}
            <div className="flex justify-between items-center text-xs">
                <span className={cn(
                    "font-medium transition-colors duration-300",
                    password.length > 0 ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"
                )}>
                    Password Strength
                </span>
                <span className={cn(
                    "font-bold uppercase tracking-wider transition-colors duration-300",
                    password.length > 0 ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
                )}>
                    {password.length > 0 ? strengthLabels[strength] : "-"}
                </span>
            </div>

            {/* Requirements List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {passwordRequirements.map((req, index) => {
                    const isMet = req.test(password);
                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center gap-1.5 transition-colors duration-200",
                                isMet ? "text-green-600 dark:text-green-400" : "text-slate-400 dark:text-slate-500"
                            )}
                        >
                            {isMet ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-zinc-700" />}
                            <span>{req.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
