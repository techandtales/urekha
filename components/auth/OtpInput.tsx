"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
}

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
    const valueItems = useMemo(() => {
        const valueArray = value.split("");
        const items = [];

        for (let i = 0; i < length; i++) {
            const char = valueArray[i];
            items.push(char || "");
        }
        return items;
    }, [value, length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/[^0-9]/g, "").slice(0, length);
        onChange(newValue);
    };

    return (
        <div className="relative w-full max-w-[360px] mx-auto">
            <div className="flex gap-2 justify-center">
                {valueItems.map((digit, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "relative w-12 h-14 flex items-center justify-center rounded-xl bg-white/10 border transition-all duration-300 backdrop-blur-sm",
                            digit ? "border-brand-gold bg-white/20 shadow-sm" : "border-white/10",
                            // Highlight current focused box roughly (since actual focus is on the input)
                            value.length === idx ? "border-brand-gold ring-2 ring-brand-gold/20" : ""
                        )}
                    >
                        {digit && (
                            <motion.span
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="text-xl font-bold text-white"
                            >
                                {digit}
                            </motion.span>
                        )}
                    </div>
                ))}
            </div>

            {/* Hidden Input Layer */}
            <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={length}
                value={value}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-text font-mono tracking-[2em]"
                autoFocus
            />
        </div>
    );
}
