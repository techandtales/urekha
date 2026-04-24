import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Polyline,
  Rect,
  Polygon,
  Font,
} from "@react-pdf/renderer";
import { Language } from "@/types/languages";
import {
  resolveTranslations,
  yoginiTranslations,
  YOGINI_NAMES_HI,
  PLANET_NAMES_HI,
  translateName,
} from "@/lib/i18n";

// Register custom fonts
import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- TYPES ---
export interface YoginiDashaResponse {
  dasha_list: string[];
  dasha_end_dates: string[];
  dasha_lord_list: string[];
  start_date?: number;
}

interface ReactPdfYoginiDashaPageProps {
  lang: Language;
  data?: YoginiDashaResponse;
  loading?: boolean;
}

// --- DUMMY DATA ---
const dummyYoginiData: YoginiDashaResponse = {
  dasha_list: [
    "Ulka",
    "Siddha",
    "Sankata",
    "Mangala",
    "Pingala",
    "Dhanya",
    "Bhramari",
    "Bhadrika",
    "Ulka",
    "Siddha",
    "Sankata",
    "Mangala",
    "Pingala",
    "Dhanya",
    "Bhramari",
    "Bhadrika",
    "Ulka",
    "Siddha",
    "Sankata",
    "Mangala",
    "Pingala",
    "Dhanya",
    "Bhramari",
    "Bhadrika",
  ],
  dasha_end_dates: [
    "Sat, Dec 14, 2024",
    "Sat, Dec 14, 2030",
    "Mon, Dec 14, 2037",
    "Thu, Dec 14, 2045",
    "Fri, Dec 14, 2046",
    "Mon, Dec 14, 2048",
    "Thu, Dec 14, 2051",
    "Tue, Dec 14, 2055",
    "Tue, Dec 14, 2060",
    "Tue, Dec 14, 2066",
    "Thu, Dec 14, 2073",
    "Sun, Dec 14, 2081",
    "Mon, Dec 14, 2082",
    "Thu, Dec 14, 2084",
    "Sun, Dec 14, 2087",
    "Fri, Dec 14, 2091",
    "Fri, Dec 14, 2096",
    "Thu, Dec 14, 2102",
    "Sat, Dec 14, 2109",
    "Tue, Dec 14, 2117",
    "Wed, Dec 14, 2118",
    "Sat, Dec 14, 2120",
    "Tue, Dec 14, 2123",
    "Sun, Dec 14, 2127",
  ],
  dasha_lord_list: [
    "Saturn",
    "Venus",
    "Rahu/Ketu",
    "Moon",
    "Sun",
    "Jupiter",
    "Mars",
    "Mercury",
    "Saturn",
    "Venus",
    "Rahu/Ketu",
    "Moon",
    "Sun",
    "Jupiter",
    "Mars",
    "Mercury",
    "Saturn",
    "Venus",
    "Rahu/Ketu",
    "Moon",
    "Sun",
    "Jupiter",
    "Mars",
    "Mercury",
  ],
};

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

  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#FCFAF5",
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
  },
  colHeaderDasha: {
    width: "22%",
    paddingVertical: pt(2),
    paddingHorizontal: pt(3),
    borderRightWidth: 0.5,
    borderRightColor: "#C5A059",
  },
  colHeaderLord: {
    width: "18%",
    paddingVertical: pt(2),
    paddingHorizontal: pt(3),
  },
  colHeaderDate: {
    width: "30%",
    paddingVertical: pt(2),
    paddingHorizontal: pt(3),
  },
  colHeaderText: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textAlign: "left",
    textTransform: "uppercase",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  rowEven: { backgroundColor: "#FAFAFA" },
  rowOdd: { backgroundColor: "#FFFFFF" },

  cellDasha: {
    width: "22%",
    paddingVertical: pt(1.5),
    paddingHorizontal: pt(3),
    borderRightWidth: 0.5,
    borderRightColor: "#F3F4F6",
    justifyContent: "center",
  },
  cellDashaText: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#111827",
    textTransform: "capitalize",
  },

  cellLord: {
    width: "18%",
    paddingVertical: pt(1.5),
    paddingHorizontal: pt(3),
    flex: 1,
    justifyContent: "center",
  },
  cellLordBox: {
    backgroundColor: "rgba(254, 242, 242, 0.5)",
    paddingVertical: pt(0.5),
    paddingHorizontal: pt(1.5),
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  cellLordText: { fontSize: 9, fontFamily: "Times-Bold", color: "#7B1818" },

  cellDate: {
    width: "30%",
    paddingVertical: pt(1.5),
    paddingHorizontal: pt(3),
    justifyContent: "center",
  },
  cellDateText: { fontSize: 9, fontFamily: "Times-Roman", color: "#4B5563" },

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

// --- COMPONENT ---
export default function ReactPdfYoginiDashaPage({
  lang,
  data,
  loading = false,
}: ReactPdfYoginiDashaPageProps) {
  const isHindi = lang === "hi";
  const t = resolveTranslations(yoginiTranslations, lang);

  // Hindi font override
  const hindiFont = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBold = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  const currentData =
    data && data.dasha_list?.length > 0
      ? data
      : ({
          dasha_list: [],
          dasha_lord_list: [],
          dasha_end_dates: [],
        } as YoginiDashaResponse);

  const trYogini = (text: string) =>
    isHindi ? YOGINI_NAMES_HI[text] || text : text;
  const trLord = (text: string) =>
    isHindi ? PLANET_NAMES_HI[text] || text : text;

  // Process data into rows
  const rows = currentData.dasha_list.map((dasha: string, i: number) => {
    const lord = currentData.dasha_lord_list[i];
    const endRaw = currentData.dasha_end_dates[i] || "";
    let endDate = String(endRaw);

    // Attempt parse
    const parsedEnd = new Date(endRaw);
    if (!isNaN(parsedEnd.getTime())) {
      endDate = parsedEnd.toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      endDate = endDate.split(",").slice(0, 2).join(",").trim() || endDate;
    }

    let startDate = "-";
    if (i > 0) {
      const prevEnd = currentData.dasha_end_dates[i - 1] || "";
      startDate = String(prevEnd);
      const parsedStart = new Date(prevEnd);
      if (!isNaN(parsedStart.getTime())) {
        startDate = parsedStart.toLocaleDateString(
          isHindi ? "hi-IN" : "en-IN",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        );
      } else {
        startDate =
          startDate.split(",").slice(0, 2).join(",").trim() || startDate;
      }
    }

    return { dasha, lord, startDate, endDate };
  });

  if (loading) {
    return (
      <Page size="A4" style={[styles.page, hindiFont]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.loadingText, hindiFont]}>
            {isHindi ? "लोड हो रहा है..." : "Loading..."}
          </Text>
        </View>
      </Page>
    );
  }

  return (
    <Page size="A4" style={[styles.page, hindiFont]} wrap>
      {/* Fixed UI Layer - repeated on every page */}
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      <View fixed style={styles.footer}>
        <Text style={[styles.footerText, hindiFont]}>
          {isHindi
            ? "युरेखा \u2022 वैदिक इंटेलिजेंस"
            : "UREKHA \u2022 Vedic Intelligence"}
        </Text>
        <Text style={[styles.footerText, { color: "#9CA3AF" }]}>
          www.urekha.com
        </Text>
      </View>

      {/* Header (rendered once at top of first page) */}
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

      {/* Wrapping Table container */}
      <View style={styles.tableWrapper}>
        <View style={styles.rowHeader} fixed>
          <View style={styles.colHeaderDasha}>
            <Text style={[styles.colHeaderText, hindiBold]}>{t.dasha}</Text>
          </View>
          <View style={styles.colHeaderLord}>
            <Text style={[styles.colHeaderText, hindiBold]}>{t.lord}</Text>
          </View>
          <View style={styles.colHeaderDate}>
            <Text style={[styles.colHeaderText, hindiBold]}>{t.start}</Text>
          </View>
          <View style={styles.colHeaderDate}>
            <Text style={[styles.colHeaderText, hindiBold]}>{t.end}</Text>
          </View>
        </View>

        {rows.map(
          (
            row: {
              dasha: string;
              lord: string;
              startDate: string;
              endDate: string;
            },
            i: number,
          ) => (
            <View
              key={i}
              style={[styles.row, i % 2 !== 0 ? styles.rowEven : styles.rowOdd]}
              wrap={false}
            >
              <View style={styles.cellDasha}>
                <Text style={[styles.cellDashaText, hindiBold]}>
                  {trYogini(row.dasha)}
                </Text>
              </View>
              <View style={styles.cellLord}>
                <View style={styles.cellLordBox}>
                  <Text style={[styles.cellLordText, hindiBold]}>
                    {trLord(row.lord)}
                  </Text>
                </View>
              </View>
              <View style={styles.cellDate}>
                <Text style={[styles.cellDateText, hindiFont]}>
                  {row.startDate}
                </Text>
              </View>
              <View style={styles.cellDate}>
                <Text style={[styles.cellDateText, hindiFont]}>
                  {row.endDate}
                </Text>
              </View>
            </View>
          ),
        )}
      </View>
    </Page>
  );
}
