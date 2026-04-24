"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ className, label, icon: Icon, error, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const hasValue = props.value ? String(props.value).length > 0 : false;

        return (
            <div className="space-y-1.5 w-full group">
                <div className="relative group">
                    <div className={cn(
                        "absolute left-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors duration-300",
                        isFocused ? "text-brand-gold" : "group-hover:text-white/70"
                    )}>
                        {Icon && <Icon size={18} />}
                    </div>
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-12 w-full rounded-xl border bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
                            Icon ? "pl-10" : "",
                            error ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:border-brand-gold/50",
                            className
                        )}
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        placeholder={label}
                        {...props}
                    />
                    {/* Floating Label Effect (Optional, simpler approach here) */}
                    {/*  <label className={cn(
                        "absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-300 pointer-events-none",
                         isFocused || hasValue ? "-top-2.5 left-2 text-xs bg-black/50 px-1 text-brand-gold" : ""
                    )}>
                        {label}
                    </label> */}
                </div>
                {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
            </div>
        );
    }
);
AuthInput.displayName = "AuthInput";
