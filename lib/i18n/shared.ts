import type { TranslationMap } from "./types";

/**
 * ═══════════════════════════════════════════════════════════
 *  Shared translation maps used across multiple pages.
 *  Planet names, zodiac signs, and common UI labels.
 * ═══════════════════════════════════════════════════════════
 */

// ── Planet name translations (used in Dasha, KP, Friendship, etc.) ──
export const PLANET_NAMES_HI: Record<string, string> = {
  Sun: "सूर्य",
  Moon: "चंद्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
  Rahu: "राहु",
  Ketu: "केतु",
  Uranus: "अरुण",
  Neptune: "वरुण",
  Pluto: "यम",
  Ascendant: "लग्न",
  "Rahu/Ketu": "राहु/केतु",
};

// Extended planet map (used in KP pages — includes Moon as चंद्रमा)
export const PLANET_NAMES_KP_HI: Record<string, string> = {
  ...PLANET_NAMES_HI,
  Moon: "चंद्रमा", // KP uses full form
};

// ── Zodiac sign translations ──
export const SIGN_NAMES_HI: Record<string, string> = {
  Aries: "मेष",
  Taurus: "वृषभ",
  Gemini: "मिथुन",
  Cancer: "कर्क",
  Leo: "सिंह",
  Virgo: "कन्या",
  Libra: "तुला",
  Scorpio: "वृश्चिक",
  Sagittarius: "धनु",
  Capricorn: "मकर",
  Aquarius: "कुम्भ",
  Pisces: "मीन",
};

// ── Yogini Dasha names ──
export const YOGINI_NAMES_HI: Record<string, string> = {
  Bhadrika: "भद्रिका",
  Ulka: "उल्का",
  Siddha: "सिद्धा",
  Sankata: "संकटा",
  Mangala: "मंगला",
  Pingala: "पिंगला",
  Dhanya: "धान्या",
  Bhramari: "भ्रामरी",
};

/**
 * Translate a name using a Hindi lookup map.
 * Falls back to the original text if no translation found or if lang is "en".
 */
export function translateName(
  text: string,
  lang: string,
  ...maps: Record<string, string>[]
): string {
  if (lang !== "hi" || !text) return text;
  for (const map of maps) {
    if (map[text]) return map[text];
  }
  return text;
}

// ── Common UI labels used across many pages ──
type CommonKey =
  | "planet"
  | "house"
  | "sign"
  | "status"
  | "loading"
  | "loadingGeneric";

export const commonTranslations: TranslationMap<CommonKey> = {
  planet: { en: "Planet", hi: "ग्रह" },
  house: { en: "House", hi: "भाव" },
  sign: { en: "Sign", hi: "राशि" },
  status: { en: "Status", hi: "स्थिति" },
  loading: { en: "Loading...", hi: "लोड हो रहा है..." },
  loadingGeneric: { en: "Loading data...", hi: "डेटा लोड हो रहा है..." },
};
