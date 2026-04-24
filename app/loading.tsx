"use client";

import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050A0A] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FF94]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 255, 148, 0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Constellation Animation */}
      <div className="relative mb-12">
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none opacity-20">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#00FF94" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_10s_linear_infinite]" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#00FF94" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_10s_linear_infinite]" />
        </svg>

        {/* Nodes */}
        <div className="flex items-center justify-center gap-12 relative z-10">
          <div className="w-4 h-4 rounded-full bg-[#00FF94] shadow-[0_0_15px_#00FF94] animate-bounce [animation-delay:-0.3s]" title="URekha" />
          <div className="w-5 h-5 rounded-full bg-[#00FF94] shadow-[0_0_25px_#00FF94] animate-bounce [animation-delay:-0.15s]" title="UBrainLab" />
          <div className="w-4 h-4 rounded-full bg-[#00FF94] shadow-[0_0_15px_#00FF94] animate-bounce" title="ByVayomi" />
        </div>
      </div>

      {/* Progress Text */}
      <div className="text-center relative z-10">
        <h2 className="text-[#00FF94] font-mono text-sm tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin" />
          Synchronizing Cosmic Logic
        </h2>
        <div className="w-48 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF94] to-transparent w-1/2 animate-[shimmer_2s_infinite]" />
        </div>
        <p className="mt-4 text-white/30 font-mono text-[10px] uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
          Architecting Deterministic Systems for Predictive Intelligence
        </p>
      </div>

      <style jsx>{`
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
