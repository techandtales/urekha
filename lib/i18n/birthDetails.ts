import type { TranslationMap } from "./types";

// ── Birth Details Page ──
type BirthDetailsKey =
  | "title"
  | "username"
  | "date"
  | "time"
  | "place"
  | "lat"
  | "long"
  | "tz"
  | "disclaimer";

export const birthDetailsTranslations: TranslationMap<BirthDetailsKey> = {
  title: { en: "Birth Data", hi: "जन्म विवरण" },
  username: { en: "Username", hi: "उपयोगकर्ता नाम" },
  date: { en: "Date of Birth", hi: "जन्म तिथि" },
  time: { en: "Time of Birth", hi: "जन्म समय" },
  place: { en: "Place of Birth", hi: "जन्म स्थान" },
  lat: { en: "Latitude", hi: "अक्षांश" },
  long: { en: "Longitude", hi: "देशांतर" },
  tz: { en: "Time Zone", hi: "समय क्षेत्र" },
  disclaimer: {
    en: "All astrological calculations and analyses in this document are strictly based on the birth details provided above. Please ensure the accuracy of this data.",
    hi: "इस दस्तावेज़ में सभी ज्योतिषीय गणनाएँ और विश्लेषण ऊपर दिए गए जन्म विवरण पर ही आधारित हैं। कृपया डेटा की सटीकता सुनिश्चित करें।",
  },
};

// ── Panchang Section ──
type PanchangKey =
  | "panchang"
  | "attributes"
  | "signs"
  | "gems"
  | "tithi"
  | "yoga"
  | "karana"
  | "nakshatra"
  | "pada"
  | "lord"
  | "gana"
  | "yoni"
  | "nadi"
  | "varna"
  | "vasya"
  | "paya"
  | "tatva"
  | "name"
  | "asc"
  | "moon"
  | "sun"
  | "lStone"
  | "lkStone"
  | "fStone";

export const panchangTranslations: TranslationMap<PanchangKey> = {
  // Section titles
  panchang: { en: "Panchang Elements", hi: "पंचांग तत्व" },
  attributes: { en: "Vedic Attributes", hi: "वैदिक गुण (अवकहड़ा)" },
  signs: { en: "Planetary Signs", hi: "ग्रहीय राशियाँ" },
  gems: { en: "Lucky Gemstones", hi: "भाग्य रत्न" },
  // Panchang labels
  tithi: { en: "Tithi", hi: "तिथि" },
  yoga: { en: "Yoga", hi: "योग" },
  karana: { en: "Karana", hi: "करण" },
  nakshatra: { en: "Nakshatra", hi: "नक्षत्र" },
  pada: { en: "Pada", hi: "चरण" },
  lord: { en: "Lord", hi: "स्वामी" },
  // Vedic attributes
  gana: { en: "Gana", hi: "गण" },
  yoni: { en: "Yoni", hi: "योनि" },
  nadi: { en: "Nadi", hi: "नाड़ी" },
  varna: { en: "Varna", hi: "वर्ण" },
  vasya: { en: "Vasya", hi: "वश्य" },
  paya: { en: "Paya", hi: "पाया" },
  tatva: { en: "Tatva", hi: "तत्व" },
  name: { en: "Name Letters", hi: "नामाक्षर" },
  // Signs
  asc: { en: "Ascendant", hi: "लग्न राशि" },
  moon: { en: "Moon Sign", hi: "चंद्र राशि" },
  sun: { en: "Sun Sign", hi: "सूर्य राशि" },
  // Gems
  lStone: { en: "Life Stone", hi: "जीवन रत्न" },
  lkStone: { en: "Lucky Stone", hi: "भाग्य रत्न" },
  fStone: { en: "Fortune Stone", hi: "उन्नति रत्न" },
};

// ── Report Guide Page ──
type ReportGuideKey =
  | "header"
  | "intro"
  | "secPanchang"
  | "secIdentity"
  | "secAttr";

export const reportGuideTranslations: TranslationMap<ReportGuideKey> = {
  header: { en: "Report Guide", hi: "रिपोर्ट निर्देशिका" },
  intro: {
    en: "A concise guide to understanding the astrological terms used in this report.",
    hi: "इस रिपोर्ट में उपयोग किए गए ज्योतिषीय शब्दों को समझने के लिए संक्षिप्त मार्गदर्शिका।",
  },
  secPanchang: {
    en: "Panchang (Elements of Time)",
    hi: "पंचांग (समय के तत्व)",
  },
  secIdentity: { en: "Identity (Elements of Self)", hi: "पहचान (आत्म तत्व)" },
  secAttr: { en: "Attributes (Elements of Nature)", hi: "गुण (स्वभाव तत्व)" },
};

// Glossary terms for Report Guide (structured data, not TranslationMap)
export const GLOSSARY_TERMS = {
  panchang: [
    {
      en: "Tithi",
      hi: "तिथि (Tithi)",
      descEn: "Lunar Day. Determines mental state and relationships.",
      descHi: "यह मानसिक स्थिति और संबंधों को निर्धारित करती है।",
    },
    {
      en: "Nakshatra",
      hi: "नक्षत्र (Nakshatra)",
      descEn:
        "Constellation. The star indicating your mind's focus and emotional nature.",
      descHi:
        "वह तारा समूह जो आपके मन के फोकस और भावनात्मक स्वभाव को दर्शाता है।",
    },
    {
      en: "Yoga",
      hi: "योग (Yoga)",
      descEn: "Union of Sun & Moon. Indicates luck and connection capability.",
      descHi:
        "सूर्य और चंद्रमा का मिलन। यह भाग्य और जुड़ने की क्षमता को दर्शाता है।",
    },
    {
      en: "Karana",
      hi: "करण (Karana)",
      descEn: "Half of a Tithi. Shows work capacity and professional success.",
      descHi: "तिथि का आधा भाग। यह कार्य क्षमता और पेशेवर सफलता को दिखाता है।",
    },
    {
      en: "Vaara",
      hi: "वार (Vaara)",
      descEn: "Day of Week. Indicates physical vitality and fire energy.",
      descHi: "सप्ताह का दिन। यह शारीरिक जीवन शक्ति और ऊर्जा को दर्शाता है।",
    },
  ],
  identity: [
    {
      en: "Lagna (Ascendant)",
      hi: "लग्न (Ascendant)",
      descEn: "The Rising Sign. Represents Self, Body, and Personality.",
      descHi:
        "उदित राशि। यह स्वयं, शरीर और व्यक्तित्व का प्रतिनिधित्व करती है।",
    },
    {
      en: "Rashi (Moon Sign)",
      hi: "चंद्र राशि (Moon Sign)",
      descEn: "Where Moon is placed. Represents emotions and perception.",
      descHi:
        "जहां चंद्रमा स्थित है। यह भावनाओं और धारणा का प्रतिनिधित्व करता है।",
    },
    {
      en: "Sun Sign",
      hi: "सूर्य राशि (Sun Sign)",
      descEn: "Where Sun is placed. Represents Soul, ego, and father.",
      descHi:
        "जहां सूर्य स्थित है। यह आत्मा, अहंकार और पिता का प्रतिनिधित्व करता है।",
    },
  ],
  attributes: [
    {
      en: "Gana",
      hi: "गण (Gana)",
      descEn: "Nature. Shows temperament (Divine, Human, or Demon-like).",
      descHi: "स्वभाव। यह आपके व्यवहार (देव, मनुष्य, या राक्षस) को दिखाता है।",
    },
    {
      en: "Yoni",
      hi: "योनि (Yoni)",
      descEn: "Animal Symbol. Indicates instinctive nature and compatibility.",
      descHi: "पशु प्रतीक। यह सहज स्वभाव और अनुकूलता को इंगित करता है।",
    },
    {
      en: "Nadi",
      hi: "नाड़ी (Nadi)",
      descEn: "Pulse/Health. Indicates physiological constitution and health.",
      descHi: "शारीरिक गठन और स्वास्थ्य का सूचक।",
    },
  ],
};
