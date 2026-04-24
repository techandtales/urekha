"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportBook() {
    const [isHovered, setIsHovered] = useState(false);
    const [status, setStatus] = useState<"idle" | "open" | "flipping" | "locked">("idle");
    const timersRef = useRef<NodeJS.Timeout[]>([]);
    const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimers = () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    };

    useEffect(() => {
        if (isHovered) {
            if (status === 'locked') return;

            if (status === 'idle') {
                setStatus('open');

                // Timer 1: Start Flipping after 1s
                const t1 = setTimeout(() => {
                    setStatus('flipping');

                    // Timer 2: End Flipping and Lock after 3.5s (flipping duration)
                    const t2 = setTimeout(() => {
                        setStatus('locked');
                    }, 3500);
                    timersRef.current.push(t2);

                }, 1000);
                timersRef.current.push(t1);
            }
        } else {
            clearTimers();
            setStatus('idle');
        }

        return () => {
            clearTimers();
            if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
        };
    }, [isHovered, status]);

    const handleMouseEnter = () => {
        if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (status === 'locked') {
            // Keep visible for a bit if locked, to allow clicking button
            leaveTimerRef.current = setTimeout(() => setIsHovered(false), 1500);
        } else {
            setIsHovered(false);
        }
    };

    // Pages for flipping animation
    const pages = [1, 2, 3, 4, 5];

    return (
        <div
            className="flex flex-col items-center gap-6 p-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative w-full h-full flex items-center justify-center py-12 perspective-[2000px]">
                <motion.div
                    className="relative w-64 h-80 preserve-3d cursor-pointer"
                    initial={false}
                    animate={status === 'locked' || status === 'idle' ? 'closed' : 'open'}
                    transition={{ duration: 0.8 }}
                >
                    {/* --- BACK COVER (Base) --- */}
                    <div className="absolute inset-0 bg-[#5c0b0b] rounded-r-lg shadow-2xl skew-x-1 origin-bottom" style={{ transform: "translateZ(-20px)" }} />

                    {/* --- STATIC PAGES BLOCK --- */}
                    <div className="absolute inset-y-2 right-2 left-3 bg-white shadow-inner transform translate-z-[-10px]" />
                    <div className="absolute top-3 right-3 bottom-3 left-4 bg-[#fcfbf9] shadow-sm border-r border-[#e5e5e5] flex flex-col p-4 overflow-hidden">
                        {/* Content inside the book */}
                        <div className="w-full h-full border-2 border-brand-gold/20 p-2 flex flex-col gap-2 opacity-80">
                            {status === 'locked' ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <Lock className="w-12 h-12 text-brand-gold/50" />
                                </div>
                            ) : (
                                <>
                                    <div className="w-full h-1/3 bg-brand-gold/5 border border-brand-gold/10 rounded flex items-center justify-center">
                                        <Star className="text-brand-gold/40 w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-1 bg-zinc-200 w-full rounded" />
                                        <div className="h-1 bg-zinc-200 w-5/6 rounded" />
                                        <div className="h-1 bg-zinc-200 w-4/6 rounded" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* --- FLIPPING PAGES --- */}
                    <AnimatePresence>
                        {status === 'flipping' && pages.map((page, i) => (
                            <motion.div
                                key={page}
                                className="absolute inset-y-3 right-3 left-4 bg-[#fcfbf9] shadow-sm border-l border-zinc-200 origin-left preserve-3d"
                                initial={{ rotateY: 0, zIndex: 10 + i }}
                                animate={{ rotateY: -170, zIndex: 10 + i }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut",
                                    delay: i * 0.3
                                }}
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <div className="p-4 space-y-4 opacity-50">
                                    <div className="h-2 bg-zinc-100 w-full" />
                                    <div className="h-2 bg-zinc-100 w-3/4" />
                                    <div className="grid grid-cols-2 gap-2 mt-8">
                                        <div className="h-20 bg-zinc-50 rounded" />
                                        <div className="h-20 bg-zinc-50 rounded" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* --- FRONT COVER (Animated) --- */}
                    <motion.div
                        className="absolute inset-0 preserve-3d origin-left"
                        variants={{
                            closed: { rotateY: 0 },
                            open: { rotateY: -170 }
                        }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
                    >
                        {/* FRONT OF FRONT COVER */}
                        <div className="absolute inset-0 bg-[#7d1212] rounded-r-lg shadow-xl flex flex-col items-center justify-between p-6 border-l-4 border-[#4a0808] backface-hidden" style={{ backfaceVisibility: "hidden" }}>

                            {status === 'locked' ? (
                                /* LOCKED STATE DESIGN */
                                <div className="w-full h-full flex flex-col items-center justify-center space-y-6 relative z-10 animate-in fade-in duration-500">
                                    <div className="w-20 h-20 rounded-full bg-brand-gold/10 border-2 border-brand-gold flex items-center justify-center">
                                        <Crown className="w-10 h-10 text-brand-gold" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-serif font-bold text-white tracking-widest">
                                            PREMIUM
                                        </h3>
                                        <p className="text-brand-gold text-xs uppercase tracking-[0.2em] font-medium">
                                            Unlock Complete Destiny
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* NORMAL STATE DESIGN */
                                <>
                                    {/* Golden Border decoration */}
                                    <div className="absolute inset-3 border-2 border-brand-gold/40 rounded-r-md pointer-events-none" />
                                    <div className="absolute inset-4 border border-brand-gold/20 rounded-r-sm pointer-events-none" />

                                    {/* Om Icon Image (Preset Asset) */}
                                    <div className="mt-8 relative z-10 select-none">
                                        <Image
                                            src="/pdf-presets/Om.png"
                                            alt="Om"
                                            width={120}
                                            height={120}
                                            className="w-16 h-16 object-contain drop-shadow-md brightness-110 saturate-150"
                                            priority
                                        />
                                    </div>

                                    <div className="text-center space-y-2 relative z-10 mt-auto mb-8">
                                        <h3 className="font-serif font-bold text-2xl text-brand-gold tracking-widest drop-shadow-md">
                                            JAMMA PATRIKA
                                        </h3>
                                        <div className="h-[1px] w-24 bg-brand-gold/50 mx-auto" />
                                        <p className="text-brand-gold/60 text-xs font-serif uppercase tracking-[0.2em]">
                                            Vedic Intelligence
                                        </p>
                                    </div>

                                    {/* Urekha Logo Branding */}
                                    <div className="mb-6 flex flex-col items-center gap-2 relative z-10">
                                        <div className="opacity-90">
                                            <Image
                                                src="/logo-white.png"
                                                alt="Urekha Logo"
                                                width={90}
                                                height={30}
                                                className="w-auto h-7 object-contain"
                                            />
                                        </div>
                                        <div className="text-[10px] text-brand-gold/50 font-serif tracking-[0.4em] uppercase font-semibold">
                                            Urekha
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Texture overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-overlay pointer-events-none" />
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                        </div>

                        {/* BACK OF FRONT COVER */}
                        <div className="absolute inset-0 bg-[#690e0e] rounded-l-lg shadow-inner transform rotate-y-180 backface-hidden flex items-center justify-center" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                            <div className="text-brand-gold/20 font-serif text-sm rotate-y-180">
                                Urekha
                            </div>
                        </div>
                    </motion.div>

                    {/* --- SPINE --- */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#4a0808] -translate-x-full rounded-l-sm" />

                </motion.div>
            </div>

            {/* --- EXTERNAL PREMIUM BUTTON --- */}
            <AnimatePresence>
                {status === 'locked' && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="group relative px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-gold hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-2 text-black font-bold tracking-widest uppercase text-sm">
                            <Crown size={16} />
                            Get Premium Report
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
