"use client";

import { Sparkles, Globe, Compass, BarChart3, Gem, Target, Activity } from "lucide-react";
import { motion } from "framer-motion";

const BRANCHES = [
  {
    icon: Sparkles,
    title: "Vedic Astrology (Jyotish)",
    desc: "India's gift to the world — a profound predictive science dating back thousands of years. Urekha's engine processes 27 constellations, 9 grahas (planets), 12 rashis (zodiac signs), and 12 bhavas (houses) to construct a comprehensive Kundli. Our AI cross-references planetary periods (Dashas), specific yogas, and divisional charts (D1 through D60) to deliver predictions with granularity that takes human astrologers days to compute.",
  },
  {
    icon: Globe,
    title: "Western Astrology",
    desc: "Built on the tropical zodiac system, Western astrology emphasizes psychological archetypes and personality dynamics. Urekha integrates transit analysis and progression techniques alongside classical Vedic methods, offering a multi-dimensional view of your cosmic blueprint. By synthesizing both Eastern and Western frameworks, we deliver a richer, more complete analysis than any single-system approach.",
  },
];

const CHART_FACTORS = [
  { icon: Compass, label: "Planetary positions across all 12 astrological houses" },
  {
    icon: Target,
    label: "Moon, Venus & Mars placements mapping emotional & relational depth",
  },
  {
    icon: BarChart3,
    label: "Jupiter's exact placement highlighting luck, growth & opportunity windows",
  },
  {
    icon: Gem,
    label: "Saturn's hard discipline, structural challenges & karmic lessons",
  },
];

export default function AstrologyEducation() {
  return (
    <section className="pt-8 pb-10 md:pb-16 overflow-hidden bg-white dark:bg-background font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Top Header - Ultra Clean SaaS Light Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-[13px] uppercase tracking-[0.2em] font-semibold text-[#00A859]">
            The Science
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold text-[#111111] dark:text-white max-w-4xl mx-auto leading-[1.05]">
            Unlock Your Future with <br className="hidden md:block" /> Data-Driven Astrology
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed pt-2 font-medium">
            Astrology is a predictive science that reveals an individual&rsquo;s
            unique strengths, weaknesses, and life trajectories through the
            precise positions of celestial bodies at the moment of birth. Urekha
            elevates this ancient wisdom with AI, processing thousands of
            planetary data points to construct a complete blueprint of life
            potential — delivering reports that rival decades of human expert
            analysis.
          </p>
        </motion.div>

        {/* Vedic vs Western — Sleek Premium Cards */}
        <div className="flex flex-col lg:flex-row gap-6 mb-24 w-full max-w-[1200px] mx-auto relative z-10">
          {BRANCHES.map((branch, i) => (
            <motion.div
              key={branch.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-1 bg-white dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-zinc-800 group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500"
            >
              {/* Decorative Corner Glow */}
              <div 
                 className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-30 ${i === 0 ? 'bg-[#EAC94D]' : 'bg-[#00A859]'}`} 
              />
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:scale-110 ${i === 0 ? 'bg-[#EAC94D]/10 text-[#c2a22f] border-[#EAC94D]/30' : 'bg-[#00A859]/10 text-[#00A859] border-[#00A859]/30'}`}>
                <branch.icon className="w-6 h-6" strokeWidth={2} />
              </div>
              
              <h3 className="text-2xl md:text-[1.6rem] font-bold tracking-tight text-[#111111] dark:text-white mb-5">
                {branch.title}
              </h3>
              <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {branch.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Natal Chart Breakdown — Unified Light Array */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="bg-[#F8F9FA] dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 w-full max-w-[1200px] mx-auto rounded-[2.5rem] px-6 py-16 md:p-20 relative overflow-hidden shadow-sm transition-colors duration-300"
        >
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-gradient-radial from-[#00A859]/5 via-transparent to-transparent blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-[#EAC94D]/5 via-transparent to-transparent blur-[100px] pointer-events-none" />

          {/* Abstract Grid background */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#111111 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
            <span className="text-[13px] uppercase tracking-[0.2em] font-bold text-[#00A859] block mb-2">
              Birth Chart Analysis
            </span>
            <h3 className="text-3xl md:text-5xl font-bold text-[#111111] dark:text-white tracking-tight leading-[1.1]">
              The Natal Chart — <br className="md:hidden" /> Your Cosmic Blueprint
            </h3>
            <p className="text-lg text-slate-500 dark:text-slate-300 leading-relaxed font-medium pb-8 max-w-2xl mx-auto">
              A natal chart maps the positions of all planets around the Sun at
              the exact moment of your birth. This chart reveals inherent
              strengths, hidden challenges, and the most opportune windows for
              decision-making. Urekha&rsquo;s AI analyzes every factor a master
              astrologer would — then goes further, cross-referencing 5,000+ yogas
              and calculating 25 years of transits in under 60 seconds.
            </p>

            {/* Matrix Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {CHART_FACTORS.map((factor, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-3xl p-6 md:p-8 flex items-start gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-full flex flex-shrink-0 items-center justify-center border transition-transform duration-500 group-hover:rotate-12 ${i % 2 === 0 ? 'bg-[#EAC94D]/10 text-[#c2a22f] border-[#EAC94D]/20' : 'bg-[#00A859]/10 text-[#00A859] border-[#00A859]/20'}`}>
                    <factor.icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <p className="text-[14.5px] font-medium text-[#2D2D2D] dark:text-gray-200 leading-relaxed mt-0.5">
                    {factor.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Terminal Output Footer */}
            <div className="mt-12 bg-white dark:bg-zinc-800 rounded-[2rem] border border-slate-100 dark:border-zinc-700 shadow-sm p-8 md:p-10 text-left relative overflow-hidden group hover:border-[#00A859]/30 transition-colors duration-500">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00A859] to-[#EAC94D] opacity-80" />
               <div className="flex items-start gap-4">
                 <Activity className="w-6 h-6 text-[#00A859] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                 <p className="text-[14px] text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                   Urekha also rapidly computes angular aspects between celestial bodies, elemental balances (Fire, Water, Earth, Air), modalities, and dense stellium concentrations. If karmic imbalances are detected within the timeline, targeted remedial protocols—including resonant gemstones and sonic mantras—are instantly generated to help restore dimensional equilibrium.
                 </p>
               </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
