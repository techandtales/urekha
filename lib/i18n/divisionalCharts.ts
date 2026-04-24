import type { TranslationMap } from "./types";

// ── Divisional Charts Page Translations ──

// Chart definition: title per chart per language
export interface ChartDef {
  id: string;
  title: Record<string, string>; // keyed by Language code
}

// Page 1: The "Big Three"
export const PAGE_1_CHARTS: ChartDef[] = [
  { id: "D1", title: { en: "Lagna Chart (D1)", hi: "लग्न कुंडली (D1)" } },
  { id: "D9", title: { en: "Navamsa Chart (D9)", hi: "नवमांश कुंडली (D9)" } },
  { id: "moon", title: { en: "Moon Chart (Chandra)", hi: "चंद्र कुंडली" } },
];

// Subsequent Pages
export const OTHER_CHARTS: ChartDef[] = [
  { id: "D3", title: { en: "Drekkana (D3)", hi: "द्रेष्काण (D3)" } },
  { id: "D4", title: { en: "Chaturthamsha (D4)", hi: "चतुर्थांश (D4)" } },
  { id: "D7", title: { en: "Saptamsha (D7)", hi: "सप्तमांश (D7)" } },
  { id: "D10", title: { en: "Dashamsha (D10)", hi: "दशमांश (D10)" } },
  { id: "D12", title: { en: "Dwadashamsha (D12)", hi: "द्वादशांश (D12)" } },
  { id: "D16", title: { en: "Shodashamsha (D16)", hi: "षोडशांश (D16)" } },
  { id: "D20", title: { en: "Vimshamsha (D20)", hi: "विंशामश (D20)" } },
  {
    id: "D24",
    title: { en: "Chaturvimshamsha (D24)", hi: "चतुर्विंशामश (D24)" },
  },
  { id: "D30", title: { en: "Trimshamsha (D30)", hi: "त्रिंशांश (D30)" } },
  { id: "D60", title: { en: "Shashtiamsha (D60)", hi: "षष्टियांश (D60)" } },
  { id: "sun", title: { en: "Sun Chart (Surya)", hi: "सूर्य कुंडली" } },
  { id: "chalit", title: { en: "Bhav Chalit", hi: "भाव चलित" } },
  { id: "D6", title: { en: "Shasthamsa (D6)", hi: "षष्ठांश (D6)" } },
  { id: "D8", title: { en: "Ashtamsha (D8)", hi: "अष्टमांश (D8)" } },
  {
    id: "D27",
    title: { en: "Saptavimshamsha (D27)", hi: "सप्तविंशामश (D27)" },
  },
];

// Static chart details (purpose & basic info for each chart)
export const CHART_DETAILS: Record<string, Record<string, string>> = {
  D1: {
    en: "The Lagna (D1) chart is the most fundamental chart in Vedic Astrology. It represents the overall life blueprint — personality, health, physical appearance, temperament, and the general direction of one's destiny. All other divisional charts are derived from this root chart.",
    hi: "लग्न (D1) कुंडली वैदिक ज्योतिष की सबसे मूलभूत कुंडली है। यह समग्र जीवन का खाका प्रस्तुत करती है — व्यक्तित्व, स्वास्थ्य, शारीरिक रूप, स्वभाव और भाग्य की सामान्य दिशा। अन्य सभी वर्ग कुंडलियाँ इसी मूल कुंडली से व्युत्पन्न होती हैं।",
  },
  D9: {
    en: "The Navamsa (D9) chart is the second most important chart. It reveals the strength of planets, married life, spouse characteristics, spiritual inclination, and the inner fortune (Dharma). It is essential for confirming planetary promises seen in the D1 chart.",
    hi: "नवमांश (D9) कुंडली दूसरी सबसे महत्वपूर्ण कुंडली है। यह ग्रहों की शक्ति, वैवाहिक जीवन, जीवनसाथी के गुण, आध्यात्मिक झुकाव और आंतरिक भाग्य (धर्म) को प्रकट करती है। D1 कुंडली में दिखाई देने वाले ग्रह वादों की पुष्टि के लिए यह आवश्यक है।",
  },
  moon: {
    en: "The Moon (Chandra) chart is cast with the Moon sign as the ascendant. It reveals the emotional landscape, mental tendencies, intuition, and how one perceives the world internally. It is vital for analyzing the mind, mother, and overall emotional well-being.",
    hi: "चंद्र कुंडली में चंद्र राशि को लग्न के रूप में रखा जाता है। यह भावनात्मक परिदृश्य, मानसिक प्रवृत्तियों, अंतर्ज्ञान और व्यक्ति आंतरिक रूप से दुनिया को कैसे देखता है, यह प्रकट करती है। मन, माता और समग्र भावनात्मक कल्याण के विश्लेषण के लिए यह महत्वपूर्ण है।",
  },
  D3: {
    en: "Drekkana (D3) is used to analyze siblings, courage, valor, short journeys, and communication abilities. It also indicates the native's initiative and self-effort in life.",
    hi: "द्रेष्काण (D3) भाई-बहनों, साहस, वीरता, छोटी यात्राओं और संवाद क्षमताओं के विश्लेषण के लिए उपयोग किया जाता है। यह जातक की पहल और आत्म-प्रयास को भी दर्शाता है।",
  },
  D4: {
    en: "Chaturthamsha (D4) governs fixed assets — property, land, vehicles, and overall fortune related to immovable possessions and domestic happiness.",
    hi: "चतुर्थांश (D4) स्थिर संपत्ति — भूमि, संपत्ति, वाहन और अचल संपत्ति से संबंधित समग्र भाग्य तथा घरेलू सुख को नियंत्रित करता है।",
  },
  D6: {
    en: "Shasthamsa (D6) is analyzed for health issues, diseases, debts, enemies, and obstacles. It helps identify vulnerability to specific ailments and legal disputes.",
    hi: "षष्ठांश (D6) स्वास्थ्य समस्याओं, रोगों, ऋणों, शत्रुओं और बाधाओं के विश्लेषण के लिए देखा जाता है। यह विशिष्ट बीमारियों और कानूनी विवादों की संभावना की पहचान में सहायक है।",
  },
  D7: {
    en: "Saptamsha (D7) is the chart of progeny and children. It reveals the number of children, their nature, and the overall happiness derived from offspring.",
    hi: "सप्तमांश (D7) संतान और बच्चों की कुंडली है। यह बच्चों की संख्या, उनके स्वभाव और संतान से प्राप्त समग्र सुख को प्रकट करती है।",
  },
  D8: {
    en: "Ashtamsha (D8) deals with sudden events, longevity, accidents, inheritance, and unexpected transformations in life. It is crucial for timing unforeseen changes.",
    hi: "अष्टमांश (D8) अचानक होने वाली घटनाओं, आयु, दुर्घटनाओं, विरासत और जीवन में अप्रत्याशित परिवर्तनों से संबंधित है। अप्रत्याशित बदलावों के समय निर्धारण के लिए यह महत्वपूर्ण है।",
  },
  D10: {
    en: "Dashamsha (D10) is the career and profession chart. It shows professional achievements, fame, authority, and the nature of one's livelihood and public reputation.",
    hi: "दशमांश (D10) करियर और पेशे की कुंडली है। यह पेशेवर उपलब्धियों, प्रसिद्धि, अधिकार और आजीविका तथा सार्वजनिक प्रतिष्ठा की प्रकृति को दर्शाता है।",
  },
  D12: {
    en: "Dwadashamsha (D12) represents parents and ancestral lineage. It provides insight into the relationship with parents, ancestral blessings, and karmic inheritance.",
    hi: "द्वादशांश (D12) माता-पिता और पैतृक वंश का प्रतिनिधित्व करता है। यह माता-पिता के साथ संबंध, पैतृक आशीर्वाद और कार्मिक विरासत की जानकारी प्रदान करता है।",
  },
  D16: {
    en: "Shodashamsha (D16) relates to vehicles, comforts, luxuries, and pleasures in life. It indicates the native's access to material happiness and conveyances.",
    hi: "षोडशांश (D16) वाहनों, सुख-सुविधाओं, विलासिता और जीवन के आनंद से संबंधित है। यह जातक की भौतिक सुख और वाहनों तक पहुंच को दर्शाता है।",
  },
  D20: {
    en: "Vimshamsha (D20) is the chart of spiritual progress, religious inclination, meditation practices, and devotion. It reveals one's spiritual evolution across lifetimes.",
    hi: "विंशामश (D20) आध्यात्मिक प्रगति, धार्मिक झुकाव, ध्यान अभ्यास और भक्ति की कुंडली है। यह जन्मों-जन्मों की आध्यात्मिक विकास यात्रा को प्रकट करती है।",
  },
  D24: {
    en: "Chaturvimshamsha (D24) governs education, learning, academic achievements, and knowledge acquisition. It shows areas of intellectual strength and scholarly pursuits.",
    hi: "चतुर्विंशामश (D24) शिक्षा, अध्ययन, शैक्षणिक उपलब्धियों और ज्ञान अर्जन को नियंत्रित करता है। यह बौद्धिक शक्ति और विद्वत्तापूर्ण अनुसंधान के क्षेत्रों को दर्शाता है।",
  },
  D27: {
    en: "Saptavimshamsha (D27) indicates physical strength, stamina, and vitality. It is used to assess constitutional robustness and inherent physical capabilities.",
    hi: "सप्तविंशामश (D27) शारीरिक शक्ति, सहनशक्ति और जीवन-शक्ति को दर्शाता है। यह शारीरिक मजबूती और जन्मजात शारीरिक क्षमताओं के आकलन के लिए उपयोग किया जाता है।",
  },
  D30: {
    en: "Trimshamsha (D30) is analyzed for misfortunes, evils, and negative karma. It reveals hidden challenges, moral struggles, and areas where one may face adversity.",
    hi: "त्रिंशांश (D30) दुर्भाग्य, बुराइयों और नकारात्मक कर्म के विश्लेषण के लिए देखा जाता है। यह छिपी चुनौतियों, नैतिक संघर्षों और प्रतिकूलता के क्षेत्रों को प्रकट करता है।",
  },
  D60: {
    en: "Shashtiamsha (D60) is the most granular divisional chart. It captures past-life karma and is said to fine-tune all predictions. It is the ultimate confirmation chart for advanced analysis.",
    hi: "षष्टियांश (D60) सबसे सूक्ष्म वर्ग कुंडली है। यह पूर्व जन्म के कर्मों को दर्शाती है और सभी भविष्यवाणियों को परिष्कृत करती है। उन्नत विश्लेषण के लिए यह अंतिम पुष्टि कुंडली है।",
  },
  sun: {
    en: "The Sun (Surya) chart places the Sun sign as the ascendant. It reveals the soul's purpose, father's influence, authority, government connections, and one's inherent vitality and leadership.",
    hi: "सूर्य कुंडली में सूर्य राशि को लग्न के रूप में रखा जाता है। यह आत्मा का उद्देश्य, पिता का प्रभाव, अधिकार, सरकारी संबंध और जन्मजात जीवन-शक्ति व नेतृत्व को प्रकट करती है।",
  },
  chalit: {
    en: "Bhav Chalit chart shows the actual house positions of planets based on the mid-point (Bhav Madhya) system. It is essential for determining which house a planet truly influences, often differing from the Rasi chart.",
    hi: "भाव चलित कुंडली भाव मध्य प्रणाली के आधार पर ग्रहों की वास्तविक भाव स्थिति दर्शाती है। यह निर्धारित करने के लिए आवश्यक है कि कोई ग्रह वास्तव में किस भाव को प्रभावित करता है, जो अक्सर राशि कुंडली से भिन्न होता है।",
  },
};

// General UI labels for the divisional charts pages
type DivisionalChartsKey =
  | "coreVedicTitle_en"
  | "coreVedicTitle_hi"
  | "divisionalPartTitle_en"
  | "divisionalPartTitle_hi"
  | "transitTitle_en"
  | "transitTitle_hi"
  | "loadingCharts"
  | "aboutPrefix"
  | "aboutPrefixHi"
  | "transitInsight"
  | "transitInsightHi"
  | "transitTimestamp"
  | "transitTimestampHi"
  | "transitLoading"
  | "transitUnavailable"
  | "chartDetailsUnavailable";

export const divisionalChartsTranslations: TranslationMap<DivisionalChartsKey> =
  {
    coreVedicTitle_en: {
      en: "Core Vedic Charts",
      hi: "Core Vedic Charts",
    },
    coreVedicTitle_hi: {
      en: "प्रमुख कुंडलियाँ",
      hi: "प्रमुख कुंडलियाँ",
    },
    divisionalPartTitle_en: {
      en: "Divisional Charts",
      hi: "Divisional Charts",
    },
    divisionalPartTitle_hi: {
      en: "अन्य कुंडलियाँ",
      hi: "अन्य कुंडलियाँ",
    },
    transitTitle_en: {
      en: "Transit Chart (Gochar Kundli)",
      hi: "Transit Chart (Gochar Kundli)",
    },
    transitTitle_hi: {
      en: "गोचर कुंडली",
      hi: "गोचर कुंडली",
    },
    loadingCharts: {
      en: "Loading Divisional Charts...",
      hi: "कुंडलियाँ लोड हो रही हैं...",
    },
    aboutPrefix: {
      en: "About",
      hi: "About",
    },
    aboutPrefixHi: {
      en: "के बारे में",
      hi: "के बारे में",
    },
    transitInsight: {
      en: "Your Personal Transit Insight",
      hi: "आपका गोचर विश्लेषण",
    },
    transitInsightHi: {
      en: "आपका गोचर विश्लेषण",
      hi: "आपका गोचर विश्लेषण",
    },
    transitTimestamp: {
      en: "Current Positions",
      hi: "वर्तमान स्थिति",
    },
    transitTimestampHi: {
      en: "वर्तमान स्थिति",
      hi: "वर्तमान स्थिति",
    },
    transitLoading: {
      en: "Fetching live positions...",
      hi: "गोचर लोड हो रहा है...",
    },
    transitUnavailable: {
      en: "Unavailable",
      hi: "उपलब्ध नहीं",
    },
    chartDetailsUnavailable: {
      en: "Details for this chart are not available.",
      hi: "इस कुंडली का विवरण उपलब्ध नहीं है।",
    },
  };

// Transit chart static description
export const TRANSIT_DESCRIPTION: Record<string, string> = {
  en: "The current planetary transits are actively shaping multiple dimensions of your life. Jupiter's transit house brings expansion and opportunity; Saturn demands patience, hard work, and structural reinforcement where it sits. The Rahu–Ketu axis illuminates the karmic lesson you are navigating in this life chapter. Compare this chart with your natal chart — the houses activated in both simultaneously are your most significant focal areas right now. Use this chart as a living compass, updated with each passing moment.",
  hi: "गोचर ग्रहों की वर्तमान स्थिति आपके जीवन के विभिन्न आयामों पर सक्रिय प्रभाव डाल रही है। बृहस्पति जिस भाव से गुजर रहा है वहाँ विस्तार और शुभता आती है; शनि जहाँ बैठा है वहाँ परिश्रम और अनुशासन की माँग है। राहु-केतु का अक्ष कर्मिक पाठों को उजागर करता है। इस कुंडली को अपनी जन्म कुंडली के साथ मिलाकर देखें — जो भाव दोनों में सक्रिय हैं, वे अभी जीवन के सबसे महत्वपूर्ण क्षेत्र हैं।",
};

// What is a transit chart? — explanatory text
export const TRANSIT_EXPLANATION: Record<string, string> = {
  en: "A Transit Chart (Gochar Kundli) captures the real-time positions of all planets in the sky at this very moment. By overlaying these live positions onto your birth chart, astrologers can gauge which areas of your life are currently activated, challenged, or blessed. Transits of slow-moving planets (Jupiter, Saturn, Rahu/Ketu) create long-lasting themes, while faster planets (Moon, Mercury, Venus) trigger day-to-day events.",
  hi: "गोचर कुंडली (Transit Chart) इस क्षण आकाश में सभी ग्रहों की वास्तविक स्थिति को दर्शाती है। इन जीवित स्थितियों को आपकी जन्म कुंडली पर आरोपित करके, ज्योतिषी यह आकलन कर सकते हैं कि आपके जीवन के कौन से क्षेत्र वर्तमान में सक्रिय, चुनौतीपूर्ण या आशीर्वादित हैं। धीमी गति से चलने वाले ग्रहों (बृहस्पति, शनि, राहु/केतु) के गोचर दीर्घकालिक विषय बनाते हैं, जबकि तेज ग्रह (चंद्र, बुध, शुक्र) दैनिक घटनाओं को प्रेरित करते हैं।",
};
