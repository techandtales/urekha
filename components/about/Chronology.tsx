"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MILESTONES = [
  {
    year: "2021",
    title: "The Code of the Rishis",
    desc: "Began digitalizing Paranara Hora Shastra into deterministic logic blocks. Bridging ancient Sanskrit with modern computational rigor.",
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
    desc: "Trained our first specialized models on 50,000+ verified historical charts to identify recurring karmic signatures.",
    accent: "#00FF94",
  },
  {
    year: "2024",
    title: "URekha Genesis",
    desc: "Launched the first version of the planetary engine. Validated by thousands of early seekers for unprecedented accuracy.",
    accent: "#FF8C00",
  },
  {
    year: "2025",
    title: "The Massive Scale",
    desc: "Deployed the 100-page report orchestrator, capable of processing millions of data points per second with managed concurrency.",
    accent: "#00FF94",
  },
];

export default function Chronology() {
  return (
    <div className="relative py-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Central spine */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent" />

        <div className="space-y-16 md:space-y-20">
          {MILESTONES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: "easeOut" }}
              className={cn(
                "relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12",
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              {/* Connector dot on spine */}
              <div className="absolute left-6 md:left-1/2 top-2 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-20">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.accent,
                    boxShadow: `0 0 12px ${item.accent}60, 0 0 24px ${item.accent}30`,
                  }}
                />
              </div>

              {/* Year */}
              <div className={cn(
                "flex-1 pl-16 md:pl-0",
                i % 2 === 0 ? "md:text-right" : "md:text-left"
              )}>
                <span
                  className="font-mono text-4xl md:text-5xl font-black tracking-tighter"
                  style={{ color: `${item.accent}30` }}
                >
                  {item.year}
                </span>
              </div>

              {/* Glass Content Card */}
              <div
                className={cn(
                  "flex-1 pl-16 md:pl-0",
                  "relative rounded-2xl overflow-hidden",
                  // Light glass
                  "bg-white/50 backdrop-blur-xl border border-white/60",
                  "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]",
                  // Dark glass
                  "dark:bg-white/[0.04] dark:backdrop-blur-xl dark:border-white/[0.08]",
                  "dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]",
                  "p-6 md:p-8"
                )}
              >
                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />

                {/* Accent glow */}
                <div
                  className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-20 dark:opacity-10 pointer-events-none blur-3xl"
                  style={{ backgroundColor: item.accent }}
                />

                <h4 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 relative z-10">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed relative z-10">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
