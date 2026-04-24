"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: "primary" | "secondary";
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
    ({ className, children, isLoading, variant = "primary", disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "relative w-full h-12 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-300 flex items-center justify-center overflow-hidden",
                    variant === "primary"
                        ? "bg-zinc-900 text-white shadow-md hover:bg-zinc-800 hover:scale-[1.01]"
                        : "bg-black/5 border border-black/10 text-slate-900 hover:bg-black/10 hover:border-black/20",
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
AuthButton.displayName = "AuthButton";
