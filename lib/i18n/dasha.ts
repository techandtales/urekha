import type { TranslationMap } from "./types";

// ── Vimshottari Dasha Page ──
type VimshottariKey =
  | "titleEn"
  | "titleHi"
  | "heading"
  | "subHeading"
  | "mahadasha"
  | "antardasha"
  | "paryantardasha"
  | "sookshma"
  | "prana"
  | "page2Heading"
  | "page2SubHeading"
  | "page3SubHeading"
  | "currentDashaChain"
  | "level"
  | "planet"
  | "start"
  | "end"
  | "calculatingDasha"
  | "calculatingSubPeriods"
  | "calculatingNano";

export const vimshottariTranslations: TranslationMap<VimshottariKey> = {
  titleEn: {
    en: "Vimshottari Dasha Analysis",
    hi: "Vimshottari Dasha Analysis",
  },
  titleHi: { en: "विंशोत्तरी दशा विश्लेषण", hi: "विंशोत्तरी दशा विश्लेषण" },
  heading: {
    en: "Vimshottari Mahadasha & Antardasha",
    hi: "विंशोत्तरी महादशा एवं अंतर्दशा",
  },
  subHeading: {
    en: "Detailed analysis of planetary periods (Dasha Hierarchy)",
    hi: "वर्तमान ग्रह दशाओं का विस्तृत विवरण",
  },
  mahadasha: { en: "Mahadasha (Major Period)", hi: "महादशा (Major Period)" },
  antardasha: {
    en: "Antardasha (Minor Period)",
    hi: "अंतर्दशा (Minor Period)",
  },
  paryantardasha: {
    en: "Paryantardasha (Sub-Minor)",
    hi: "प्रत्यंतर दशा (Sub-Minor)",
  },
  sookshma: {
    en: "Sookshma Dasha (Micro Period)",
    hi: "सूक्ष्म दशा (Micro Period)",
  },
  prana: { en: "Prana Dasha (Nano Period)", hi: "प्राण दशा (Nano Period)" },
  page2Heading: {
    en: "Paryantar & Sookshma Period",
    hi: "प्रत्यंतर और सूक्ष्म दशा",
  },
  page2SubHeading: {
    en: "Intermediate and Micro influence analysis",
    hi: "मध्यवर्ती एवं सूक्ष्म प्रभाव",
  },
  page3SubHeading: {
    en: "Detailed Nano-level time influence",
    hi: "अति-सूक्ष्म समय प्रभाव",
  },
  currentDashaChain: { en: "Current Dasha Chain", hi: "वर्तमान दशा क्रम" },
  level: { en: "Level", hi: "स्तर (Level)" },
  planet: { en: "Planet", hi: "ग्रह (Planet)" },
  start: { en: "Start", hi: "आरंभ (Start)" },
  end: { en: "End", hi: "समाप्ति (End)" },
  calculatingDasha: {
    en: "Calculating Dasha Cycles...",
    hi: "दशा चक्र की गणना हो रही है...",
  },
  calculatingSubPeriods: {
    en: "Calculating Sub-Periods...",
    hi: "उप-दशा की गणना हो रही है...",
  },
  calculatingNano: {
    en: "Calculating Nano-Periods...",
    hi: "सूक्ष्म-दशा की गणना हो रही है...",
  },
};

// Dasha chain row labels
export const DASHA_CHAIN_ROWS = [
  { key: "major", en: "Mahadasha", hi: "महादशा" },
  { key: "minor", en: "Antardasha", hi: "अंतर्दशा" },
  { key: "sub_minor", en: "Paryantar", hi: "प्रत्यंतर" },
  { key: "sub_sub_minor", en: "Sookshma", hi: "सूक्ष्म" },
  { key: "sub_sub_sub_minor", en: "Prana", hi: "प्राण" },
];

// ── Yogini Dasha Page ──
type YoginiKey =
  | "titleEn"
  | "titleHi"
  | "subtitleEn"
  | "subtitleHi"
  | "dasha"
  | "lord"
  | "end"
  | "start";

export const yoginiTranslations: TranslationMap<YoginiKey> = {
  titleEn: { en: "Yogini Dasha", hi: "Yogini Dasha" },
  titleHi: { en: "योगिनी दशा", hi: "योगिनी दशा" },
  subtitleEn: {
    en: "Planetary influence cycles based on Nakshatras",
    hi: "Planetary influence cycles based on Nakshatras",
  },
  subtitleHi: {
    en: "नक्षत्र आधारित ग्रह प्रभाव चक्र",
    hi: "नक्षत्र आधारित ग्रह प्रभाव चक्र",
  },
  dasha: { en: "Yogini Dasha", hi: "योगिनी दशा" },
  lord: { en: "Lord", hi: "स्वामी" },
  end: { en: "Ends On", hi: "कब तक (End Date)" },
  start: { en: "Start Date", hi: "आरंभ (Start)" },
};

// ── Dasha Table (shared sub-component) ──
type DashaTableKey = "planet" | "startDate" | "endDate";

export const dashaTableTranslations: TranslationMap<DashaTableKey> = {
  planet: { en: "Planet", hi: "ग्रह (Planet)" },
  startDate: { en: "Start Date", hi: "आरंभ (Start)" },
  endDate: { en: "End Date", hi: "समाप्ति (End)" },
};
