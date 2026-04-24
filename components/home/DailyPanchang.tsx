"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Star, Activity, Sparkles, Clock } from "lucide-react";
// --- Types ---
export type Language = "en" | "hi";

export interface Translation {
  en: string;
  hi: string;
}

export interface PanchangData {
  date: Translation;
  tithi: Translation;
  nakshatra: Translation;
  yoga: Translation;
  karana: Translation;
  sunrise: Translation;
  sunset: Translation;
  moonPhase: Translation;
}

export const staticLabels = {
  sectionTitle: { en: "Daily Panchang", hi: "दैनिक पंचांग" },
  todayParams: {
    en: "Today's Astrological Parameters",
    hi: "आज के ज्योतिषीय पैरामीटर",
  },
  subtitle: {
    en: "Observing the cosmic clockwork",
    hi: "लौकिक चक्र का अवलोकन",
  },
  lunarDay: { en: "Lunar Day", hi: "चंद्र दिवस" },
  tithiDesc: {
    en: "The precise angular relationship between the Sun and Moon, signifying the day's subtle energetic quality and potential for manifestation.",
    hi: "सूर्य और चंद्रमा के बीच सटीक कोणीय संबंध, जो दिन की सूक्ष्म ऊर्जावान गुणवत्ता और अभिव्यक्ति की क्षमता को दर्शाता है।",
  },
  constellation: { en: "Constellation", hi: "नक्षत्र" },
  nakshatraDesc: {
    en: "The Nakshatra symbolizes creation and productivity, influencing a day suitable for growth-oriented activities and nurturing foundations.",
    hi: "नक्षत्र सृजन और उत्पादकता का प्रतीक है, जो विकास-उन्मुख गतिविधियों और नींव को पोषित करने के लिए उपयुक्त दिन को प्रभावित करता है।",
  },
  sunrise: { en: "Sunrise", hi: "सूर्योदय" },
  sunset: { en: "Sunset", hi: "सूर्यास्त" },
  yoga: { en: "Yoga", hi: "योग" },
  karana: { en: "Karana", hi: "करण" },
  phase: { en: "Phase", hi: "चरण" },
};

// --- Dummy Data ---
const dummyPanchang: PanchangData = {
  date: {
    en: "Tuesday, March 3, 2026",
    hi: "मंगलवार, 3 मार्च 2026",
  },
  tithi: { en: "Shukla Paksha Dashami", hi: "शुक्ल पक्ष दशमी" },
  nakshatra: { en: "Rohini (until 23:45)", hi: "रोहिणी (रात 11:45 तक)" },
  yoga: { en: "Ayushman", hi: "आयुष्मान" },
  karana: { en: "Taitila", hi: "तैतिल" },
  sunrise: { en: "06:14 AM", hi: "06:14 सुबह" },
  sunset: { en: "18:22 PM", hi: "06:22 शाम" },
  moonPhase: { en: "Waxing Gibbous", hi: "वर्धमान चंद्र" },
};

// --- Animated Text Component ---
const AnimatedText = ({
  text,
  className = "",
  textClassName = "",
}: {
  text: string;
  className?: string;
  textClassName?: string;
}) => {
  return (
    <span
      className={`relative overflow-hidden inline-block leading-[1.4] ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          className={`inline-block ${textClassName}`}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default function DailyPanchang() {
  const { date, tithi, nakshatra, yoga, karana, sunrise, sunset, moonPhase } =
    dummyPanchang;

  // Language state: 'en' or 'hi'
  const [staticLang, setStaticLang] = useState<Language>("en");
  const [dynamicLang, setDynamicLang] = useState<Language>("en");

  // Interval to toggle languages
  useEffect(() => {
    const interval = setInterval(() => {
      // Toggle static language first
      setStaticLang((prev) => (prev === "en" ? "hi" : "en"));

      // 500ms later, toggle dynamic language
      setTimeout(() => {
        setDynamicLang((prev) => (prev === "en" ? "hi" : "en"));
      }, 500);
    }, 5000); // Toggle every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden min-h-[800px] pt-24 pb-8 px-4 font-sans bg-[#050A0A]">
      {/* Background Texture with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/black-texture.jpg"
          alt="Background Texture"
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050A0A]/40 via-transparent to-[#050A0A]/60" />
      </div>

      {/* Slowly Rotating Background Wheel */}
      <div className="absolute inset-0 z-1 flex items-center justify-center pointer-events-none p-4">
        <img
          src="/golden-wheel-hand.png"
          alt="Cosmic Background"
          className="w-full max-w-[400px] h-auto max-h-[90%] object-contain drop-shadow-[0_0_30px_rgba(255,140,0,0.3)]"
          style={{
            animation: "spin 120s linear infinite",
          }}
        />
      </div>

      <div className="container mx-auto relative z-10 max-w-6xl flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-5 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
                <Clock className="w-3.5 h-3.5 text-[#FF8C00]/70" />
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">
                  Watch the Cosmic Clock
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] flex items-center justify-center gap-4">
              <AnimatedText text={staticLabels.sectionTitle[staticLang]} />
            </h2>

            {/* Subtitle & Date */}
            <div className="space-y-2">
              <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto leading-relaxed font-light drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                <AnimatedText text={staticLabels.subtitle[staticLang]} />
              </p>
              <div className="text-red-500 font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                <AnimatedText text={date[dynamicLang]} />
              </div>
            </div>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#FF8C00]/40" />
              <div className="w-2 h-2 rounded-full bg-[#FF8C00]/50 animate-pulse" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#FF8C00]/40" />
            </div>
          </motion.div>
        </div>

        {/* --- SLEEK MAIN CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto mb-8">
          {/* Left Card: Moon / Tithi */}
          <div className="relative group flex flex-col items-center text-center p-10 rounded-3xl bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] golden-border transition-all duration-500 hover:bg-white/[0.05]">
            {/* Faint Background Number */}
            <div className="absolute top-1/2 left-8 -translate-y-1/2 text-[8rem] font-serif font-bold text-white/[0.02] pointer-events-none select-none">
              01
            </div>

            {/* Icon Block */}
            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] relative group-hover:scale-110 transition-transform duration-500">
              <Moon className="w-8 h-8 text-[#00FF94]" strokeWidth={1} />
            </div>

            {/* Label Block (Height +4px) */}
            <div className="flex items-center gap-3 mb-3 h-[24px] text-white/50 font-mono text-xs tracking-[0.2em] uppercase">
              <AnimatedText text={staticLabels.lunarDay[staticLang]} />
              <span className="text-[#00FF94]/50 font-serif">♈</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-serif text-white/90 mb-6 h-[40px] tracking-wide relative z-10">
              <AnimatedText text={tithi[dynamicLang]} />
            </h3>

            <p className="text-sm text-white/40 leading-relaxed max-w-sm h-[60px] overflow-hidden font-light relative z-10">
              <AnimatedText text={staticLabels.tithiDesc[staticLang]} />
            </p>
          </div>

          {/* Right Card: Star / Nakshatra */}
          <div className="relative group flex flex-col items-center text-center p-10 rounded-3xl bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] golden-border transition-all duration-500 hover:bg-white/[0.05]">
            {/* Faint Background Number */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 text-[8rem] font-serif font-bold text-white/[0.02] pointer-events-none select-none">
              02
            </div>

            {/* Icon Block */}
            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] relative group-hover:scale-110 transition-transform duration-500">
              <Star className="w-8 h-8 text-[#FF8C00]" strokeWidth={1} />
            </div>

            {/* Label Block (Height +4px) */}
            <div className="flex items-center gap-3 mb-3 h-[24px] text-white/50 font-mono text-xs tracking-[0.2em] uppercase">
              <AnimatedText text={staticLabels.constellation[staticLang]} />
              <span className="text-[#FF8C00]/50 font-serif">♉</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-serif text-white/90 mb-6 h-[40px] tracking-wide relative z-10">
              <AnimatedText text={nakshatra[dynamicLang]} />
            </h3>

            <p className="text-sm text-white/40 leading-relaxed max-w-sm h-[60px] overflow-hidden font-light relative z-10">
              <AnimatedText text={staticLabels.nakshatraDesc[staticLang]} />
            </p>
          </div>
        </div>
        {/* --- BOTTOM 5-PILL ROW (Sleek) --- */}
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 w-full max-w-5xl mx-auto">
          {[
            {
              label: staticLabels.sunrise,
              val: sunrise,
              icon: (
                <Sun className="w-6 h-6 text-[#FF8C00]" strokeWidth={1.5} />
              ),
              zodiac: "♌",
            },
            {
              label: staticLabels.sunset,
              val: sunset,
              icon: (
                <Moon className="w-6 h-6 text-[#00FF94]" strokeWidth={1.5} />
              ),
              zodiac: "♋",
            },
            {
              label: staticLabels.yoga,
              val: yoga,
              icon: (
                <Activity
                  className="w-6 h-6 text-[#00FF94]"
                  strokeWidth={1.5}
                />
              ),
              zodiac: "♓",
            },
            {
              label: staticLabels.karana,
              val: karana,
              icon: (
                <Sparkles
                  className="w-6 h-6 text-[#FF8C00]"
                  strokeWidth={1.5}
                />
              ),
              zodiac: "♍",
            },
            {
              label: staticLabels.phase,
              val: moonPhase,
              icon: (
                <Clock className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
              ),
              zodiac: "♏",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl golden-border shadow-[0_20px_40px_rgba(0,0,0,0.4)] min-w-[170px] flex-1 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/[0.08] shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] transition-colors">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-white/40 tracking-[0.1em] uppercase">
                    <AnimatedText text={item.label[staticLang]} />
                  </span>
                  <span className="text-white/20 font-serif text-[10px]">
                    {item.zodiac}
                  </span>
                </div>
                <span className="text-sm text-white/90 font-sans font-medium h-[20px]">
                  <AnimatedText text={item.val[dynamicLang]} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
