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
import { KPCuspDetail as KpCusp } from "@/types/kpAstrology/kpCuspsDetails";
import {
  resolveTranslations,
  kpHousesTranslations,
  PLANET_NAMES_KP_HI,
  SIGN_NAMES_HI,
  translateName,
} from "@/lib/i18n";
import { Language } from "@/types/languages";

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
  headerContainer: {
    alignItems: "center",
    marginTop: pt(6),
    marginBottom: pt(4),
  },
  headerTitle: {
    fontSize: 26,
    color: "#7B1818",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Times-Bold",
  },

  // Elegant Section Heading
  headingSection: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C5A059",
    paddingBottom: pt(3),
    marginBottom: pt(5),
  },
  iconBox: {
    padding: pt(2),
    backgroundColor: "#FCFAF5",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 4,
    marginRight: pt(3),
  },
  headingTitle: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  headingSubtitle: {
    fontSize: 10,
    color: "#4B5563",
    fontFamily: "Times-Italic",
  },

  // Grid / Table Styling
  tableContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#FCFAF5",
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
  },
  tableHeaderCell: {
    paddingVertical: pt(3),
    paddingHorizontal: pt(2),
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableHeaderCellBorder: {
    borderRightWidth: 0.5,
    borderRightColor: "#C5A059",
    backgroundColor: "#FDFBF7",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#FFFFFF",
  },
  tableRowOdd: {
    backgroundColor: "#FAFAFA",
  },
  tableCell: {
    paddingVertical: pt(3),
    paddingHorizontal: pt(2),
    fontSize: 10,
    color: "#374151",
    fontFamily: "Times-Roman",
  },
  tableCellBold: {
    color: "#111827",
    fontFamily: "Times-Bold",
  },
  tableCellBorder: {
    borderRightWidth: 0.5,
    borderRightColor: "#E5E7EB",
    backgroundColor: "#FDFBF7", // Slight tint to House column
  },
  tableCellRedBold: {
    color: "#7B1818", // Crimson for SubLord
    fontFamily: "Times-Bold",
  },
  tableCellGoldBold: {
    color: "#C5A059", // Gold for Nakshatra Lord
    fontFamily: "Times-Bold",
  },

  // Footer
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

const CompassIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#7B1818" }}>
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke="#7B1818"
      fill="none"
      strokeWidth={1.5}
    />
    <Path
      d="M16.24 7.76 L14.12 14.12 L7.76 16.24 L9.88 9.88 Z"
      stroke="#C5A059"
      fill="none"
      strokeWidth={1.5}
    />
  </Svg>
);

const GitMergeIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#7B1818" }}>
    <Circle
      cx="18"
      cy="18"
      r="3"
      stroke="#C5A059"
      fill="none"
      strokeWidth={1.5}
    />
    <Circle
      cx="6"
      cy="6"
      r="3"
      stroke="#C5A059"
      fill="none"
      strokeWidth={1.5}
    />
    <Path
      d="M6 21 V 9 C 6 12 8 18 15 18"
      stroke="#7B1818"
      fill="none"
      strokeWidth={1.5}
    />
  </Svg>
);

const decimalToDMS = (deg: number | undefined): string => {
  if (deg === undefined) return "-";
  const signDeg = deg % 30;
  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  const s = Math.floor(((signDeg - d) * 60 - m) * 60);
  return `${d.toString().padStart(2, "0")}° ${m.toString().padStart(2, "0")}' ${s.toString().padStart(2, "0")}"`;
};

interface ReactPdfKpHousesPageProps {
  lang: Language;
  houses?: KpCusp[];
}

export default function ReactPdfKpHousesPage({
  lang,
  houses = [],
}: ReactPdfKpHousesPageProps) {
  const isHi = lang === "hi";
  const t = resolveTranslations(kpHousesTranslations, lang);
  const title = isHi ? t.titleHi : t.titleEn;

  // Hindi font override
  const hindiFont = isHi ? { fontFamily: "NotoSansDevanagari" as const } : {};
  const hindiBold = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  const tr = (text: string) =>
    translateName(text, lang, PLANET_NAMES_KP_HI, SIGN_NAMES_HI);

  const defaultDummyHouses: KpCusp[] = [
    {
      house: 1,
      sign: "Scorpio",
      degree: 15.42,
      nakshatra: "Jyeshtha",
      nakshatraLord: "Mercury",
      signLord: "Mars",
      subLord: "Mars",
      subSubLord: "Venus",
    },
    {
      house: 2,
      sign: "Sagittarius",
      degree: 14.28,
      nakshatra: "Purva Ashadha",
      nakshatraLord: "Venus",
      signLord: "Jupiter",
      subLord: "Saturn",
      subSubLord: "Jupiter",
    },
    {
      house: 3,
      sign: "Capricorn",
      degree: 16.55,
      nakshatra: "Shravana",
      nakshatraLord: "Moon",
      signLord: "Saturn",
      subLord: "Jupiter",
      subSubLord: "Mercury",
    },
    {
      house: 4,
      sign: "Aquarius",
      degree: 19.12,
      nakshatra: "Shatabhisha",
      nakshatraLord: "Rahu",
      signLord: "Saturn",
      subLord: "Jupiter",
      subSubLord: "Saturn",
    },
    {
      house: 5,
      sign: "Pisces",
      degree: 18.45,
      nakshatra: "Revati",
      nakshatraLord: "Mercury",
      signLord: "Jupiter",
      subLord: "Mercury",
      subSubLord: "Moon",
    },
    {
      house: 6,
      sign: "Aries",
      degree: 15.55,
      nakshatra: "Bharani",
      nakshatraLord: "Venus",
      signLord: "Mars",
      subLord: "Sun",
      subSubLord: "Venus",
    },
    {
      house: 7,
      sign: "Taurus",
      degree: 15.42,
      nakshatra: "Rohini",
      nakshatraLord: "Moon",
      signLord: "Venus",
      subLord: "Jupiter",
      subSubLord: "Mars",
    },
    {
      house: 8,
      sign: "Gemini",
      degree: 14.28,
      nakshatra: "Ardra",
      nakshatraLord: "Rahu",
      signLord: "Mercury",
      subLord: "Mercury",
      subSubLord: "Rahu",
    },
    {
      house: 9,
      sign: "Cancer",
      degree: 16.55,
      nakshatra: "Pushya",
      nakshatraLord: "Saturn",
      signLord: "Moon",
      subLord: "Jupiter",
      subSubLord: "Saturn",
    },
    {
      house: 10,
      sign: "Leo",
      degree: 19.12,
      nakshatra: "Purva Phalguni",
      nakshatraLord: "Venus",
      signLord: "Sun",
      subLord: "Rahu",
      subSubLord: "Mercury",
    },
    {
      house: 11,
      sign: "Virgo",
      degree: 18.45,
      nakshatra: "Hasta",
      nakshatraLord: "Moon",
      signLord: "Mercury",
      subLord: "Mercury",
      subSubLord: "Jupiter",
    },
    {
      house: 12,
      sign: "Libra",
      degree: 15.55,
      nakshatra: "Swati",
      nakshatraLord: "Rahu",
      signLord: "Venus",
      subLord: "Venus",
      subSubLord: "Mercury",
    },
  ];

  const dataToRender = houses && houses.length > 0 ? houses : [];

  return (
    <>
      {/* PAGE 1: POSITIONS */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <View fixed style={styles.outerBorder} />
        <View fixed style={styles.innerBorder} />

        <View style={styles.headerContainer} fixed>
          <Text
            style={[
              styles.headerTitle,
              hindiBold,
              { letterSpacing: isHi ? 0 : 2 },
            ]}
          >
            {title}
          </Text>
          <OrnateHeadingDivider />
        </View>

        <View style={styles.headingSection}>
          <View style={styles.iconBox}>
            <CompassIcon />
          </View>
          <View>
            <Text style={[styles.headingTitle, hindiBold]}>{t.posTitle}</Text>
            <Text style={[styles.headingSubtitle, hindiFont]}>
              {t.posSubtitle}
            </Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text
              style={[
                styles.tableHeaderCell,
                styles.tableHeaderCellBorder,
                hindiBold,
                { width: "16%" },
              ]}
            >
              {t.house}
            </Text>
            <Text style={[styles.tableHeaderCell, hindiBold, { width: "20%" }]}>
              {t.sign}
            </Text>
            <Text style={[styles.tableHeaderCell, hindiBold, { width: "24%" }]}>
              {t.degree}
            </Text>
            <Text style={[styles.tableHeaderCell, hindiBold, { width: "22%" }]}>
              {t.nakshatra}
            </Text>
            <Text style={[styles.tableHeaderCell, hindiBold, { width: "18%" }]}>
              {t.nakLord}
            </Text>
          </View>

          {dataToRender.map((row, i) => (
            <View
              key={`house-pos-${i}`}
              style={[
                styles.tableRow,
                i % 2 !== 0 ? styles.tableRowEven : styles.tableRowOdd,
                i === dataToRender.length - 1 ? { borderBottomWidth: 0 } : {},
              ]}
            >
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellBold,
                  styles.tableCellBorder,
                  hindiBold,
                  { width: "16%" },
                ]}
              >
                {isHi ? `${t.housePrefix} ${row.house}` : `House ${row.house}`}
              </Text>
              <Text style={[styles.tableCell, hindiFont, { width: "20%" }]}>
                {tr(row.sign)}
              </Text>
              <Text style={[styles.tableCell, hindiFont, { width: "24%" }]}>
                {decimalToDMS(row.degree)}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellBold,
                  hindiBold,
                  { width: "22%" },
                ]}
              >
                {row.nakshatra}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellGoldBold,
                  hindiBold,
                  { width: "18%" },
                ]}
              >
                {tr(row.nakshatraLord)}
              </Text>
            </View>
          ))}
        </View>

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

      {/* PAGE 2: KP LORDS */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <View fixed style={styles.outerBorder} />
        <View fixed style={styles.innerBorder} />

        <View style={styles.headerContainer} fixed>
          <Text
            style={[
              styles.headerTitle,
              hindiBold,
              { letterSpacing: isHi ? 0 : 2 },
            ]}
          >
            {title}
          </Text>
          <OrnateHeadingDivider />
        </View>

        <View style={styles.headingSection}>
          <View style={styles.iconBox}>
            <GitMergeIcon />
          </View>
          <View>
            <Text style={[styles.headingTitle, hindiBold]}>
              {t.rulingTitle}
            </Text>
            <Text style={[styles.headingSubtitle, hindiFont]}>
              {isHi
                ? "\u092D\u093E\u0935 \u0938\u094D\u0935\u093E\u092E\u093F\u092F\u094B\u0902 \u0915\u093E \u0935\u093F\u0935\u0930\u0923 (Sub-Lord Hierarchy)"
                : "Detailed Rulership of House Cusps (Sub-Lord Hierarchy)"}
            </Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text
              style={[
                styles.tableHeaderCell,
                styles.tableHeaderCellBorder,
                hindiBold,
                { width: "16%" },
              ]}
            >
              {t.house}
            </Text>
            <Text style={[styles.tableHeaderCell, hindiBold, { width: "21%" }]}>
              {t.signLord}
            </Text>
            <Text style={[styles.tableHeaderCell, hindiBold, { width: "21%" }]}>
              {t.starLord}
            </Text>
            <Text style={[styles.tableHeaderCell, hindiBold, { width: "21%" }]}>
              {t.subLord}
            </Text>
            <Text style={[styles.tableHeaderCell, hindiBold, { width: "21%" }]}>
              {t.subSubLord}
            </Text>
          </View>

          {dataToRender.map((row, i) => (
            <View
              key={`house-rul-${i}`}
              style={[
                styles.tableRow,
                i % 2 !== 0 ? styles.tableRowEven : styles.tableRowOdd,
                i === dataToRender.length - 1 ? { borderBottomWidth: 0 } : {},
              ]}
            >
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellBold,
                  styles.tableCellBorder,
                  hindiBold,
                  { width: "16%" },
                ]}
              >
                {isHi ? `${t.housePrefix} ${row.house}` : `House ${row.house}`}
              </Text>
              <Text style={[styles.tableCell, hindiFont, { width: "21%" }]}>
                {tr(row.signLord)}
              </Text>
              <Text style={[styles.tableCell, hindiFont, { width: "21%" }]}>
                {tr(row.nakshatraLord)}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellRedBold,
                  hindiBold,
                  { width: "21%" },
                ]}
              >
                {tr(row.subLord)}
              </Text>
              <Text style={[styles.tableCell, hindiFont, { width: "21%" }]}>
                {tr(row.subSubLord)}
              </Text>
            </View>
          ))}
        </View>

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
    </>
  );
}
