"use client";

import { useStageStore } from "@/store/stage-store";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User } from "lucide-react";

export default function HeroOverlay() {
    const { currentStage, isTransitioning } = useStageStore();

    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-16 lg:p-24 selection:bg-brand-gold/30">

            {/* Top Left - Brand (Usually in Navbar, but maybe redundant here? Kept clear as requested) */}
            <div className="flex-1" />

            {/* Main Content Area - Left aligned */}
            <div className="flex-[2] flex flex-col justify-center max-w-2xl pointer-events-auto">
                <AnimatePresence mode="wait">
                    {!isTransitioning && (
                        <motion.div
                            key={currentStage.id}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-4 md:space-y-6"
                        >
                            <div className="flex flex-col gap-2">
                                <span className="text-xs md:text-base font-light tracking-[0.2em] text-white/70 uppercase">
                                    {currentStage.subtitle}
                                </span>
                                <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-none tracking-tight">
                                    {currentStage.name}
                                </h1>
                            </div>

                            <p className="text-base md:text-xl text-white/80 font-light leading-relaxed max-w-lg">
                                {currentStage.description}
                            </p>

                            <div className="flex gap-4 pt-4">
                                <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 text-white backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm tracking-wider font-medium">AGENT LOGIN</span>
                                </button>

                                <button
                                    className={`px-8 py-4 rounded-full text-brand-dark transition-all duration-300 flex items-center gap-2 group hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]
                    ${currentStage.themeColor === 'brand-gold' ? 'bg-brand-gold' : currentStage.themeColor === 'brand-white' ? 'bg-brand-white' : 'bg-white'}
                    `}
                                >
                                    <span className="text-sm tracking-wider font-bold">BECOME AN AGENT</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Area */}
            <div className="flex-1 flex items-end justify-center pointer-events-auto pb-8 md:pb-0">
                <div className="flex items-center gap-8 text-white/50">
                    <a href="#" className="hover:text-white transition-colors hover:scale-110 duration-300 flex items-center justify-center w-6 h-6">
                        {/* X (Twitter) */}
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors hover:scale-110 duration-300 flex items-center justify-center w-6 h-6">
                        {/* YouTube */}
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors hover:scale-110 duration-300 flex items-center justify-center w-6 h-6">
                        {/* Instagram */}
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 0 1 1.153-1.772A4.902 4.902 0 0 1 5.451 4.63c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 1.802a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666zm5.338-3.205a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors hover:scale-110 duration-300 flex items-center justify-center w-6 h-6">
                        {/* LinkedIn */}
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors hover:scale-110 duration-300 flex items-center justify-center w-6 h-6">
                        {/* Facebook */}
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>

        </div>
    );
}
