import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Image,
} from "@react-pdf/renderer";
import { Language } from "@/types/languages";
import { resolveTranslations } from "@/lib/i18n";
import { lagnaTranslations } from "@/lib/i18n/lagna";
import { hindiFont, hindiBold } from "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- ELEGANT VEDIC MANUSCRIPT STYLING ---
const styles = StyleSheet.create({
  page: {
    paddingTop: pt(16),
    paddingBottom: pt(20),
    paddingHorizontal: pt(18),
    backgroundColor: "#FFFDF5", // Soft parchment/cream color
    fontFamily: "Times-Roman",
  },
  outerBorder: {
    position: "absolute",
    top: pt(10),
    left: pt(10),
    right: pt(10),
    bottom: pt(10),
    borderWidth: 1.5,
    borderColor: "#7B1818", // Deep Crimson
    borderRadius: 5,
    opacity: 0.9,
  },
  innerBorder: {
    position: "absolute",
    top: pt(12.5),
    left: pt(12.5),
    right: pt(12.5),
    bottom: pt(12.5),
    borderWidth: 0.5,
    borderColor: "#C5A059", // Rich Gold
    borderRadius: 5,
    opacity: 0.8,
  },
  // Header
  headerContainer: {
    alignItems: "center",
    marginTop: pt(6),
    marginBottom: pt(6),
  },
  headerTitle: {
    fontSize: 26,
    color: "#7B1818",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Times-Bold",
  },

  // Section 1: Top (Chart & Info)
  topSection: {
    flexDirection: "row",
    marginBottom: pt(4),
    borderBottomWidth: 0.5,
    borderBottomColor: "#C5A059",
    paddingBottom: pt(4),
  },
  chartBox: {
    width: pt(50),
    height: pt(50),
    borderWidth: 0.5,
    borderColor: "#C5A059",
    backgroundColor: "#FDFBF7",
    borderRadius: 4,
    overflow: "hidden", // Ensure chart doesn't spill over
    marginRight: pt(6),
  },
  chartImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  chartLabel: {
    fontSize: 8,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoCol: { flex: 1, justifyContent: "space-between" },
  ascLabel: {
    fontSize: 9,
    color: "#C5A059",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  ascTitle: {
    fontSize: 22,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    marginBottom: 6,
  },
  pillRow: { flexDirection: "row", marginBottom: 4, flexWrap: "wrap", gap: 6 },
  pill: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: "#FFFFFF",
  },
  pillLabel: {
    fontSize: 8,
    color: "#6B7280",
    marginRight: 4,
    textTransform: "uppercase",
  },
  pillValue: { fontSize: 8.5, color: "#111827", fontFamily: "Times-Bold" },
  quoteBox: {
    borderLeftWidth: 2,
    borderLeftColor: "#C5A059",
    paddingLeft: 8,
    marginTop: 6,
    marginBottom: 4,
  },
  quoteText: {
    fontSize: 10,
    color: "#4B5563",
    fontFamily: "Times-Italic",
    lineHeight: 1.4,
  },

  // Good Qualities Tags
  qualityTag: {
    backgroundColor: "#FCFAF5",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  qualityText: { fontSize: 8.5, color: "#7B1818", fontFamily: "Times-Bold" },

  // Section 2: Matrix
  matrixTitle: {
    fontSize: 12,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  matrixGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: pt(5),
  },
  matrixCard: {
    width: "23%",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 8,
    minHeight: 50,
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 8,
    color: "#6B7280",
    textTransform: "uppercase",
    fontFamily: "Times-Bold",
    marginBottom: 3,
  },
  cardValue: {
    fontSize: 10,
    color: "#111827",
    fontFamily: "Times-Bold",
    marginBottom: 2,
  },
  cardSub: { fontSize: 8, color: "#7B1818", fontFamily: "Times-Italic" },

  // Section 3: Mantra
  mantraBox: {
    backgroundColor: "#FDFBF7",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    marginBottom: pt(5),
  },
  mantraLabel: {
    fontSize: 9,
    color: "#C5A059",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  mantraText: {
    fontSize: 12,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textAlign: "center",
    lineHeight: 1.4,
  },

  // Section 4: Predictions
  predGrid: { flexDirection: "row", justifyContent: "space-between" },
  predCol: { width: "48%" },
  predTitle: {
    fontSize: 11,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
    paddingBottom: 4,
    marginBottom: 6,
  },
  predText: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: 1.6,
    textAlign: "justify",
  },

  footer: {
    position: "absolute",
    bottom: pt(15),
    left: pt(20),
    right: pt(20),
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#C5A059",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontFamily: "Times-Bold",
  },
});

// --- ORNATE DIVIDER ---
const OrnateHeadingDivider = () => (
  <View style={{ alignItems: "center", marginTop: 4, marginBottom: 8 }}>
    <Svg viewBox="0 0 300 30" style={{ width: pt(110), height: pt(11) }}>
      <Path d="M 0 15 L 105 15" stroke="#C5A059" strokeWidth="1" />
      <Circle cx="112" cy="15" r="1" fill="#C5A059" />
      <Circle cx="118" cy="15" r="1.5" fill="#C5A059" />
      <Circle cx="126" cy="15" r="2" fill="#C5A059" />

      <Path
        d="M135,15 Q150,0 165,15 Q150,30 135,15 Z"
        fill="none"
        stroke="#C5A059"
        strokeWidth="1"
      />

      <Path d="M150,4 L161,15 L150,26 L139,15 Z" fill="#7B1818" />
      <Path d="M150,8 L157,15 L150,22 L143,15 Z" fill="#C5A059" />
      <Circle cx="150" cy="15" r="1.5" fill="#FFFDF5" />

      <Circle cx="174" cy="15" r="2" fill="#C5A059" />
      <Circle cx="182" cy="15" r="1.5" fill="#C5A059" />
      <Circle cx="188" cy="15" r="1" fill="#C5A059" />
      <Path d="M 195 15 L 300 15" stroke="#C5A059" strokeWidth="1" />
    </Svg>
  </View>
);

const dummyData = {
  en: {
    ascendant: "Scorpio (Vrishchika)",
    symbol: "The Scorpion",
    zodiac_characteristics: "Fixed, Watery, Secretive",
    flagship_qualities:
      "Intense, passionate, fiercely loyal, deeply intuitive, and capable of profound transformation.",
    good_qualities: ["Determined", "Brave", "Loyal", "Intuitive"],
    ascendant_lord: "Mars (Mangal)",
    ascendant_lord_strength: "Strong",
    ascendant_lord_house_location: "10th",
    ascendant_lord_location: "Leo (Simha)",
    lucky_gem: "Red Coral",
    day_for_fasting: "Tuesday",
    gayatri_mantra:
      "Om Angarakaya Vidmahe, Shakti Hastaya Dhimahi, Tanno Bhaumah Prachodayat.",
    general_prediction:
      "You have a natural aura of mystery. People are drawn to your intensity, which often conceals deeply sensitive emotions. In all undertakings, your determination is your greatest asset. You do not easily detach from your goals. Emotionally, you seek profound connections rather than superficial ones.",
    personalised_prediction:
      "Currently, your Ascendant Lord's placement favors career elevation and decisive actions in your professional sphere. You may feel a surge of ambitions. Guard against unnecessary conflicts by channeling this dynamic energy into constructive leadership rather than domination.",
  },
  hi: {
    ascendant: "वृश्चिक",
    symbol: "बिच्छू",
    zodiac_characteristics: "स्थिर, जलीय, रहस्यमयी",
    flagship_qualities:
      "तीव्र, भावुक, अत्यंत वफादार, गहराई से समझने वाला, और गहन परिवर्तन में सक्षम।",
    good_qualities: ["दृढ़ संकल्पित", "बहादुर", "वफादार", "सहज"],
    ascendant_lord: "मंगल",
    ascendant_lord_strength: "मज़बूत",
    ascendant_lord_house_location: "10 वां",
    ascendant_lord_location: "सिंह",
    lucky_gem: "लाल मूंगा",
    day_for_fasting: "मंगलवार",
    gayatri_mantra:
      "ॐ अङ्गारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात्।",
    general_prediction:
      "आपके पास रहस्य की एक स्वाभाविक आभा है। लोग आपकी तीव्रता की ओर आकर्षित होते हैं, जो अक्सर गहराई से संवेदनशील भावनाओं को छुपाती है। सभी प्रयासों में, आपका दृढ़ संकल्प आपकी सबसे बड़ी संपत्ति है। आप आसानी से अपने लक्ष्यों से अलग नहीं होते हैं। भावनात्मक रूप से, आप सतही संबंधों के बजाय गहरे संबंधों की तलाश करते हैं।",
    personalised_prediction:
      "वर्तमान में, आपके लग्न स्वामी का स्थान आपके पेशेवर क्षेत्र में करियर के विकास और निर्णायक कार्यों के पक्ष में है। आप महत्वाकांक्षाओं में वृद्धि महसूस कर सकते हैं। इस गतिशील ऊर्जा को वर्चस्व के बजाय रचनात्मक नेतृत्व में लगाकर अनावश्यक संघर्षों से बचें।",
  },
};

export default function ReactPdfLagnaProfilePage({
  lang = "en",
  data: passedData,
  chartImage,
}: {
  lang?: Language;
  data?: any;
  chartImage?: string | null;
}) {
  const isHi = lang === "hi";
  const t = resolveTranslations(lagnaTranslations, lang);

  // Local font overrides for absolute consistency with other report pages
  const hindiFontOverride = isHi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBoldOverride = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  // Extract effectively whether it's an array for a single object
  const rawObj = Array.isArray(passedData) ? passedData[0] : passedData;

  const data =
    rawObj && Object.keys(rawObj).length > 0 ? rawObj : { good_qualities: "" };

  // Handle good_qualities as either array or comma-separated string
  let goodQualities: string[] = [];
  if (Array.isArray(data.good_qualities)) {
    goodQualities = data.good_qualities;
  } else if (typeof data.good_qualities === "string") {
    goodQualities = data.good_qualities
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  return (
    <Page size="A4" style={[styles.page, hindiFontOverride]}>
      {/* Borders */}
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      {/* Header */}
      <View style={styles.headerContainer} fixed>
        <Text
          style={[
            styles.headerTitle,
            hindiBoldOverride,
            { letterSpacing: isHi ? 0 : 2 },
          ]}
        >
          {isHi ? t.titleHi : t.titleEn}
        </Text>
        <OrnateHeadingDivider />
      </View>

      {/* 1. Identity & Chart */}
      <View style={styles.topSection}>
        <View style={styles.chartBox}>
          {chartImage ? (
            <Image src={chartImage} style={styles.chartImage} />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={[styles.chartLabel, hindiBoldOverride]}>
                {t.chartTitle}
              </Text>
              <Text
                style={[{ fontSize: 7, color: "#9CA3AF" }, hindiFontOverride]}
              >
                {isHi ? "[ लंबित चार्ट ]" : "[ Pending ]"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoCol}>
          <View>
            <Text style={[styles.ascLabel, isHi ? hindiBold : {}]}>
              {t.ascLabel}
            </Text>
            <Text style={[styles.ascTitle, isHi ? hindiBold : {}]}>
              {data.ascendant}
            </Text>
          </View>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={[styles.pillLabel, isHi ? hindiFont : {}]}>
                {isHi ? "प्रतीक:" : "Symbol:"}
              </Text>
              <Text style={[styles.pillValue, isHi ? hindiBold : {}]}>
                {data.symbol}
              </Text>
            </View>
            <View style={styles.pill}>
              <Text style={[styles.pillLabel, isHi ? hindiFont : {}]}>
                {isHi ? "प्रकृति:" : "Nature:"}
              </Text>
              <Text style={[styles.pillValue, isHi ? hindiBold : {}]}>
                {data.zodiac_characteristics}
              </Text>
            </View>
          </View>

          <View style={styles.quoteBox}>
            <Text style={[styles.quoteText, isHi ? hindiFont : {}]}>
              "{data.flagship_qualities}"
            </Text>
          </View>

          <View style={[styles.pillRow, { marginTop: 6 }]}>
            {goodQualities.map((q: string, i: number) => (
              <View key={i} style={styles.qualityTag}>
                <Text style={[styles.qualityText, isHi ? hindiBold : {}]}>
                  {q}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 2. Planetary Matrix */}
      <Text style={[styles.matrixTitle, isHi ? hindiBold : {}]}>
        {isHi ? "ग्रहीय मैट्रिक्स" : "Planetary Matrix"}
      </Text>
      <View style={styles.matrixGrid}>
        <View style={styles.matrixCard}>
          <Text style={[styles.cardLabel, isHi ? hindiBold : {}]}>
            {t.lordLabel}
          </Text>
          <Text style={[styles.cardValue, isHi ? hindiBold : {}]}>
            {data.ascendant_lord}
          </Text>
          <Text style={[styles.cardSub, isHi ? hindiFont : {}]}>
            {data.ascendant_lord_strength} {t.strengthLabel}
          </Text>
        </View>
        <View style={styles.matrixCard}>
          <Text style={[styles.cardLabel, isHi ? hindiBold : {}]}>
            {t.placementLabel}
          </Text>
          <Text style={[styles.cardValue, isHi ? hindiBold : {}]}>
            {data.ascendant_lord_house_location}
          </Text>
          <Text style={[styles.cardSub, isHi ? hindiFont : {}]}>
            {data.ascendant_lord_location}
          </Text>
        </View>
        <View style={styles.matrixCard}>
          <Text style={[styles.cardLabel, isHi ? hindiBold : {}]}>
            {t.gemLabel}
          </Text>
          <Text style={[styles.cardValue, isHi ? hindiBold : {}]}>
            {data.lucky_gem}
          </Text>
        </View>
        <View style={styles.matrixCard}>
          <Text style={[styles.cardLabel, isHi ? hindiBold : {}]}>
            {t.fastingLabel}
          </Text>
          <Text style={[styles.cardValue, isHi ? hindiBold : {}]}>
            {data.day_for_fasting}
          </Text>
        </View>
      </View>

      {/* 3. Mantra */}
      <View style={styles.mantraBox}>
        <Text style={[styles.mantraLabel, isHi ? hindiBold : {}]}>
          {t.mantraTitle}
        </Text>
        <Text style={[styles.mantraText, isHi ? hindiBold : {}]}>
          {data.gayatri_mantra}
        </Text>
      </View>

      {/* 4. Predictions */}
      <View style={styles.predGrid}>
        <View style={styles.predCol}>
          <Text style={[styles.predTitle, hindiBoldOverride]}>
            {t.generalPred}
          </Text>
          <Text style={[styles.predText, hindiFontOverride]}>
            {data.general_prediction}
          </Text>
        </View>
        <View style={styles.predCol}>
          <Text style={[styles.predTitle, hindiBoldOverride]}>
            {t.personalPred}
          </Text>
          <Text style={[styles.predText, hindiFontOverride]}>
            {data.personalised_prediction}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View fixed style={styles.footer}>
        <Text style={[styles.footerText, isHi ? hindiBold : {}]}>
          {isHi ? "युरेखा • वैदिक इंटेलिजेंस" : "UREKHA • VEDIC INTELLIGENCE"}
        </Text>
        <Text
          style={[
            styles.footerText,
            isHi ? hindiBold : {},
            { color: "#9CA3AF" },
          ]}
        >
          www.urekha.com
        </Text>
      </View>
    </Page>
  );
}
