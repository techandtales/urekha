"use client";

import Image from "next/image";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ModernAuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
}

const PROMO_VIDEOS = [
  "/promo1.mp4",
  "/promo2.mp4",
  "/promo3.mp4"
];

export function ModernAuthLayout({ children, title, subtitle }: ModernAuthLayoutProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % PROMO_VIDEOS.length);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-8 transition-colors duration-500">
      <div className="w-full max-w-[1200px] h-[800px] max-h-[90vh] bg-white dark:bg-zinc-900 rounded-[2rem] shadow-premium overflow-hidden flex flex-col lg:flex-row relative z-10 border border-slate-200 dark:border-zinc-800 transition-colors duration-500">
        
        {/* Left Side - Video Carousel */}
        <div className="relative hidden w-full lg:flex lg:w-1/2 h-full p-4">
          <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-black flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMediaIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <video
                  src={PROMO_VIDEOS[currentMediaIndex]}
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleNextMedia}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Overlay Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10" />

            {/* Top Bar (Logo & Back) */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
              <Link href="/" className="flex items-center gap-2">
                 <Image src="/logo.svg" alt="Urekha" width={120} height={32} className="h-8 w-auto invert" />
                 <span className="text-xl font-bold tracking-tight text-white uppercase mt-0.5">
                   UREKHA
                 </span>
              </Link>
              <Link 
                href="/" 
                className="flex items-center gap-2 text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all"
              >
                Back to website <span>&rarr;</span>
              </Link>
            </div>

            {/* Bottom Text & Slider Indicators */}
            <div className="absolute bottom-12 left-12 right-12 z-20">
              <h2 className="text-3xl md:text-4xl font-light text-white leading-tight mb-8">
                Architecting Deterministic<br />Systems for Predictive Intelligence
              </h2>
              
              <div className="flex gap-2">
                {PROMO_VIDEOS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentMediaIndex === index ? "w-8 bg-white" : "w-4 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Container */}
        <div className="flex-1 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="min-h-full flex flex-col justify-center px-6 sm:px-16 lg:px-24 py-8 transition-colors duration-300">
            <div className="w-full max-w-[420px] mx-auto">
              {/* Mobile Logo */}
            <div className="flex items-center justify-center gap-2 lg:hidden mb-12">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Urekha" width={100} height={28} className="h-7 w-auto dark:invert" />
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase mt-0.5 transition-colors duration-300">
                  UREKHA
                </span>
              </Link>
            </div>


            <div className="mb-8 space-y-3">
              <h1 className="text-4xl font-medium text-slate-900 dark:text-white tracking-tight transition-colors duration-300">{title}</h1>
              {subtitle && (
                <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                  {subtitle}
                </div>
              )}
            </div>

            {/* Content Injected here */}
            {children}
            
          </div>
        </div>
        </div>
      </div>
      
      {/* Ambient glow behind the main container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#7e56da]/10 rounded-full blur-[120px] pointer-events-none z-0" />
    </div>
  );
}
