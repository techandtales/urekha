import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Font,
} from "@react-pdf/renderer";
import { Language } from "@/types/languages";
import { resolveTranslations, planetaryTranslations } from "@/lib/i18n";

// Register custom fonts
import "@/components/pdf/pdfFontRegistry";

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
  headerSubtitle: {
    fontSize: 10,
    color: "#C5A059",
    fontFamily: "Times-Italic",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Top Cards (Lucky & Panchang)
  topGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: pt(4),
  },
  infoCard: {
    width: "48.5%",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    overflow: "hidden",
  },
  infoCardHeader: {
    backgroundColor: "#FCFAF5",
    padding: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#C5A059",
    alignItems: "center",
  },
  infoCardTitle: {
    fontSize: 10,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoCardBody: { padding: 6 },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
  },
  dataLabel: { fontSize: 9, color: "#4B5563", fontFamily: "Times-Roman" },
  dataValue: { fontSize: 9.5, color: "#111827", fontFamily: "Times-Bold" },

  // Dasha Strip
  dashaStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FDFBF7",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: pt(5),
  },
  dashaBox: { alignItems: "flex-start" },
  dashaBoxRight: { alignItems: "flex-end" },
  dashaLabel: {
    fontSize: 8,
    color: "#7B1818",
    textTransform: "uppercase",
    fontFamily: "Times-Bold",
    marginBottom: 2,
  },
  dashaValue: { fontSize: 14, color: "#111827", fontFamily: "Times-Bold" },
  dashaArrow: { fontSize: 14, color: "#C5A059" },

  // Grid / Table
  tableContainer: {
    borderWidth: 0.5,
    borderColor: "#C5A059",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#FCFAF5",
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableColHeader: {
    flex: 1,
    fontSize: 8.5,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  tableColHeaderPlanet: {
    flex: 1.5,
    fontSize: 8.5,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textAlign: "left",
    paddingLeft: 8,
    textTransform: "uppercase",
  },

  tableRowEven: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  tableRowOdd: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  tableRowLagna: {
    flexDirection: "row",
    backgroundColor: "#FFF7ED",
    borderBottomWidth: 1,
    borderBottomColor: "#FDBA74",
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
  },

  tableCol: { flex: 1, fontSize: 9.5, color: "#374151", textAlign: "center" },
  tableColPlanet: {
    flex: 1.5,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Times-Bold",
    paddingLeft: 8,
  },
  tableColNakshatra: {
    flex: 1.5,
    fontSize: 9.5,
    color: "#374151",
    textAlign: "center",
    fontFamily: "Times-Bold",
  },

  tagBox: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: "#FDFBF7",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#C5A059",
    alignSelf: "center",
  },
  tagText: {
    fontSize: 7.5,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
  },
  combustText: {
    fontSize: 7,
    color: "#DC2626",
    fontFamily: "Times-Italic",
    marginTop: 2,
    textAlign: "center",
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
  <View style={{ alignItems: "center", marginTop: 4, marginBottom: 4 }}>
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
    panchang: {
      tithi: "Krishna Panchami",
      yoga: "Harshana",
      karana: "Taitila",
      day_of_birth: "Tuesday",
    },
    lucky_gem: ["Red Coral", "Yellow Sapphire"],
    lucky_colors: ["Red", "Orange", "Yellow"],
    lucky_num: ["9", "18", "27"],
    lucky_letters: ["A", "H", "K"],
    current_dasa: "Jupiter - Mars",
    current_dasa_time: "15 Oct 2026",
    planets: [
      {
        name: "As",
        full_name: "Ascendant",
        zodiac: "Sco",
        house: "1",
        nakshatra: "Jyeshtha",
        nakshatra_pada: 1,
        local_degree: 15.5,
        zodiac_lord: "Mars",
        basic_avastha: "Active",
        is_combust: false,
      },
      {
        name: "Su",
        full_name: "Sun",
        zodiac: "Leo",
        house: "10",
        nakshatra: "Magha",
        nakshatra_pada: 2,
        local_degree: 5.2,
        zodiac_lord: "Sun",
        basic_avastha: "Active",
        is_combust: false,
      },
      {
        name: "Mo",
        full_name: "Moon",
        zodiac: "Ari",
        house: "6",
        nakshatra: "Ashwini",
        nakshatra_pada: 3,
        local_degree: 12.8,
        zodiac_lord: "Mars",
        basic_avastha: "Active",
        is_combust: false,
      },
      {
        name: "Ma",
        full_name: "Mars",
        zodiac: "Leo",
        house: "10",
        nakshatra: "Magha",
        nakshatra_pada: 4,
        local_degree: 8.9,
        zodiac_lord: "Sun",
        basic_avastha: "Active",
        is_combust: false,
      },
      {
        name: "Me",
        full_name: "Mercury",
        zodiac: "Can",
        house: "9",
        nakshatra: "Pushya",
        nakshatra_pada: 1,
        local_degree: 28.1,
        zodiac_lord: "Moon",
        basic_avastha: "Active",
        is_combust: true,
      },
      {
        name: "Ju",
        full_name: "Jupiter",
        zodiac: "Cap",
        house: "3",
        nakshatra: "Shravan",
        nakshatra_pada: 2,
        local_degree: 16.4,
        zodiac_lord: "Saturn",
        basic_avastha: "Debilitated",
        is_combust: false,
      },
      {
        name: "Ve",
        full_name: "Venus",
        zodiac: "Vir",
        house: "11",
        nakshatra: "Chitra",
        nakshatra_pada: 3,
        local_degree: 4.5,
        zodiac_lord: "Mercury",
        basic_avastha: "Active",
        is_combust: false,
      },
      {
        name: "Sa",
        full_name: "Saturn",
        zodiac: "Aqu",
        house: "4",
        nakshatra: "Shatabhisha",
        nakshatra_pada: 4,
        local_degree: 22.2,
        zodiac_lord: "Saturn",
        basic_avastha: "Active",
        is_combust: false,
      },
      {
        name: "Ra",
        full_name: "Rahu",
        zodiac: "Tau",
        house: "7",
        nakshatra: "Rohini",
        nakshatra_pada: 1,
        local_degree: 10.1,
        zodiac_lord: "Venus",
        basic_avastha: "Active",
        is_combust: false,
      },
      {
        name: "Ke",
        full_name: "Ketu",
        zodiac: "Sco",
        house: "1",
        nakshatra: "Jyeshtha",
        nakshatra_pada: 3,
        local_degree: 10.1,
        zodiac_lord: "Mars",
        basic_avastha: "Active",
        is_combust: false,
      },
    ],
  },
  hi: {
    panchang: {
      tithi: "कृष्ण पंचमी",
      yoga: "हर्षण",
      karana: "तैतिल",
      day_of_birth: "मंगलवार",
    },
    lucky_gem: ["लाल मूंगा", "पीला नीलम"],
    lucky_colors: ["लाल", "नारंगी", "पीला"],
    lucky_num: ["9", "18", "27"],
    lucky_letters: ["अ", "ह", "क"],
    current_dasa: "गुरु - मंगल",
    current_dasa_time: "15 अक्टूबर 2026",
    planets: [
      {
        name: "Л",
        full_name: "लग्न",
        zodiac: "वृश्चिक",
        house: "1",
        nakshatra: "ज्येष्ठा",
        nakshatra_pada: 1,
        local_degree: 15.5,
        zodiac_lord: "मंगल",
        basic_avastha: "सक्रिय",
        is_combust: false,
      },
      {
        name: "सू",
        full_name: "सूर्य",
        zodiac: "सिंह",
        house: "10",
        nakshatra: "मघा",
        nakshatra_pada: 2,
        local_degree: 5.2,
        zodiac_lord: "सूर्य",
        basic_avastha: "सक्रिय",
        is_combust: false,
      },
      {
        name: "चं",
        full_name: "चंद्र",
        zodiac: "मेष",
        house: "6",
        nakshatra: "अश्विनी",
        nakshatra_pada: 3,
        local_degree: 12.8,
        zodiac_lord: "मंगल",
        basic_avastha: "सक्रिय",
        is_combust: false,
      },
      {
        name: "मं",
        full_name: "मंगल",
        zodiac: "सिंह",
        house: "10",
        nakshatra: "मघा",
        nakshatra_pada: 4,
        local_degree: 8.9,
        zodiac_lord: "सूर्य",
        basic_avastha: "सक्रिय",
        is_combust: false,
      },
      {
        name: "बु",
        full_name: "बुध",
        zodiac: "कर्क",
        house: "9",
        nakshatra: "पुष्य",
        nakshatra_pada: 1,
        local_degree: 28.1,
        zodiac_lord: "चंद्र",
        basic_avastha: "सक्रिय",
        is_combust: true,
      },
      {
        name: "गु",
        full_name: "बृहस्पति",
        zodiac: "मकर",
        house: "3",
        nakshatra: "श्रवण",
        nakshatra_pada: 2,
        local_degree: 16.4,
        zodiac_lord: "शनि",
        basic_avastha: "नीच",
        is_combust: false,
      },
      {
        name: "शु",
        full_name: "शुक्र",
        zodiac: "कन्या",
        house: "11",
        nakshatra: "चित्रा",
        nakshatra_pada: 3,
        local_degree: 4.5,
        zodiac_lord: "बुध",
        basic_avastha: "सक्रिय",
        is_combust: false,
      },
      {
        name: "श",
        full_name: "शनि",
        zodiac: "कुंभ",
        house: "4",
        nakshatra: "शतभिषा",
        nakshatra_pada: 4,
        local_degree: 22.2,
        zodiac_lord: "शनि",
        basic_avastha: "सक्रिय",
        is_combust: false,
      },
      {
        name: "रा",
        full_name: "राहु",
        zodiac: "वृषभ",
        house: "7",
        nakshatra: "रोहिणी",
        nakshatra_pada: 1,
        local_degree: 10.1,
        zodiac_lord: "शुक्र",
        basic_avastha: "सक्रिय",
        is_combust: false,
      },
      {
        name: "के",
        full_name: "केतु",
        zodiac: "वृश्चिक",
        house: "1",
        nakshatra: "ज्येष्ठा",
        nakshatra_pada: 3,
        local_degree: 10.1,
        zodiac_lord: "मंगल",
        basic_avastha: "सक्रिय",
        is_combust: false,
      },
    ],
  },
};

const DataRow = ({
  label,
  value,
  hindiFont,
}: {
  label: string;
  value: string;
  hindiFont?: any;
}) => (
  <View style={styles.dataRow}>
    <Text style={[styles.dataLabel, hindiFont]}>{label}</Text>
    <Text style={[styles.dataValue, hindiFont]}>{value}</Text>
  </View>
);

export default function ReactPdfPlanetaryDetailsPage({
  lang = "en",
  data: passedData,
}: {
  lang?: Language;
  data?: any;
}) {
  const isHi = lang === "hi";
  const t = resolveTranslations(planetaryTranslations, lang);

  // Hindi font override
  const hindiFont = isHi ? { fontFamily: "NotoSansDevanagari" as const } : {};
  const hindiBold = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  let parsedPlanets: any[] = [];
  if (passedData) {
    for (let i = 0; i <= 9; i++) {
      if (passedData[i.toString()]) {
        parsedPlanets.push(passedData[i.toString()]);
      }
    }
  }

  const data =
    passedData && Object.keys(passedData).length > 0
      ? { ...passedData, planets: parsedPlanets }
      : { panchang: {}, planets: [] };

  const safePanchang = data.panchang || {};

  const getPlanetRowStyle = (index: number, isLagna: boolean) => {
    if (isLagna) return styles.tableRowLagna;
    return index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd;
  };

  return (
    <Page size="A4" style={[styles.page, hindiFont]}>
      {/* Borders */}
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      {/* Header */}
      <View style={styles.headerContainer} fixed>
        <Text
          style={[
            styles.headerTitle,
            hindiBold,
            { letterSpacing: isHi ? 0 : 2 },
          ]}
        >
          {isHi
            ? "\u0935\u093F\u0938\u094D\u0924\u0943\u0924 \u0917\u094D\u0930\u0939 \u0924\u093E\u0932\u093F\u0915\u093E"
            : "Planetary Table"}
        </Text>
        <OrnateHeadingDivider />
        <Text style={[styles.headerSubtitle, hindiFont]}>{t.subtitle}</Text>
      </View>

      {/* Top Cards */}
      <View style={styles.topGrid}>
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Text style={[styles.infoCardTitle, hindiBold]}>{t.lucky}</Text>
          </View>
          <View style={styles.infoCardBody}>
            <DataRow
              label={t.gem}
              value={data.lucky_gem?.join(", ") || "-"}
              hindiFont={hindiFont}
            />
            <DataRow
              label={t.color}
              value={data.lucky_colors?.join(", ") || "-"}
              hindiFont={hindiFont}
            />
            <DataRow
              label={t.num}
              value={data.lucky_num?.join(", ") || "-"}
              hindiFont={hindiFont}
            />
            <DataRow
              label={t.letters}
              value={data.lucky_letters?.join(", ") || "-"}
              hindiFont={hindiFont}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Text style={[styles.infoCardTitle, hindiBold]}>{t.panchang}</Text>
          </View>
          <View style={styles.infoCardBody}>
            <DataRow
              label={t.tithi}
              value={safePanchang.tithi || "-"}
              hindiFont={hindiFont}
            />
            <DataRow
              label={t.yoga}
              value={safePanchang.yoga || "-"}
              hindiFont={hindiFont}
            />
            <DataRow
              label={t.karana}
              value={safePanchang.karana || "-"}
              hindiFont={hindiFont}
            />
            <DataRow
              label={t.day}
              value={safePanchang.day_of_birth || "-"}
              hindiFont={hindiFont}
            />
          </View>
        </View>
      </View>

      {/* Dasha Strip */}
      <View style={styles.dashaStrip}>
        <View style={styles.dashaBox}>
          <Text style={[styles.dashaLabel, hindiBold]}>
            {t.dasha} (Current)
          </Text>
          <Text style={[styles.dashaValue, hindiBold]}>
            {data.current_dasa}
          </Text>
        </View>
        <Text style={styles.dashaArrow}>{"\u27F7"}</Text>
        <View style={styles.dashaBoxRight}>
          <Text style={[styles.dashaLabel, hindiBold]}>Ends On</Text>
          <Text style={[styles.dashaValue, hindiBold]}>
            {data.current_dasa_time}
          </Text>
        </View>
      </View>

      {/* Main Table / Grid */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableColHeaderPlanet, hindiBold]}>
            {t.pName}
          </Text>
          <Text style={[styles.tableColHeader, hindiBold]}>{t.sign}</Text>
          <Text style={[styles.tableColHeader, hindiBold]}>{t.house}</Text>
          <Text style={[styles.tableColHeader, hindiBold, { flex: 1.5 }]}>
            {t.nakshatra}
          </Text>
          <Text style={[styles.tableColHeader, hindiBold]}>{t.degree}</Text>
          <Text style={[styles.tableColHeader, hindiBold]}>{t.lord}</Text>
          <Text style={[styles.tableColHeader, hindiBold]}>{t.status}</Text>
        </View>

        {data.planets.map((p: any, i: number) => {
          const isLagna = i === 0; // The Ascendant
          return (
            <View key={i} style={getPlanetRowStyle(i, isLagna)}>
              <Text style={[styles.tableColPlanet, hindiBold]}>
                {isLagna ? `\u2727 ${p.full_name}` : p.full_name}
              </Text>
              <Text style={[styles.tableCol, hindiFont]}>{p.zodiac}</Text>
              <Text style={[styles.tableCol, hindiBold]}>{p.house}</Text>
              <Text style={[styles.tableColNakshatra, hindiFont]}>
                {p.nakshatra}{" "}
                <Text style={{ fontSize: 7, color: "#9CA3AF" }}>
                  ({p.nakshatra_pada})
                </Text>
              </Text>
              <Text style={[styles.tableCol, hindiFont, { color: "#6B7280" }]}>
                {(p.local_degree ?? 0).toFixed(2)}
                {"\u00B0"}
              </Text>
              <Text style={[styles.tableCol, hindiFont]}>{p.zodiac_lord}</Text>

              <View style={[styles.tableCol, { alignItems: "center" }]}>
                <View
                  style={[
                    styles.tagBox,
                    isLagna
                      ? { backgroundColor: "#FFF1F2", borderColor: "#FECDD3" }
                      : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      hindiFont,
                      isLagna ? { color: "#BE123C" } : {},
                    ]}
                  >
                    {p.basic_avastha}
                  </Text>
                </View>
                {p.is_combust && (
                  <Text style={[styles.combustText, hindiFont]}>(Combust)</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View fixed style={styles.footer}>
        <Text style={[styles.footerText, hindiFont]}>
          {isHi
            ? "\u092F\u0941\u0930\u0947\u0916\u093E \u2022 \u0935\u0948\u0926\u093F\u0915 \u0907\u0902\u091F\u0947\u0932\u093F\u091C\u0947\u0902\u0938"
            : "UREKHA \u2022 VEDIC INTELLIGENCE"}
        </Text>
        <Text style={[styles.footerText, { color: "#9CA3AF" }]}>
          www.urekha.com
        </Text>
      </View>
    </Page>
  );
}
