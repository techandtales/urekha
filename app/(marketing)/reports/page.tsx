"use client";

import { motion } from "framer-motion";
import { BookOpen, Map, Target, Heart, TrendingUp, Calendar, Zap, Shield } from "lucide-react";
import Image from "next/image";
import PremiumHero from "@/components/ui/PremiumHero";
import ReportBook from "@/components/home/ReportBook";

const CHAPTERS = [
    { icon: Map, title: "The Soul Map", desc: "Your primal motivations, strengths, and karmic baggage." },
    { icon: Target, title: "Career & Dharma", desc: "Optimal career paths, leadership style, and wealth potential." },
    { icon: Heart, title: "Love & Relationships", desc: "Compatibility patterns, marriage timing, and emotional needs." },
    { icon: TrendingUp, title: "Financial Trajectory", desc: "Wealth accumulation periods and investment luck." },
    { icon: Calendar, title: "25-Year Timeline", desc: "Micro-predictions for every month until 2050." },
    { icon: Zap, title: "Remedial Measures", desc: "Gemstones, mantras, and lifestyle adjustments to mitigate risk." },
];

export default function ReportsPage() {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <PremiumHero
                badge="The Output"
                title="100+ Pages of Depth"
                description="We don't do 'horoscopes'. We generate a comprehensive life manual, bound as a hardcover book or delivered as a digital manuscript."
            />

            <div className="container mx-auto px-6 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Visual Book Presentation */}
                    <div className="flex items-center justify-center">
                        <ReportBook />
                    </div>

                    {/* Chapters List */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-serif text-foreground">What's Inside?</h2>
                            <p className="text-lg text-muted-foreground">
                                Every report is unique. We simulate your chart against millions of planetary combinations to write 10 chapters tailored specifically to your life path.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {CHAPTERS.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 rounded-xl border border-border/50 bg-secondary/50 hover:bg-secondary hover:border-brand-gold/50 transition-colors group cursor-default"
                                >
                                    <item.icon className="w-6 h-6 text-brand-gold mb-3 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-border">
                            <div className="flex items-center gap-4 text-sm text-foreground/80">
                                <Shield className="w-5 h-5 text-green-500" />
                                <span>100% Private & Encrypted. Deleted from our servers after delivery.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
