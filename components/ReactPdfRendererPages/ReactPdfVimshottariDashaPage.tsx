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
  vimshottariTranslations,
  DASHA_CHAIN_ROWS,
  PLANET_NAMES_HI,
} from "@/lib/i18n";

// Register custom fonts
import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- TYPES ---
export interface DashaPeriod {
  name: string;
  start: string;
  end: string;
}

export interface DashaResponse {
  mahadasha: DashaPeriod[];
  antardasha: DashaPeriod[];
  paryantardasha: DashaPeriod[];
  Shookshamadasha: DashaPeriod[];
  Pranadasha: DashaPeriod[];
  order_names: string[];
  order_of_dashas: {
    major: DashaPeriod;
    minor: DashaPeriod;
    sub_minor: DashaPeriod;
    sub_sub_minor: DashaPeriod;
    sub_sub_sub_minor: DashaPeriod;
  };
}

interface ReactPdfVimshottariDashaPageProps {
  lang: Language;
  data?: DashaResponse;
  loading?: boolean;
}

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
    marginBottom: pt(2),
  },
  iconWrapper: {
    padding: pt(1.5),
    backgroundColor: "#FFF1F2",
    borderRadius: 6,
    marginRight: pt(2),
  },
  sectionTitle: { fontSize: 13, fontFamily: "Times-Bold", color: "#7B1818" },
  sectionSubtitle: {
    fontSize: 9,
    color: "#4B5563",
    marginLeft: pt(7),
    marginBottom: pt(4),
    fontFamily: "Times-Italic",
  },

  // Table Container
  tableWrapper: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    marginBottom: pt(4),
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#FCFAF5",
    paddingHorizontal: pt(3),
    paddingVertical: pt(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
    flexDirection: "row",
    alignItems: "center",
  },
  tableHeaderIcon: {
    padding: pt(1.5),
    backgroundColor: "#FEFCE8",
    borderRadius: 4,
    marginRight: pt(2),
  },
  tableTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: "#111827",
    textTransform: "uppercase",
  },

  // Table Rows
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#FCFAF5",
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
  },
  colHeaderPlanet: {
    width: "33%",
    paddingVertical: pt(2),
    paddingHorizontal: pt(3),
    borderRightWidth: 0.5,
    borderRightColor: "#C5A059",
  },
  colHeaderText: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
  },
  colHeaderDate: {
    width: "33%",
    paddingVertical: pt(2),
    paddingHorizontal: pt(3),
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },
  rowEven: { backgroundColor: "#FAFAFA" },
  rowOdd: { backgroundColor: "#FFFFFF" },
  rowHighlight: { backgroundColor: "#FFF7ED" },

  cellPlanet: {
    width: "33%",
    paddingVertical: pt(1.5),
    paddingHorizontal: pt(3),
    borderRightWidth: 0.5,
    borderRightColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
  },
  cellPlanetText: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#111827",
    textTransform: "capitalize",
  },
  cellPlanetTextHighlight: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "capitalize",
  },

  cellDate: {
    width: "33%",
    paddingVertical: pt(1.5),
    paddingHorizontal: pt(3),
  },
  cellDateText: { fontSize: 9, fontFamily: "Times-Roman", color: "#4B5563" },
  cellDateTextHighlight: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#9A3412",
  },

  // Summary Table (Page 3)
  summaryColLevel: {
    width: "25%",
    paddingVertical: pt(2),
    paddingHorizontal: pt(3),
    borderRightWidth: 0.5,
    borderRightColor: "#E5E7EB",
  },
  summaryColText: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
  },
  summaryCellLevelText: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#374151",
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

const ClockIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#EA580C" }}>
    <Circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke="#EA580C"
      strokeWidth={2}
    />
    <Polyline
      points="12 6 12 12 16 14"
      fill="none"
      stroke="#EA580C"
      strokeWidth={2}
    />
  </Svg>
);

const ZapIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#EA580C" }}>
    <Polygon
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      fill="none"
      stroke="#EA580C"
      strokeWidth={2}
    />
  </Svg>
);

const LayersIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "#EA580C" }}>
    <Polygon
      points="12 2 2 7 12 12 22 7 12 2"
      fill="none"
      stroke="#EA580C"
      strokeWidth={2}
    />
    <Polyline
      points="2 12 12 17 22 12"
      fill="none"
      stroke="#EA580C"
      strokeWidth={2}
    />
    <Polyline
      points="2 17 12 22 22 17"
      fill="none"
      stroke="#EA580C"
      strokeWidth={2}
    />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: 10, height: 10, color: "#EA580C", marginRight: 4 }}
  >
    <Polyline
      points="9 18 15 12 9 6"
      fill="none"
      stroke="#EA580C"
      strokeWidth={3}
    />
  </Svg>
);

// --- DUMMY DATA ---
const createDummyPeriods = () => [
  { name: "Sun", start: "Sat Aug 22 2015", end: "Mon Aug 22 2021" },
  { name: "Moon", start: "Mon Aug 22 2021", end: "Mon Aug 22 2031" },
  { name: "Mars", start: "Mon Aug 22 2031", end: "Sat Aug 22 2038" },
  { name: "Rahu", start: "Sat Aug 22 2038", end: "Mon Aug 22 2056" },
  { name: "Jupiter", start: "Mon Aug 22 2056", end: "Sun Aug 22 2072" },
  { name: "Saturn", start: "Sun Aug 22 2072", end: "Fri Aug 22 2091" },
];

const dummyDashaData: DashaResponse = {
  mahadasha: createDummyPeriods(),
  antardasha: createDummyPeriods(),
  paryantardasha: createDummyPeriods(),
  Shookshamadasha: createDummyPeriods(),
  Pranadasha: createDummyPeriods(),
  order_names: ["Moon", "Rahu", "Saturn", "Jupiter", "Mars"],
  order_of_dashas: {
    major: { name: "Moon", start: "Mon Aug 22 2021", end: "Mon Aug 22 2031" },
    minor: { name: "Rahu", start: "Sat Aug 22 2038", end: "Mon Aug 22 2056" },
    sub_minor: {
      name: "Saturn",
      start: "Sun Aug 22 2072",
      end: "Fri Aug 22 2091",
    },
    sub_sub_minor: {
      name: "Jupiter",
      start: "Mon Aug 22 2056",
      end: "Sun Aug 22 2072",
    },
    sub_sub_sub_minor: {
      name: "Mars",
      start: "Mon Aug 22 2031",
      end: "Sat Aug 22 2038",
    },
  },
};

// --- RENDER HELPERS ---
const Footer = ({
  isHindi,
  hindiFont,
}: {
  isHindi: boolean;
  hindiFont: any;
}) => (
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
);

const Header = ({
  titleEn,
  titleHi,
  isHindi,
  hindiBold,
}: {
  titleEn: string;
  titleHi: string;
  isHindi: boolean;
  hindiBold: any;
}) => (
  <View style={styles.headerContainer}>
    <Text
      style={[
        styles.headerTitle,
        hindiBold,
        { letterSpacing: isHindi ? 0 : 2 },
      ]}
    >
      {isHindi ? titleHi : titleEn}
    </Text>
    <OrnateHeadingDivider />
  </View>
);

const SectionHeader = ({
  title,
  subtitle,
  icon,
  isHindi,
  hindiFont,
  hindiBold,
}: {
  title: string;
  subtitle: string;
  icon: "clock" | "zap";
  isHindi: boolean;
  hindiFont: any;
  hindiBold: any;
}) => (
  <>
    <View style={styles.sectionHeadingBox}>
      <View style={styles.iconWrapper}>
        {icon === "clock" ? <ClockIcon /> : <ZapIcon />}
      </View>
      <Text style={[styles.sectionTitle, hindiBold]}>{title}</Text>
    </View>
    <Text style={[styles.sectionSubtitle, hindiFont]}>{subtitle}</Text>
  </>
);

const DashaTable = ({
  title,
  data,
  highlightName,
  tTracker,
  isHindi,
  trLabel,
  hindiFont,
  hindiBold,
}: {
  title: string;
  data: DashaPeriod[];
  highlightName?: string;
  tTracker: any;
  isHindi: boolean;
  trLabel: (n: string) => string;
  hindiFont: any;
  hindiBold: any;
}) => (
  <View style={styles.tableWrapper}>
    <View style={styles.tableHeader}>
      <View style={styles.tableHeaderIcon}>
        <LayersIcon />
      </View>
      <Text style={[styles.tableTitle, hindiBold]}>{title}</Text>
    </View>
    <View style={styles.rowHeader}>
      <View style={styles.colHeaderPlanet}>
        <Text style={[styles.colHeaderText, hindiBold]}>{tTracker.planet}</Text>
      </View>
      <View style={styles.colHeaderDate}>
        <Text style={[styles.colHeaderText, hindiBold]}>
          {tTracker.startDate}
        </Text>
      </View>
      <View style={styles.colHeaderDate}>
        <Text style={[styles.colHeaderText, hindiBold]}>
          {tTracker.endDate}
        </Text>
      </View>
    </View>
    {data.map((row, i) => {
      const isHighlighted = highlightName && row.name === highlightName;
      return (
        <View
          key={i}
          style={[
            styles.row,
            isHighlighted
              ? styles.rowHighlight
              : i % 2 !== 0
                ? styles.rowEven
                : styles.rowOdd,
          ]}
        >
          <View style={styles.cellPlanet}>
            {isHighlighted && <ChevronRightIcon />}
            <Text
              style={[
                isHighlighted
                  ? styles.cellPlanetTextHighlight
                  : styles.cellPlanetText,
                hindiBold,
              ]}
            >
              {trLabel(row.name)}
            </Text>
          </View>
          <View style={styles.cellDate}>
            <Text
              style={[
                isHighlighted
                  ? styles.cellDateTextHighlight
                  : styles.cellDateText,
                hindiFont,
              ]}
            >
              {row.start}
            </Text>
          </View>
          <View style={styles.cellDate}>
            <Text
              style={[
                isHighlighted
                  ? styles.cellDateTextHighlight
                  : styles.cellDateText,
                hindiFont,
              ]}
            >
              {row.end}
            </Text>
          </View>
        </View>
      );
    })}
  </View>
);

// --- COMPONENT ---
export default function ReactPdfVimshottariDashaPage({
  lang,
  data,
  loading = false,
}: ReactPdfVimshottariDashaPageProps) {
  const isHindi = lang === "hi";
  const t = resolveTranslations(vimshottariTranslations, lang);

  // Hindi font override
  const hindiFont = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBold = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  // Actually the dasha tables use translations from `dashaTableTranslations`, I'll adapt them manually:
  const tTracker = {
    planet: isHindi ? "ग्रह" : "Planet",
    startDate: isHindi ? "आरंभ तिथि" : "Start Date",
    endDate: isHindi ? "समाप्ति तिथि" : "End Date",
  };

  const trStr = (name: string) =>
    isHindi ? PLANET_NAMES_HI[name] || name : name;

  const currentData =
    data && data.mahadasha?.length > 0
      ? data
      : ({
          mahadasha: [],
          antardasha: [],
          paryantardasha: [],
          Shookshamadasha: [],
          Pranadasha: [],
          order_of_dashas: {},
        } as any);
  const activeMajor = currentData.order_of_dashas?.major?.name;
  const activeMinor = currentData.order_of_dashas?.minor?.name;
  const activeSubMinor = currentData.order_of_dashas?.sub_minor?.name;
  const activeSubSubMinor = currentData.order_of_dashas?.sub_sub_minor?.name;
  const activePrana = currentData.order_of_dashas?.sub_sub_sub_minor?.name;

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
    <>
      {/* PAGE 1: Mahadasha, Antardasha */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <View fixed style={styles.outerBorder} />
        <View fixed style={styles.innerBorder} />

        <Header
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          isHindi={isHindi}
          hindiBold={hindiBold}
        />
        <SectionHeader
          title={t.heading}
          subtitle={t.subHeading}
          icon="clock"
          isHindi={isHindi}
          hindiFont={hindiFont}
          hindiBold={hindiBold}
        />

        <DashaTable
          title={t.mahadasha}
          data={currentData.mahadasha}
          highlightName={activeMajor}
          tTracker={tTracker}
          isHindi={isHindi}
          trLabel={trStr}
          hindiFont={hindiFont}
          hindiBold={hindiBold}
        />
        <DashaTable
          title={t.antardasha}
          data={currentData.antardasha}
          highlightName={activeMinor}
          tTracker={tTracker}
          isHindi={isHindi}
          trLabel={trStr}
          hindiFont={hindiFont}
          hindiBold={hindiBold}
        />

        <Footer isHindi={isHindi} hindiFont={hindiFont} />
      </Page>

      {/* PAGE 2: Paryantardasha & Sookshma */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <View fixed style={styles.outerBorder} />
        <View fixed style={styles.innerBorder} />

        <Header
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          isHindi={isHindi}
          hindiBold={hindiBold}
        />
        <SectionHeader
          title={t.page2Heading}
          subtitle={t.page2SubHeading}
          icon="zap"
          isHindi={isHindi}
          hindiFont={hindiFont}
          hindiBold={hindiBold}
        />

        <DashaTable
          title={t.paryantardasha}
          data={currentData.paryantardasha}
          highlightName={activeSubMinor}
          tTracker={tTracker}
          isHindi={isHindi}
          trLabel={trStr}
          hindiFont={hindiFont}
          hindiBold={hindiBold}
        />
        <DashaTable
          title={t.sookshma}
          data={currentData.Shookshamadasha}
          highlightName={activeSubSubMinor}
          tTracker={tTracker}
          isHindi={isHindi}
          trLabel={trStr}
          hindiFont={hindiFont}
          hindiBold={hindiBold}
        />

        <Footer isHindi={isHindi} hindiFont={hindiFont} />
      </Page>

      {/* PAGE 3: Pranadasha & Summary Table */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <View fixed style={styles.outerBorder} />
        <View fixed style={styles.innerBorder} />

        <Header
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          isHindi={isHindi}
          hindiBold={hindiBold}
        />
        <SectionHeader
          title={t.prana}
          subtitle={t.page3SubHeading}
          icon="clock"
          isHindi={isHindi}
          hindiFont={hindiFont}
          hindiBold={hindiBold}
        />

        <DashaTable
          title={t.prana}
          data={currentData.Pranadasha}
          highlightName={activePrana}
          tTracker={tTracker}
          isHindi={isHindi}
          trLabel={trStr}
          hindiFont={hindiFont}
          hindiBold={hindiBold}
        />

        <SectionHeader
          title={t.currentDashaChain}
          subtitle=""
          icon="zap"
          isHindi={isHindi}
          hindiFont={hindiFont}
          hindiBold={hindiBold}
        />

        {/* Summary Table */}
        <View style={styles.tableWrapper}>
          <View style={styles.rowHeader}>
            <View style={styles.summaryColLevel}>
              <Text style={[styles.summaryColText, hindiBold]}>{t.level}</Text>
            </View>
            <View style={styles.summaryColLevel}>
              <Text style={[styles.summaryColText, hindiBold]}>{t.planet}</Text>
            </View>
            <View style={styles.summaryColLevel}>
              <Text style={[styles.summaryColText, hindiBold]}>{t.start}</Text>
            </View>
            <View style={[styles.summaryColLevel, { borderRightWidth: 0 }]}>
              <Text style={[styles.summaryColText, hindiBold]}>{t.end}</Text>
            </View>
          </View>

          {DASHA_CHAIN_ROWS.map((row, i) => {
            const val =
              currentData.order_of_dashas?.[
                row.key as keyof typeof currentData.order_of_dashas
              ];
            return (
              <View
                key={row.key}
                style={[
                  styles.row,
                  i % 2 !== 0 ? styles.rowEven : styles.rowOdd,
                ]}
              >
                <View style={styles.summaryColLevel}>
                  <Text style={[styles.summaryCellLevelText, hindiBold]}>
                    {isHindi ? row.hi : row.en}
                  </Text>
                </View>
                <View style={styles.summaryColLevel}>
                  <Text style={[styles.cellPlanetText, hindiBold]}>
                    {val ? trStr(val.name) : "-"}
                  </Text>
                </View>
                <View style={styles.summaryColLevel}>
                  <Text style={[styles.cellDateText, hindiFont]}>
                    {val?.start || "-"}
                  </Text>
                </View>
                <View style={[styles.summaryColLevel, { borderRightWidth: 0 }]}>
                  <Text style={[styles.cellDateText, hindiFont]}>
                    {val?.end || "-"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Footer isHindi={isHindi} hindiFont={hindiFont} />
      </Page>
    </>
  );
}
