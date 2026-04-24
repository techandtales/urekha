"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if user has already seen the loader in this session
    const hasVisited = sessionStorage.getItem("urekha_visited");
    
    if (hasVisited) {
      setLoading(false);
      setShouldRender(false);
      return;
    }

    setShouldRender(true);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("urekha_visited", "true");
          }, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[999999] bg-[#050A0A] flex flex-col items-center justify-center p-6 overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00A859]/10 rounded-full blur-[120px]" />
          
          <div className="relative z-10 flex flex-col items-center gap-12">
            {/* Animated Mandala Logo Placeholder */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-32 h-32 md:w-40 md:h-40"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-white/20">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <polygon points="50,5 95,80 5,80" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <polygon points="50,95 5,20 95,20" stroke="currentColor" strokeWidth="0.5" fill="none" />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke="#00A859" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse" />
              </div>
            </motion.div>

            {/* Text & Progress */}
            <div className="flex flex-col items-center gap-4 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white font-cinzel text-2xl md:text-3xl tracking-[0.3em] font-bold"
              >
                UREKHA
              </motion.h1>
              
              <div className="h-[2px] w-64 md:w-80 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-[#00A859]"
                />
              </div>

              <div className="flex items-center gap-4 mt-2">
                <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Initializing cosmic blueprint</p>
                <div className="w-[1px] h-4 bg-white/10" />
                <p className="text-amber-500 font-mono text-sm font-bold w-12 text-left">{progress}%</p>
              </div>
            </div>
          </div>

          {/* Glitch Decorative Lines */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="w-full h-full border-[20px] border-white/50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
