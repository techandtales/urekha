"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

const STATS = [
  { value: 50000, suffix: "+", label: "Reports Generated", icon: "☽" },
  { value: 100, suffix: "+", label: "Pages Per Report", icon: "✦" },
  { value: 25, suffix: "", label: "Years of Predictions", icon: "♄" },
  { value: 12, suffix: "", label: "Astrological Systems", icon: "☿" },
];

/* ─── Astrology SVG Background ─── */
const AstroBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06]">
    <svg
      className="w-full h-full"
      viewBox="0 0 1440 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Large outer circle */}
      <circle cx="720" cy="200" r="350" stroke="#A78B4A" strokeWidth="0.5" />
      <circle
        cx="720"
        cy="200"
        r="320"
        stroke="#A78B4A"
        strokeWidth="0.3"
        strokeDasharray="4 8"
      />
      <circle cx="720" cy="200" r="280" stroke="#A78B4A" strokeWidth="0.5" />

      {/* Zodiac division lines (12 segments) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 720 + 280 * Math.cos(angle);
        const y1 = 200 + 280 * Math.sin(angle);
        const x2 = 720 + 350 * Math.cos(angle);
        const y2 = 200 + 350 * Math.sin(angle);
        return (
          <line
            key={`div-${i}`}
            x1={x1.toFixed(4)}
            y1={y1.toFixed(4)}
            x2={x2.toFixed(4)}
            y2={y2.toFixed(4)}
            stroke="#A78B4A"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Inner geometric pattern — rotated square */}
      <rect
        x="620"
        y="100"
        width="200"
        height="200"
        stroke="#A78B4A"
        strokeWidth="0.5"
        fill="none"
        transform="rotate(45,720,200)"
      />
      <rect
        x="645"
        y="125"
        width="150"
        height="150"
        stroke="#A78B4A"
        strokeWidth="0.3"
        fill="none"
        transform="rotate(45,720,200)"
      />

      {/* Center eye motif */}
      <ellipse
        cx="720"
        cy="200"
        rx="80"
        ry="35"
        stroke="#A78B4A"
        strokeWidth="0.5"
        fill="none"
      />
      <circle
        cx="720"
        cy="200"
        r="18"
        stroke="#A78B4A"
        strokeWidth="0.5"
        fill="none"
      />
      <circle cx="720" cy="200" r="6" fill="#A78B4A" opacity="0.3" />

      {/* Corner constellation dots (left) */}
      <circle cx="80" cy="60" r="2" fill="#A78B4A" />
      <circle cx="120" cy="90" r="1.5" fill="#A78B4A" />
      <circle cx="60" cy="110" r="1" fill="#A78B4A" />
      <line
        x1="80"
        y1="60"
        x2="120"
        y2="90"
        stroke="#A78B4A"
        strokeWidth="0.3"
      />
      <line
        x1="120"
        y1="90"
        x2="60"
        y2="110"
        stroke="#A78B4A"
        strokeWidth="0.3"
      />

      {/* Corner constellation dots (right) */}
      <circle cx="1360" cy="80" r="2" fill="#A78B4A" />
      <circle cx="1320" cy="50" r="1.5" fill="#A78B4A" />
      <circle cx="1380" cy="120" r="1" fill="#A78B4A" />
      <line
        x1="1360"
        y1="80"
        x2="1320"
        y2="50"
        stroke="#A78B4A"
        strokeWidth="0.3"
      />
      <line
        x1="1360"
        y1="80"
        x2="1380"
        y2="120"
        stroke="#A78B4A"
        strokeWidth="0.3"
      />

      {/* Bottom constellation (left) */}
      <circle cx="150" cy="320" r="1.5" fill="#A78B4A" />
      <circle cx="200" cy="340" r="1" fill="#A78B4A" />
      <circle cx="170" cy="360" r="2" fill="#A78B4A" />
      <line
        x1="150"
        y1="320"
        x2="200"
        y2="340"
        stroke="#A78B4A"
        strokeWidth="0.3"
      />
      <line
        x1="200"
        y1="340"
        x2="170"
        y2="360"
        stroke="#A78B4A"
        strokeWidth="0.3"
      />

      {/* Bottom constellation (right) */}
      <circle cx="1280" cy="310" r="1.5" fill="#A78B4A" />
      <circle cx="1330" cy="340" r="2" fill="#A78B4A" />
      <circle cx="1300" cy="370" r="1" fill="#A78B4A" />
      <line
        x1="1280"
        y1="310"
        x2="1330"
        y2="340"
        stroke="#A78B4A"
        strokeWidth="0.3"
      />
      <line
        x1="1330"
        y1="340"
        x2="1300"
        y2="370"
        stroke="#A78B4A"
        strokeWidth="0.3"
      />

      {/* Small scattered stars */}
      {[
        [300, 70],
        [500, 350],
        [900, 50],
        [1100, 330],
        [400, 180],
        [1050, 150],
      ].map(([x, y], i) => (
        <polygon
          key={`star-${i}`}
          points={`${x},${y - 4} ${x + 1.5},${y - 1} ${x + 4},${y} ${x + 1.5},${y + 1} ${x},${y + 4} ${x - 1.5},${y + 1} ${x - 4},${y} ${x - 1.5},${y - 1}`}
          fill="#A78B4A"
        />
      ))}
    </svg>
  </div>
);

function AnimatedCounter({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  // Use framer-motion's useInView
  const isInView = useInView(ref, { once: true, amount: "some" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (value) => {
          setCount(Math.round(value));
        },
      });
      return controls.stop;
    }
  }, [target, isInView]);

  const formatted =
    count >= 1000
      ? `${(count / 1000).toFixed(count >= target ? 0 : 1)}K`
      : count.toString();

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-[#0A0D0E]">
      {/* Light warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1215] via-[#0E1117] to-[#0A0D0E]" />

      {/* Subtle golden radial glow at center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-[#A78B4A]/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Top and bottom gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A78B4A]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A78B4A]/20 to-transparent" />

      {/* Astrology SVG Background */}
      <AstroBg />

      <div className="relative z-10 container mx-auto px-6">
        {/* Section micro-title */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#A78B4A]/60">
            ✦ Trusted by Thousands ✦
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto">
          {STATS.map((stat, i) => (
            <div key={i} className="relative text-center space-y-3 group">
              {/* Divider line (not on first item) */}
              {i > 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-[#A78B4A]/20 to-transparent" />
              )}

              {/* Astrology icon */}
              <div className="text-xl text-[#A78B4A]/30 font-serif mb-1">
                {stat.icon}
              </div>

              {/* Counter */}
              <div className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/40">
                {stat.label}
              </p>

              {/* Subtle underline on hover */}
              <div className="mx-auto w-0 group-hover:w-12 h-px bg-[#A78B4A]/30 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
