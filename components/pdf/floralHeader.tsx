"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { Language } from "@/types/languages";

interface FloralHeaderProps {
  titleEn: string;
  titleHi: string;
  lang: Language;
  className?: string;
}

const RED_COSMIC = "#B91C1C"; // Deep Cosmic Red

/**
 * A Cosmic/Astrological divider featuring a central Star and planetary alignment
 */
const CosmicOrnament = () => (
  <svg
    width="48"
    height="24"
    viewBox="0 0 48 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Central 4-Pointed Star (Polaris/North Star vibe) */}
    <path
      d="M24 2L26.5 10L34 12L26.5 14L24 22L21.5 14L14 12L21.5 10L24 2Z"
      fill={RED_COSMIC}
    />

    {/* Inner Halo/Sun Ring */}
    <circle
      cx="24"
      cy="12"
      r="5"
      stroke={RED_COSMIC}
      strokeWidth="1"
      opacity="0.5"
    />

    {/* Outer Orbital Ring (Broken) */}
    <path
      d="M14 12C14 7.58172 18.4772 4 24 4C29.5228 4 34 7.58172 34 12"
      stroke={RED_COSMIC}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
    <path
      d="M34 12C34 16.4183 29.5228 20 24 20C18.4772 20 14 16.4183 14 12"
      stroke={RED_COSMIC}
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />

    {/* Planetary Dots (Left) */}
    <circle cx="8" cy="12" r="1.5" fill={RED_COSMIC} />
    <circle cx="3" cy="12" r="1" fill={RED_COSMIC} opacity="0.7" />

    {/* Planetary Dots (Right) */}
    <circle cx="40" cy="12" r="1.5" fill={RED_COSMIC} />
    <circle cx="45" cy="12" r="1" fill={RED_COSMIC} opacity="0.7" />
  </svg>
);

const FloralHeader: React.FC<FloralHeaderProps> = ({
  titleEn,
  titleHi,
  lang,
  className = "mb-2 mt-0",
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center w-[90%] mx-auto ${className}`}
    >
      {/* 2. TEXT STACK */}
      <div className="py-1 flex flex-col items-center gap-0">
        {lang === "hi" && (
          <h2
            className="font-serif font-semibold leading-tight text-center"
            style={{
              fontSize: "18pt",
              color: UREKHA_COLORS.inkPrimary,
              letterSpacing: "0.05em",
              fontWeight: 700,
            }}
          >
            {titleHi}
          </h2>
        )}
        {lang === "en" && (
          <h2
            className="font-serif font-semibold leading-tight text-center"
            style={{
              fontSize: "18pt",
              color: UREKHA_COLORS.inkPrimary,
              letterSpacing: "0.08em", // Slightly more spacing for "Astrological" feel
              fontWeight: 700,
              textTransform: "uppercase", // Uppercase usually looks more "Chart-like"
            }}
          >
            {titleEn}
          </h2>
        )}
      </div>

      {/* 3. BOTTOM CELESTIAL LINE (Mirrored) */}
      <div className="flex items-center w-full gap-2 opacity-90 rotate-180">
        <div
          className="h-px flex-1"
          style={{
            backgroundImage: `linear-gradient(to right, transparent, ${RED_COSMIC})`,
          }}
        />
        <CosmicOrnament />
        <div
          className="h-px flex-1"
          style={{
            backgroundImage: `linear-gradient(to left, transparent, ${RED_COSMIC})`,
          }}
        />
      </div>
    </div>
  );
};

export default FloralHeader;
