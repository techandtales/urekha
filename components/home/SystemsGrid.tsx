"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  X,
  Moon,
  Stars,
  Heart,
  AlertTriangle,
  Clock,
  LayoutTemplate,
  Sparkles,
  Gem,
  Activity,
  ShieldCheck,
  Orbit,
  Compass,
  BookOpen,
  Globe2,
} from "lucide-react";
import Image from "next/image";

const SYSTEMS = [
  {
    name: "Advanced Panchang",
    gradient: "from-blue-900 to-indigo-900",
    icon: Moon,
    bgImage: "/systems/bg1.png",
    description:
      "Calculates the five limbs of time (Vara, Tithi, Nakshatra, Yoga, Karana) to determine auspicious timings with millisecond precision.",
  },
  {
    name: "Divisional Charts",
    gradient: "from-indigo-900 to-purple-900",
    icon: LayoutTemplate,
    bgImage: "/systems/bg2.png",
    description:
      "Shodashvarga analysis breaks the birth chart into 16 harmonic divisions to inspect specific life areas like marriage (Navamsa) and career (Dasamsa).",
  },
  {
    name: "Match Making",
    gradient: "from-purple-900 to-pink-900",
    icon: Heart,
    bgImage: "/systems/bg3.png",
    description:
      "Ashtakoot Guna Milan algorithm evaluates 36 points of compatibility, weighing mental harmony, destiny, and biological rhythm.",
  },
  {
    name: "Horoscope Dosh",
    gradient: "from-red-900 to-orange-900",
    icon: AlertTriangle,
    bgImage: "/systems/bg4.png",
    description:
      "AI detection of Mangal Dosh, Kal Sarp Dosh, and Pitra Dosh, providing quantified severity scores and actionable remedies.",
  },
  {
    name: "Vimshottari Dasha",
    gradient: "from-orange-900 to-yellow-900",
    icon: Clock,
    bgImage: "/systems/bg1.png",
    description:
      "A 120-year planetary cycle system mapping your life's timeline, predicting when specific karmic patterns will ripen.",
  },
  {
    name: "Horoscope Charts",
    gradient: "from-yellow-900 to-green-900",
    icon: Orbit,
    bgImage: "/systems/bg2.png",
    description:
      "High-definition rendering of North Indian (Diamond), South Indian (Square), and East Indian chart styles.",
  },
  {
    name: "Nakshatra Predictions",
    gradient: "from-green-900 to-teal-900",
    icon: Stars,
    bgImage: "/systems/bg3.png",
    description:
      "Deep dive into your birth star's padas, deity, and symbol to reveal your subconscious nature and destiny patterns.",
  },
  {
    name: "Gems Suggestions",
    gradient: "from-teal-900 to-cyan-900",
    icon: Gem,
    bgImage: "/systems/bg4.png",
    description:
      "Algorithmic recommendation of gemstone based on functional benefic planets, including carat weight and metal settings.",
  },
  {
    name: "Rudraksh Suggestions",
    gradient: "from-cyan-900 to-blue-900",
    icon: Activity,
    bgImage: "/systems/bg1.png",
    description:
      "Prescribes specific Mukhi Rudraksha beads to balance planetary energies based on your Shiva Purana birth chart details.",
  },
  {
    name: "Suggestions And Remedies",
    gradient: "from-blue-800 to-indigo-800",
    icon: ShieldCheck,
    bgImage: "/systems/bg2.png",
    description:
      "A curated list of practical Vedic remedies, mantras, and lifestyle adjustments to mitigate negative planetary influences.",
  },
  {
    name: "Tarot",
    gradient: "from-purple-800 to-pink-800",
    icon: Sparkles,
    bgImage: "/systems/bg3.png",
    description:
      "Archetypal synchronization using Major Arcana symbolism to provide intuitive guidance on immediate life questions.",
  },
  {
    name: "Numerology",
    gradient: "from-pink-800 to-rose-800",
    icon: Compass,
    bgImage: "/systems/bg4.png",
    description:
      "Pythagorean and Chaldean numerology analysis of your name and birth date to uncover your Life Path and Destiny numbers.",
  },
  {
    name: "Lal Kitab",
    gradient: "from-rose-800 to-red-800",
    icon: BookOpen,
    bgImage: "/systems/bg1.png",
    description:
      "Unique remedial astrology focusing on karmic debts and simple, household remedies for quick relief.",
  },
  {
    name: "Multi Languages",
    gradient: "from-gray-800 to-slate-800",
    icon: Globe2,
    bgImage: "/systems/bg2.png",
    description:
      "Native support for English, Hindi, and regional languages, ensuring cultural context is preserved in translation.",
  },
];

export default function SystemsGrid() {
  const [selectedSystem, setSelectedSystem] = useState<
    (typeof SYSTEMS)[0] | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleSelect = (system: (typeof SYSTEMS)[0]) => {
    if (selectedSystem?.name === system.name) return; // Already open
    setSelectedSystem(system);
  };

  const handleClose = () => {
    setSelectedSystem(null);
  };

  return (
    <section id="systems" className="py-24 bg-muted/5 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif mb-4 text-brand-gold">
            Cosmic Intelligence Engines
          </h2>
          <p className="text-muted-foreground">
            Synthesizing multiple astrological disciplines for accuracy.
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {SYSTEMS.map((sys) => {
            const Icon = sys.icon;
            return (
              <div
                key={sys.name}
                onClick={() => handleSelect(sys)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = (y - centerY) / 15;
                  const rotateY = (centerX - x) / 15;

                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transition:
                    "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
                className={cn(
                  "aspect-[4/3] md:aspect-square relative overflow-hidden rounded-2xl border border-white/5 group cursor-pointer bg-gradient-to-br transition-all duration-500 shadow-lg hover:shadow-[0_0_40px_-10px_rgba(255,183,77,0.3)] hover:border-brand-gold/40 hover:-translate-y-2",
                  sys.gradient,
                )}
              >
                {/* Cosmic Background Image */}
                <Image
                  src={sys.bgImage}
                  alt={`${sys.name} background`}
                  fill
                  className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 mix-blend-overlay group-hover:scale-110"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 z-20">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white/5 mb-3 md:mb-5 flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:border-brand-gold/50 group-hover:scale-110 group-hover:bg-brand-gold/10 transition-all duration-500 shadow-xl group-hover:shadow-[0_0_20px_rgba(255,183,77,0.4)]">
                    <Icon
                      className="w-5 h-5 md:w-7 md:h-7 text-white/70 group-hover:text-brand-gold transition-colors duration-300"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="font-serif text-lg md:text-xl text-white/90 font-medium tracking-wide group-hover:text-white transition-colors">
                    {sys.name}
                  </h3>
                  <div className="h-0.5 w-0 bg-brand-gold mt-2 transition-all duration-500 group-hover:w-12" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Overlay Details */}
      {selectedSystem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass-card p-1 rounded-3xl max-w-3xl w-full shadow-2xl relative animate-in zoom-in-95 duration-400 border border-white/10">
            <div
              className={cn(
                "relative rounded-[1.35rem] overflow-hidden bg-gradient-to-br min-h-[400px] flex flex-col md:flex-row",
                selectedSystem.gradient,
              )}
            >
              {/* Modal Background Image */}
              <Image
                src={selectedSystem.bgImage}
                alt="System Background"
                fill
                className="object-cover opacity-30 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />

              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all z-50 group hover:rotate-90 duration-300"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <div className="relative z-20 p-8 md:p-12 space-y-8 flex flex-col justify-center w-full">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(255,183,77,0.2)]">
                    <selectedSystem.icon
                      className="w-8 h-8 md:w-10 md:h-10 text-brand-gold"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-5xl font-serif text-white mb-2 tracking-wide">
                      {selectedSystem.name}
                    </h3>
                    <div className="h-1 w-24 bg-brand-gold/60 rounded-full shadow-[0_0_10px_rgba(255,183,77,0.4)]" />
                  </div>
                </div>

                <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light max-w-2xl border-l-2 border-white/10 pl-6">
                  {selectedSystem.description}
                </p>

                <div className="pt-4 flex gap-4">
                  <button className="px-8 py-3 bg-white text-black text-sm font-bold uppercase tracking-widest rounded-full hover:bg-brand-gold transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(255,183,77,0.4)] hover:-translate-y-1">
                    Initialize System
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10 bg-transparent"
            onClick={handleClose}
          />
        </div>
      )}
    </section>
  );
}
