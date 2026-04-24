"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumHeroProps {
    badge: string;
    title: string;
    description: string;
    align?: "center" | "left";
    backgroundStr?: string; // Optional custom background
}

export default function PremiumHero({
    badge,
    title,
    description,
    align = "center",
    backgroundStr
}: PremiumHeroProps) {
    return (
        <div className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background removed for cleaner aesthetic */}

            <div className={cn("max-w-4xl mx-auto relative z-10", align === "center" ? "text-center" : "text-left")}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className={cn(
                        "inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-6 py-2 mb-8 backdrop-blur-sm",
                        align === "center" ? "mx-auto" : ""
                    )}>
                        <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                        <span className="text-sm font-mono tracking-wider text-brand-gold uppercase">{badge}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif mb-6 bg-gradient-to-r from-slate-900 via-brand-gold to-slate-900 dark:from-white dark:via-brand-gold dark:to-white bg-clip-text text-transparent leading-tight drop-shadow-sm transition-colors duration-300">
                        {title}
                    </h1>

                    <p className="text-lg md:text-xl pb-5 text-slate-700 dark:text-white/70 leading-relaxed max-w-2xl mx-auto transition-colors duration-300">
                        {description}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
