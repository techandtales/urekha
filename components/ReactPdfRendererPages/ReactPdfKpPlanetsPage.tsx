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
import { resolveTranslations, kpPlanetsTranslations } from "@/lib/i18n";

// Register custom fonts
import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

const decimalToDMS = (deg: number | undefined): string => {
  if (deg === undefined) return "-";
  const signDeg = deg % 30;
  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  const s = Math.floor(((signDeg - d) * 60 - m) * 60);
  return `${d.toString().padStart(2, "0")}° ${m.toString().padStart(2, "0")}' ${s.toString().padStart(2, "0")}"`;
};

// --- ELEGANT STYLING ---
const styles = StyleSheet.create({
  page: {
    paddingTop: pt(18),
    paddingBottom: pt(20),
    paddingHorizontal: pt(16),
    backgroundColor: "#FFFDF5", // Soft parchment cream
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
    marginBottom: pt(8),
  },
  headerTitle: {
    fontSize: 26,
    color: "#7B1818",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Times-Bold",
  },
  sectionTitle: {
    fontSize: 12,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  // --- ELEGANT DATA GRID (Replaces basic table) ---
  gridContainer: {
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    marginBottom: pt(8),
    overflow: "hidden",
  },
  gridHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#FCFAF5", // Soft gold tint
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  gridColHeader: {
    fontSize: 9,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  gridRowEven: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  gridRowOdd: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA", // Very subtle gray for readability
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  colPlanet: {
    fontSize: 11,
    color: "#111827",
    fontFamily: "Times-Bold",
  },
  colData: {
    fontSize: 10,
    color: "#374151",
    fontFamily: "Times-Roman",
  },
  colDataItalic: {
    fontSize: 10,
    color: "#4B5563",
    fontFamily: "Times-Italic",
  },
  // --- ENHANCED TAG BOX ---
  tagBox: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: "#FDFBF7",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#C5A059",
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 8.5,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
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
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
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

const dummyData = [
  {
    p: "Ascendant",
    si: "Scorpio",
    d: "15° 25' 10\"",
    n: "Jyeshtha",
    nl: "Mercury",
    sl: "Mars",
    stl: "Jupiter",
    sl2: "Saturn",
    ssl: "Venus",
  },
  {
    p: "Sun",
    si: "Leo",
    d: "05° 12' 40\"",
    n: "Magha",
    nl: "Ketu",
    sl: "Sun",
    stl: "Venus",
    sl2: "SubLord",
    ssl: "Jupiter",
  },
  {
    p: "Moon",
    si: "Aries",
    d: "12° 48' 11\"",
    n: "Ashwini",
    nl: "Ketu",
    sl: "Mars",
    stl: "Ketu",
    sl2: "Mercury",
    ssl: "Rahu",
  },
  {
    p: "Mars",
    si: "Leo",
    d: "08° 55' 33\"",
    n: "Magha",
    nl: "Ketu",
    sl: "Sun",
    stl: "Venus",
    sl2: "Saturn",
    ssl: "Sun",
  },
  {
    p: "Mercury",
    si: "Cancer",
    d: "28° 06' 12\"",
    n: "Ashlesha",
    nl: "Mercury",
    sl: "Moon",
    stl: "Mercury",
    sl2: "Saturn",
    ssl: "Venus",
  },
  {
    p: "Jupiter",
    si: "Capricorn",
    d: "16° 24' 00\"",
    n: "Shravana",
    nl: "Moon",
    sl: "Saturn",
    stl: "Saturn",
    sl2: "Jupiter",
    ssl: "Venus",
  },
  {
    p: "Venus",
    si: "Virgo",
    d: "04° 30' 30\"",
    n: "Uttara Phalguni",
    nl: "Sun",
    sl: "Mercury",
    stl: "Venus",
    sl2: "Mars",
    ssl: "Moon",
  },
  {
    p: "Saturn",
    si: "Aquarius",
    d: "22° 12' 45\"",
    n: "Purva Bhadrapada",
    nl: "Jupiter",
    sl: "Saturn",
    stl: "Jupiter",
    sl2: "Saturn",
    ssl: "Rahu",
  },
  {
    p: "Rahu",
    si: "Taurus",
    d: "10° 06' 10\"",
    n: "Rohini",
    nl: "Moon",
    sl: "Venus",
    stl: "Moon",
    sl2: "Jupiter",
    ssl: "Venus",
  },
  {
    p: "Ketu",
    si: "Scorpio",
    d: "10° 06' 10\"",
    n: "Anuradha",
    nl: "Saturn",
    sl: "Mars",
    stl: "Mars",
    sl2: "Saturn",
    ssl: "Jupiter",
  },
];

export default function ReactPdfKpPlanetsPage({
  lang = "en",
  data: passedData,
}: {
  lang?: Language;
  data?: any;
}) {
  const isHi = lang === "hi";
  const t = resolveTranslations(kpPlanetsTranslations, lang);

  // Hindi font override
  const hindiFont = isHi ? { fontFamily: "NotoSansDevanagari" as const } : {};
  const hindiBold = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  const parsedData =
    passedData && passedData.planets
      ? (() => {
          const asc = passedData.ascendant
            ? {
                ...passedData.ascendant,
                siderealLongitude: passedData.ascendant.longitude,
              }
            : null;

          const allRows = asc
            ? [asc, ...passedData.planets]
            : passedData.planets;

          return allRows.map((r: any) => ({
            p: r.name,
            si: r.sign,
            d: decimalToDMS(r.siderealLongitude || r.longitude || 0),
            n: r.nakshatra,
            nl: r.nakshatraLord,
            sl: r.signLord,
            stl: r.nakshatraLord,
            sl2: r.subLord,
            ssl: r.subSubLord,
          }));
        })()
      : [];

  const dataToRender = parsedData;
  const getRowStyle = (i: number) =>
    i % 2 === 0 ? styles.gridRowEven : styles.gridRowOdd;

  return (
    <>
      {/* PAGE 1: KP POSITIONS */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <View fixed style={styles.outerBorder} />
        <View fixed style={styles.innerBorder} />

        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.headerTitle,
              hindiBold,
              { letterSpacing: isHi ? 0 : 2 },
            ]}
          >
            {isHi ? t.titleHi : t.titleEn}
          </Text>
          <OrnateHeadingDivider />
        </View>

        <Text style={[styles.sectionTitle, hindiBold]}>{t.posTitle}</Text>

        <View style={styles.gridContainer}>
          <View style={styles.gridHeaderRow}>
            <Text style={[styles.gridColHeader, hindiBold, { width: "22%" }]}>
              {t.planet}
            </Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "20%" }]}>
              {t.sign}
            </Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "22%" }]}>
              {t.degree}
            </Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "20%" }]}>
              {t.nakshatra}
            </Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "16%" }]}>
              {t.nakLord}
            </Text>
          </View>

          {dataToRender.map((row: any, i: number) => (
            <View key={i} style={getRowStyle(i)}>
              <Text style={[styles.colPlanet, hindiBold, { width: "22%" }]}>
                {row.p}
              </Text>
              <Text style={[styles.colData, hindiFont, { width: "20%" }]}>
                {row.si}
              </Text>
              <Text style={[styles.colDataItalic, hindiFont, { width: "22%" }]}>
                {row.d}
              </Text>
              <Text style={[styles.colData, hindiBold, { width: "20%" }]}>
                {row.n}
              </Text>
              <Text
                style={[
                  styles.colData,
                  hindiBold,
                  { width: "16%", color: "#C5A059" },
                ]}
              >
                {row.nl}
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

        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.headerTitle,
              hindiBold,
              { letterSpacing: isHi ? 0 : 2 },
            ]}
          >
            {isHi ? t.titleHi : t.titleEn}
          </Text>
          <OrnateHeadingDivider />
        </View>

        <Text style={[styles.sectionTitle, hindiBold]}>{t.rulingTitle}</Text>

        <View style={styles.gridContainer}>
          <View style={styles.gridHeaderRow}>
            <Text style={[styles.gridColHeader, hindiBold, { width: "20%" }]}>
              {t.planet}
            </Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "20%" }]}>
              {t.signLord}
            </Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "20%" }]}>
              {t.starLord}
            </Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "20%" }]}>
              {t.subLord}
            </Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "20%" }]}>
              {t.subSubLord}
            </Text>
          </View>

          {dataToRender.map((row: any, i: number) => (
            <View key={i} style={getRowStyle(i)}>
              <Text style={[styles.colPlanet, hindiBold, { width: "20%" }]}>
                {row.p}
              </Text>
              <Text style={[styles.colData, hindiFont, { width: "20%" }]}>
                {row.sl}
              </Text>
              <Text style={[styles.colData, hindiFont, { width: "20%" }]}>
                {row.stl}
              </Text>
              <View style={{ width: "20%" }}>
                <View style={styles.tagBox}>
                  <Text style={[styles.tagText, hindiFont]}>{row.sl2}</Text>
                </View>
              </View>
              <Text style={[styles.colDataItalic, hindiFont, { width: "20%" }]}>
                {row.ssl}
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
