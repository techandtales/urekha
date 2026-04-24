"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Network, Variable, GitMerge, FileJson } from "lucide-react";
import PremiumHero from "@/components/ui/PremiumHero";

const QUOTE = {
    text: "God does not play dice with the universe.",
    author: "Albert Einstein"
};

const FEATURES = [
    {
        icon: Database,
        title: "Astrology as Big Data",
        subtitle: "The Input Layer",
        description: "A complete birth chart involves thousands of permutations: planetary positions, nakshatra subdivisions, divisional charts (D1 to D60), aspectual strength (Shadbala), and temporal cycles (Dashas). Urekha ingest these thousands of data points as raw vector inputs.",
        gradient: "from-brand-gold",
        accent: "#D4AF37"
    },
    {
        icon: Network,
        title: "The Neural Architecture",
        subtitle: "The Processing Layer",
        description: "Our system is not a simple lookup table. It utilizes a graph neural network to understand context. It 'knows' that a debilitated Sun behaves differently in the 10th house than in the 12th, and differently again if aspected by Jupiter.",
        gradient: "from-brand-indigo",
        accent: "#A78BFA"
    },
    {
        icon: Cpu,
        title: "Real-Time Processing",
        subtitle: "The Compute Layer",
        description: "Unlike human astrologers who may take days to prepare a reading, our distributed GPU clusters calculate 25-years of planetary transits in roughly 45 seconds, delivering immediate insights when you need them.",
        gradient: "from-emerald-500",
        accent: "#00FF94"
    }
];

const PROCESS_STEPS = [
    { icon: Variable, title: "Data Ingestion", desc: "Ephemeris calculation to 0.001° accuracy", accent: "#D4AF37" },
    { icon: GitMerge, title: "Pattern Matching", desc: "Cross-referencing 5,000+ Yogas", accent: "#00FF94" },
    { icon: FileJson, title: "Report Generation", desc: "Natural Language Synthesis", accent: "#A78BFA" }
];

export default function PlatformPage() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[#050A0A] theme-transition pb-24 dark">
            <div className="relative z-10">
                <PremiumHero
                    badge="The Intelligence"
                    title="The Platform"
                    description="Where ancient wisdom meets cutting-edge artificial intelligence. We treat astrology as a data science problem, not a mystic art."
                />

                {/* Quote Block */}
                <div className="container mx-auto px-6 mb-24 text-center mt-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-10 py-8 rounded-2xl border border-white/10 bg-[#0A0F0F]/80 backdrop-blur-xl shadow-lg relative overflow-hidden group transition-all duration-500 hover:bg-white/5"
                    >
                        {/* Top accent strip */}
                        <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 ease-out bg-[#D4AF37]" />

                        <div className="flex justify-center mb-4">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mx-2" />
                            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
                        </div>

                        <p className="text-white italic text-xl md:text-2xl font-serif symbol-interact relative z-10 drop-shadow-sm font-medium">
                            "{QUOTE.text}"
                        </p>
                        <p className="text-[#D4AF37] text-sm mt-4 font-mono tracking-[0.2em] uppercase origin-bottom font-bold">
                            — {QUOTE.author}
                        </p>
                    </motion.div>
                </div>

                {/* How It Works - Visual Process */}
                <section className="mb-32 container mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                                <span className="text-sm">⚡</span>
                                <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.3em] font-bold">
                                    Architecture
                                </span>
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">System Pipeline</h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 max-w-5xl mx-auto"
                    >
                        {PROCESS_STEPS.map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center relative z-10 group w-full md:w-1/3">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    whileInView={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: i * 0.2, type: "spring" }}
                                    className="w-24 h-24 rounded-2xl bg-[#0A0F0F] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group-hover:scale-110 transition-transform duration-500"
                                >
                                    <div className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20" style={{ background: `radial-gradient(circle at center, ${step.accent}, transparent)` }} />
                                    <step.icon className="w-10 h-10 text-white relative z-10" />
                                </motion.div>
                                <h3 className="text-xl font-bold font-serif mb-3 text-white">{step.title}</h3>
                                <p className="text-sm text-white/80 font-medium">{step.desc}</p>

                                {/* Connecting Line (Desktop) */}
                                {i < PROCESS_STEPS.length - 1 && (
                                    <div className="hidden md:block absolute top-[48px] left-[calc(50%+48px)] w-[calc(100%+64px-96px)] h-[1px] bg-white/10 -z-10">
                                        <div className="absolute inset-0 origin-left animate-[shimmer_2s_infinite]" style={{ background: `linear-gradient(90deg, transparent, ${step.accent}80, transparent)` }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* Deep Dive Sections */}
                <div className="container mx-auto px-6 space-y-32">
                    {FEATURES.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}
                        >
                            {/* Text Side */}
                            <div className="w-full md:w-1/2 text-left relative">
                                <span className="font-mono text-sm tracking-[0.2em] uppercase mb-4 block font-bold" style={{ color: feature.accent }}>
                                    {feature.subtitle}
                                </span>
                                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 font-bold">
                                    {feature.title}
                                </h2>
                                <p className="text-lg text-white/80 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                                {/* Decorative Number Background */}
                                <div
                                    className="absolute -top-12 -left-8 text-[120px] font-mono font-bold leading-none select-none pointer-events-none opacity-[0.05]"
                                    style={{ color: feature.accent }}
                                >
                                    0{i + 1}
                                </div>
                            </div>

                            {/* Visual Side */}
                            <div className="w-full md:w-1/2">
                                <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-[#0A0F0F]/50 border border-white/10 backdrop-blur-xl group hover:shadow-2xl transition-all duration-700">
                                    {/* Accent Border Hover */}
                                    <div
                                        className="absolute top-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-1000 ease-out z-20"
                                        style={{ background: feature.accent }}
                                    />
                                    
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} to-transparent opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-700`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <feature.icon className="w-32 h-32 md:w-40 md:h-40 text-white/20 group-hover:scale-110 group-hover:text-white/60 transition-all duration-700" />
                                    </div>
                                    
                                    {/* Decorative Code/Data overlay */}
                                    <div className="absolute bottom-6 left-6 right-6 font-mono text-xs text-white/50 overflow-hidden h-20 leading-relaxed flex flex-col justify-end group-hover:text-white/80 transition-colors duration-500 font-medium">
                                        <div className="opacity-50">01010010 01000101 01000001 01001100 01001001 01010100 01011001</div>
                                        <div>&gt; Analyzing planetary vectors...</div>
                                        <div>&gt; Optimize graph weights...</div>
                                        <div style={{ color: feature.accent }}>&gt; Synthesizing output... [OK]</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}

