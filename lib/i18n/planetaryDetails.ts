import type { TranslationMap } from "./types";

// ── Planetary Details Page ──
type PlanetaryKey =
  | "title"
  | "subtitle"
  | "pName"
  | "house"
  | "sign"
  | "nakshatra"
  | "degree"
  | "lord"
  | "status"
  | "lucky"
  | "panchang"
  | "dasha"
  | "gem"
  | "color"
  | "num"
  | "letters"
  | "tithi"
  | "yoga"
  | "karana"
  | "day"
  | "loadingPlanets";

export const planetaryTranslations: TranslationMap<PlanetaryKey> = {
  title: { en: "Planetary Table", hi: "विस्तृत ग्रह तालिका" },
  subtitle: {
    en: "Natal Positions Detailed View",
    hi: "जन्मकालीन ग्रह स्थिति विवरण",
  },
  pName: { en: "Planet", hi: "ग्रह" },
  house: { en: "House", hi: "भाव" },
  sign: { en: "Sign", hi: "राशि" },
  nakshatra: { en: "Nakshatra (Pada)", hi: "नक्षत्र" },
  degree: { en: "Degree", hi: "अंश" },
  lord: { en: "Lord", hi: "स्वामी" },
  status: { en: "Avastha", hi: "अवस्था" },
  lucky: { en: "Lucky Elements", hi: "भाग्य कारक (Lucky Elements)" },
  panchang: { en: "Panchang Details", hi: "पंचांग विवरण" },
  dasha: { en: "Dasha Analysis", hi: "दशा विश्लेषण" },
  gem: { en: "Gem", hi: "रत्न" },
  color: { en: "Color", hi: "रंग" },
  num: { en: "Number", hi: "अंक" },
  letters: { en: "Letters", hi: "अक्षर" },
  tithi: { en: "Tithi", hi: "तिथि" },
  yoga: { en: "Yoga", hi: "योग" },
  karana: { en: "Karana", hi: "करण" },
  day: { en: "Day", hi: "वार" },
  loadingPlanets: {
    en: "Fetching Planetary Alignments...",
    hi: "ग्रह स्पष्ट लोड हो रहा है...",
  },
};

// ── Friendship Page ──
type FriendshipKey =
  | "titleEn"
  | "titleHi"
  | "permanent"
  | "temporary"
  | "fiveFold"
  | "planet"
  | "friend"
  | "neutral"
  | "enemy"
  | "intimate"
  | "bitter"
  | "loading";

export const friendshipTranslations: TranslationMap<FriendshipKey> = {
  titleEn: { en: "Planetary Relationships", hi: "Planetary Relationships" },
  titleHi: { en: "ग्रह मैत्री चक्र", hi: "ग्रह मैत्री चक्र" },
  permanent: {
    en: "Permanent Relationship (Naisargik)",
    hi: "नैसर्गिक मैत्री (स्थायी)",
  },
  temporary: {
    en: "Temporary Relationship (Tatkalik)",
    hi: "तात्कालिक मैत्री (अस्थायी)",
  },
  fiveFold: {
    en: "Five-Fold Friendship (Panchadha)",
    hi: "पंचधा मैत्री (समग्र)",
  },
  planet: { en: "Planet", hi: "ग्रह" },
  friend: { en: "Friend", hi: "मित्र" },
  neutral: { en: "Neutral", hi: "सम" },
  enemy: { en: "Enemy", hi: "शत्रु" },
  intimate: { en: "Best Friend", hi: "अधिमित्र" },
  bitter: { en: "Bitter Enemy", hi: "अधिशत्रु" },
  loading: {
    en: "Fetching Planetary Relationships...",
    hi: "ग्रह मैत्री चक्र लोड हो रहा है...",
  },
};

// ── Lagna Profile 2 (Architecture Page) ──
type LagnaArchKey =
  | "title"
  | "subtitle"
  | "house"
  | "empty"
  | "retro"
  | "ascendant"
  | "lordTitle"
  | "lordDesc"
  | "insightsTitle"
  | "placement"
  | "planet";

export const lagnaArchTranslations: TranslationMap<LagnaArchKey> = {
  title: { en: "Planetary Architecture", hi: "ग्रहीय वास्तुकला" },
  subtitle: {
    en: "House Positions & Lagna Analysis",
    hi: "भाव स्थिति एवं लग्नेश विश्लेषण",
  },
  house: { en: "House", hi: "भाव" },
  empty: { en: "Empty", hi: "रिक्त" },
  retro: { en: "Rx", hi: "वक्री" },
  ascendant: { en: "Ascendant", hi: "लग्न" },
  lordTitle: { en: "Lagna Lord Status", hi: "लग्नेश की स्थिति" },
  lordDesc: {
    en: "The primary ruler of your personality",
    hi: "आपके व्यक्तित्व का मुख्य शासक ग्रह",
  },
  insightsTitle: { en: "Basic Planetary Insights", hi: "मूलभूत ग्रह फल" },
  placement: { en: "Placement", hi: "स्थान" },
  planet: { en: "Planet", hi: "ग्रह" },
};
