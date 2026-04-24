"use client";
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
  Image,
  Font,
} from "@react-pdf/renderer";
import "@/components/pdf/pdfFontRegistry"; // ── Ensure shared fonts are registered first ──
import { Language } from "@/types/languages";
import {
  PAGE_1_CHARTS,
  OTHER_CHARTS,
  CHART_DETAILS,
  divisionalChartsTranslations,
  TRANSIT_DESCRIPTION,
  resolveTranslations,
} from "@/lib/i18n";

// Redundant font registration and hyphenation moved to @/components/pdf/pdfFontRegistry

const pt = (mm: number) => mm * 2.83465;

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
  contentContainer: {
    flex: 1,
    paddingTop: pt(2),
  },
  // Alternating Row layout
  rowLayout: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    marginBottom: pt(4),
  },
  rowLayoutReverse: {
    flexDirection: "row-reverse",
    flex: 1,
    alignItems: "flex-start",
    marginBottom: pt(4),
  },
  // Dimensions
  chartSide: {
    width: "45%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: pt(4),
  },
  chartSideSmall: {
    width: "42%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FAFAF9", // zinc-50
    paddingVertical: pt(2),
    paddingHorizontal: pt(2),
    marginHorizontal: pt(2),
  },
  textSide: {
    width: "55%",
    paddingHorizontal: pt(3),
    paddingTop: pt(2),
  },
  textSideLarge: {
    width: "58%",
    paddingHorizontal: pt(2),
    paddingTop: pt(2),
  },
  chartBox: {
    width: pt(60),
    height: pt(60),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // Text elements
  chartHeading: {
    fontSize: 13,
    fontFamily: "Times-Bold",
    color: "#27272A",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: pt(2),
  },
  insightTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: pt(1),
  },
  insightTitle: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    color: "#9A3412", // orange-800
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4,
  },
  insightTitleSmall: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    color: "#27272A",
    marginBottom: pt(1),
  },
  insightDescription: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    color: "#52525B",
    lineHeight: 1.4,
    textAlign: "justify",
  },
  // Dividers
  rowDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: pt(2),
  },
  dividerLine: {
    width: "40%",
    height: 0.5,
    backgroundColor: "#FED7AA", // orange-200
  },
  dividerDiamonds: {
    fontSize: 6,
    color: "#FDBA74",
    letterSpacing: 5,
    marginHorizontal: pt(4),
  },
  // Transit Chart particular styles
  transitRow: {
    flexDirection: "row",
    marginBottom: pt(4),
  },
  transitChartCol: {
    width: "45%",
    alignItems: "center",
    paddingRight: pt(3),
  },
  verticalDivider: {
    width: 0.5,
    backgroundColor: "#E4E4E7",
    marginHorizontal: pt(2),
  },
  transitTextCol: {
    flex: 1,
    paddingLeft: pt(3),
  },
  timestampPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAF9",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: pt(3),
  },
  timestampText: {
    fontSize: 8,
    fontFamily: "Times-Bold",
    color: "#3F3F46",
    marginLeft: 4,
  },
  pointRow: {
    flexDirection: "row",
    marginBottom: pt(1),
    alignItems: "flex-start",
  },
  pointBullet: {
    color: "#7B1818",
    fontSize: 8,
    marginRight: 4,
    marginTop: 1,
  },
  pointText: {
    fontSize: 9,
    fontFamily: "Times-Roman",
    color: "#52525B",
    lineHeight: 1.4,
    flex: 1,
  },
  pointLabel: {
    fontFamily: "Times-Bold",
    color: "#3F3F46",
  },
  transitInsightBox: {
    backgroundColor: "#FAFAF9",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: pt(4),
    marginTop: pt(2),
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#A1A1AA",
    fontFamily: "Times-Italic",
  },
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

const SparklesIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: "#f97316" }}>
    <Path
      d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"
      fill="none"
      stroke="#f97316"
      strokeWidth={1.5}
    />
  </Svg>
);

const ScrollTextIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: "#ea580c" }}>
    <Path d="M15 12h-5" stroke="#ea580c" fill="none" strokeWidth={1.5} />
    <Path d="M15 8h-5" stroke="#ea580c" fill="none" strokeWidth={1.5} />
    <Path
      d="M19 21V5a2 2 0 0 0-2-2H4v18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2z"
      stroke="#ea580c"
      fill="none"
      strokeWidth={1.5}
    />
  </Svg>
);

interface ReactPdfDivisionalChartsPageProps {
  lang: Language;
  chartData?: Record<string, any>;
  chartImages?: Record<string, string>;
  transitData?: any | null;
  loading?: boolean;
  transitImage?: string | null;
  dummyImage?: string | null;
}

const defaultDummyChart = {
  response: {
    house_no: {
      "1": [
        { name: "Su", retro: false, zodiac: "Ar" },
        { name: "Me", retro: false, zodiac: "Ar" },
      ],
      "4": [{ name: "As", retro: false, zodiac: "Cn" }],
      "7": [{ name: "Mo", retro: true, zodiac: "Li" }],
      "10": [{ name: "Sa", retro: false, zodiac: "Cp" }],
      "11": [{ name: "Ra", retro: false, zodiac: "Aq" }],
      "5": [{ name: "Ke", retro: false, zodiac: "Le" }],
      "9": [{ name: "Ju", retro: false, zodiac: "Sg" }],
    },
  },
};

export default function ReactPdfDivisionalChartsPage({
  lang,
  chartData = {},
  chartImages = {},
  transitData = null,
  loading = false,
  transitImage = null,
  dummyImage = null,
}: ReactPdfDivisionalChartsPageProps) {
  const isHi = lang === "hi";
  const uiT = resolveTranslations(divisionalChartsTranslations, lang);

  // Hindi font override
  const hindiFont = isHi ? { fontFamily: "NotoSansDevanagari" as const } : {};
  const hindiBold = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  if (loading) {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.loadingText, hindiFont]}>
            {isHi
              ? "\u0915\u0941\u0902\u0921\u0932\u093F\u092F\u093E\u0901 \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u0940 \u0939\u0948\u0902..."
              : "Loading Divisional Charts..."}
          </Text>
        </View>
      </Page>
    );
  }

  const getChartData = (id: string) =>
    Object.keys(chartData).length > 0 ? chartData[id] || {} : {};

  const chunkSize = 3;
  const chartPages = [];
  for (let i = 0; i < OTHER_CHARTS.length; i += chunkSize) {
    chartPages.push(OTHER_CHARTS.slice(i, i + chunkSize));
  }

  // Common Header & Footer Components
  const PageDecorations = ({
    title,
    headerMarginTop,
    headerMarginBottom,
    titleFontSize,
  }: {
    title: string;
    headerMarginTop?: number;
    headerMarginBottom?: number;
    titleFontSize?: number;
  }) => (
    <>
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />
      <View
        style={[
          styles.headerContainer,
          headerMarginTop !== undefined ? { marginTop: headerMarginTop } : {},
          headerMarginBottom !== undefined
            ? { marginBottom: headerMarginBottom }
            : {},
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            hindiBold,
            { letterSpacing: isHi ? 0 : 2 },
            titleFontSize !== undefined ? { fontSize: titleFontSize } : {},
          ]}
        >
          {title}
        </Text>
        <OrnateHeadingDivider />
      </View>
      <View fixed style={styles.footer}>
        <Text style={[styles.footerText, hindiFont]}>
          {isHi
            ? "\u092F\u0941\u0930\u0947\u0916\u093E \u2022 \u0935\u0948\u0926\u093F\u0915 \u0907\u0902\u091F\u0947\u0932\u093F\u091C\u0947\u0902\u0938"
            : "UREKHA \u2022 Vedic Intelligence"}
        </Text>
        <Text style={[styles.footerText, { color: "#9CA3AF" }]}>
          www.urekha.com
        </Text>
      </View>
    </>
  );

  return (
    <>
      {/* PAGE 1: PRIMARY CHARTS */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <PageDecorations
          title={isHi ? uiT.coreVedicTitle_hi : uiT.coreVedicTitle_en}
          headerMarginTop={pt(0)}
          headerMarginBottom={pt(2)}
        />

        <View style={[styles.contentContainer, { paddingTop: 0 }]}>
          {PAGE_1_CHARTS.map((def, index) => {
            const isReverse = index % 2 !== 0;
            const rowStyle = isReverse
              ? styles.rowLayoutReverse
              : styles.rowLayout;

            return (
              <React.Fragment key={def.id}>
                <View style={rowStyle}>
                  {/* CHART SIDE */}
                  <View style={styles.chartSide}>
                    <Text style={[styles.chartHeading, hindiBold]}>
                      {def.title[lang] ?? def.title["en"]}
                    </Text>
                    <View style={styles.chartBox}>
                      {chartImages[def.id] ? (
                        <Image
                          src={chartImages[def.id]}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : chartImages[def.id] && String(chartImages[def.id]).startsWith("<svg") ? (
                         <Text style={{ fontSize: 9, color: "#9F1239", textAlign: 'center' }}>[Chart Ref Error]</Text>
                      ) : dummyImage ? (
                        <Image
                          src={dummyImage}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Text style={{ fontSize: 10, color: "#A1A1AA" }}>
                          Loading Chart...
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* TEXT SIDE */}
                  <View style={styles.textSide}>
                    <View style={styles.insightTitleRow}>
                      <ScrollTextIcon />
                      <Text style={[styles.insightTitle, hindiBold]}>
                        {isHi
                          ? `${def.title["hi"]} ${uiT.aboutPrefixHi}`
                          : `${uiT.aboutPrefix} ${def.title["en"]}`}
                      </Text>
                    </View>
                    <Text style={[styles.insightDescription, hindiFont]}>
                      {CHART_DETAILS[def.id]?.[lang] ??
                        CHART_DETAILS[def.id]?.["en"] ??
                        uiT.chartDetailsUnavailable}
                    </Text>
                  </View>
                </View>

                {index < PAGE_1_CHARTS.length - 1 && (
                  <View style={styles.rowDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerDiamonds}>• • •</Text>
                    <View style={styles.dividerLine} />
                  </View>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </Page>

      {/* SUBSEQUENT PAGES */}
      {chartPages.map((pageCharts, pageIndex) => (
        <Page
          key={`div-page-${pageIndex}`}
          size="A4"
          style={[styles.page, hindiFont]}
        >
          <PageDecorations
            title={
              isHi
                ? `${uiT.divisionalPartTitle_hi} (भाग ${pageIndex + 1})`
                : `${uiT.divisionalPartTitle_en} (Part ${pageIndex + 1})`
            }
          />

          <View style={styles.contentContainer}>
            {pageCharts.map((def, index) => {
              const isReverse = index % 2 !== 0;
              const rowStyle = isReverse
                ? styles.rowLayoutReverse
                : styles.rowLayout;

              return (
                <React.Fragment key={def.id}>
                  <View style={rowStyle}>
                    <View style={styles.chartSideSmall}>
                      <View style={styles.chartBox}>
                        {chartImages[def.id] ? (
                          <Image
                            src={chartImages[def.id]}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : chartImages[def.id] && String(chartImages[def.id]).startsWith("<svg") ? (
                           <Text style={{ fontSize: 8, color: "#9F1239", textAlign: 'center' }}>[Ref Error]</Text>
                        ) : dummyImage ? (
                          <Image
                            src={dummyImage}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Text style={{ fontSize: 10, color: "#A1A1AA" }}>
                            Loading Chart...
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.textSideLarge}>
                      <Text style={[styles.insightTitleSmall, hindiBold]}>
                        {def.title[lang] ?? def.title["en"]}
                      </Text>
                      <Text style={[styles.insightDescription, hindiFont]}>
                        {CHART_DETAILS[def.id]?.[lang] ??
                          CHART_DETAILS[def.id]?.["en"] ??
                          uiT.chartDetailsUnavailable}
                      </Text>
                    </View>
                  </View>

                  {index < pageCharts.length - 1 && (
                    <View style={styles.rowDivider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerDiamonds}>• • •</Text>
                      <View style={styles.dividerLine} />
                    </View>
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </Page>
      ))}

      {/* TRANSIT CHART PAGE */}
      <Page size="A4" style={[styles.page, hindiFont]}>
        <PageDecorations
          title={isHi ? uiT.transitTitle_hi : uiT.transitTitle_en}
          titleFontSize={20}
        />

        <View style={[styles.contentContainer, { paddingTop: pt(4) }]}>
          <View style={styles.transitRow}>
            {/* LEFT: SVG Chart Placeholder for Transit */}
            <View style={styles.transitChartCol}>
              <View style={styles.timestampPill}>
                <SparklesIcon />
                <Text style={styles.timestampText}>
                  {isHi
                    ? `${new Date().toLocaleString("hi-IN")}`
                    : `${new Date().toLocaleString("en-IN")}`}
                </Text>
              </View>
              <View style={styles.chartBox}>
                {transitImage || dummyImage ? (
                  <Image
                    src={(transitImage || dummyImage) as string}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#A1A1AA",
                      textAlign: "center",
                    }}
                  >
                    Loading Transit Chart...
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.verticalDivider} />

            {/* RIGHT: Transit Explanation */}
            <View style={styles.transitTextCol}>
              <View style={styles.insightTitleRow}>
                <ScrollTextIcon />
                <Text
                  style={[styles.insightTitle, hindiBold, { color: "#9F1239" }]}
                >
                  {isHi ? "गोचर कुंडली क्या है?" : "What is a Transit Chart?"}
                </Text>
              </View>
              <Text
                style={[
                  styles.insightDescription,
                  hindiFont,
                  { marginBottom: pt(3) },
                ]}
              >
                {isHi
                  ? "गोचर कुंडली वर्तमान क्षण में आकाश में ग्रहों की वास्तविक स्थिति दर्शाती है। यह आपकी जन्म कुंडली से भिन्न है — जन्म कुंडली जन्म के समय की स्थिति है, जबकि गोचर कुंडली आज के क्षण की जीवंत तस्वीर है।"
                  : "The Transit Chart (Gochar Kundli) maps the real-time positions of the planets in the sky at this exact moment. Unlike your natal chart — which is fixed at birth — the transit chart is a living snapshot of the cosmos as it moves through time."}
              </Text>

              {/* Points */}
              {(isHi
                ? [
                    {
                      label: "गोचर का उद्देश्य",
                      text: "वर्तमान ग्रहीय प्रवाह को जन्म कुंडली से मिलाकर जीवन के सक्रिय चरणों की पहचान करना।",
                    },
                    {
                      label: "शनि गोचर",
                      text: "शनि प्रत्येक राशि में ढाई वर्ष रहता है और कर्म शुद्धि, अनुशासन व परिश्रम के क्षेत्रों को प्रभावित करता है।",
                    },
                    {
                      label: "गुरु गोचर",
                      text: "बृहस्पति प्रतिवर्ष एक राशि पार करता है और जिस भाव से गुजरता है उसमें विस्तार, सौभाग्य व ज्ञान लाता है।",
                    },
                    {
                      label: "राहु-केतु गोचर",
                      text: "छाया ग्रह लगभग 18 माह एक राशि में रहते हैं और कर्मिक उथल-पुथल व आत्मिक परिवर्तन लाते हैं।",
                    },
                  ]
                : [
                    {
                      label: "Purpose",
                      text: "Correlating the current planetary flow with your natal chart identifies active life themes, opportunities, and challenges.",
                    },
                    {
                      label: "Saturn Transit",
                      text: "Saturn stays ~2.5 years per sign. It activates karma, discipline, and restructuring in whichever house it transits.",
                    },
                    {
                      label: "Jupiter Transit",
                      text: "Jupiter moves one sign per year, expanding fortune, wisdom, and growth in the house it occupies.",
                    },
                    {
                      label: "Rahu–Ketu Axis",
                      text: "The shadow planets shift every ~18 months, triggering karmic reversals, obsessions, and spiritual transformation.",
                    },
                  ]
              ).map((pt) => (
                <View key={pt.label} style={styles.pointRow}>
                  <Text style={styles.pointBullet}>{"\u2022"}</Text>
                  <Text style={[styles.pointText, hindiFont]}>
                    <Text style={[styles.pointLabel, hindiBold]}>
                      {pt.label}:{" "}
                    </Text>
                    {pt.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Insight Box */}
          <View style={styles.rowDivider}>
            <View
              style={[styles.dividerLine, { backgroundColor: "#FECDD3" }]}
            />
            <Text style={[styles.dividerDiamonds, { color: "#FECDD3" }]}>
              • • •
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: "#FECDD3" }]}
            />
          </View>

          <View style={styles.transitInsightBox}>
            <View style={[styles.insightTitleRow, { marginBottom: pt(2) }]}>
              <SparklesIcon />
              <Text
                style={[styles.insightTitle, hindiBold, { color: "#9F1239" }]}
              >
                {uiT.transitInsight}
              </Text>
            </View>
            <Text style={[styles.insightDescription, hindiFont]}>
              {TRANSIT_DESCRIPTION[lang] ?? TRANSIT_DESCRIPTION["en"]}
            </Text>
          </View>
        </View>
      </Page>
    </>
  );
}
