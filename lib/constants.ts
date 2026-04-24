export type Stage = {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  themeColor: string; // Tailwind class or hex
  accentColor: string;
  imageUrl: string; // Static image path
  mode: "dark" | "light";
};

export const STAGES: Stage[] = [
  {
    id: 1,
    name: "BIRTH DATA",
    subtitle: "ASTROLOGICAL FOUNDATION",
    description:
      "Precise birth details form the foundation of accurate astrological analysis and life mapping.",
    themeColor: "brand-indigo",
    accentColor: "#000000",
    imageUrl: "/slide1.png",
    mode: "dark",
  },
  {
    id: 2,
    name: "INTELLIGENCE",
    subtitle: "ADVANCED INTERPRETATION",
    description:
      "Classical astrology systems are interpreted and structured using sophisticated analysis for clarity and depth.",
    themeColor: "brand-gold",
    accentColor: "#d4af37",
    imageUrl: "/slide2.png",
    mode: "dark",
  },
  {
    id: 3,
    name: "LIFE REPORT",
    subtitle: "COMPLETE BLUEPRINT",
    description:
      "A comprehensive, multi-chapter life report delivering structured insights across all major life dimensions.",
    themeColor: "brand-white",
    accentColor: "#ffffff",
    imageUrl: "/slide3.png",
    mode: "dark",
  },
];
