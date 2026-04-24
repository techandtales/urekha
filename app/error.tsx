"use client";

import { useEffect } from "react";
import { TriangleAlert, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an observability service if implemented
    console.error("System Paradox Detested:", error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050A0A] px-6 text-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF8C00]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Error Icon & Code */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#FF8C00]/20 blur-[30px] rounded-full animate-pulse" />
        <div className="relative w-20 h-20 bg-[#FF8C00]/10 border border-[#FF8C00]/30 rounded-2xl flex items-center justify-center text-[#FF8C00]">
          <TriangleAlert size={40} className="animate-[wiggle_1s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Error Content */}
      <h1 className="text-[#FF8C00] font-mono text-xl md:text-2xl tracking-tighter mb-4 uppercase">
        System Paradox Detected
      </h1>
      
      <p className="max-w-md text-white/50 font-sans text-sm md:text-base leading-relaxed mb-10">
        The Architect's Void has encountered an unexpected data corruption or service interruption. 
        Deterministic parameters have been temporarily destabilized.
      </p>

      {/* Error ID / Digest - Monospace Glitch look */}
      <div className="bg-white/[0.03] border border-white/10 px-4 py-2 rounded font-mono text-[10px] text-white/30 uppercase tracking-widest mb-12">
        Error Digest: {error.digest || "NULL_POINTER_EXCEPTION"}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full max-w-sm">
        <button
          onClick={() => reset()}
          className="w-full bg-[#FF8C00] hover:bg-[#FF9C20] text-[#050A0A] px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,140,0,0.3)]"
        >
          <RefreshCw size={18} />
          Re-anchor System
        </button>
        
        <Link
          href="/dashboard"
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 transition-all"
        >
          <ChevronLeft size={18} />
          Return to Core
        </Link>
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
