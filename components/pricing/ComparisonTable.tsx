"use client";

import { Check, Minus, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/* ─── Online User Features ─── */
const USER_FEATURES = [
    { name: "AI Birth Chart Analysis", basic: true, deep: true, architect: true },
    { name: "Daily Horoscope Access", basic: true, deep: true, architect: true },
    { name: "Numerology Report", basic: true, deep: true, architect: true },
    { name: "Deep Predictive Reports (5)", basic: false, deep: true, architect: true },
    { name: "Compatibility Matrix Sync", basic: false, deep: true, architect: true },
    { name: "AI Interpretation Engine", basic: false, deep: true, architect: true },
    { name: "Priority System Support", basic: false, deep: true, architect: true },
    { name: "Unlimited Predictive Reports", basic: false, deep: false, architect: true },
    { name: "Direct Astrologer API Access", basic: false, deep: false, architect: true },
    { name: "Custom Dashboards", basic: false, deep: false, architect: true },
    { name: "24/7 VIP Support", basic: false, deep: false, architect: true },
];

/* ─── Offline Agent Features ─── */
const AGENT_FEATURES = [
    { name: "Core Prediction Chapters", basic: true, standard: true, premium: true },
    { name: "Lifelong Overview", basic: true, standard: true, premium: true },
    { name: "Printable Dynamic PDF", basic: true, standard: true, premium: true },
    { name: "5-Year Forecast", basic: true, standard: false, premium: false },
    { name: "10-Year Forecast", basic: false, standard: true, premium: false },
    { name: "15-Year Forecast", basic: false, standard: false, premium: true },
    { name: "Extended Extra Pages (23+)", basic: true, standard: true, premium: true },
    { name: "Extended Extra Pages (43+)", basic: false, standard: true, premium: true },
    { name: "Extended Extra Pages (73+)", basic: false, standard: false, premium: true },
    { name: "Advanced Divisional Charts", basic: false, standard: true, premium: true },
    { name: "Comprehensive AI Analysis", basic: false, standard: false, premium: true },
    { name: "Priority Rendering Queue", basic: false, standard: false, premium: true },
];

function FeatureIcon({ active, accent }: { active: boolean; accent: string }) {
    return active ? (
        <Check className="w-4 h-4 mx-auto" style={{ color: accent }} />
    ) : (
        <Minus className="w-4 h-4 mx-auto text-white/15" />
    );
}

export default function ComparisonTable() {
    return (
        <div className="space-y-20">
            {/* ─── Online Users Comparison ─── */}
            <div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00FF94]/15 bg-[#00FF94]/[0.04] mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.25em]">
                            Online Users
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-serif text-white mb-3">
                        Compare User Plans
                    </h2>
                    <p className="text-sm text-white/30 max-w-md mx-auto">
                        Side-by-side breakdown of what each tier unlocks for your cosmic journey.
                    </p>
                </motion.div>

                <div className="overflow-x-auto pb-4 -mx-2 px-2">
                    <motion.table
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-full text-left border-collapse min-w-[600px]"
                    >
                        <thead>
                            <tr className="border-b border-white/[0.08]">
                                <th className="py-5 px-4 text-sm font-semibold text-white/60 w-2/5 uppercase tracking-wider">
                                    Features
                                </th>
                                <th className="py-5 px-4 text-center w-1/5">
                                    <span className="text-sm font-bold text-[#A78BFA]">Basic Cosmic</span>
                                </th>
                                <th className="py-5 px-4 text-center w-1/5 relative">
                                    <div className="absolute inset-0 bg-[#00FF94]/[0.02] rounded-t-xl pointer-events-none" />
                                    <div className="relative flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00FF94]/10 border border-[#00FF94]/20">
                                            <Crown className="w-2.5 h-2.5 text-[#00FF94]" />
                                            <span className="text-[8px] font-mono text-[#00FF94] uppercase tracking-wider">Popular</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#00FF94]">Deep Matrix</span>
                                    </div>
                                </th>
                                <th className="py-5 px-4 text-center w-1/5">
                                    <span className="text-sm font-bold text-[#D4AF37]">Architect&apos;s Void</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {USER_FEATURES.map((feature, i) => (
                                <tr
                                    key={feature.name}
                                    className={cn(
                                        "border-b border-white/[0.04] transition-colors duration-200 hover:bg-white/[0.02]",
                                        i % 2 === 0 ? "bg-white/[0.01]" : ""
                                    )}
                                >
                                    <td className="py-3.5 px-4 text-sm text-white/60 font-medium">
                                        {feature.name}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <FeatureIcon active={feature.basic} accent="#A78BFA" />
                                    </td>
                                    <td className="py-3.5 px-4 text-center relative">
                                        <div className="absolute inset-0 bg-[#00FF94]/[0.02] pointer-events-none" />
                                        <div className="relative">
                                            <FeatureIcon active={feature.deep} accent="#00FF94" />
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <FeatureIcon active={feature.architect} accent="#D4AF37" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </motion.table>
                </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 max-w-md mx-auto">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/30" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
            </div>

            {/* ─── Offline Agent Comparison ─── */}
            <div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF8C00]/15 bg-[#FF8C00]/[0.04] mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C00] animate-pulse" />
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.25em]">
                            Offline Agents
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-serif text-white mb-3">
                        Compare Agent Reports
                    </h2>
                    <p className="text-sm text-white/30 max-w-md mx-auto">
                        Each report tier offers different depth of Vedic analysis and page count.
                    </p>
                </motion.div>

                <div className="overflow-x-auto pb-4 -mx-2 px-2">
                    <motion.table
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-full text-left border-collapse min-w-[600px]"
                    >
                        <thead>
                            <tr className="border-b border-white/[0.08]">
                                <th className="py-5 px-4 text-sm font-semibold text-white/60 w-2/5 uppercase tracking-wider">
                                    Features
                                </th>
                                <th className="py-5 px-4 text-center w-1/5">
                                    <div className="flex flex-col items-center gap-0.5">
                                        <span className="text-sm font-bold text-[#38BDF8]">Basic</span>
                                        <span className="text-[10px] font-mono text-white/30">₹1,200</span>
                                    </div>
                                </th>
                                <th className="py-5 px-4 text-center w-1/5 relative">
                                    <div className="absolute inset-0 bg-[#D4AF37]/[0.02] rounded-t-xl pointer-events-none" />
                                    <div className="relative flex flex-col items-center gap-0.5">
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-0.5">
                                            <Crown className="w-2.5 h-2.5 text-[#D4AF37]" />
                                            <span className="text-[8px] font-mono text-[#D4AF37] uppercase tracking-wider">Popular</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#D4AF37]">Standard</span>
                                        <span className="text-[10px] font-mono text-white/30">₹1,500</span>
                                    </div>
                                </th>
                                <th className="py-5 px-4 text-center w-1/5">
                                    <div className="flex flex-col items-center gap-0.5">
                                        <span className="text-sm font-bold text-[#FF8C00]">Premium</span>
                                        <span className="text-[10px] font-mono text-white/30">₹2,000</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {AGENT_FEATURES.map((feature, i) => (
                                <tr
                                    key={feature.name}
                                    className={cn(
                                        "border-b border-white/[0.04] transition-colors duration-200 hover:bg-white/[0.02]",
                                        i % 2 === 0 ? "bg-white/[0.01]" : ""
                                    )}
                                >
                                    <td className="py-3.5 px-4 text-sm text-white/60 font-medium">
                                        {feature.name}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <FeatureIcon active={feature.basic} accent="#38BDF8" />
                                    </td>
                                    <td className="py-3.5 px-4 text-center relative">
                                        <div className="absolute inset-0 bg-[#D4AF37]/[0.02] pointer-events-none" />
                                        <div className="relative">
                                            <FeatureIcon active={feature.standard} accent="#D4AF37" />
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <FeatureIcon active={feature.premium} accent="#FF8C00" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </motion.table>
                </div>
            </div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center pt-6 pb-10"
            >
                <p className="text-white/25 text-xs font-mono tracking-wider max-w-lg mx-auto">
                    All prices in INR. Agent report credits are purchased via admin approval.
                    User plans are one-time or subscription-based.
                </p>
            </motion.div>
        </div>
    );
}
