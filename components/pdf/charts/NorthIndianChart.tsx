"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { CelestialBody } from "@/types/horoscope/divisionalChart";

/** Alias for backward compat */
type ChartPlanet = CelestialBody;

export interface ChartData {
  zodiac_no: { [key: string]: ChartPlanet[] };
}

interface NorthIndianChartProps {
  data: ChartData;
  className?: string;
}

// --- ZODIAC MAPPING ---
const ZODIAC_MAP: { [key: string]: number } = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

// --- HOUSE COORDINATES (North Indian / Diamond Style) ---
// SVG ViewBox: 0 0 100 100
// H1=Top Diamond, H2=Top Left, H3=Left Bottom, H4=Left Diamond, etc.
// Note: Standard NI Layout logic:
// House 1: Top Center
// House 2: Upper Left Triangle
// House 3: Lower Left Triangle
// House 4: Middle Right Diamond (Wait, no).
// NI Layout:
// H1: Top Diamond
// H4: Bottom Diamond? No. H4 is Bottom of Top-Left Quadrant?
// Let's use standard NI coordinates:
// H1: Top Diamond (Center)
// H2: Top Left Triangle
// H3: Left Top Triangle? No.
// Let's visualize:
// Square rotated 45 deg? No.
// Standard Square.
// diagonals cross.
// Top Triangle = H1.
// Left Triangle = H4.
// Bottom Triangle = H7.
// Right Triangle = H10.
// H2 is top-left of H1? No, H2 is usually the triangle to the left of H1 inside the square.
// Let's try standard plotting centroids.

const HOUSE_CONFIG = [
  // H1 (Top Diamond)
  { id: 1, x: 50, y: 28, signX: 50, signY: 8 },
  // H2 (Top Left Triangle - Top)
  { id: 2, x: 20, y: 15, signX: 25, signY: 4 },
  // H3 (Top Left Triangle - Side)
  { id: 3, x: 8, y: 35, signX: 4, signY: 25 },
  // H4 (Left Diamond)
  { id: 4, x: 22, y: 50, signX: 8, signY: 50 },
  // H5 (Bottom Left Triangle - Side)
  { id: 5, x: 8, y: 65, signX: 4, signY: 75 },
  // H6 (Bottom Left Triangle - Bottom)
  { id: 6, x: 20, y: 85, signX: 25, signY: 96 },
  // H7 (Bottom Diamond)
  { id: 7, x: 50, y: 72, signX: 50, signY: 92 },
  // H8 (Bottom Right Triangle - Bottom)
  { id: 8, x: 80, y: 85, signX: 75, signY: 96 },
  // H9 (Bottom Right Triangle - Side)
  { id: 9, x: 92, y: 65, signX: 96, signY: 75 },
  // H10 (Right Diamond)
  { id: 10, x: 78, y: 50, signX: 92, signY: 50 },
  // H11 (Top Right Triangle - Side)
  { id: 11, x: 92, y: 35, signX: 96, signY: 25 },
  // H12 (Top Right Triangle - Top)
  { id: 12, x: 80, y: 15, signX: 75, signY: 4 },
];

const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  data,
  className = "",
}) => {
  // 1. Find Ascendant Sign Number (1-12)
  let ascSign = 1;
  Object.keys(data.zodiac_no).forEach((key) => {
    const planets = data.zodiac_no[key];
    if (planets.find((p) => p.name === "Asc" || p.name === "Ascendant")) {
      ascSign = parseInt(key);
    }
  });

  // 2. Helper to Get Sign Number for a House (H1 = ascSign, H2 = ascSign+1...)
  const getSignForHouse = (houseIdx: number) => {
    // houseIdx is 1-12
    // offset = houseIdx - 1
    // sign = (ascSign + offset - 1) % 12 + 1
    let sign = ((ascSign + (houseIdx - 1) - 1) % 12) + 1;
    if (sign <= 0) sign += 12; // JS Modulo fix
    return sign;
  };

  // 3. Helper to Get Planets in a Sign
  const getPlanetsInSign = (signNum: number) => {
    const planets = data.zodiac_no[signNum.toString()] || [];

    // Aggressive Deduplication using a Set to track unique names
    const seen = new Set();
    const uniquePlanets: ChartPlanet[] = [];

    planets.forEach((p) => {
      const cleanName = p.name.trim();
      if (cleanName === "Asc" || cleanName === "Ascendant") return; // Filter Asc
      if (seen.has(cleanName)) return; // Filter Duplicates

      seen.add(cleanName);
      uniquePlanets.push(p);
    });

    return uniquePlanets;
  };

  // --- RENDERING HELPERS ---
  const renderPlanets = (planets: ChartPlanet[], x: number, y: number) => {
    if (planets.length === 0) return null;

    const count = planets.length;
    // Smart Sizing: Shrink if crowded
    let fontSize = count > 3 ? "3.5" : count > 2 ? "4.5" : "5.5";
    let lineHeight = count > 3 ? 3.5 : 5.5;

    // 2-Column Grid for very crowded houses (4+ planets)
    if (count >= 4) {
      return (
        <text
          x={x}
          y={y - (lineHeight * Math.ceil(count / 2)) / 2 + 2}
          fontSize={fontSize}
          fill={UREKHA_COLORS.inkPrimary}
          fontWeight="bold"
          className="font-serif"
          textAnchor="middle"
        >
          {planets.map((p, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const offsetX = col === 0 ? -4 : 4; // Shift Left/Right increased for larger text
            return (
              <tspan
                x={x + offsetX}
                dy={col === 0 && row > 0 ? lineHeight : 0}
                key={i}
              >
                {p.name}
                {p.retro ? "*" : ""}
              </tspan>
            );
          })}
        </text>
      );
    }

    // Standard Vertical Stack
    return (
      <text
        x={x}
        y={y - ((count - 1) * lineHeight) / 2 + 1}
        fontSize={fontSize}
        fill={UREKHA_COLORS.inkPrimary}
        fontWeight="bold"
        className="font-serif"
        textAnchor="middle"
      >
        {planets.map((p, i) => (
          <tspan x={x} dy={i === 0 ? 0 : lineHeight} key={i}>
            {p.name}
            {p.retro ? "*" : ""}
          </tspan>
        ))}
      </text>
    );
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full bg-white select-none ${className}`}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* --- GRID LINES (Gold) --- */}
      <g
        stroke={UREKHA_COLORS.goldPrimary}
        strokeWidth="0.4"
        fill="none"
        opacity="0.8"
      >
        {/* Outer Box */}
        <rect x="0.5" y="0.5" width="99" height="99" />

        {/* Diagonals */}
        <line x1="0" y1="0" x2="100" y2="100" />
        <line x1="100" y1="0" x2="0" y2="100" />

        {/* Inner Diamond (Midpoints) */}
        <path d="M50 0 L100 50 L50 100 L0 50 Z" />
      </g>

      {/* --- HOUSE DATA --- */}
      {HOUSE_CONFIG.map((pos) => {
        const houseNum = pos.id;
        const signNum = getSignForHouse(houseNum);
        const planets = getPlanetsInSign(signNum);

        return (
          <g key={houseNum}>
            {/* Sign Number (Corner) */}
            <text
              x={pos.signX}
              y={pos.signY}
              fontSize="5"
              fill={UREKHA_COLORS.inkMuted}
              opacity="0.8"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-sans font-bold"
            >
              {signNum}
            </text>

            {/* Planets (Smart Render) */}
            {renderPlanets(planets, pos.x, pos.y)}
          </g>
        );
      })}
    </svg>
  );
};

export default NorthIndianChart;
