"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useStore } from "@/lib/store";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useSvgToPng, useMultipleSvgToPng, DUMMY_SVG } from "@/utils/svgToPng";

// ── Types ──
import { Language } from "@/types/languages";

// ── Loading Messages ──
const LOADING_MESSAGES = [
  "Preparing celestial document...",
  "Formatting planetary charts...",
  "Generating complex SVGs...",
  "Applying Sanskrit fonts...",
  "Compiling astrological sections...",
  "Assembling final PDF...",
];

// ── Report Loading Screen ──
export function ReportLoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 2;
      if (currentProgress >= 95) currentProgress = 95; // wait for document
      setProgress(currentProgress);

      if (currentProgress % 20 === 0) {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050A0A]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(0,229,255,0.15), transparent 70%)",
            top: "-100px",
            right: "-50px",
            animation: "reportOrbFloat 14s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(0,255,148,0.1), transparent 70%)",
            bottom: "-80px",
            left: "-60px",
            animation:
              "reportOrbFloat 18s ease-in-out infinite alternate-reverse",
          }}
        />
      </div>

      <div className="relative w-28 h-28 mb-8">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(0,229,255,0.1)"
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(0,229,255,0.6)"
            strokeWidth="2.5"
            strokeDasharray={`${progress * 3.39} ${339.29 - progress * 3.39}`}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "60px 60px",
              transition: "stroke-dasharray 0.8s ease",
            }}
          />
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="rgba(255,215,0,0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 60 60"
              to="360 60 60"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="60"
            cy="60"
            r="30"
            fill="none"
            stroke="rgba(0,229,255,0.1)"
            strokeWidth="1"
            strokeDasharray="2 6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 60 60"
              to="0 60 60"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
          <polygon
            points="60,48 72,60 60,72 48,60"
            fill="none"
            stroke="rgba(255,215,0,0.4)"
            strokeWidth="1.5"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </polygon>
          <circle cx="60" cy="60" r="3" fill="#00E5FF">
            <animate
              attributeName="r"
              values="2;4;2"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "'Source Code Pro', monospace",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#00E5FF",
          }}
        >
          {progress}%
        </div>
      </div>

      <h2
        className="text-xl font-bold mb-2"
        style={{
          background: "linear-gradient(135deg, #00FF94, #00E5FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em",
        }}
      >
        Initializing Document Frame
      </h2>

      <p
        className="text-sm mb-6"
        style={{
          fontFamily: "'Source Code Pro', monospace",
          color: "rgba(0,229,255,0.5)",
          letterSpacing: "0.04em",
        }}
      >
        {LOADING_MESSAGES[messageIndex]}
      </p>

      <div
        className="w-64 h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #0891b2, #22d3ee, #67e8f9)",
            transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            boxShadow: "0 0 10px rgba(0,229,255,0.6)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes reportOrbFloat {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -15px) scale(1.1);
          }
          100% {
            transform: translate(-10px, 10px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}

// ── Dynmaically Import the Entire PDF Document Core ──
// This prevents React-PDF from trying to run node APIs on the Next.js server
const DynamicReactPdfCore = dynamic(() => import("./PdfRendererShell"), {
  ssr: false,
  loading: () => <ReportLoadingScreen />,
});

export default function Home() {
  const { birthDetails, jyotishamData } = useStore();

  const isDataLoaded = !!jyotishamData.extendedHoro.extendedKundli;

  if (birthDetails.username === null) {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#050a0a] text-center px-4">
        <Loader2 className="animate-spin text-[#00ff94] mb-4" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">
          Redirecting to Dashboard
        </h2>
      </div>
    );
  }

  if (!isDataLoaded) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#050a0a] text-center px-4">
        <Loader2 className="animate-spin text-[#00ff94] mb-4" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">
          Vault Data Not Loaded
        </h2>
        <p className="text-zinc-500 mb-6">
          Redirecting to the architecture pipeline...
        </p>
        <button
          onClick={() => (window.location.href = "/pipeline")}
          className="px-8 py-3 bg-[#00ff94] text-black rounded-xl font-bold hover:scale-105 transition-transform"
        >
          Initialize Pipeline
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#050a0a] m-0 p-0 overflow-hidden">
      <DynamicReactPdfCore />
    </div>
  );
}
