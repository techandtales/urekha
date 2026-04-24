"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  BookOpen,
  Heart,
  Shield,
  Hash,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
} from "lucide-react";

/* ─── Service Data ─── */
const SERVICES = [
  {
    id: "full-prediction",
    icon: BookOpen,
    title: "Personalized Full Prediction",
    tagline: "Your Complete Cosmic Blueprint",
    color: "#BF9004",
    features: [
      "18 Types of Charts",
      "10 Types of Tables",
      "Numerology Insights",
      "Dasha & Dosha Analysis",
      "10 Types of Prediction",
    ],
  },
  {
    id: "kundli-matching",
    icon: Heart,
    title: "Kundli Matching",
    tagline: "Harmonize Destinies Together",
    color: "#FF6B6B",
    features: [
      "Gun Milan Score",
      "Compatibility Analysis",
      "Possible Dosha Detection",
      "Remedies & Solutions",
    ],
  },
  {
    id: "dasha-dosha",
    icon: Shield,
    title: "Dasha & Dosha Analysis",
    tagline: "Navigate Life's Planetary Cycles",
    color: "#00FF94",
    features: [
      "Mahadasha Timeline",
      "Current Mahadasha Period",
      "Manglik Dosha",
      "Kaalsarp Dosha",
      "Pitra Dosha",
      "Mangal Dosha",
    ],
  },
  {
    id: "numerology",
    icon: Hash,
    title: "Numerology",
    tagline: "Decode Numbers, Decode Destiny",
    color: "#A78BFA",
    features: [
      "Mobile Number Analysis",
      "Lucky Things",
      "Name Analysis",
      "Vehicle Number Analysis",
    ],
  },
];

/* ─── Parallax Star Field ─── */
const ParallaxStars = ({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Different parallax speeds for depth layers
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  if (!mounted) return null;

  const layer1 = Array.from({ length: 15 }, (_, i) => ({
    x: (i * 37) % 100,
    y: (i * 53) % 100,
    size: 1.5 + (i % 3),
    opacity: 0.15 + (i % 4) * 0.08,
  }));

  const layer2 = Array.from({ length: 12 }, (_, i) => ({
    x: (i * 47 + 20) % 100,
    y: (i * 31 + 15) % 100,
    size: 1 + (i % 2),
    opacity: 0.1 + (i % 3) * 0.06,
  }));

  const layer3 = Array.from({ length: 8 }, (_, i) => ({
    x: (i * 61 + 10) % 100,
    y: (i * 43 + 30) % 100,
    size: 2 + (i % 3),
    opacity: 0.2 + (i % 2) * 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep layer — slowest parallax */}
      <motion.div className="absolute inset-0" style={{ y: layer2Y }}>
        {layer2.map((s, i) => (
          <div
            key={`l2-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: s.opacity,
            }}
          />
        ))}
      </motion.div>

      {/* Mid layer */}
      <motion.div className="absolute inset-0" style={{ y: layer1Y }}>
        {layer1.map((s, i) => (
          <motion.div
            key={`l1-${i}`}
            className="absolute rounded-full"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.x}%`,
              top: `${s.y}%`,
              background:
                i % 3 === 0 ? "#BF9004" : i % 3 === 1 ? "#00FF94" : "#A78BFA",
            }}
            animate={{ opacity: [s.opacity, s.opacity * 2, s.opacity] }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      {/* Near layer — fastest parallax */}
      <motion.div className="absolute inset-0" style={{ y: layer3Y }}>
        {layer3.map((s, i) => (
          <motion.div
            key={`l3-${i}`}
            className="absolute rounded-full bg-brand-gold/30 blur-[1px]"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.x}%`,
              top: `${s.y}%`,
            }}
            animate={{
              opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.5],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + (i % 3) * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

/* ─── Parallax Orb ─── */
const ParallaxOrb = ({
  scrollYProgress,
  config,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  config: {
    size: number;
    x: string;
    y: string;
    color: string;
    speed: number;
  };
}) => {
  const y = useTransform(scrollYProgress, [0, 1], [0, config.speed]);
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: config.size,
        height: config.size,
        left: config.x,
        top: config.y,
        background: `radial-gradient(circle, ${config.color}, transparent 70%)`,
        filter: "blur(80px)",
        y: smoothY,
      }}
    />
  );
};

/* ─── Service Card ─── */
const ServiceCard = ({
  service,
  index,
}: {
  service: (typeof SERVICES)[0];
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] as any,
      }}
      className="group relative flex-shrink-0 w-[320px] sm:w-[340px] h-full"
    >
      {/* Card outer glow on hover (and persistent on mobile) */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 max-md:opacity-100 transition-opacity duration-700 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${service.color}33, transparent 60%)`,
        }}
      />

      {/* Solid Dark Card */}
      <div className="relative h-full rounded-2xl overflow-hidden border border-white/5 bg-[#0A0F0F] shadow-2xl">
        {/* Top colored accent strip (always full width on mobile) */}
        <div
          className="h-1 w-0 group-hover:w-full max-md:w-full transition-all duration-700 ease-out"
          style={{ background: service.color }}
        />

        {/* Card Content */}
        <div className="p-7 flex flex-col gap-5 h-full">
          {/* Icon + Badge */}
          <div className="flex items-start justify-between">
            <div
              className="relative w-14 h-14 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-white/10 max-md:border-white/10 transition-all duration-500 group-hover:scale-110 max-md:scale-110"
              style={{
                background: `${service.color}10`,
              }}
            >
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-40 max-md:opacity-40 transition-opacity duration-500 blur-xl"
                style={{ background: service.color }}
              />
              <Icon
                className="w-6 h-6 relative z-10"
                style={{ color: service.color }}
              />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/10 bg-white/5">
              <Star className="w-3 h-3 text-brand-gold/80" />
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                Premium
              </span>
            </div>
          </div>

          {/* Title & Tagline */}
          <div>
            <h3 className="text-lg font-bold text-white/90 mb-1 tracking-wide group-hover:text-white max-md:text-white transition-colors duration-300">
              {service.title}
            </h3>
            <p
              className="text-xs font-mono tracking-wide font-semibold opacity-80"
              style={{ color: service.color }}
            >
              {service.tagline}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Features List */}
          <ul className="space-y-2.5">
            {service.features.map((feature, fi) => (
              <motion.li
                key={fi}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.12 + fi * 0.05,
                }}
                className="flex items-center gap-3 text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300"
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `${service.color}15` }}
                >
                  <Check className="w-3 h-3" style={{ color: service.color }} />
                </div>
                {feature}
              </motion.li>
            ))}
          </ul>

          {/* CTA area */}
          <div className="mt-auto pt-3">
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all duration-500 border border-white/10 bg-[#050A0A] text-white/60 group-hover:text-white group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer max-md:text-white max-md:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              style={{
                borderColor: `${service.color}30`,
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.background = `${service.color}15`;
                  e.currentTarget.style.borderColor = `${service.color}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.background = "#050A0A";
                  e.currentTarget.style.borderColor = `${service.color}30`;
                }
              }}
            >
              Explore Service
            </button>
          </div>
        </div>

        {/* Decorative background number */}
        <div
          className="absolute -bottom-6 -right-2 text-[120px] font-mono font-bold leading-none select-none pointer-events-none opacity-[0.02] group-hover:opacity-[0.04] max-md:opacity-[0.04] transition-opacity duration-500"
          style={{ color: service.color }}
        >
          0{index + 1}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Services Section ─── */
export default function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Parallax scroll tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax orb configs
  const orbConfigs = [
    {
      size: 400,
      x: "5%",
      y: "10%",
      color: "rgba(191,144,4,0.08)",
      speed: -150,
    },
    {
      size: 300,
      x: "75%",
      y: "50%",
      color: "rgba(0,255,148,0.06)",
      speed: -100,
    },
    {
      size: 350,
      x: "45%",
      y: "70%",
      color: "rgba(167,139,250,0.05)",
      speed: -180,
    },
    {
      size: 250,
      x: "20%",
      y: "60%",
      color: "rgba(255,107,107,0.04)",
      speed: -80,
    },
  ];

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateScrollButtons();
    };

    handleResize(); // Initial check

    ref.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", handleResize);

    // Delayed initial check to ensure layout is finished
    const t = setTimeout(updateScrollButtons, 200);

    return () => {
      ref.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", handleResize);
      clearTimeout(t);
    };
  }, []);

  // Card width + gap = 340px + 24px = 364px
  const SCROLL_STEP = 364;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -SCROLL_STEP : SCROLL_STEP,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full overflow-hidden min-h-[800px] py-8 px-4 font-sans bg-[#050A0A]"
      style={{ isolation: "isolate" }}
    >
      {/* ─── Background Layer 1: Dark Texture (rotated 180°) ─── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/black-4texture.jpg"
          alt="Background Texture"
          className="w-full h-full object-cover opacity-50 mix-blend-luminosity rotate-180"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050A0A]/40 via-transparent to-[#050A0A]/60" />
      </div>

      {/* ─── Background Layer 2: Golden Wheel (rotated 180°) ─── */}
      {/* ─── Parallax Background Orbs ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        {orbConfigs.map((config, i) => (
          <ParallaxOrb
            key={i}
            scrollYProgress={scrollYProgress}
            config={config}
          />
        ))}
      </div>

      {/* ─── Parallax Star Field ─── */}
      <ParallaxStars scrollYProgress={scrollYProgress} />

      {/* ─── Content ─── */}
      <div className="relative z-10 pt-20 pb-28">
        <div className="container mx-auto px-6">
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
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold/70" />
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">
                    Vedic Wisdom, Decoded
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Celestial Services
              </h2>

              {/* Subtitle */}
              <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto leading-relaxed font-light drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                Unlock the ancient secrets of the cosmos. From personalized
                predictions to dosha analysis — your stars, your story.
              </p>

              {/* Decorative line */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-brand-gold/40" />
                <div className="w-2 h-2 rounded-full bg-brand-gold/50 animate-pulse" />
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-brand-gold/40" />
              </div>
            </motion.div>
          </div>

          {/* Horizontally Scrollable Cards with Side Arrows */}
          <div className="relative group/container mt-8">
            {/* Left side arrow - Persistent on mobile */}
            <div className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-6 z-30 opacity-100 md:opacity-0 md:group-hover/container:opacity-100 transition-all duration-300">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll services left"
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
                  canScrollLeft
                    ? "border-white/20 bg-black/40 md:bg-white/[0.06] text-white/70 hover:bg-white/10 hover:border-brand-gold/30 hover:shadow-[0_0_15px_rgba(191,144,4,0.2)] active:scale-90"
                    : "border-white/5 bg-white/[0.02] text-white/10 cursor-default opacity-20"
                }`}
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Right side arrow - Persistent on mobile */}
            <div className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-6 z-30 opacity-100 md:opacity-0 md:group-hover/container:opacity-100 transition-all duration-300">
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll services right"
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
                  canScrollRight
                    ? "border-white/20 bg-black/40 md:bg-white/[0.06] text-white/70 hover:bg-white/10 hover:border-brand-gold/30 hover:shadow-[0_0_15px_rgba(191,144,4,0.2)] active:scale-90"
                    : "border-white/5 bg-white/[0.02] text-white/10 cursor-default opacity-20"
                }`}
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="relative">
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto overflow-y-hidden pb-8 scrollbar-hide scroll-smooth items-stretch snap-x snap-mandatory px-4 md:px-0"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                  // Added dynamic padding trick to allow the first and last card to perfectly center on mobile
                  paddingLeft: isMobile ? "max(1rem, calc(50vw - 160px))" : "0",
                  paddingRight: isMobile
                    ? "max(1rem, calc(50vw - 160px))"
                    : "0",
                }}
              >
                {SERVICES.map((service, idx) => (
                  <div
                    key={service.id}
                    className="flex-shrink-0 h-auto snap-center"
                  >
                    <ServiceCard service={service} index={idx} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
