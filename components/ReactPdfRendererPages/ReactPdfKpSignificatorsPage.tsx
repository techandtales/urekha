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
  Polygon,
  Font,
} from "@react-pdf/renderer";
import { KPPlanetSignifications as PlanetSignificators } from "@/types/kpAstrology/kpPlanetSignifications";
import { KPHouseSignificators as HouseSignificators } from "@/types/kpAstrology/kpHouseSignificators";
import {
  resolveTranslations,
  kpSignificatorsTranslations,
  PLANET_NAMES_KP_HI,
  translateName,
} from "@/lib/i18n";
import { Language } from "@/types/languages";

import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- ELEGANT VEDIC MANUSCRIPT STYLING ---
const styles = StyleSheet.create({
  page: {
    paddingTop: pt(14),
    paddingBottom: pt(18),
    paddingHorizontal: pt(16),
    backgroundColor: "#FFFDF5", // Soft parchment cream
    fontFamily: "Times-Roman",
  },
  outerBorder: {
    position: "absolute",
    top: pt(8),
    left: pt(8),
    right: pt(8),
    bottom: pt(8),
    borderWidth: 1.5,
    borderColor: "#7B1818", // Deep Crimson
    borderRadius: 5,
    opacity: 0.9,
  },
  innerBorder: {
    position: "absolute",
    top: pt(10),
    left: pt(10),
    right: pt(10),
    bottom: pt(10),
    borderWidth: 0.5,
    borderColor: "#C5A059", // Rich Gold
    borderRadius: 5,
    opacity: 0.8,
  },

  headerContainer: {
    alignItems: "center",
    marginTop: pt(6),
    marginBottom: pt(4),
  },
  headerTitle: {
    fontSize: 22, // Reduced from 26
    color: "#7B1818",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontFamily: "Times-Bold",
  },

  // Heading Section
  headingSection: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C5A059",
    paddingBottom: pt(2),
    marginBottom: pt(3),
  },
  iconBox: {
    padding: pt(1.5),
    backgroundColor: "#FCFAF5",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 4,
    marginRight: pt(2),
  },
  headingTitle: {
    fontSize: 13, // Reduced from 14
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },

  // Grids
  gridContainer3Col: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: pt(3), // Reduced from pt(4)
  },
  gridContainer4Col: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: "1.5%", // Reduced gap
    marginBottom: pt(4), // Reduced from pt(6)
  },

  // Cards
  card3Col: {
    width: "32%", // Slightly wider to fill space better
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
    padding: pt(2), // Reduced from pt(3)
    marginBottom: pt(2), // Reduced from pt(3)
  },
  card4Col: {
    width: "23.8%", 
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
    padding: pt(2), // Reduced from pt(3)
    marginBottom: pt(2), // Reduced from pt(3)
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    paddingBottom: pt(1.5),
    marginBottom: pt(2), // Reduced from pt(3)
  },
  cardTitle: {
    fontSize: 9.5, // Reduced from 10.5
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginLeft: 5,
  },

  // Tags
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3, 
  },
  tagHouse: {
    backgroundColor: "#FDFBF7",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 4,
    color: "#111827",
    fontSize: 8.5, // Reduced from 9.5
    fontFamily: "Times-Bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagPlanet: {
    backgroundColor: "#FCFAF5",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 4,
    color: "#7B1818",
    fontSize: 7.5, // Reduced from 8.5
    fontFamily: "Times-Bold",
    paddingHorizontal: 4,
    paddingVertical: 2,
    textTransform: "uppercase",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: pt(12),
    left: pt(18),
    right: pt(18),
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#C5A059",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7.5,
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontFamily: "Times-Bold",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Times-Italic",
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

const SparklesIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#7B1818" }}>
    <Path
      d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"
      stroke="#7B1818"
      fill="none"
      strokeWidth={1.5}
    />
  </Svg>
);

const StarIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: "#C5A059" }}>
    <Polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      stroke="#C5A059"
      fill="none"
      strokeWidth={2}
    />
  </Svg>
);

const HomeIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#7B1818" }}>
    <Path
      d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      stroke="#7B1818"
      fill="none"
      strokeWidth={1.5}
    />
    <Polyline
      points="9 22 9 12 15 12 15 22"
      stroke="#7B1818"
      fill="none"
      strokeWidth={1.5}
    />
  </Svg>
);

const LayersIcon = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "#C5A059" }}>
    <Polygon
      points="12 2 2 7 12 12 22 7 12 2"
      stroke="#C5A059"
      fill="none"
      strokeWidth={1.5}
    />
    <Polyline
      points="2 12 12 17 22 12"
      stroke="#C5A059"
      fill="none"
      strokeWidth={1.5}
    />
    <Polyline
      points="2 17 12 22 22 17"
      stroke="#C5A059"
      fill="none"
      strokeWidth={1.5}
    />
  </Svg>
);

interface ReactPdfKpSignificatorsPageProps {
  lang: Language;
  planets?: PlanetSignificators | null;
  houses?: HouseSignificators | null;
  loading?: boolean;
}

const defaultDummyPlanets: PlanetSignificators = {
  Sun: [10, 12, 11],
  Moon: [6, 1],
  Mars: [10, 11, 4, 1, 6],
  Mercury: [4, 9, 8, 11],
  Jupiter: [3, 4, 2, 5],
  Venus: [11, 10, 7, 12],
  Saturn: [3, 4],
  Rahu: [7, 6, 1],
  Ketu: [1, 10, 4, 6],
};

const defaultDummyHouses: HouseSignificators = {
  1: ["Moon", "Mars", "Rahu", "Ketu"],
  2: ["Jupiter"],
  3: ["Jupiter", "Saturn"],
  4: ["Mars", "Mercury", "Jupiter", "Saturn", "Ketu"],
  5: ["Jupiter"],
  6: ["Moon", "Mars", "Rahu", "Ketu"],
  7: ["Venus", "Rahu"],
  8: ["Mercury"],
  9: ["Mercury"],
  10: ["Sun", "Mars", "Venus", "Ketu"],
  11: ["Sun", "Mars", "Mercury", "Venus"],
  12: ["Sun", "Venus"],
};

export default function ReactPdfKpSignificatorsPage({
  lang,
  planets,
  houses,
  loading = false,
}: ReactPdfKpSignificatorsPageProps) {
  const isHi = lang === "hi";
  const t = resolveTranslations(kpSignificatorsTranslations, lang);
  const title = isHi ? t.titleHi : t.titleEn;

  // Hindi font override
  const hindiFont = isHi ? { fontFamily: "NotoSansDevanagari" as const } : {};
  const hindiBold = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  const tr = (text: string) => translateName(text, lang, PLANET_NAMES_KP_HI);

  // If no planets/houses provided, fallback to dummy data (useful for playground)
  const dataPlanets = planets && Object.keys(planets).length > 0 ? planets : {};
  const dataHouses = houses && Object.keys(houses).length > 0 ? houses : {};

  if (loading) {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.emptyContainer}>
          <Text style={styles.loadingText}>{t.loading}</Text>
        </View>
      </Page>
    );
  }

  const planetRows = Object.entries(dataPlanets) as [string, number[]][];
  const houseRows = Object.entries(dataHouses) as [string, string[]][];

  return (
    <Page size="A4" style={[styles.page, hindiFont]}>
      {/* Borders */}
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      {/* Header */}
      <View style={styles.headerContainer} fixed>
        <Text
          style={[
            styles.headerTitle,
            hindiBold,
            { letterSpacing: isHi ? 0 : 2 },
          ]}
        >
          {title}
        </Text>
        <OrnateHeadingDivider />
      </View>

      {/* SECTION 1: PLANET VIEW */}
      <View style={styles.headingSection}>
        <View style={styles.iconBox}>
          <SparklesIcon />
        </View>
        <View>
          <Text style={[styles.headingTitle, hindiBold]}>
            {t.planetSection}
          </Text>
        </View>
      </View>

      <View style={styles.gridContainer3Col}>
        {planetRows.map(([planet, houseList]) => (
          <View key={`planet-${planet}`} style={styles.card3Col}>
            {/* Header: Planet Name */}
            <View style={styles.cardHeader}>
              <StarIcon />
              <Text style={[styles.cardTitle, hindiBold]}>{tr(planet)}</Text>
            </View>
            {/* Body: House Tags */}
            <View style={styles.tagsContainer}>
              {houseList.map((house: number) => (
                <Text
                  key={`planet-${planet}-house-${house}`}
                  style={[styles.tagHouse, hindiFont]}
                >
                  {house}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* SECTION 2: HOUSE VIEW */}
      <View style={[styles.headingSection, { marginTop: pt(2) }]}>
        <View style={styles.iconBox}>
          <HomeIcon />
        </View>
        <View>
          <Text style={[styles.headingTitle, hindiBold]}>{t.houseSection}</Text>
        </View>
      </View>

      <View style={styles.gridContainer4Col}>
        {houseRows.map(([house, planetList]) => (
          <View key={`house-${house}`} style={styles.card4Col}>
            {/* Header: House Number */}
            <View style={styles.cardHeader}>
              <LayersIcon />
              <Text style={[styles.cardTitle, hindiBold]}>
                {isHi ? `${t.housePrefix} ${house}` : `House ${house}`}
              </Text>
            </View>
            {/* Body: Planet List */}
            <View style={styles.tagsContainer}>
              {planetList.map((p: string) => (
                <Text
                  key={`house-${house}-planet-${p}`}
                  style={[styles.tagPlanet, hindiFont]}
                >
                  {isHi ? tr(p) : p.substring(0, 3)}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
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
  );
}
