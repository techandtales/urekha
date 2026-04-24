"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "google" | "phone";
  loading?: boolean;
}

export function SocialButton({
  provider,
  className,
  loading,
  ...props
}: SocialButtonProps) {
  return (
    <button
      type="button"
      disabled={loading}
      className={cn(
        "flex-1 h-11 flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white hover:bg-gray-50 hover:border-black/20 transition-all duration-300 active:scale-95 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">
            Connecting...
          </span>
        </>
      ) : provider === "google" ? (
        <>
          <div className="w-5 h-5 relative flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-slate-700">Google</span>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-phone text-slate-900"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="text-sm font-medium text-slate-700">Phone</span>
        </>
      )}
    </button>
  );
}
