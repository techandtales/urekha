"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Orbit,
  BarChart3,
  Timer,
  AlertTriangle,
  Calendar,
  Brain,
  Heart,
  Sparkles,
  ChevronRight,
  Layers,
  Grid3x3,
  Star,
  Moon,
  Sun,
  Hexagon,
  Cpu,
  Eye,
  TrendingUp,
  Compass,
  Zap,
} from "lucide-react";
import CrystalCard from "@/components/about/CrystalCard";

/* ────────────────────────────────────────────────
   DATA: Every feature in the URekha engine
   ──────────────────────────────────────────────── */

const CATEGORIES = [
  {
    id: "charts",
    label: "Charts",
    icon: Grid3x3,
    accent: "#00FF94",
    count: 21,
    description: "Precision-rendered divisional charts from D1 to D60, plus Moon, Sun, Chalit & Transit charts. Each computed at 0.001° accuracy.",
    items: [
      { name: "D1 — Birth Chart (Lagna)", desc: "The foundational chart mapping planetary positions at the moment of birth." },
      { name: "D9 — Navamsa", desc: "The chart of dharma, marriage, and the soul's deeper purpose." },
      { name: "D3 — Drekkana", desc: "Siblings, courage, and short journeys." },
      { name: "D4 — Chaturthamsa", desc: "Property, fixed assets, and fortune." },
      { name: "D7 — Saptamsa", desc: "Children, progeny, and creative expression." },
      { name: "D10 — Dasamsa", desc: "Career, profession, and public reputation." },
      { name: "D12 — Dvadasamsa", desc: "Parents, ancestry, and lineage." },
      { name: "D16 — Shodasamsa", desc: "Vehicles, comforts, and luxuries." },
      { name: "D20 — Vimsamsa", desc: "Spiritual progress and worship." },
      { name: "D24 — Chaturvimsamsa", desc: "Education, knowledge, and academic success." },
      { name: "D27 — Saptavimsamsa", desc: "Strength, stamina, and physical vitality." },
      { name: "D30 — Trimsamsa", desc: "Misfortunes, obstacles, and hidden challenges." },
      { name: "D60 — Shashtiamsa", desc: "Past-life karma and the deepest layer of destiny." },
      { name: "D6 — Shashthamsa", desc: "Health, diseases, and enemies." },
      { name: "D8 — Ashtamsa", desc: "Longevity, sudden events, and transformation." },
      { name: "Moon Chart", desc: "Chart pivoting from the Moon's natal position." },
      { name: "Sun Chart", desc: "Solar perspective used in Sudarshan Chakra analysis." },
      { name: "Chalit / Bhav Chalit", desc: "House-based chart for precise bhava analysis." },
      { name: "Transit Chart", desc: "Real-time planetary positions overlaid on the natal chart." },
      { name: "Ashtakvarga Matrix", desc: "Sarvashtakvarga — aggregate strength grid across all houses." },
      { name: "Bhinnashtakvarga", desc: "Individual planet strength matrices for all 8 key planets." },
    ],
  },
  {
    id: "planetary",
    label: "Planetary",
    icon: Orbit,
    accent: "#FF8C00",
    count: 7,
    description: "Deep analysis of every graha — positions, nakshatras, dignity, friendships, and KP subdivisions.",
    items: [
      { name: "Planet Details", desc: "Degrees, signs, nakshatras, retrogradation, and house placement for all 9 grahas." },
      { name: "Ascendant Report", desc: "Complete Lagna analysis with ruler dignity and aspect influence." },
      { name: "Extended Kundli", desc: "Expanded horoscope data with Shadbala, Bhava Bala, and Ishta/Kashta phala." },
      { name: "Friendship Table", desc: "Natural and temporal friendship/enmity matrix between all planets." },
      { name: "Planet KP Details", desc: "Krishnamurti Paddhati star/sub/sub-sub lord breakdown." },
      { name: "Sade Sati Analysis", desc: "Current Saturn transit over Moon — phase detection and impact assessment." },
      { name: "Ashtakvarga Strength", desc: "Bindhu-based strength score for each planet across all 12 houses." },
    ],
  },
  {
    id: "kp",
    label: "KP System",
    icon: Compass,
    accent: "#7e56da",
    count: 4,
    description: "Krishnamurti Paddhati — the precision astrology system based on sub-lord theory.",
    items: [
      { name: "KP Planet Details", desc: "Star lord, sub lord, and sub-sub lord for each planet." },
      { name: "KP Cusp Details", desc: "All 12 house cusp positions with their KP significators." },
      { name: "Planet Significators", desc: "Ruling planet chain and significator hierarchy for event prediction." },
      { name: "House Significators", desc: "Which planets signify which houses — the backbone of KP timing." },
    ],
  },
  {
    id: "dasha",
    label: "Dasha",
    icon: Timer,
    accent: "#00C2FF",
    count: 5,
    description: "Vimshottari & Yogini Dasha systems — mapping the cosmic timeline of your life.",
    items: [
      { name: "Mahadasha Periods", desc: "Complete 120-year Vimshottari Mahadasha timeline with start/end dates." },
      { name: "Current Mahadasha", desc: "Which major planetary period is active right now and its effects." },
      { name: "Current Mahadasha (Full)", desc: "Deep dive into active Mahadasha + Antardasha + Pratyantardasha." },
      { name: "Yogini Dasha (Main)", desc: "Alternative 36-year cycle used for precise event timing." },
      { name: "Yogini Sub-Dasha", desc: "Sub-period breakdown within each Yogini main period." },
    ],
  },
  {
    id: "dosha",
    label: "Dosha",
    icon: AlertTriangle,
    accent: "#FF4D6A",
    count: 4,
    description: "Detection and severity scoring of key planetary afflictions in the birth chart.",
    items: [
      { name: "Mangal Dosha", desc: "Mars placement analysis for marriage compatibility and remedial guidance." },
      { name: "Kaal Sarp Dosha", desc: "Rahu-Ketu axis trapping all planets — impact and intensity scoring." },
      { name: "Manglik Analysis", desc: "Extended Manglik assessment across Lagna, Moon, and Venus charts." },
      { name: "Pitra Dosha", desc: "Ancestral karma indicators from Sun-Saturn and Rahu-Jupiter combinations." },
    ],
  },
  {
    id: "panchang",
    label: "Panchang",
    icon: Calendar,
    accent: "#F59E0B",
    count: 3,
    description: "The five limbs of time — Tithi, Nakshatra, Yoga, Karana, and Vara.",
    items: [
      { name: "Panchang Details", desc: "Complete almanac data for any date — sunrise, sunset, tithi, yoga, and karana." },
      { name: "Choghadiya Muhurta", desc: "Auspicious time windows for daily activities based on planetary hours." },
      { name: "Hora Muhurta", desc: "Planetary hour ruler for each time segment of the day." },
    ],
  },
  {
    id: "predictions",
    label: "Predictions",
    icon: Brain,
    accent: "#00FF94",
    count: 9,
    description: "Deep AI-generated life-area analyses — each chapter is a 1,200+ word interpretation synthesized from your complete chart data.",
    items: [
      { name: "Personal Insight", desc: "Core personality blueprint — your strengths, tendencies, and the fundamental nature of your ascendant and Moon sign." },
      { name: "Education Analysis", desc: "Academic potential, learning style, and the best periods for higher education based on the 4th & 5th house lords." },
      { name: "Career & Professional Journey", desc: "10th house analysis covering profession, promotions, business potential, and optimal career timing via Dasha periods." },
      { name: "Finance & Money Flow", desc: "Wealth accumulation patterns from the 2nd, 11th & Dhana Yogas — income peaks, investment timing, and financial risks." },
      { name: "Love, Emotions & Relationships", desc: "7th house deep-dive into romantic compatibility, emotional patterns, marriage timing, and partnership dynamics." },
      { name: "Family & Social Support", desc: "4th house analysis of family bonds, parental influence, property matters, and your social support ecosystem." },
      { name: "Health Analysis", desc: "6th & 8th house health mapping — vulnerability zones, chronic tendencies, and preventive guidance from planetary positions." },
      { name: "Enemy & Challenges", desc: "Hidden obstacles, legal disputes, competition, and the planetary combinations that create friction in your life path." },
      { name: "Spirituality", desc: "12th house moksha analysis — spiritual inclinations, meditation compatibility, and the karmic lessons encoded in your chart." },
    ],
  },
  {
    id: "matching",
    label: "Matching",
    icon: Heart,
    accent: "#FF6B9D",
    count: 5,
    description: "Compatibility analysis across Vedic, Nakshatra, and Western systems.",
    items: [
      { name: "Ashtakoot Matching", desc: "36-point Guna Milan — the gold standard of Vedic compatibility." },
      { name: "Dashakoot Matching", desc: "10-point South Indian matching system for deeper compatibility layers." },
      { name: "Aggregate Matching", desc: "Multi-system composite compatibility score." },
      { name: "Western Matching", desc: "Sun-sign based compatibility using Western astrology." },
      { name: "Nakshatra Matching", desc: "Star-to-star compatibility using Yoni, Gana, and Nadi analysis." },
    ],
  },
];

const HERO_STATS = [
  { val: "21", label: "Charts", icon: Grid3x3 },
  { val: "58+", label: "Data Modules", icon: Layers },
  { val: "100pg", label: "AI Reports", icon: Brain },
  { val: "9", label: "Languages", icon: Sparkles },
];

/* ────────────────────────────────────────────────
   COMPONENT
   ──────────────────────────────────────────────── */

export default function ReadingsPage() {
  const [activeTab, setActiveTab] = useState("charts");
  const activeCategory = CATEGORIES.find((c) => c.id === activeTab)!;

  // Tab auto-scroll refs
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const setTabRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) tabRefs.current.set(id, el);
    else tabRefs.current.delete(id);
  }, []);

  /** Scroll the clicked tab to the horizontal center of the tab container.
   *  Clamped so the last tab's right edge never goes past the container's right edge. */
  const handleTabClick = useCallback((id: string) => {
    setActiveTab(id);

    const container = tabScrollRef.current;
    const btn = tabRefs.current.get(id);
    if (!container || !btn) return;

    // Calculate ideal scroll to center this tab
    const containerWidth = container.offsetWidth;
    const btnLeft = btn.offsetLeft; // relative to scroll container
    const btnWidth = btn.offsetWidth;
    const idealScroll = btnLeft - containerWidth / 2 + btnWidth / 2;

    // Clamp: max scroll = total scrollable width (scrollWidth - clientWidth)
    const maxScroll = container.scrollWidth - container.clientWidth;
    const clampedScroll = Math.max(0, Math.min(idealScroll, maxScroll));

    container.scrollTo({ left: clampedScroll, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050A0A] relative overflow-hidden transition-colors duration-500">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] bg-[#00FF94]/[0.04] dark:bg-[#00FF94]/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-[#FF8C00]/[0.04] dark:bg-[#FF8C00]/[0.03] rounded-full blur-[180px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#7e56da]/[0.03] dark:bg-[#7e56da]/[0.02] rounded-full blur-[200px]" />

        {/* Dot grid */}
        <div className="absolute inset-0 dark:hidden opacity-30" style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div className="absolute inset-0 hidden dark:block opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <div className="relative z-10">

        {/* ═══ HERO ═══ */}
        <section className="pt-36 pb-20 md:pt-44 md:pb-28 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-10 text-xs font-mono uppercase tracking-[0.2em] bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/50 dark:border-white/10 text-[#00A859] dark:text-[#00FF94]"
            >
              <Eye size={14} />
              What We Deliver
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[0.95]"
            >
              The Complete{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00FF94] via-[#00C2FF] to-[#7e56da]">
                Kundli Engine
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-16"
            >
              Every chart, every dasha, every dosha — computed with mathematical precision and interpreted by our AI. Here is everything inside a single URekha report.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {HERO_STATS.map((s, i) => (
                <div
                  key={i}
                  className="py-5 px-4 rounded-2xl bg-white/50 dark:bg-white/[0.04] backdrop-blur-xl border border-white/60 dark:border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-center"
                >
                  <s.icon size={18} className="mx-auto mb-2 text-slate-400 dark:text-zinc-500" />
                  <div className="text-2xl font-mono font-bold text-slate-800 dark:text-[#00FF94]">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ UNIFIED EXPLORER PANEL ═══ */}
        <section className="px-4 md:px-6 pb-32">
          <div className="max-w-6xl mx-auto">
            {/* Outer Glass Container */}
            <div className="relative rounded-3xl overflow-hidden bg-white/40 dark:bg-white/[0.02] backdrop-blur-2xl border border-white/50 dark:border-white/[0.06] shadow-[0_8px_60px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_60px_-12px_rgba(0,0,0,0.5)]">
              {/* Top highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/10 to-transparent z-20" />

              {/* ── Sticky Tab Bar ── */}
              <div className="sticky top-0 z-20 bg-white/70 dark:bg-[rgba(10,10,15,0.85)] backdrop-blur-2xl border-b border-white/40 dark:border-white/[0.06] px-4 md:px-6 py-3">
                <div ref={tabScrollRef} className="flex gap-1.5 overflow-x-auto scrollbar-hide md:flex-wrap">
                  {CATEGORIES.map((cat) => {
                    const isActive = activeTab === cat.id;
                    return (
                      <button
                        key={cat.id}
                        ref={(el) => setTabRef(cat.id, el)}
                        onClick={() => handleTabClick(cat.id)}
                        className={`relative flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-lg"
                            style={{ backgroundColor: cat.accent }}
                            transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                          <cat.icon size={14} />
                          <span className="hidden sm:inline">{cat.label}</span>
                          <span className="sm:hidden">{cat.label.slice(0, 4)}</span>
                          <span className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 dark:bg-white/[0.06] text-slate-400 dark:text-zinc-500"
                          }`}>
                            {cat.count}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Content Area ── */}
              <div className="p-5 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Category Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${activeCategory.accent}15`, border: `1px solid ${activeCategory.accent}30` }}
                          >
                            <activeCategory.icon size={18} style={{ color: activeCategory.accent }} />
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {activeCategory.label}
                          </h2>
                        </div>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-xl text-sm leading-relaxed">
                          {activeCategory.description}
                        </p>
                      </div>
                      <div
                        className="font-mono text-5xl md:text-6xl font-black tracking-tighter opacity-[0.07]"
                        style={{ color: activeCategory.accent }}
                      >
                        {String(activeCategory.count).padStart(2, "0")}
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activeCategory.items.map((item, i) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.025, duration: 0.35 }}
                        >
                          <div className="group relative h-full rounded-xl overflow-hidden bg-white/60 dark:bg-white/[0.03] border border-white/70 dark:border-white/[0.06] shadow-[0_1px_8px_-2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_1px_8px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] hover:shadow-[0_6px_24px_-6px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_6px_24px_-6px_rgba(0,0,0,0.5)] transition-all duration-400 p-5">
                            {/* Hover glow */}
                            <div
                              className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-25 dark:group-hover:opacity-15 transition-opacity duration-500 blur-2xl pointer-events-none"
                              style={{ backgroundColor: activeCategory.accent }}
                            />

                            {/* Neon dot + Title */}
                            <div className="flex items-start gap-2.5 mb-2 relative z-10">
                              <div
                                className="w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0"
                                style={{
                                  backgroundColor: activeCategory.accent,
                                  boxShadow: `0 0 6px ${activeCategory.accent}80`,
                                }}
                              />
                              <h3 className="font-semibold text-slate-800 dark:text-white text-sm leading-snug">
                                {item.name}
                              </h3>
                            </div>
                            <p className="text-[13px] text-slate-400 dark:text-zinc-500 leading-relaxed pl-4 relative z-10">
                              {item.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BOTTOM CTA ═══ */}
        <section className="px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-[1.5px] rounded-[2.5rem] overflow-hidden">
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#00FF94,#00C2FF,#7e56da,#FF8C00,#00FF94)] opacity-30 dark:opacity-50 animate-[spin_10s_linear_infinite]" style={{ filter: "blur(3px)" }} />

              <div className="relative bg-white/70 dark:bg-[rgba(10,10,15,0.85)] backdrop-blur-2xl rounded-[2.4rem] p-12 md:p-16 text-center">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/10 to-transparent rounded-t-[2.4rem]" />

                <Cpu size={40} className="text-[#00FF94] mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                  All of This. One Report.
                </h2>
                <p className="text-slate-500 dark:text-zinc-400 max-w-lg mx-auto mb-8 leading-relaxed">
                  58+ data modules processed in milliseconds. Interpreted by our AI. Delivered as a 100-page personalized Kundli report.
                </p>
                <a
                  href="/plans"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00A859] hover:bg-[#008f4c] text-white font-semibold text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_-4px_rgba(0,168,89,0.4)]"
                >
                  Get Your Report
                  <ChevronRight size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </main>
  );
}
