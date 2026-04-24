"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const MILESTONES = [
  {
    year: "2021",
    title: "The Code of the Rishis",
    desc: "Began digitalizing Parashara Hora Shastra into deterministic logic blocks. Bridging ancient Sanskrit with modern computational rigor.",
    accent: "#00FF94",
  },
  {
    year: "2022",
    title: "Ephemeris Computing",
    desc: "Engineered a high-performance calculation cluster to handle real-time planetary transits with 0.001-degree precision.",
    accent: "#FF8C00",
  },
  {
    year: "2023",
    title: "The Neural Link",
    desc: "Trained specialized models on 50,000+ verified historical charts to identify recurring karmic signatures.",
    accent: "#7e56da",
  },
  {
    year: "2024",
    title: "URekha Genesis",
    desc: "Launched the first version of the planetary engine. Validated by thousands of seekers for unprecedented accuracy.",
    accent: "#FF8C00",
  },
  {
    year: "2025",
    title: "The Massive Scale",
    desc: "Deployed the 100-page report orchestrator, processing millions of data points with managed concurrency.",
    accent: "#00FF94",
  },
];

export default function EvolutionMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative">

      {/* ─── Desktop: Horizontal Scroll-like Cards ─── */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Main Timeline Spine */}
          <div className="absolute left-0 right-0 top-[80px] h-[1px]">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.06] to-transparent" />
          </div>

          {/* Year markers row */}
          <div className="flex justify-between mb-0 relative z-10">
            {MILESTONES.map((item, i) => (
              <motion.div
                key={`year-${i}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
                style={{ flex: 1 }}
              >
                {/* Year */}
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-slate-400 dark:text-zinc-500 font-semibold mb-6">
                  {item.year}
                </span>

                {/* Dot on line */}
                <div className="relative mb-8">
                  <div
                    className="w-[14px] h-[14px] rounded-full border-[3px] border-white dark:border-[#0c0c10] z-10 relative"
                    style={{ backgroundColor: item.accent }}
                  />
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: item.accent }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content Cards */}
          <div className="flex gap-5">
            {MILESTONES.map((item, i) => (
              <motion.div
                key={`card-${i}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="flex-1 group"
              >
                <div className={cn(
                  "relative rounded-3xl p-8 h-full",
                  "bg-white/70 dark:bg-white/[0.03]",
                  "backdrop-blur-xl",
                  "border border-slate-100 dark:border-white/[0.06]",
                  "shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)]",
                  "dark:shadow-none",
                  "transition-all duration-500",
                  "hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)]",
                  "dark:hover:border-white/[0.12]",
                  "dark:hover:bg-white/[0.05]",
                )}>
                  {/* Accent top bar */}
                  <div
                    className="absolute top-0 left-8 right-8 h-[2px] rounded-b-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: item.accent }}
                  />

                  {/* Number */}
                  <div className="font-mono text-[64px] font-black leading-none tracking-tighter opacity-[0.04] dark:opacity-[0.06] absolute top-4 right-6 select-none pointer-events-none">
                    0{i + 1}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h4 className="text-[17px] font-bold text-slate-800 dark:text-white mb-3 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-[13.5px] text-slate-500 dark:text-zinc-400 leading-[1.8]">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.accent }}
                      />
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-300 dark:text-zinc-600 font-medium">
                        Phase {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Mobile: Clean Stacked Timeline ─── */}
      <div className="md:hidden space-y-6">
        {MILESTONES.map((item, i) => (
          <motion.div
            key={`mobile-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative flex gap-5 group"
          >
            {/* Left spine */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-3 h-3 rounded-full mt-1.5 z-10 border-2 border-white dark:border-[#0c0c10]"
                style={{ backgroundColor: item.accent }}
              />
              {i < MILESTONES.length - 1 && (
                <div className="w-px flex-1 bg-gradient-to-b from-slate-200 dark:from-white/10 to-transparent mt-2" />
              )}
            </div>

            {/* Card */}
            <div className={cn(
              "flex-1 rounded-2xl p-6 mb-2",
              "bg-white/60 dark:bg-white/[0.03]",
              "backdrop-blur-xl",
              "border border-slate-100 dark:border-white/[0.06]",
              "shadow-[0_2px_20px_-6px_rgba(0,0,0,0.06)] dark:shadow-none",
            )}>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-slate-400 dark:text-zinc-500 font-semibold">
                  {item.year}
                </span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-white/[0.05]" />
                <span className="font-mono text-[10px] tracking-wider uppercase text-slate-300 dark:text-zinc-700">
                  0{i + 1}
                </span>
              </div>
              <h4 className="text-[16px] font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
                {item.title}
              </h4>
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-[1.75]">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
