"use client";

import React from "react";
import { motion } from "framer-motion";

const LightSource = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Concentrated Source - Top Left */}
    <div className="absolute top-[-15%] left-[5%] w-[800px] h-[800px] bg-primary/20 dark:bg-primary/25 blur-[150px] rounded-full animate-pulse" />
    
    {/* Spspreading Light Beam */}
    <div 
      className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-40"
      style={{
        background: "radial-gradient(circle at 10% 0%, hsl(var(--primary) / 0.15) 0%, transparent 80%)"
      }}
    />

    {/* Secondary Soft Glows */}
    <div className="absolute top-[20%] left-[-5%] w-[900px] h-[900px] bg-blue-500/10 blur-[180px] rounded-full" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-primary/5 blur-[200px] rounded-full" />
  </div>
);

export const AstrologyBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-slate-50 dark:bg-[#050A0A] transition-colors duration-500">
      <LightSource />
      
      {/* User Provided SVG - Adaptive Layer */}
      <div className="absolute inset-0 flex items-center justify-center md:pl-64 opacity-20 dark:opacity-40 overflow-hidden text-slate-900 dark:text-white transition-opacity duration-500">
        <motion.div
           initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
           animate={{ opacity: 1, scale: 1.25, rotate: 360 }}
           transition={{ 
             opacity: { duration: 2 },
             scale: { duration: 2 },
             rotate: { duration: 240, repeat: Infinity, ease: "linear" }
           }}
           className="w-full h-full max-w-[1400px] max-h-[1400px] flex items-center justify-center origin-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%" className="w-full h-full">
            <defs>
              <radialGradient id="bg" cx="50%" cy="50%" r="75%">
                <stop offset="0%" className="stop-color-primary/10 dark:stop-color-[#1B143F]" style={{ stopColor: "currentColor", stopOpacity: 0.12 }} />
                <stop offset="100%" className="stop-color-transparent" style={{ stopColor: "currentColor", stopOpacity: 0 }} />
              </radialGradient>
              
              <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F2C94C" />
                <stop offset="100%" stopColor="#E28B14" />
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Geometric Grid - Adaptive Color */}
            <g stroke="currentColor" strokeOpacity="0.1" fill="none" strokeWidth="1.5">
              <circle cx="400" cy="400" r="300" />
              <circle cx="400" cy="400" r="220" />
              <circle cx="400" cy="400" r="140" />
              
              <line x1="400" y1="100" x2="400" y2="700" />
              <line x1="100" y1="400" x2="700" y2="400" />
              <line x1="187.8" y1="187.8" x2="612.2" y2="612.2" />
              <line x1="612.2" y1="187.8" x2="187.8" y2="612.2" />
              <line x1="250" y1="140.2" x2="550" y2="659.8" />
              <line x1="550" y1="140.2" x2="250" y2="659.8" />
              <line x1="140.2" y1="250" x2="659.8" y2="550" />
              <line x1="659.8" y1="250" x2="140.2" y2="550" />
            </g>

            {/* Central Diamond/Star */}
            <motion.path 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
              d="M400,340 Q400,400 460,400 Q400,400 400,460 Q400,400 340,400 Q400,400 400,340 Z" 
              fill="url(#gold)" 
              filter="url(#glow)"
            />

            {/* Static Stars */}
            <g fill="currentColor" opacity="0.3">
              <circle cx="150" cy="200" r="1.5" />
              <circle cx="250" cy="100" r="1" />
              <circle cx="650" cy="180" r="2" />
              <circle cx="700" cy="350" r="1" />
              <circle cx="600" cy="650" r="1.5" />
              <circle cx="200" cy="600" r="2" />
              <circle cx="100" cy="450" r="1" />
              <circle cx="350" cy="700" r="1.5" />
              <circle cx="500" cy="80" r="1" />
              <circle cx="720" cy="550" r="1.5" />
            </g>

            {/* Constellation Lines */}
            <g stroke="url(#gold)" strokeWidth="1.5" strokeOpacity="0.4" fill="none">
              <polyline points="150,200 250,250 280,180" />
              <polyline points="650,180 580,220 590,300" />
              <polyline points="200,600 280,550 320,620" />
              <polyline points="600,650 520,580 480,680" />
            </g>

            {/* Glowing Stars */}
            <g fill="url(#gold)" filter="url(#glow)">
              {[
                { cx: 150, cy: 200, r: 2.5 }, { cx: 250, cy: 250, r: 1.5 }, { cx: 280, cy: 180, r: 2 },
                { cx: 650, cy: 180, r: 2.5 }, { cx: 580, cy: 220, r: 1.5 }, { cx: 590, cy: 300, r: 2 },
                { cx: 200, cy: 600, r: 2.5 }, { cx: 280, cy: 550, r: 1.5 }, { cx: 320, cy: 620, r: 2 },
                { cx: 600, cy: 650, r: 2.5 }, { cx: 520, cy: 580, r: 1.5 }, { cx: 480, cy: 680, r: 2 }
              ].map((star, i) => (
                <motion.circle
                  key={i}
                  cx={star.cx}
                  cy={star.cy}
                  r={star.r}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() }}
                />
              ))}
            </g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
