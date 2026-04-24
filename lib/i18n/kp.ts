import type { TranslationMap } from "./types";

// ── KP Planets Page ──
type KpPlanetsKey =
  | "titleEn"
  | "titleHi"
  | "posTitle"
  | "posSubtitle"
  | "rulingTitle"
  | "rulingSubtitle"
  | "planet"
  | "sign"
  | "degree"
  | "nakshatra"
  | "nakLord"
  | "signLord"
  | "starLord"
  | "subLord"
  | "subSubLord"
  | "loading";

export const kpPlanetsTranslations: TranslationMap<KpPlanetsKey> = {
  titleEn: { en: "KP Planetary Details", hi: "KP Planetary Details" },
  titleHi: { en: "के.पी. ग्रह स्पष्ट", hi: "के.पी. ग्रह स्पष्ट" },
  posTitle: {
    en: "Planetary Positions & Nakshatra",
    hi: "ग्रह स्थिति एवं नक्षत्र",
  },
  posSubtitle: {
    en: "Detailed planetary longitudes and nakshatra positions",
    hi: "ग्रहों की स्पष्ट स्थिति एवं नक्षत्र विवरण",
  },
  rulingTitle: { en: "KP Ruling Lords Hierarchy", hi: "के.पी. शासक (लॉर्ड्स)" },
  rulingSubtitle: {
    en: "Planetary Rulerships as per KP System",
    hi: "कृष्णमूर्ति पद्धति अनुसार ग्रह शासक (लॉर्ड्स)",
  },
  planet: { en: "Planet", hi: "ग्रह" },
  sign: { en: "Sign", hi: "राशि" },
  degree: { en: "Degree (DMS)", hi: "अंश" },
  nakshatra: { en: "Nakshatra", hi: "नक्षत्र" },
  nakLord: { en: "Nak Lord", hi: "नक्षत्र स्वामी" },
  signLord: { en: "Sign Lord", hi: "राशि स्वामी" },
  starLord: { en: "Star Lord", hi: "नक्षत्र स्वामी" },
  subLord: { en: "Sub Lord", hi: "उप स्वामी" },
  subSubLord: { en: "Sub-Sub Lord", hi: "उप-उप स्वामी" },
  loading: {
    en: "Fetching KP Planetary Details...",
    hi: "के.पी. ग्रह स्पष्ट लोड हो रहा है...",
  },
};

// ── KP Houses Page ──
type KpHousesKey =
  | "titleEn"
  | "titleHi"
  | "posTitle"
  | "posSubtitle"
  | "rulingTitle"
  | "rulingSubtitle"
  | "house"
  | "sign"
  | "degree"
  | "nakshatra"
  | "nakLord"
  | "signLord"
  | "starLord"
  | "subLord"
  | "subSubLord"
  | "loading"
  | "housePrefix";

export const kpHousesTranslations: TranslationMap<KpHousesKey> = {
  titleEn: { en: "KP House Cusps", hi: "KP House Cusps" },
  titleHi: { en: "के.पी. भाव स्पष्ट", hi: "के.पी. भाव स्पष्ट" },
  posTitle: { en: "House Cusp Positions", hi: "भाव स्थिति एवं नक्षत्र" },
  posSubtitle: {
    en: "Precise longitudes of 12 Houses (Bhav Chalit) as per KP",
    hi: "द्वादश भावों की स्पष्ट स्थिति (KP System)",
  },
  rulingTitle: { en: "House Rulership Lords", hi: "भाव शासक (लॉर्ड्स)" },
  rulingSubtitle: {
    en: "Detailed Rulership of House Cusps (Sub-Lord Hierarchy)",
    hi: "भाव स्वामियों का विवरण (Sub-Lord Hierarchy)",
  },
  house: { en: "House", hi: "भाव" },
  sign: { en: "Sign", hi: "राशि" },
  degree: { en: "Degree (DMS)", hi: "अंश" },
  nakshatra: { en: "Nakshatra", hi: "नक्षत्र" },
  nakLord: { en: "Nak Lord", hi: "नक्षत्र स्वामी" },
  signLord: { en: "Sign Lord", hi: "राशि स्वामी" },
  starLord: { en: "Star Lord", hi: "नक्षत्र स्वामी" },
  subLord: { en: "Sub Lord", hi: "उप स्वामी" },
  subSubLord: { en: "Sub-Sub Lord", hi: "उप-उप स्वामी" },
  loading: { en: "Loading KP House Cusps...", hi: "लोड हो रहा है..." },
  housePrefix: { en: "House", hi: "भाव" },
};

// ── KP Significators Page ──
type KpSigKey =
  | "titleEn"
  | "titleHi"
  | "subtitleEn"
  | "subtitleHi"
  | "planetSection"
  | "houseSection"
  | "loading"
  | "housePrefix";

export const kpSignificatorsTranslations: TranslationMap<KpSigKey> = {
  titleEn: { en: "KP Significators", hi: "KP Significators" },
  titleHi: {
    en: "के.पी. कारक (Significators)",
    hi: "के.पी. कारक (Significators)",
  },
  subtitleEn: {
    en: "Planetary & House significations based on KP System",
    hi: "Planetary & House significations based on KP System",
  },
  subtitleHi: {
    en: "के.पी. पद्धति के अनुसार ग्रह और भाव कारक",
    hi: "के.पी. पद्धति के अनुसार ग्रह और भाव कारक",
  },
  planetSection: {
    en: "Houses Signified by Planets (Planet View)",
    hi: "ग्रह द्वारा कारित भाव (Cusps by Planet)",
  },
  houseSection: {
    en: "Planets Signifying Houses (House View)",
    hi: "भाव के कार्येश ग्रह (Planets by Cusp)",
  },
  loading: { en: "Loading KP Significators...", hi: "लोड हो रहा है..." },
  housePrefix: { en: "House", hi: "भाव" },
};
