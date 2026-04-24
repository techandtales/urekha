import type { TranslationMap } from "./types";

// ── Dosha Report Page ──
type DoshaKey =
  | "titleEn"
  | "titleHi"
  | "subtitleEn"
  | "subtitleHi"
  | "present"
  | "absent"
  | "low"
  | "remedies"
  | "effects"
  | "factors"
  | "mangalDosha"
  | "pitraDosha"
  | "kaalSarpDosha"
  | "status"
  | "intensity"
  | "manglikAnalysis"
  | "otherContributors"
  | "pitraDetail"
  | "kaalSarpRemedies"
  | "kaalSarpAbsent"
  | "calculatingDoshas";

export const doshaTranslations: TranslationMap<DoshaKey> = {
  titleEn: { en: "Dosha Analysis", hi: "Dosha Analysis" },
  titleHi: { en: "दोष विश्लेषण", hi: "दोष विश्लेषण" },
  subtitleEn: {
    en: "Identify potential obstructions and their remedies",
    hi: "Identify potential obstructions and their remedies",
  },
  subtitleHi: {
    en: "कुंडली के मुख्य दोष और उनके उपाय",
    hi: "कुंडली के मुख्य दोष और उनके उपाय",
  },
  present: { en: "Present", hi: "उपस्थित (Present)" },
  absent: { en: "Absent", hi: "नहीं (Absent)" },
  low: { en: "Partial", hi: "आंशिक (Partial)" },
  remedies: { en: "Suggested Remedies", hi: "सुझाए गए उपाय" },
  effects: { en: "Potential Effects", hi: "संभावित प्रभाव" },
  factors: { en: "Planetary Factors", hi: "कारक ग्रह स्थिति" },
  mangalDosha: { en: "Mangal Dosha", hi: "मंगल दोष" },
  pitraDosha: { en: "Pitra Dosha", hi: "पितृ दोष" },
  kaalSarpDosha: { en: "Kaal Sarp Dosha", hi: "काल सर्प दोष" },
  status: { en: "Status", hi: "स्थिति" },
  intensity: { en: "Intensity", hi: "तीव्रता" },
  manglikAnalysis: { en: "Manglik Analysis", hi: "मांगलिक विश्लेषण" },
  otherContributors: { en: "Other Contributors", hi: "अन्य प्रभाव" },
  pitraDetail: {
    en: "Pitra Dosha: Effects & Remedies",
    hi: "पितृ दोष: प्रभाव एवं उपाय",
  },
  kaalSarpRemedies: { en: "Kaal Sarp Remedies", hi: "काल सर्प उपाय" },
  kaalSarpAbsent: {
    en: "No Kaal Sarp Dosha detected in the horoscope.",
    hi: "काल सर्प दोष उपस्थित नहीं है।",
  },
  calculatingDoshas: {
    en: "Calculating Doshas...",
    hi: "दोष की गणना हो रही है...",
  },
};
