"use client";

import { Search, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050A0A] px-6 text-center overflow-hidden">
      {/* Background Drifting Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {mounted &&
          [...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#00FF94] blur-[1px]"
              style={{
                width: Math.random() * 3 + "px",
                height: Math.random() * 3 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random(),
                animation: `drift ${Math.random() * 20 + 10}s linear infinite`,
              }}
            />
          ))}
      </div>

      {/* Floating Node */}
      <div className="relative mb-12">
        <div className="w-16 h-16 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/30 flex items-center justify-center text-[#00FF94] shadow-[0_0_30px_rgba(0,255,148,0.2)] animate-[float_4s_ease-in-out_infinite]">
          <Search size={32} />
        </div>
        {/* Broken connection lines */}
        <div className="absolute top-1/2 left-full w-24 h-[1px] bg-gradient-to-r from-[#00FF94]/40 to-transparent -translate-y-1/2 -rotate-12 blur-[0.5px] opacity-30" />
        <div className="absolute top-1/2 right-full w-20 h-[1px] bg-gradient-to-l from-[#00FF94]/40 to-transparent -translate-y-1/2 rotate-45 blur-[0.5px] opacity-30" />
      </div>

      {/* 404 Content */}
      <h1 className="text-[#00FF94] font-mono text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
        404
      </h1>
      <h2 className="text-white/80 font-mono text-sm md:text-lg tracking-[0.2em] uppercase mb-6">
        Data Lost in the Void
      </h2>
      
      <p className="max-w-md text-white/40 font-sans text-sm md:text-base leading-relaxed mb-12">
        The coordinate you are attempting to synchronize does not exist in the URekha index.
        A deterministic path forward is currently unavailable.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full max-w-sm">
        <Link
          href="/dashboard"
          className="w-full bg-[#00FF94] hover:bg-[#05E889] text-[#050A0A] px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-[0_0_20px_rgba(0,255,148,0.2)]"
        >
          <Home size={18} />
          Return to Core
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 transition-all"
        >
          <ArrowLeft size={18} />
          Previous Cache
        </button>
      </div>

      <style jsx>{`
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-100vh); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
