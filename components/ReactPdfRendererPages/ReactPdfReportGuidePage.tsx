import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";
import { Language } from "@/types/languages";
import {
  resolveTranslations,
  reportGuideTranslations,
  GLOSSARY_TERMS,
} from "@/lib/i18n";
import { hindiFont, hindiBold } from "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- PERFECTLY BALANCED STYLING ---
const styles = StyleSheet.create({
  page: {
    paddingTop: pt(16) - 1,
    paddingBottom: pt(20) - 1,
    paddingHorizontal: pt(18),
    backgroundColor: "#FFFDF5",
    fontFamily: "Roboto",
  },
  outerBorder: {
    position: "absolute",
    top: pt(10),
    left: pt(10),
    right: pt(10),
    bottom: pt(10),
    borderWidth: 1.5,
    borderColor: "#7B1818",
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
    borderColor: "#C5A059",
    borderRadius: 5,
    opacity: 0.8,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: pt(6) - 1,
    marginBottom: pt(4) - 1,
  },
  headerTitle: {
    fontSize: 26,
    color: "#7B1818",
    marginBottom: 3,
    textTransform: "uppercase",
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  introBox: {
    backgroundColor: "#FDFBF7",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
    padding: pt(3.5) - 1,
    marginBottom: pt(5) - 1,
  },
  introText: {
    fontSize: 10,
    color: "#4B5563",
    lineHeight: 1.6,
    fontFamily: "Roboto",
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: pt(4) - 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
    paddingBottom: 3,
    marginBottom: pt(3.5) - 1,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#7B1818",
    fontFamily: "Roboto",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: pt(2.5) - 1,
  },
  termCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: pt(3) - 1,
    minHeight: pt(15) - 1, // The perfect middle ground height
  },
  termTitle: {
    fontSize: 9,
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginBottom: 3,
  },
  termDesc: {
    fontSize: 8.5,
    color: "#374151",
    lineHeight: 1.5,
    fontFamily: "Roboto",
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
    paddingTop: 7,
  },
  footerText: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#7B1818",
    fontFamily: "Roboto",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

// --- ORNATE DIVIDER ---
const OrnateHeadingDivider = () => (
  <View style={{ alignItems: "center", marginTop: 8, marginBottom: 10 }}>
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

export default function ReactPdfReportGuidePage({ lang }: { lang: Language }) {
  const isHi = lang === "hi";
  const t = resolveTranslations(reportGuideTranslations, lang as Language);
  const TERMS = GLOSSARY_TERMS;

  // Local font overrides for absolute consistency with other report pages
  const hindiFontOverride = isHi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBoldOverride = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  const TermCard = ({ item }: { item: any }) => (
    <View style={styles.termCard} wrap={false}>
      <Text
        style={[styles.termTitle, hindiBoldOverride]}
        hyphenationCallback={isHi ? (word: string) => [word] : undefined}
      >
        {isHi ? item.hi : item.en}
      </Text>
      <Text
        style={[styles.termDesc, hindiFontOverride]}
        hyphenationCallback={isHi ? (word: string) => [word] : undefined}
      >
        {isHi ? item.descHi : item.descEn}
      </Text>
    </View>
  );

  const SectionBlock = ({ title, items }: { title: string; items: any[] }) => {
    // Chunk items into rows of 2 to avoid React-PDF flexWrap pagination bugs
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader} wrap={false}>
          <Text style={[styles.sectionTitle, hindiBoldOverride]}>{title}</Text>
        </View>
        <View>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow} wrap={false}>
              {row.map((item, colIndex) => (
                <TermCard key={colIndex} item={item} />
              ))}
              {row.length === 1 && <View style={{ width: "48.5%" }} />}
              {/* Empty spacer for odd item out */}
            </View>
          ))}
        </View>
      </View>
    );
  };

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
            {
              textTransform: isHi ? "none" : "uppercase",
              letterSpacing: isHi ? 0 : 2,
            },
          ]}
          hyphenationCallback={isHi ? (word: string) => [word] : undefined}
        >
          {t.header}
        </Text>
        <OrnateHeadingDivider />
      </View>

      {/* Intro Description */}
      <View style={styles.introBox} wrap={false}>
        <Text
          style={[
            styles.introText,
            hindiFontOverride,
            { fontStyle: isHi ? "normal" : "normal" },
          ]}
          hyphenationCallback={isHi ? (word: string) => [word] : undefined}
        >
          {t.intro}
        </Text>
      </View>

      {/* Glossary Sections */}
      <SectionBlock title={t.secPanchang} items={TERMS.panchang} />
      <SectionBlock title={t.secIdentity} items={TERMS.identity} />
      <SectionBlock title={t.secAttr} items={TERMS.attributes} />

      {/* Footer */}
      <View fixed style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            hindiBoldOverride,
            {
              textTransform: isHi ? "none" : "uppercase",
              letterSpacing: isHi ? 0 : 1.5,
            },
          ]}
        >
          {isHi ? "युरेखा • वैदिक इंटेलिजेंस" : "UREKHA • VEDIC INTELLIGENCE"}
        </Text>
        <Text
          style={[styles.footerText, hindiBoldOverride, { color: "#9CA3AF" }]}
        >
          www.urekha.com
        </Text>
      </View>
    </Page>
  );
}
