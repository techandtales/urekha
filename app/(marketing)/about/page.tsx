"use client";

import { motion, Variants } from "framer-motion";
import {
  Binary,
  Cpu,
  Globe,
  Infinity,
  Users,
  Database,
  Star,
  Layers,
  Zap,
  Shield,
  BookOpen,
  Sparkles,
} from "lucide-react";
import EvolutionMap from "@/components/about/EvolutionMap";
import CrystalCard from "@/components/about/CrystalCard";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: "easeOut" },
  }),
};

const STATS = [
  { val: "500M+", label: "Data Points Processed", icon: Database },
  { val: "50k+", label: "Charts Analysed", icon: Layers },
  { val: "0.001°", label: "Planetary Precision", icon: Sparkles },
  { val: "≈14ms", label: "Average Latency", icon: Zap },
];

const PILLARS = [
  {
    icon: Infinity,
    title: "Ancient Data Science",
    desc: "Vedic Astrology is the world's first pattern recognition system. We decode 5,000 years of observational data into deterministic algorithms.",
    variant: "teal" as const,
  },
  {
    icon: Binary,
    title: "Algorithmic Precision",
    desc: "Every prediction passes through an 8-layer validation pipeline — integrating rigorous mathematics with modern software engineering.",
    variant: "amber" as const,
  },
  {
    icon: Shield,
    title: "Computational Integrity",
    desc: "Swiss Ephemeris logic powers our calculation core. No shortcuts, no approximations — only mathematically verifiable outputs.",
    variant: "teal" as const,
  },
  {
    icon: BookOpen,
    title: "Vedic Scholarship",
    desc: "Our interpretation engine is trained on authenticated texts — Parasara Hora Shastra, Brihat Jataka, and Phaladeepika form the knowledge base.",
    variant: "amber" as const,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050A0A] relative overflow-hidden transition-colors duration-500">

      {/* === BACKGROUND MESH === */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Teal orb */}
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-[#00FF94]/[0.07] dark:bg-[#00FF94]/[0.04] rounded-full blur-[150px]" />
        {/* Amber orb */}
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-[#FF8C00]/[0.07] dark:bg-[#FF8C00]/[0.04] rounded-full blur-[150px]" />
        {/* Center orb */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/[0.03] dark:bg-purple-500/[0.02] rounded-full blur-[200px]" />

        {/* Dot grid (light mode) */}
        <div className="absolute inset-0 dark:hidden opacity-[0.4]" style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        {/* Dot grid (dark mode) */}
        <div className="absolute inset-0 hidden dark:block opacity-[0.15]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
      </div>

      <div className="relative z-10">

        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <section className="pt-36 pb-24 md:pt-44 md:pb-32 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-10 text-xs font-mono uppercase tracking-[0.2em] bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/50 dark:border-white/10 text-[#00A859] dark:text-[#00FF94] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-none"
            >
              <Star size={14} className="animate-pulse" />
              The Genesis
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[0.95]"
            >
              Decoding <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00FF94] via-[#00A859] to-[#007A42]">
                The Infinite Code
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-lg md:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              We built a massive kundli and prediction generation system. Users enter birth details — our engine does the rest, processing millions of planetary combinations to deliver a 100-page precision report.
            </motion.p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PILLARS — 4 Premium Glass Cards
        ═══════════════════════════════════════════ */}
        <section className="px-6 pb-32">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
              >
                <CrystalCard variant={pillar.variant} className="p-10 md:p-12 h-full">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: pillar.variant === "amber"
                        ? "rgba(255, 140, 0, 0.1)"
                        : "rgba(0, 255, 148, 0.1)",
                      border: `1px solid ${pillar.variant === "amber" ? "rgba(255, 140, 0, 0.2)" : "rgba(0, 255, 148, 0.2)"}`,
                    }}
                  >
                    <pillar.icon
                      size={28}
                      className={pillar.variant === "amber" ? "text-[#FF8C00]" : "text-[#00FF94]"}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-500 dark:text-zinc-400 leading-relaxed text-[15px]">
                    {pillar.desc}
                  </p>
                </CrystalCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ENGINE STATS — Giant Glass Panel
        ═══════════════════════════════════════════ */}
        <section className="px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto relative rounded-[2.5rem] overflow-hidden"
          >
            {/* Colored bg behind glass */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/10 via-slate-50 dark:via-[#0a0a10] to-[#FF8C00]/10" />

            {/* Glass panel */}
            <div className="relative bg-white/40 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/50 dark:border-white/[0.06] shadow-[0_8px_60px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_60px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-12 md:p-20">
              {/* Top highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/15 to-transparent" />

              <div className="text-center mb-16 relative z-10">
                <Cpu className="w-14 h-14 text-[#00A859] dark:text-[#00FF94] mx-auto mb-6" />
                <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                  The Engine of <br className="hidden md:block" /> Determinism
                </h2>
                <p className="text-lg text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                  From managed asynchronous job queues to 100-page dynamic report generation — our backend processes millions of planetary combinations with zero approximation.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-6 rounded-2xl bg-white/50 dark:bg-white/[0.04] backdrop-blur-lg border border-white/60 dark:border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <stat.icon size={20} className="text-slate-400 dark:text-zinc-500 mx-auto mb-3" />
                    <div className="text-2xl md:text-3xl font-mono font-bold text-slate-800 dark:text-[#00FF94] mb-1">
                      {stat.val}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            CHRONOLOGY
        ═══════════════════════════════════════════ */}
        <section className="px-6 pb-32">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                The Evolution
              </h2>
              <p className="text-slate-500 dark:text-zinc-400 text-lg">
                Years of research. A singular vision.
              </p>
            </motion.div>
            <EvolutionMap />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            VISION — Gradient Border Glass Card
        ═══════════════════════════════════════════ */}
        <section className="px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            {/* Gradient border wrapper */}
            <div className="relative p-[1.5px] rounded-[2.5rem] overflow-hidden">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#00FF94,#FF8C00,#7e56da,#00FF94)] opacity-30 dark:opacity-50 animate-[spin_8s_linear_infinite]" style={{ filter: "blur(4px)" }} />

              {/* Inner glass */}
              <div className="relative bg-white/70 dark:bg-[rgba(10,10,15,0.85)] backdrop-blur-2xl rounded-[2.4rem] p-12 md:p-20 flex flex-col md:flex-row gap-14 items-center">
                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/10 to-transparent rounded-t-[2.4rem]" />

                <div className="flex-1 space-y-8 relative z-10">
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                      The Core Vision
                    </h2>
                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#00FF94] to-[#FF8C00]" />
                  </div>

                  <p className="text-lg text-slate-600 dark:text-zinc-300 leading-relaxed italic">
                    "Our mission is to quantify the unquantifiable. Destiny is not a mystery — it is a complex data structure that can be decoded through mathematical precision. URekha is the interface between ancient insight and future logic."
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center">
                      <Binary size={22} className="text-slate-400 dark:text-zinc-500" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white text-sm">
                        System Architecture Team
                      </div>
                      <div className="text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-[0.15em]">
                        Engineering Division
                      </div>
                    </div>
                  </div>
                </div>

                {/* Icon Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4 relative z-10">
                  {[
                    { icon: Database, color: "#FF8C00", label: "Storage" },
                    { icon: Globe, color: "#00FF94", label: "Global" },
                    { icon: Users, color: "#7e56da", label: "Scale" },
                    { icon: Cpu, color: "#00FF94", label: "Compute" },
                  ].map((item, i) => (
                    <CrystalCard
                      key={i}
                      variant={item.color === "#FF8C00" ? "amber" : item.color === "#7e56da" ? "neutral" : "teal"}
                      className={`aspect-square flex flex-col items-center justify-center gap-2 ${i % 2 === 1 ? "mt-6" : ""}`}
                    >
                      <item.icon size={32} style={{ color: item.color }} />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 font-medium">
                        {item.label}
                      </span>
                    </CrystalCard>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </main>
  );
}
