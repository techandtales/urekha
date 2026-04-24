import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Rect,
  Polygon,
  Font,
} from "@react-pdf/renderer";
import { Language } from "@/types/languages";

// Register custom fonts
import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- TYPES ---
export interface SarvashtakavargaResponse {
  ashtakvarga_order: string[];
  ashtakvarga_points: number[][];
  ashtakvarga_total: number[];
}

interface ReactPdfSarvashtakavargaPageProps {
  lang: Language;
  data?: SarvashtakavargaResponse;
  loading?: boolean;
}

// --- CONSTANTS ---
const PLANET_HI: Record<string, string> = {
  Sun: "सूर्य",
  Moon: "चंद्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
  Ascendant: "लग्न",
};

const SIGNS_EN = [
  "Ar",
  "Ta",
  "Ge",
  "Cn",
  "Le",
  "Vi",
  "Li",
  "Sc",
  "Sa",
  "Cp",
  "Aq",
  "Pi",
];
const SIGNS_HI = [
  "मेष",
  "वृष",
  "मि",
  "कर्क",
  "सिंह",
  "कन्या",
  "तुला",
  "वृश्व",
  "धनु",
  "मकर",
  "कुंभ",
  "मीन",
];

// --- STYLES ---
const styles = StyleSheet.create({
  page: {
    paddingTop: pt(16),
    paddingBottom: pt(20),
    paddingHorizontal: pt(18),
    backgroundColor: "#FFFDF5",
    fontFamily: "Times-Roman",
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

  // Section Headings
  sectionHeadingBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: pt(4),
    borderBottomWidth: 0.5,
    borderBottomColor: "#C5A059",
    paddingBottom: pt(3),
  },
  iconWrapper: {
    padding: pt(2),
    backgroundColor: "#FFF1F2",
    borderRadius: 8,
    marginRight: pt(3),
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 9,
    color: "#4B5563",
    marginTop: 2,
    fontFamily: "Times-Italic",
  },

  // Table Styling
  tableWrapper: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    marginTop: pt(2),
    borderRadius: 6,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  rowEven: { backgroundColor: "#FAFAFA" },
  rowOdd: { backgroundColor: "#FFFFFF" },
  rowTotal: {
    backgroundColor: "#FFF7ED",
    borderTopWidth: 1,
    borderTopColor: "#FDBA74",
  }, // matches orange-50/200

  colHeaderPlanet: {
    width: "16%",
    paddingVertical: pt(2),
    paddingHorizontal: pt(2),
    borderRightWidth: 1,
    borderRightColor: "#C5A059",
    backgroundColor: "#FCFAF5",
  },
  colHeaderTextPlanet: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textAlign: "left",
  },

  colHeaderSign: {
    width: "7%",
    paddingVertical: pt(2),
    textAlign: "center",
    backgroundColor: "#FCFAF5",
  },
  colHeaderTextSign: {
    fontSize: 8,
    fontFamily: "Times-Bold",
    color: "#7B1818",
  },

  cellPlanet: {
    width: "16%",
    paddingVertical: pt(2),
    paddingHorizontal: pt(2),
    borderRightWidth: 1,
    borderRightColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
  },
  cellTextPlanet: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#111827",
    marginLeft: 4,
  },

  cellValue: {
    width: "7%",
    paddingVertical: pt(2),
    alignItems: "center",
    justifyContent: "center",
  },
  cellTextValue: { fontSize: 10, fontFamily: "Times-Bold", color: "#111827" },
  cellTextValueHigh: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    color: "#065F46",
  }, // emerald-800
  cellTextValueLow: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    color: "#991B1B",
  }, // red-800
  cellTextValueNeutral: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    color: "#4B5563",
  }, // text-gray-600

  cellValueBgHigh: { backgroundColor: "rgba(209, 250, 229, 0.4)" }, // bg-emerald-50
  cellValueBgLow: { backgroundColor: "rgba(254, 242, 242, 0.5)" }, // bg-red-50

  cellTotalLabel: {
    width: "16%",
    paddingVertical: pt(2.5),
    paddingHorizontal: pt(2),
    borderRightWidth: 1,
    borderRightColor: "#FDBA74",
    justifyContent: "center",
  },
  cellTextTotalLabel: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    color: "#9A3412",
    textTransform: "uppercase",
  },

  cellTotalValue: {
    width: "7%",
    paddingVertical: pt(2.5),
    alignItems: "center",
    justifyContent: "center",
  },
  cellTextTotalValue: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    color: "#9A3412",
  },

  // Interpretation Note
  noteBox: {
    marginTop: pt(6),
    padding: pt(3),
    backgroundColor: "#FFFDF5",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 4,
  },
  noteBoxText: {
    fontSize: 9,
    fontFamily: "Times-Italic",
    color: "#52525B",
    lineHeight: 1.4,
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
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontSize: 14, color: "#A1A1AA", fontFamily: "Times-Italic" },
});

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

const GridIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#7B1818" }}>
    <Rect
      width="7"
      height="7"
      x="3"
      y="3"
      rx="1"
      fill="none"
      stroke="#7B1818"
      strokeWidth={2}
    />
    <Rect
      width="7"
      height="7"
      x="14"
      y="3"
      rx="1"
      fill="none"
      stroke="#7B1818"
      strokeWidth={2}
    />
    <Rect
      width="7"
      height="7"
      x="14"
      y="14"
      rx="1"
      fill="none"
      stroke="#7B1818"
      strokeWidth={2}
    />
    <Rect
      width="7"
      height="7"
      x="3"
      y="14"
      rx="1"
      fill="none"
      stroke="#7B1818"
      strokeWidth={2}
    />
  </Svg>
);

const StarIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 10, height: 10, color: "#ca8a04" }}>
    <Polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      stroke="#ca8a04"
      fill="#ca8a04"
      strokeWidth={1.5}
    />
  </Svg>
);

// --- DUMMY DATA ---
const dummySavData: SarvashtakavargaResponse = {
  ashtakvarga_order: [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Ascendant",
  ],
  ashtakvarga_points: [
    [3, 4, 4, 3, 5, 2, 6, 4, 3, 4, 5, 5],
    [5, 4, 6, 2, 4, 5, 4, 4, 4, 6, 5, 0],
    [4, 4, 3, 4, 3, 3, 5, 3, 2, 4, 4, 0],
    [5, 4, 4, 5, 5, 4, 3, 6, 3, 6, 4, 5],
    [6, 4, 5, 3, 5, 6, 6, 5, 3, 6, 3, 4],
    [5, 4, 5, 4, 6, 3, 4, 4, 6, 5, 3, 3],
    [3, 4, 4, 3, 3, 2, 5, 4, 3, 4, 3, 1],
    [5, 4, 5, 4, 3, 6, 4, 5, 4, 3, 5, 1],
  ],
  ashtakvarga_total: [36, 32, 36, 28, 34, 31, 37, 35, 28, 38, 32, 19],
};

// --- COMPONENT ---
export default function ReactPdfSarvashtakavargaPage({
  lang,
  data,
  loading = false,
}: ReactPdfSarvashtakavargaPageProps) {
  const isHindi = lang === "hi";

  // Hindi font override
  const hindiFont = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBold = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  const t = {
    titleEn: "Sarvashtakavarga Summary",
    titleHi: "सर्वाष्टक वर्ग (Summary)",
    heading: isHindi ? "सर्वाष्टक वर्ग सारणी" : "Sarvashtakavarga Table",
    subHeading: isHindi
      ? "सभी ग्रहों का संयुक्त अष्टकवर्ग योग"
      : "Consolidated Ashtakavarga Points for all Planets",
    planet: isHindi ? "ग्रह" : "Planet",
    total: isHindi ? "कुल योग" : "Total (SAV)",
  };

  const signs = isHindi ? SIGNS_HI : SIGNS_EN;

  const trPlanet = (name: string) => {
    if (!isHindi) return name;
    return PLANET_HI[name] || name;
  };

  const currentData =
    data && data.ashtakvarga_order?.length > 0
      ? data
      : ({ ashtakvarga_order: [], ashtakvarga_points: {} } as any);

  if (loading) {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.loadingText, hindiFont]}>
            {isHindi ? "लोड हो रहा है..." : "Loading..."}
          </Text>
        </View>
      </Page>
    );
  }

  return (
    <Page size="A4" style={[styles.page, hindiFont]}>
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.headerTitle,
            hindiBold,
            { letterSpacing: isHindi ? 0 : 2 },
          ]}
        >
          {isHindi ? t.titleHi : t.titleEn}
        </Text>
        <OrnateHeadingDivider />
      </View>

      {/* Section Heading */}
      <View style={styles.sectionHeadingBox}>
        <View style={styles.iconWrapper}>
          <GridIcon />
        </View>
        <View>
          <Text style={[styles.sectionTitle, hindiBold]}>{t.heading}</Text>
          <Text style={[styles.sectionSubtitle, hindiFont]}>
            {t.subHeading}
          </Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableWrapper}>
        {/* Table Header Row */}
        <View
          style={[
            styles.row,
            { borderBottomWidth: 1, borderBottomColor: "#FECDD3" },
          ]}
        >
          <View style={styles.colHeaderPlanet}>
            <Text style={[styles.colHeaderTextPlanet, hindiBold]}>
              {t.planet}
            </Text>
          </View>
          {signs.map((sign, i) => (
            <View key={i} style={styles.colHeaderSign}>
              <Text style={[styles.colHeaderTextSign, hindiBold]}>{sign}</Text>
            </View>
          ))}
        </View>

        {/* Table Body Rows */}
        {currentData.ashtakvarga_order.map((planet: string, i: number) => {
          const rowValues =
            currentData.ashtakvarga_points[i] || Array(12).fill(0);
          return (
            <View
              key={planet}
              style={[styles.row, i % 2 !== 0 ? styles.rowEven : styles.rowOdd]}
            >
              <View style={styles.cellPlanet}>
                <StarIcon />
                <Text style={[styles.cellTextPlanet, hindiBold]}>
                  {trPlanet(planet)}
                </Text>
              </View>
              {rowValues.map((val: number, j: number) => {
                const isHigh = val >= 5;
                const isLow = val <= 3;
                return (
                  <View
                    key={j}
                    style={[
                      styles.cellValue,
                      isHigh
                        ? styles.cellValueBgHigh
                        : isLow
                          ? styles.cellValueBgLow
                          : {},
                    ]}
                  >
                    <Text
                      style={
                        isHigh
                          ? styles.cellTextValueHigh
                          : isLow
                            ? styles.cellTextValueLow
                            : styles.cellTextValueNeutral
                      }
                    >
                      {val}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Total SAV Row */}
        <View style={[styles.row, styles.rowTotal]}>
          <View style={styles.cellTotalLabel}>
            <Text style={[styles.cellTextTotalLabel, hindiBold]}>
              {t.total}
            </Text>
          </View>
          {currentData.ashtakvarga_total.map((val: number, j: number) => (
            <View key={j} style={styles.cellTotalValue}>
              <Text style={styles.cellTextTotalValue}>{val}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Note interpretation box */}
      <View style={styles.noteBox}>
        <Text style={[styles.noteBoxText, hindiFont]}>
          {isHindi
            ? "नोट: २८ या उससे अधिक बिंदु शुभ माने जाते हैं। ३०+ बिंदु उत्कृष्ट परिणाम दर्शाते हैं।"
            : "Note: Points 28 or above are considered distinct data. Points 30+ indicate excellent results for that House."}
        </Text>
      </View>

      {/* Footer */}
      <View fixed style={styles.footer}>
        <Text style={[styles.footerText, hindiFont]}>
          {isHindi
            ? "\u092F\u0941\u0930\u0947\u0916\u093E \u2022 \u0935\u0948\u0926\u093F\u0915 \u0907\u0902\u091F\u0947\u0932\u093F\u091C\u0947\u0902\u0938"
            : "UREKHA \u2022 Vedic Intelligence"}
        </Text>
        <Text style={[styles.footerText, { color: "#9CA3AF" }]}>
          www.urekha.com
        </Text>
      </View>
    </Page>
  );
}
