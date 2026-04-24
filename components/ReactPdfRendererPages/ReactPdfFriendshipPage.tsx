import React from 'react';
import { Page, Text, View, StyleSheet, Svg, Path, Circle, Font } from '@react-pdf/renderer';
import { Language } from "@/types/languages";
import { resolveTranslations, friendshipTranslations } from "@/lib/i18n";

import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- ELEGANT VEDIC MANUSCRIPT STYLING ---
const styles = StyleSheet.create({
  page: {
    paddingTop: pt(16),
    paddingBottom: pt(20),
    paddingHorizontal: pt(18),
    backgroundColor: '#FFFDF5', // Soft parchment cream
    fontFamily: "Times-Roman",
  },
  outerBorder: {
    position: 'absolute',
    top: pt(10), left: pt(10), right: pt(10), bottom: pt(10),
    borderWidth: 1.5,
    borderColor: '#7B1818', // Deep Crimson
    borderRadius: 5,
    opacity: 0.9,
  },
  innerBorder: {
    position: 'absolute',
    top: pt(12.5), left: pt(12.5), right: pt(12.5), bottom: pt(12.5),
    borderWidth: 0.5,
    borderColor: '#C5A059', // Rich Gold
    borderRadius: 5,
    opacity: 0.8,
  },

  headerContainer: {
    alignItems: "center",
    marginTop: pt(6),
    marginBottom: pt(6),
  },
  headerTitle: {
    fontSize: 20,
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

  // --- ELEGANT DATA GRID ---
  gridContainer: {
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    marginBottom: pt(6),
    overflow: 'hidden',
  },
  gridHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#FCFAF5",
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
    backgroundColor: "#FAFAFA",
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
    lineHeight: 1.3,
    paddingRight: 4,
  },
  colDataIntimate: {
    fontSize: 10,
    color: "#15803D", // Rich Green for Intimate
    fontFamily: "Times-Bold",
  },
  colDataBitter: {
    fontSize: 10,
    color: "#9F1239", // Red for Bitter Enemy
    fontFamily: "Times-Bold",
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
  <View style={{ alignItems: 'center', marginTop: 4, marginBottom: 8 }}>
    <Svg viewBox="0 0 300 30" style={{ width: pt(110), height: pt(11) }}>
      <Path d="M 0 15 L 105 15" stroke="#C5A059" strokeWidth="1" />
      <Circle cx="112" cy="15" r="1" fill="#C5A059" />
      <Circle cx="118" cy="15" r="1.5" fill="#C5A059" />
      <Circle cx="126" cy="15" r="2" fill="#C5A059" />
      <Path d="M135,15 Q150,0 165,15 Q150,30 135,15 Z" fill="none" stroke="#C5A059" strokeWidth="1" />
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
  permanent: [
    { p: "Sun", f: "Moon, Mars, Jupiter", n: "Mercury", e: "Venus, Saturn" },
    { p: "Moon", f: "Sun, Mercury", n: "Mars, Jupiter, Venus, Saturn", e: "-" },
    { p: "Mars", f: "Sun, Moon, Jupiter", n: "Venus, Saturn", e: "Mercury" },
    { p: "Mercury", f: "Sun, Venus", n: "Mars, Jupiter, Saturn", e: "Moon" },
    { p: "Jupiter", f: "Sun, Moon, Mars", n: "Saturn", e: "Mercury, Venus" },
    { p: "Venus", f: "Mercury, Saturn", n: "Mars, Jupiter", e: "Sun, Moon" },
    { p: "Saturn", f: "Mercury, Venus", n: "Jupiter", e: "Sun, Moon, Mars" }
  ],
  temp: [
    { p: "Sun", f: "Moon, Mars, Mercury", e: "Jupiter, Venus, Saturn" },
    { p: "Moon", f: "Sun, Venus, Saturn", e: "Mars, Mercury, Jupiter" },
    { p: "Mars", f: "Sun, Mercury, Venus", e: "Moon, Jupiter, Saturn" },
    { p: "Mercury", f: "Moon, Jupiter, Saturn", e: "Sun, Mars, Venus" },
    { p: "Jupiter", f: "Venus, Saturn", e: "Sun, Moon, Mars, Mercury" },
    { p: "Venus", f: "Sun, Moon, Mars", e: "Mercury, Jupiter, Saturn" },
    { p: "Saturn", f: "Sun, Moon, Jupiter", e: "Mars, Mercury, Venus" }
  ],
  five: [
    { p: "Sun", i: "Moon, Mars", f: "Jupiter", n: "Mercury", e: "Venus", b: "Saturn" },
    { p: "Moon", i: "Sun", f: "Mercury", n: "Venus, Saturn", e: "Mars", b: "Jupiter" },
    { p: "Mars", i: "Sun, Jupiter", f: "Moon", n: "Saturn", e: "Venus", b: "Mercury" },
    { p: "Mercury", i: "Venus", f: "Sun", n: "Saturn", e: "Jupiter", b: "Moon, Mars" },
    { p: "Jupiter", i: "Sun, Moon", f: "Mars", n: "-", e: "Saturn, Mercury", b: "Venus" },
    { p: "Venus", i: "Mercury", f: "Saturn", n: "Mars", e: "Jupiter, Sun", b: "Moon" },
    { p: "Saturn", i: "Venus", f: "Mercury", n: "Jupiter", e: "Mars, Moon", b: "Sun" }
  ]
};

export default function ReactPdfFriendshipPage({ lang = "en", data: passedData }: { lang?: Language, data?: any }) {
  const isHi = lang === "hi";
  const t = resolveTranslations(friendshipTranslations, lang);

  // Hindi font override
  const hindiFont = isHi ? { fontFamily: 'NotoSansDevanagari' as const } : {};
  const hindiBold = isHi
    ? { fontFamily: 'NotoSansDevanagari' as const, fontWeight: 700 as const }
    : {};

  const formatList = (list?: string[]) => {
    if (!list || list.length === 0) return "-";
    return list.join(", ");
  };

  const parsedData = (passedData && passedData.permanent_table) ? {
    permanent: Object.keys(passedData.permanent_table).map(p => ({
      p: p,
      f: formatList(passedData.permanent_table[p]?.Friends),
      n: formatList(passedData.permanent_table[p]?.Neutral),
      e: formatList(passedData.permanent_table[p]?.Enemies),
    })),
    temp: Object.keys(passedData.temporary_friendship || {}).map(p => ({
      p: p,
      f: formatList(passedData.temporary_friendship[p]?.Friends),
      e: formatList(passedData.temporary_friendship[p]?.Enemies),
    })),
    five: Object.keys(passedData.five_fold_friendship || {}).map(p => ({
      p: p,
      i: formatList(passedData.five_fold_friendship[p]?.IntimateFriend),
      f: formatList(passedData.five_fold_friendship[p]?.Friends),
      n: formatList(passedData.five_fold_friendship[p]?.Neutral),
      e: formatList(passedData.five_fold_friendship[p]?.Enemies),
      b: formatList(passedData.five_fold_friendship[p]?.BitterEnemy),
    }))
  } : { permanent: [], temp: [], five: [] };

  const dataToRender = parsedData;
  const getRowStyle = (i: number) => i % 2 === 0 ? styles.gridRowEven : styles.gridRowOdd;

  return (
    <>
      {/* PAGE 1: Permanent & Temporary */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <View fixed style={styles.outerBorder} />
        <View fixed style={styles.innerBorder} />

        <View style={styles.headerContainer} fixed>
          <Text style={[styles.headerTitle, hindiBold, { letterSpacing: isHi ? 0 : 2 }]}>{isHi ? t.titleHi : t.titleEn}</Text>
          <OrnateHeadingDivider />
        </View>

        {/* 1. Permanent */}
        <Text style={[styles.sectionTitle, hindiBold]}>{t.permanent}</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridHeaderRow}>
            <Text style={[styles.gridColHeader, hindiBold, { width: "16%" }]}>{t.planet}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "34%" }]}>{t.friend}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "25%" }]}>{t.neutral}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "25%" }]}>{t.enemy}</Text>
          </View>
          {dataToRender.permanent.map((row: any, i: number) => (
            <View key={i} style={getRowStyle(i)}>
              <Text style={[styles.colPlanet, hindiBold, { width: "16%" }]}>{row.p}</Text>
              <Text style={[styles.colData, hindiFont, { width: "34%" }]}>{row.f}</Text>
              <Text style={[styles.colData, hindiFont, { width: "25%" }]}>{row.n}</Text>
              <Text style={[styles.colData, hindiFont, { width: "25%" }]}>{row.e}</Text>
            </View>
          ))}
        </View>

        {/* 2. Temporary */}
        <Text style={[styles.sectionTitle, hindiBold]}>{t.temporary}</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridHeaderRow}>
            <Text style={[styles.gridColHeader, hindiBold, { width: "20%" }]}>{t.planet}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "40%" }]}>{t.friend}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "40%" }]}>{t.enemy}</Text>
          </View>
          {dataToRender.temp.map((row: any, i: number) => (
            <View key={i} style={getRowStyle(i)}>
              <Text style={[styles.colPlanet, hindiBold, { width: "20%" }]}>{row.p}</Text>
              <Text style={[styles.colData, hindiFont, { width: "40%" }]}>{row.f}</Text>
              <Text style={[styles.colData, hindiFont, { width: "40%" }]}>{row.e}</Text>
            </View>
          ))}
        </View>

        <View fixed style={styles.footer}>
          <Text style={[styles.footerText, hindiFont]}>{isHi ? "\u092F\u0941\u0930\u0947\u0916\u093E \u2022 \u0935\u0948\u0926\u093F\u0915 \u0907\u0902\u091F\u0947\u0932\u093F\u091C\u0947\u0902\u0938" : "UREKHA \u2022 VEDIC INTELLIGENCE"}</Text>
          <Text style={[styles.footerText, { color: '#9CA3AF' }]}>www.urekha.com</Text>
        </View>
      </Page>

      {/* PAGE 2: Five-Fold */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <View fixed style={styles.outerBorder} />
        <View fixed style={styles.innerBorder} />

        <View style={styles.headerContainer} fixed>
          <Text style={[styles.headerTitle, hindiBold, { letterSpacing: isHi ? 0 : 2 }]}>{isHi ? t.titleHi : t.fiveFold}</Text>
          <OrnateHeadingDivider />
        </View>

        {/* 3. Five-Fold */}
        <Text style={[styles.sectionTitle, hindiBold]}>{t.fiveFold}</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridHeaderRow}>
            <Text style={[styles.gridColHeader, hindiBold, { width: "15%" }]}>{t.planet}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "17%" }]}>{t.intimate}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "17%" }]}>{t.friend}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "17%" }]}>{t.neutral}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "17%" }]}>{t.enemy}</Text>
            <Text style={[styles.gridColHeader, hindiBold, { width: "17%" }]}>{t.bitter}</Text>
          </View>
          {dataToRender.five.map((row: any, i: number) => (
            <View key={i} style={getRowStyle(i)}>
              <Text style={[styles.colPlanet, hindiBold, { width: "15%" }]}>{row.p}</Text>
              <Text style={[styles.colDataIntimate, hindiFont, { width: "17%" }]}>{row.i}</Text>
              <Text style={[styles.colData, hindiFont, { width: "17%" }]}>{row.f}</Text>
              <Text style={[styles.colData, hindiFont, { width: "17%" }]}>{row.n}</Text>
              <Text style={[styles.colData, hindiFont, { width: "17%" }]}>{row.e}</Text>
              <Text style={[styles.colDataBitter, hindiFont, { width: "17%" }]}>{row.b}</Text>
            </View>
          ))}
        </View>

        <View fixed style={styles.footer}>
          <Text style={[styles.footerText, hindiFont]}>{isHi ? "\u092F\u0941\u0930\u0947\u0916\u093E \u2022 \u0935\u0948\u0926\u093F\u0915 \u0907\u0902\u091F\u0947\u0932\u093F\u091C\u0947\u0902\u0938" : "UREKHA \u2022 VEDIC INTELLIGENCE"}</Text>
          <Text style={[styles.footerText, { color: '#9CA3AF' }]}>www.urekha.com</Text>
        </View>
      </Page>
    </>
  );
}