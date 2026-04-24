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
import { indexPageText } from "../pdf/static/index";

// Register custom fonts
import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- ELEGANT STYLING WITH ROUNDED CORNERS ---
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFDF5", // Soft parchment/cream color
    width: pt(210),
    height: pt(297),
    padding: pt(20),
    position: "relative",
    fontFamily: "Times-Roman",
    color: "#111827",
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
    marginTop: pt(8),
    marginBottom: pt(6),
  },
  headerSubtitle: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#C5A059",
    fontFamily: "Times-Bold",
  },
  headerTitle: {
    fontSize: 28,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    marginTop: 12,
    marginBottom: 4,
  },
  listContainer: {
    marginTop: pt(8),
    marginBottom: pt(8),
    paddingHorizontal: pt(12),
  },
  listItemRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: pt(7),
  },
  itemTextContainer: {
    flexDirection: "column",
  },
  itemTitle: {
    fontSize: 14,
    color: "#111827",
    fontFamily: "Times-Bold",
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 10,
    color: "#4B5563",
    fontFamily: "Times-Italic",
  },
  dottedLeader: {
    flexGrow: 1,
    borderBottomWidth: 1.5,
    borderBottomStyle: "dotted",
    borderBottomColor: "#C5A059",
    marginHorizontal: pt(5),
    opacity: 0.6,
  },
  pageNum: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    color: "#7B1818",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: pt(5),
    borderTopWidth: 0.5,
    borderTopColor: "#C5A059",
    paddingTop: 8,
    marginTop: pt(6),
    marginBottom: pt(2),
  },
  footerText: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
  },
});

// --- ORNATE DIVIDER ---
const OrnateHeadingDivider = () => (
  <View style={{ alignItems: "center", marginTop: 8, marginBottom: 12 }}>
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

export default function ReactPdfIndexPage({ lang }: { lang: Language }) {
  const isHi = lang === "hi";
  const t =
    indexPageText[lang as keyof typeof indexPageText] || indexPageText.en;

  const subtitleSpacing = isHi ? 1 : 3.5;
  const titleSpacing = isHi ? 0 : 2.5;

  // Hindi font override
  const hindiFont = isHi ? { fontFamily: "NotoSansDevanagari" as const } : {};
  const hindiBold = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  return (
    <Page size="A4" style={[styles.page, hindiFont]}>
      {/* Borders */}
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.headerSubtitle,
            hindiFont,
            { letterSpacing: subtitleSpacing },
          ]}
        >
          {t.headerSubtitle}
        </Text>
        <Text
          style={[
            styles.headerTitle,
            hindiBold,
            { letterSpacing: titleSpacing },
          ]}
        >
          {t.headerTitle}
        </Text>
        <OrnateHeadingDivider />
      </View>

      {/* Index List */}
      <View style={styles.listContainer}>
        {t.items.map((item, index) => (
          <View key={index} style={styles.listItemRow}>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, hindiBold]}>{item.title}</Text>
              <Text
                style={[
                  styles.itemSubtitle,
                  hindiFont,
                  { letterSpacing: isHi ? 0.5 : 1.5 },
                ]}
              >
                {item.subtitle}
              </Text>
            </View>

            {/* The dotted line connecting text to page number */}
            <View style={styles.dottedLeader} />

            <Text style={[styles.pageNum, { letterSpacing: 1.5 }]}>
              {item.page}
            </Text>
          </View>
        ))}
      </View>

      {/* Spacer to push footer to the bottom */}
      <View style={{ flexGrow: 1 }} />

      {/* Footer */}
      <View fixed style={styles.footer}>
        <Text style={[styles.footerText, hindiFont]}>{t.brandName}</Text>
        <Text style={[styles.footerText, { color: "#9CA3AF" }]}>
          {t.footerTitle}
        </Text>
      </View>
    </Page>
  );
}
