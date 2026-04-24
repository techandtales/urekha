/**
 * ════════════════════════════════════════════════════════════
 *  📌  Centralized i18n — Barrel Export
 * ════════════════════════════════════════════════════════════
 *
 *  All translation files are organized per page/feature.
 *  Import everything from "@/lib/i18n" for convenience.
 *
 *  🔹 Adding a new language:
 *    1. Update Language type in `newtypes/languages.d.ts`
 *    2. Add the new language key to every TranslationEntry
 *
 *  🔹 Adding translations for a new page:
 *    1. Create `lib/i18n/<pageName>.ts`
 *    2. Define translations using TranslationMap<YourKeys>
 *    3. Re-export from this file
 *    4. Use in component:
 *       const t = resolveTranslations(myTranslations, lang as Language);
 * ════════════════════════════════════════════════════════════
 */

// ── Core types & helper ──
export { resolveTranslations } from "./types";
export type { TranslationEntry, TranslationMap } from "./types";

// ── Shared maps (Planet names, Zodiac signs, common labels) ──
export {
  PLANET_NAMES_HI,
  PLANET_NAMES_KP_HI,
  SIGN_NAMES_HI,
  YOGINI_NAMES_HI,
  translateName,
  commonTranslations,
} from "./shared";

// ── Lagna Profile ──
export { lagnaTranslations } from "./lagna";

// ── Divisional Charts ──
export {
  PAGE_1_CHARTS,
  OTHER_CHARTS,
  CHART_DETAILS,
  divisionalChartsTranslations,
  TRANSIT_DESCRIPTION,
  TRANSIT_EXPLANATION,
} from "./divisionalCharts";
export type { ChartDef } from "./divisionalCharts";

// ── Dasha (Vimshottari, Yogini, DashaTable) ──
export {
  vimshottariTranslations,
  yoginiTranslations,
  dashaTableTranslations,
  DASHA_CHAIN_ROWS,
} from "./dasha";

// ── Birth Details, Panchang, Report Guide ──
export {
  birthDetailsTranslations,
  panchangTranslations,
  reportGuideTranslations,
  GLOSSARY_TERMS,
} from "./birthDetails";

// ── Dosha Report ──
export { doshaTranslations } from "./dosha";

// ── Planetary Details, Friendship, Lagna Architecture ──
export {
  planetaryTranslations,
  friendshipTranslations,
  lagnaArchTranslations,
} from "./planetaryDetails";

// ── KP Astrology (Planets, Houses, Significators) ──
export {
  kpPlanetsTranslations,
  kpHousesTranslations,
  kpSignificatorsTranslations,
} from "./kp";
