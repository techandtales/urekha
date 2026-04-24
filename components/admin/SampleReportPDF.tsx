"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Svg,
  Circle,
  Path,
  Rect,
} from "@react-pdf/renderer";
import UrekhaCoverPage from "./UrekhaCoverPage";

// Register Mukta Hindi Font (better Devanagari word-boundary handling)
Font.register({
  family: "Mukta",
  fonts: [
    { src: "/fonts/Mukta-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Mukta-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/Mukta-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/Mukta-Bold.ttf", fontWeight: 700 },
  ],
});

// Completely disable hyphenation — prevents Hindi words from breaking mid-syllable
Font.registerHyphenationCallback((word: string) => [word]);

const colors = {
  maroon: "#800000",
  navy: "#000080",
  gold: "#B8860B",
  lightGray: "#f8fafc",
  border: "#800000",
  text: "#1a202c",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 65,
    backgroundColor: "#ffffff",
    fontFamily: "Mukta",
  },
  borderWrapper: {
    border: `2pt solid ${colors.maroon}`,
    height: "100%",
    padding: 20,
    position: "relative",
  },
  innerBorder: {
    border: `0.5pt solid ${colors.gold}`,
    height: "100%",
    padding: 20,
  },
  headerBox: {
    marginBottom: 20,
    alignItems: "center",
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 26,
    color: colors.maroon,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.navy,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 10,
    textDecoration: "underline",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
    alignItems: "center",
  },
  label: {
    width: "40%",
    fontSize: 11,
    color: colors.maroon,
    fontWeight: "bold",
  },
  value: {
    width: "60%",
    fontSize: 11,
    color: colors.text,
  },
  table: {
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: colors.maroon,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.maroon,
    padding: 5,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.maroon,
    padding: 5,
  },
  tableCell: {
    fontSize: 9,
    flex: 1,
    textAlign: "center",
    color: colors.text,
  },
  summaryBlock: {
    marginBottom: 15,
  },
  summaryHeading: {
    fontSize: 16,
    color: colors.navy,
    fontWeight: "bold",
    marginBottom: 2,
    marginTop: 5,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 1.8,
    color: colors.text,
    textAlign: "left",
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gold,
    marginVertical: 12,
    opacity: 0.5,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: colors.maroon,
    paddingLeft: 10,
    marginVertical: 10,
    backgroundColor: "#fff9f9",
    paddingVertical: 5,
    paddingRight: 5,
  },
  pageBackground: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    border: `2pt solid ${colors.maroon}`,
    pointerEvents: "none",
  },
  innerBackground: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: `0.5pt solid ${colors.gold}`,
    pointerEvents: "none",
  },
  highlightBox: {
    backgroundColor: "#fffbeb",
    border: `1pt solid ${colors.gold}`,
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 35,
    right: 35,
    textAlign: "center",
    borderTop: `1pt solid ${colors.maroon}`,
    paddingTop: 8,
  },
  footerQuote: {
    fontSize: 9,
    color: colors.maroon,
    fontWeight: "bold",
    marginBottom: 4,
    fontStyle: "normal",
  },
  footerPage: {
    fontSize: 9,
    color: colors.maroon,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  gridItem: {
    width: "33.33%",
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
  },
  gridLabel: {
    fontSize: 8,
    color: colors.maroon,
    fontWeight: "bold",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  gridValue: {
    fontSize: 10,
    color: colors.navy,
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
  },
  sectionHeader: {
    backgroundColor: "#fff1f1",
    color: colors.maroon,
    padding: 6,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.maroon,
  },
  twoColumnGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
  },
  gridCell: {
    width: "50%",
    padding: 8,
    borderWidth: 0.25,
    borderColor: "#e2e8f0",
    flexDirection: "column",
  },
  gridCellLabel: {
    fontSize: 9,
    color: colors.maroon,
    fontWeight: "bold",
    marginBottom: 2,
  },
  gridCellValue: {
    fontSize: 10,
    color: colors.text,
  },
  watermarkContainer: {
    position: "absolute",
    top: "35%",
    left: "15%",
    width: "70%",
    height: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.05,
    transform: "rotate(-35deg)",
  },
  watermarkLogo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  watermarkText: {
    fontSize: 50,
    color: colors.maroon,
    fontWeight: "bold",
    letterSpacing: 10,
    textAlign: "center",
  },
});

const safeText = (val: any) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string" || typeof val === "number") return val;
  return JSON.stringify(val);
};

const normalizeSummary = (input: any) => {
  if (!input) return { blocks: [] };

  let data = input;

  // Case 1: Stringified JSON
  if (typeof input === "string") {
    try {
      const stripped = input.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      data = JSON.parse(stripped);
    } catch (e) {
      // Not JSON, treat as raw markdown
      const lines = input.split("\n").filter((l) => l.trim() !== "");
      const blocks = lines.map((line) => {
        const trimmed = line.trim();
        if (trimmed === "---") {
          return { type: "divider" };
        }
        if (trimmed.startsWith(">")) {
          return { type: "blockquote", text: trimmed.replace(/^>\s*/, "") };
        }
        if (trimmed.startsWith("#")) {
          return { type: "heading", text: trimmed.replace(/^#+\s*/, "") };
        }
        if (trimmed.includes("**")) {
          return { type: "highlight_box", text: trimmed.replace(/\*\*/g, "") };
        }
        return { type: "paragraph", text: trimmed };
      });
      return { blocks };
    }
  }

  // Case 2: Structured Object
  if (data.blocks && Array.isArray(data.blocks)) {
    return data;
  }

  // Case 3: Simple string or unknown object
  return {
    blocks: [
      {
        type: "paragraph",
        text: typeof data === "string" ? data : JSON.stringify(data),
      },
    ],
  };
};

export const SampleReportPDF = ({ data }: { data: any }) => {
  if (!data) return null;

  const profile = data.profile || {};
  const ascendant_report =
    data.ascendant_report?.response?.[0] || data.ascendant_report || {};
  const planet_details_raw = data.planet_details?.response || {};

  // Extract planets (keys 0-9 are typically planets/ascendant in this API structure)
  const planet_list = Object.keys(planet_details_raw)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => planet_details_raw[key])
    .filter((p) => p && p.name);

  const dasha_current_maha =
    data.dasha_current_maha?.response || data.dasha_current_maha || {};
  const dosha_mangal = data.dosha_mangal?.response || data.dosha_mangal || {};
  const dosha_kaalsarp =
    data.dosha_kaalsarp?.response || data.dosha_kaalsarp || {};
  const summary_data = normalizeSummary(data.summary_report);
  const summary_blocks = summary_data.blocks || [];

  const isHindi = profile.language === "hi";

  const labels = {
    title: isHindi ? "वैदिक ज्योतिष रिपोर्ट" : "Vedic Astrology Report",
    profile: isHindi ? "प्रोफ़ाइल रिपोर्ट" : "Profile Report",
    ascendant: isHindi ? "लग्न रिपोर्ट" : "Ascendant Report",
    planets: isHindi ? "ग्रह स्थिति विवरण" : "Planetary Positions",
    dashaDosha: isHindi ? "दशा एवं दोष विश्लेषण" : "Dasha & Dosha Analysis",
    summary: isHindi ? "ज्योतिषीय सारांश" : "Astrological Summary",
  };

  return (
    <Document
      title={`${isHindi ? "ज्योतिष रिपोर्ट" : "Astrology Report"} - ${profile.name}`}
    >

      {/* PAGE 1: Profile & Lagna */}
      <Page size="A4" style={styles.page}>
        <View style={styles.borderWrapper}>
          <View style={styles.innerBorder}>
            <View style={styles.watermarkContainer} fixed>
              <Image src="/logo.png" style={styles.watermarkLogo} />
              <Text style={styles.watermarkText}>UREKHA</Text>
            </View>

            <View style={styles.headerBox}>
              <Text style={styles.mainTitle}>{labels.title}</Text>
              <Text style={{ fontSize: 10, color: colors.navy, fontWeight: "bold", marginTop: 4 }}>
                Exclusively generated for {profile.name}
              </Text>
            </View>

            <Text style={styles.sectionHeader}>{labels.profile}</Text>
            <View style={styles.twoColumnGrid}>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "नाम" : "Name"}</Text>
                <Text style={styles.gridCellValue}>{safeText(profile.name)}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "जन्म तिथि" : "DOB"}</Text>
                <Text style={styles.gridCellValue}>{safeText(profile.date_of_birth)}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "जन्म समय" : "Time"}</Text>
                <Text style={styles.gridCellValue}>{safeText(profile.time_of_birth)}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "जन्म स्थान" : "Place"}</Text>
                <Text style={styles.gridCellValue}>{safeText(profile.place_of_birth)}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "अक्षांश" : "Latitude"}</Text>
                <Text style={styles.gridCellValue}>{safeText(profile.latitude)}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "देशांतर" : "Longitude"}</Text>
                <Text style={styles.gridCellValue}>{safeText(profile.longitude)}</Text>
              </View>
            </View>

            <Text style={styles.sectionHeader}>{labels.ascendant}</Text>
            <View style={styles.twoColumnGrid}>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "लग्न" : "Ascendant"}</Text>
                <Text style={styles.gridCellValue}>{safeText(ascendant_report.ascendant)}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "लग्नेश" : "Lord"}</Text>
                <Text style={styles.gridCellValue}>{safeText(ascendant_report.ascendant_lord)}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "शुभ रत्न" : "Lucky Gem"}</Text>
                <Text style={styles.gridCellValue}>{safeText(ascendant_report.lucky_gem)}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "व्रत का दिन" : "Day for Fasting"}</Text>
                <Text style={styles.gridCellValue}>{safeText(ascendant_report.day_for_fasting || "—")}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "लग्नेश बल" : "Ascendant Lord Strength"}</Text>
                <Text style={styles.gridCellValue}>{safeText(ascendant_report.ascendant_lord_strength || "—")}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>{isHindi ? "राशि" : "Moon Sign"}</Text>
                <Text style={styles.gridCellValue}>{safeText(planet_details_raw.rasi)}</Text>
              </View>
            </View>

            <View style={{ marginTop: 20, padding: 12, backgroundColor: "#fffcf0", borderLeft: `3pt solid ${colors.gold}` }}>
              <Text style={[styles.label, { marginBottom: 5 }]}>
                {isHindi ? "गायत्री मंत्र" : "Gayatri Mantra"}:
              </Text>
              <Text style={{ fontSize: 10, lineHeight: 1.6, color: colors.navy }}>
                {safeText(ascendant_report.gayatri_mantra)}
              </Text>
            </View>

            <View style={styles.footer} fixed>
              <Text style={styles.footerQuote}>
                "Destiny is not a matter of chance; it is a matter of choice."
              </Text>
              <Text style={styles.footerPage}>Page 1 | © Urekha</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 2: Planetary Details */}
      <Page size="A4" style={styles.page}>
        <View style={styles.borderWrapper}>
          <View style={styles.innerBorder}>
            <View style={styles.watermarkContainer} fixed>
              <Image src="/logo.png" style={styles.watermarkLogo} />
              <Text style={styles.watermarkText}>UREKHA</Text>
            </View>
            <Text style={styles.sectionTitle}>{labels.planets}</Text>

            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>
                  {isHindi ? "ग्रह" : "Planet"}
                </Text>
                <Text style={styles.tableHeaderText}>
                  {isHindi ? "राशि" : "Sign"}
                </Text>
                <Text style={styles.tableHeaderText}>
                  {isHindi ? "अंश" : "Degree"}
                </Text>
                <Text style={styles.tableHeaderText}>
                  {isHindi ? "भाव" : "House"}
                </Text>
              </View>

              {planet_list.length > 0 ? (
                planet_list.map((p: any, i: number) => (
                  <View key={i} style={styles.tableRow}>
                    <Text style={styles.tableCell}>
                      {safeText(p.full_name || p.name)}
                    </Text>
                    <Text style={styles.tableCell}>{safeText(p.zodiac)}</Text>
                    <Text style={styles.tableCell}>
                      {p.local_degree
                        ? Number(p.local_degree).toFixed(2) + "°"
                        : "N/A"}
                    </Text>
                    <Text style={styles.tableCell}>{safeText(p.house)}</Text>
                  </View>
                ))
              ) : (
                <View style={{ padding: 20 }}>
                  <Text style={{ textAlign: "center", fontSize: 10 }}>
                    Planetary position data syncing...
                  </Text>
                </View>
              )}
            </View>

            <View style={{ marginTop: 25 }}>
              <Text
                style={[styles.sectionTitle, { fontSize: 16, marginTop: 20 }]}
              >
                {isHindi ? "ब्रह्मांडीय गुण" : "Cosmic Attributes"}
              </Text>
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>
                    {isHindi ? "भाग्यशाली रत्न" : "Lucky Gem"}
                  </Text>
                  <Text style={styles.gridValue}>
                    {safeText(planet_details_raw.lucky_gem?.[0]) || "—"}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>
                    {isHindi ? "भाग्यशाली अंक" : "Lucky Number"}
                  </Text>
                  <Text style={styles.gridValue}>
                    {safeText(planet_details_raw.lucky_num?.[0]) || "—"}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>
                    {isHindi ? "भाग्यशाली रंग" : "Lucky Color"}
                  </Text>
                  <Text style={styles.gridValue}>
                    {safeText(planet_details_raw.lucky_colors?.[0]) || "—"}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>
                    {isHindi ? "भाग्यशाली अक्षर" : "Lucky Letters"}
                  </Text>
                  <Text style={styles.gridValue}>
                    {safeText(planet_details_raw.lucky_letters?.join(", ")) ||
                      "—"}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>
                    {isHindi ? "जन्म राशि" : "Moon Sign"}
                  </Text>
                  <Text style={styles.gridValue}>
                    {safeText(planet_details_raw.rasi)}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>
                    {isHindi ? "नक्षत्र" : "Nakshatra"}
                  </Text>
                  <Text style={styles.gridValue}>
                    {safeText(planet_details_raw.nakshatra)} (
                    {safeText(planet_details_raw.nakshatra_pada)})
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.footer} fixed>
              <Text style={styles.footerQuote}>
                "Destiny is not a matter of chance; it is a matter of choice."
              </Text>
              <Text style={styles.footerPage}>Page 2 | © Urekha</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 3: Dasha & Dosha */}
      <Page size="A4" style={styles.page}>
        <View style={styles.borderWrapper}>
          <View style={styles.innerBorder}>
            <View style={styles.watermarkContainer} fixed>
              <Image src="/logo.png" style={styles.watermarkLogo} />
              <Text style={styles.watermarkText}>UREKHA</Text>
            </View>
            <Text style={styles.sectionTitle}>{labels.dashaDosha}</Text>

            {/* Dasha */}
            <View style={{ marginBottom: 25 }}>
              <Text
                style={[
                  styles.label,
                  {
                    width: "100%",
                    borderBottom: "1pt solid #eee",
                    paddingBottom: 5,
                    marginBottom: 10,
                  },
                ]}
              >
                {isHindi ? "वर्तमान विंशोत्तरी दशा" : "Current V. Dasha"}
              </Text>
              {dasha_current_maha.mahadasha && (
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {isHindi ? "महादशा" : "Mahadasha"}:
                  </Text>
                  <Text style={styles.value}>
                    {safeText(dasha_current_maha.mahadasha.name)} (Ends:{" "}
                    {safeText(dasha_current_maha.mahadasha.end)})
                  </Text>
                </View>
              )}
              {dasha_current_maha.antardasha && (
                <View style={styles.row}>
                  <Text style={styles.label}>
                    {isHindi ? "अंतर्दशा" : "Antardasha"}:
                  </Text>
                  <Text style={styles.value}>
                    {safeText(dasha_current_maha.antardasha.name)} (Ends:{" "}
                    {safeText(dasha_current_maha.antardasha.end)})
                  </Text>
                </View>
              )}
            </View>

            {/* Mangal Dosha */}
            <View style={{ marginBottom: 25 }}>
              <Text
                style={[
                  styles.label,
                  {
                    width: "100%",
                    borderBottom: "1pt solid #eee",
                    paddingBottom: 5,
                    marginBottom: 10,
                  },
                ]}
              >
                {isHindi ? "मंगल दोष" : "Mangal Dosha"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text style={[styles.label, { width: "40%" }]}>
                  {isHindi ? "स्थिति" : "Status"}:
                </Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: dosha_mangal.is_dosha_present
                        ? "#ef4444"
                        : "#22c55e",
                    },
                  ]}
                >
                  <Text>
                    {dosha_mangal.is_dosha_present
                      ? isHindi
                        ? "उपस्थित"
                        : "Present"
                      : isHindi
                        ? "अनुपस्थित"
                        : "Absent"}
                  </Text>
                </View>
              </View>
              <Text style={styles.summaryText}>
                {safeText(dosha_mangal.bot_response)}
              </Text>
            </View>

            {/* Kaalsarp Dosha */}
            <View>
              <Text
                style={[
                  styles.label,
                  {
                    width: "100%",
                    borderBottom: "1pt solid #eee",
                    paddingBottom: 5,
                    marginBottom: 10,
                  },
                ]}
              >
                {isHindi ? "काल सर्प दोष" : "Kaalsarp Dosha"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text style={[styles.label, { width: "40%" }]}>
                  {isHindi ? "स्थिति" : "Status"}:
                </Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: dosha_kaalsarp.is_dosha_present
                        ? "#ef4444"
                        : "#22c55e",
                    },
                  ]}
                >
                  <Text>
                    {dosha_kaalsarp.is_dosha_present
                      ? isHindi
                        ? "उपस्थित"
                        : "Present"
                      : isHindi
                        ? "अनुपस्थित"
                        : "Absent"}
                  </Text>
                </View>
              </View>
              <Text style={styles.summaryText}>
                {safeText(dosha_kaalsarp.bot_response)}
              </Text>
            </View>

            <View style={styles.footer} fixed>
              <Text style={styles.footerQuote}>
                "Destiny is not a matter of chance; it is a matter of choice."
              </Text>
              <Text style={styles.footerPage}>Page 3 | © Urekha</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 4+: Astrological Summary (Supports Multi-page) */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Borders for all summary pages */}
        <View style={styles.pageBackground} fixed />
        <View style={styles.innerBackground} fixed />

        <View style={styles.watermarkContainer} fixed>
          <Image src="/logo.png" style={styles.watermarkLogo} />
          <Text style={styles.watermarkText}>UREKHA</Text>
        </View>

        {/* Recurring Header Spacer to ensure top margin on overflow pages */}
        <View style={{ height: 35 }} fixed />

        {/* Content Area */}
        <View style={{ paddingHorizontal: 40, paddingBottom: 110 }}>
          <Text
            style={[
              styles.sectionTitle,
              { marginBottom: 15, color: colors.maroon, fontSize: 24 },
            ]}
          >
            {labels.summary}
          </Text>

          <View>
            {summary_blocks.length > 0 ? (
              summary_blocks.map((block: any, index: number) => (
                <View key={index} style={styles.summaryBlock} wrap={true}>
                  {(block.type === "heading" ||
                    block.type === "subheading") && (
                    <Text style={styles.summaryHeading}>{block.text}</Text>
                  )}
                  {(block.type === "paragraph" || block.type === "closing") && (
                    <Text style={styles.summaryText}>{block.text}</Text>
                  )}
                  {block.type === "highlight_box" && (
                    <View style={styles.highlightBox}>
                      {block.title && (
                        <Text
                          style={[
                            styles.summaryHeading,
                            {
                              fontSize: 12,
                              color: colors.maroon,
                              marginTop: 0,
                            },
                          ]}
                        >
                          {block.title}
                        </Text>
                      )}
                      <Text style={styles.summaryText}>{block.text}</Text>
                    </View>
                  )}
                  {block.type === "blockquote" && (
                    <View style={styles.blockquote}>
                      <Text
                        style={[
                          styles.summaryText,
                          { marginBottom: 0, fontWeight: 500 },
                        ]}
                      >
                        {block.text}
                      </Text>
                    </View>
                  )}
                  {block.type === "divider" && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  marginTop: 40,
                  opacity: 0.5,
                }}
              >
                {isHindi
                  ? "सारांश रिपोर्ट तैयार की जा रही है..."
                  : "Generating Astrological Summary..."}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerQuote}>
            "Destiny is not a matter of chance; it is a matter of choice."
          </Text>
          <Text
            style={styles.footerPage}
            render={({
              pageNumber,
              totalPages,
            }: {
              pageNumber: number;
              totalPages: number;
            }) => `Page ${pageNumber} | © Urekha`}
          />
        </View>
      </Page>
    </Document>
  );
};
