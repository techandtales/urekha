import type { TranslationMap } from "./types";

// ── Lagna Profile Page Translations ──

type LagnaKey =
  | "titleEn"
  | "titleHi"
  | "chartTitle"
  | "ascLabel"
  | "lordLabel"
  | "strengthLabel"
  | "placementLabel"
  | "gemLabel"
  | "fastingLabel"
  | "mantraTitle"
  | "generalPred"
  | "personalPred"
  | "house"
  | "loadingText";

export const lagnaTranslations: TranslationMap<LagnaKey> = {
  titleEn: {
    en: "Ascendant & Identity",
    hi: "Ascendant & Identity", // Kept English for the floral header prop
  },
  titleHi: {
    en: "लग्न और पहचान", // Kept Hindi for the floral header prop
    hi: "लग्न और पहचान",
  },
  chartTitle: {
    en: "Lagna Kundali (D1)",
    hi: "लग्न कुंडली (D1)",
  },
  ascLabel: {
    en: "Ascendant Sign",
    hi: "लग्न राशि",
  },
  lordLabel: {
    en: "Ascendant Lord",
    hi: "लग्नेश",
  },
  strengthLabel: {
    en: "Strength",
    hi: "बल",
  },
  placementLabel: {
    en: "Placement",
    hi: "स्थिति",
  },
  gemLabel: {
    en: "Lucky Gem",
    hi: "भाग्य रत्न",
  },
  fastingLabel: {
    en: "Fasting Day",
    hi: "उपवास",
  },
  mantraTitle: {
    en: "Vedic Mantra",
    hi: "वैदिक मंत्र",
  },
  generalPred: {
    en: "General Characteristics",
    hi: "सामान्य विशेषताएँ",
  },
  personalPred: {
    en: "Personal Insight",
    hi: "व्यक्तिगत अंतर्दृष्टि",
  },
  house: {
    en: "th House",
    hi: "वां भाव",
  },
  loadingText: {
    en: "Fetching Celestial Data...",
    hi: "डेटा लोड हो रहा है...",
  },
};
