"use client";

import { motion } from "framer-motion";
import { Database, Cpu, Activity, Zap } from "lucide-react";

const PROCESS_STEPS = [
  {
    icon: <Database className="w-6 h-6 text-brand-teal" />,
    zodiac: "♈", // Aries
    title: "Celestial Discovery",
    desc: "We extract precise astronomical coordinates based on your birth metrics. Raw planetary data forms the foundational matrix.",
  },
  {
    icon: <Cpu className="w-6 h-6 text-brand-gold" />,
    zodiac: "♉", // Taurus
    title: "Deterministic Engine",
    desc: "Our high-performance backend, powered by the Swiss Ephemeris, calculates precise orbital positions and house divisions.",
  },
  {
    icon: <Activity className="w-6 h-6 text-brand-teal" />,
    zodiac: "♍", // Virgo
    title: "Pattern Synthesis",
    desc: "Generative AI models interpret the structural geometry of the chart, translating complex astrological logic into clear narratives.",
  },
  {
    icon: <Zap className="w-6 h-6 text-brand-gold" />,
    zodiac: "♏", // Scorpio
    title: "Predictive Output",
    desc: "A comprehensive, 100+ page personalized blueprint is generated and delivered instantly without blocking server queues.",
  },
];

export default function OurProcess() {
  return (
    <section className="relative py-32 overflow-hidden bg-transparent font-sans">
      {/* Background ambient glows and Cosmic Image */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* Parallax Base Layer - Removed heavy opacity wrappers and luminosity blend to make it clear */}
        <div className="absolute inset-0 bg-[url('/dark-mode.jpg')] bg-cover bg-center bg-fixed opacity-80" />

        {/* Zodiac Floating Wheel */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-30"
          style={{ backgroundImage: "url('/zodiac-circle-vector.svg')" }}
        />
        {/* Core energy glows behind the wheel */}
        <div className="absolute w-[600px] h-[600px] bg-brand-gold/15 rounded-full blur-[150px]" />

        {/* Top/Bottom gradient fades to blend the section edges, reduced from 80% to 50% opacity */}
        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-[#020408]/50 via-transparent to-[#020408]/50" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto mb-20 flex flex-col items-center justify-center text-center space-y-4"
        >
          {/* Subtle dark underlay to always ensure text contrast */}
          <div className="absolute inset-0 bg-[#020408]/60 blur-[40px] rounded-full min-w-[150%] -z-10 pointer-events-none" />

          <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-bold tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-b from-teal-100 via-teal-300 to-teal-600 drop-shadow-[0_2px_15px_rgba(20,184,166,0.3)] leading-tight">
            Decoding The Cosmic Matrix
          </h2>
          <p className="text-sm md:text-lg font-serif tracking-widest text-[#D4AF37] max-w-3xl px-4 uppercase font-semibold leading-relaxed drop-shadow-[0_1px_5px_rgba(212,175,55,0.4)]">
            How we translate planetary geometry into deterministic, scalable
            intelligence.
          </p>
        </motion.div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
              className="relative group rounded-xl p-6 flex flex-col gap-6"
              style={{
                // Custom extremely dark metallic card background
                background: "linear-gradient(135deg, #18191C 0%, #0F1012 100%)",
                boxShadow:
                  "0 10px 40px -10px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.02)",
              }}
            >
              {/* Ornate Gold Border Frame Setup using exact CSS */}
              <div className="absolute inset-1 border border-[#6b5835]/40 rounded-lg pointer-events-none transition-colors duration-500 group-hover:border-[#aa8e55]/60" />
              <div className="absolute inset-2 border border-[#4a3b20]/30 rounded-md pointer-events-none" />

              {/* Corner Ornaments (simulated with CSS squares) */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#A78B4A] rounded-tl-xl opacity-80" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#A78B4A] rounded-tr-xl opacity-80" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#A78B4A] rounded-bl-xl opacity-80" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#A78B4A] rounded-br-xl opacity-80" />

              {/* Light sweep hover effect replacing GSAP scrub */}
              <div className="absolute top-[-20%] left-[-10%] w-[150px] h-[150px] bg-brand-gold/15 blur-[60px] rounded-full pointer-events-none card-light z-0 transition-all duration-700 opacity-50 group-hover:opacity-100 group-hover:bg-brand-teal/20 group-hover:translate-x-[100px] group-hover:translate-y-[200px] group-hover:scale-150" />

              <div className="card-content-wrapper relative z-10 flex flex-col gap-6 transition-transform duration-700 group-hover:-translate-y-2">
                {/* Large Faint Number Background */}
                <div className="absolute top-0 right-2 text-5xl font-serif font-bold text-[#A78B4A]/10 select-none pointer-events-none group-hover:text-[#A78B4A]/20 transition-colors">
                  0{idx + 1}
                </div>

                {/* Top Details (Icon + Zodiac) */}
                <div className="relative flex items-center gap-4 z-10 pt-2 pl-2">
                  {/* Main Icon Box */}
                  <div className="w-12 h-12 rounded-lg bg-[#0a0a0c] flex items-center justify-center border border-[#3b3220] shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-[#A78B4A]/60 transition-colors duration-500">
                    {step.icon}
                  </div>
                  {/* Zodiac Icon */}
                  <div className="text-xl font-serif text-[#A78B4A]/80">
                    {step.zodiac}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 pl-2">
                  <h3 className="text-lg md:text-xl font-serif font-bold text-[#f5f0e1] mb-3 tracking-wide drop-shadow-sm">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
