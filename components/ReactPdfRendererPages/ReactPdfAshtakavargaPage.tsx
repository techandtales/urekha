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
export interface BavTableData {
  sun: number[];
  moon: number[];
  mars: number[];
  mercury: number[];
  jupiter: number[];
  venus: number[];
  saturn: number[];
  ascendant: number[];
  Total: number[];
}

export interface BavResponse {
  [planetName: string]: BavTableData;
}

interface ReactPdfAshtakavargaPageProps {
  lang: Language;
  data?: BavResponse;
  loading?: boolean;
}

// --- CONSTANTS ---
const LABEL_HI: Record<string, string> = {
  sun: "सूर्य",
  moon: "चंद्र",
  mars: "मंगल",
  mercury: "बुध",
  jupiter: "गुरु",
  venus: "शुक्र",
  saturn: "शनि",
  ascendant: "लग्न",
  Total: "कुल",
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

const ROW_KEYS: (keyof BavTableData)[] = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
  "ascendant",
];

const PLANET_ORDER = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
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
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    marginBottom: pt(6),
    borderRadius: 6,
    overflow: "hidden",
  },
  tableTitleRow: {
    backgroundColor: "#FCFAF5",
    paddingHorizontal: pt(4),
    paddingVertical: pt(2),
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
    flexDirection: "row",
    alignItems: "center",
  },
  tableTitleText: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: pt(2),
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
  },

  colHeaderPlanet: {
    width: "16%",
    paddingVertical: pt(1.5),
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

  colHeaderSign: { width: "7%", paddingVertical: pt(1.5), textAlign: "center" },
  colHeaderTextSign: {
    fontSize: 8,
    fontFamily: "Times-Bold",
    color: "#7B1818",
  },

  cellPlanet: {
    width: "16%",
    paddingVertical: pt(1.5),
    paddingHorizontal: pt(2),
    borderRightWidth: 1,
    borderRightColor: "#F3F4F6",
    justifyContent: "center",
  },
  cellTextPlanet: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#111827",
    textTransform: "capitalize",
  },

  cellValue: {
    width: "7%",
    paddingVertical: pt(1.5),
    alignItems: "center",
    justifyContent: "center",
  },
  cellTextValue: { fontSize: 9, fontFamily: "Times-Bold", color: "#111827" },
  cellTextEmpty: { fontSize: 9, color: "#D1D5DB" }, // Matches text-gray-300

  cellTotalLabel: {
    width: "16%",
    paddingVertical: pt(1.5),
    paddingHorizontal: pt(2),
    borderRightWidth: 1,
    borderRightColor: "#FDBA74",
    justifyContent: "center",
  },
  cellTextTotalLabel: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#9A3412",
    textTransform: "uppercase",
  },

  cellTotalValue: {
    width: "7%",
    paddingVertical: pt(1.5),
    alignItems: "center",
    justifyContent: "center",
  },
  cellTextTotalValue: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#9A3412",
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
  <Svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "#ca8a04" }}>
    <Polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      stroke="#ca8a04"
      fill="#ca8a04"
      strokeWidth={2}
    />
  </Svg>
);

// --- DUMMY DATA ---
const createDummyMatrix = () => {
  const tableData: BavTableData = {
    sun: [1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0],
    moon: [0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1],
    mars: [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    mercury: [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    jupiter: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    venus: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    saturn: [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    ascendant: [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    Total: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // simplified
  };
  return tableData;
};

const defaultDummyBav: BavResponse = {
  Sun: createDummyMatrix(),
  Moon: createDummyMatrix(),
  Mars: createDummyMatrix(),
  Mercury: createDummyMatrix(),
  Jupiter: createDummyMatrix(),
  Venus: createDummyMatrix(),
  Saturn: createDummyMatrix(),
};

// --- COMPONENT ---
export default function ReactPdfAshtakavargaPage({
  lang,
  data,
  loading = false,
}: ReactPdfAshtakavargaPageProps) {
  const isHindi = lang === "hi";

  // Hindi font override
  const hindiFont = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBold = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  const t = {
    titleEn: "Binnashtakavarga Tables",
    titleHi:
      "\u092D\u093F\u0928\u094D\u0928\u093E\u0937\u094D\u091F\u0915 \u0935\u0930\u094D\u0917 \u0938\u093E\u0930\u0923\u0940",
    heading: isHindi
      ? "\u0938\u093E\u0924\u094B\u0902 \u0917\u094D\u0930\u0939\u094B\u0902 \u0915\u093E \u092D\u093F\u0928\u094D\u0928\u093E\u0937\u094D\u091F\u0915 \u0935\u0930\u094D\u0917"
      : "Binnashtakavarga of 7 Planets",
    subHeading: isHindi
      ? "\u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0917\u094D\u0930\u0939 \u0915\u093E \u0905\u092A\u0928\u0940 \u0905\u0937\u094D\u091F\u0915\u0935\u0930\u094D\u0917 \u0938\u093E\u0930\u0923\u0940 \u092E\u0947\u0902 \u092F\u094B\u0917\u0926\u093E\u0928"
      : "Detailed contribution matrices for each planet",
  };

  const signs = isHindi ? SIGNS_HI : SIGNS_EN;

  const getLabel = (key: string) => {
    if (!isHindi) return key;
    return LABEL_HI[key] || key;
  };

  const getPlanetName = (name: string) => {
    if (!isHindi) return name;
    return LABEL_HI[name.toLowerCase()] || name;
  };

  const currentData = data && Object.keys(data).length > 0 ? data : ({} as any);

  // We group them into 2 tables per page for A4 to avoid overflow.
  const ITEMS_PER_PAGE = 2;
  const pages = [];
  for (let i = 0; i < PLANET_ORDER.length; i += ITEMS_PER_PAGE) {
    pages.push(PLANET_ORDER.slice(i, i + ITEMS_PER_PAGE));
  }

  if (loading) {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.loadingText, hindiFont]}>
            {isHindi
              ? "\u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u093E \u0939\u0948..."
              : "Loading..."}
          </Text>
        </View>
      </Page>
    );
  }

  return (
    <>
      {pages.map((planetGroup, pageIndex) => (
        <Page
          key={`bav-page-${pageIndex}`}
          size="A4"
          style={[styles.page, hindiFont]}
        >
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

          {/* Section Heading (only on first page like original HTML) */}
          {pageIndex === 0 && (
            <View style={styles.sectionHeadingBox}>
              <View style={styles.iconWrapper}>
                <GridIcon />
              </View>
              <View>
                <Text style={[styles.sectionTitle, hindiBold]}>
                  {t.heading}
                </Text>
                <Text style={[styles.sectionSubtitle, hindiFont]}>
                  {t.subHeading}
                </Text>
              </View>
            </View>
          )}

          {/* Tables */}
          {planetGroup.map((planet) => {
            const tableData = currentData[planet] || createDummyMatrix();
            return (
              <View key={planet} style={styles.tableWrapper}>
                {/* Table Title */}
                <View style={styles.tableTitleRow}>
                  <StarIcon />
                  <Text style={[styles.tableTitleText, hindiBold]}>
                    {isHindi
                      ? `${getPlanetName(planet)} \u0915\u093E \u092D\u093F\u0928\u094D\u0928\u093E\u0937\u094D\u091F\u0915 \u0935\u0930\u094D\u0917`
                      : `Binnashtakavarga of ${planet}`}
                  </Text>
                </View>

                {/* Table Header Row */}
                <View
                  style={[
                    styles.row,
                    { borderBottomWidth: 1, borderBottomColor: "#FECDD3" },
                  ]}
                >
                  <View style={styles.colHeaderPlanet}>
                    <Text style={[styles.colHeaderTextPlanet, hindiBold]}>
                      {isHindi ? "\u0917\u094D\u0930\u0939" : "Planet"}
                    </Text>
                  </View>
                  {signs.map((sign, i) => (
                    <View key={i} style={styles.colHeaderSign}>
                      <Text style={[styles.colHeaderTextSign, hindiBold]}>
                        {sign}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Table Body Rows */}
                {ROW_KEYS.map((key, rowIndex) => (
                  <View
                    key={key}
                    style={[
                      styles.row,
                      rowIndex % 2 !== 0 ? styles.rowEven : styles.rowOdd,
                    ]}
                  >
                    <View style={styles.cellPlanet}>
                      <Text style={[styles.cellTextPlanet, hindiBold]}>
                        {getLabel(key)}
                      </Text>
                    </View>
                    {tableData[key]?.map((val: number, j: number) => (
                      <View key={j} style={styles.cellValue}>
                        <Text
                          style={
                            val === 1
                              ? styles.cellTextValue
                              : styles.cellTextEmpty
                          }
                        >
                          {val}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}

                {/* Table Total Row */}
                <View style={[styles.row, styles.rowTotal]}>
                  <View style={styles.cellTotalLabel}>
                    <Text style={[styles.cellTextTotalLabel, hindiBold]}>
                      {isHindi ? "\u0915\u0941\u0932" : "Total"}
                    </Text>
                  </View>
                  {tableData.Total?.map((val: number, j: number) => (
                    <View key={j} style={styles.cellTotalValue}>
                      <Text style={styles.cellTextTotalValue}>{val}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

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
      ))}
    </>
  );
}
