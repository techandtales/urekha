"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface ModernAuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export const ModernAuthInput = forwardRef<HTMLInputElement, ModernAuthInputProps>(
  ({ className, type, label, icon: Icon, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1 w-full group">
        {label && (
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1 mb-1 block transition-colors">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7e56da] transition-colors pointer-events-none">
              <Icon size={18} strokeWidth={2} />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "flex h-12 w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#7e56da] dark:focus:border-[#9e7df2] focus:ring-1 focus:ring-[#7e56da] dark:focus:ring-[#9e7df2] transition-colors duration-300",
              Icon && "pl-11",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              isPassword && "pr-10",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
      </div>
    );
  }
);
ModernAuthInput.displayName = "ModernAuthInput";
