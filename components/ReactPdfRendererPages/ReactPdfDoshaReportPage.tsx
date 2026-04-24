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
import { resolveTranslations, doshaTranslations } from "@/lib/i18n";

// Register custom fonts
import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- TYPES ---
export interface DoshaData {
  mangal: {
    is_dosha_present: boolean;
    is_anshik: boolean;
    score: number;
    bot_response: string;
    factors: Record<string, string>;
  };
  kaalsarp: {
    is_dosha_present: boolean;
    bot_response: string;
    remedies: string[];
  };
  pitra: {
    is_dosha_present: boolean;
    bot_response: string;
    effects: string[];
    remedies: string[];
  };
  manglik_analysis: {
    manglik_by_mars: boolean;
    manglik_by_rahuketu: boolean;
    manglik_by_saturn: boolean;
    score: number;
    bot_response: string;
    aspects: string[];
  };
}

interface ReactPdfDoshaReportPageProps {
  lang: Language;
  data?: DoshaData;
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

  // Info Cards layout
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: pt(4),
  },
  cardContainer: {
    width: "32%",
    borderWidth: 0.5,
    backgroundColor: "#FFFFFF",
    paddingBottom: pt(3),
    borderRadius: 6,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: pt(3),
    paddingVertical: pt(2),
    backgroundColor: "#FFF1F2",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C5A059",
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    marginLeft: pt(2),
  },
  cardBody: { paddingHorizontal: pt(3), paddingTop: pt(2) },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: pt(2),
  },
  cardLabel: { fontSize: 9, color: "#71717A", fontFamily: "Times-Roman" },
  cardValueNumber: { fontSize: 9, fontFamily: "Times-Bold", color: "#111827" },

  badgeRed: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#FECDD3",
  },
  badgeGreen: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#A7F3D0",
  },
  badgeTextRed: {
    fontSize: 8,
    fontFamily: "Times-Bold",
    color: "#B91C1C",
    textTransform: "uppercase",
  },
  badgeTextGreen: {
    fontSize: 8,
    fontFamily: "Times-Bold",
    color: "#065F46",
    textTransform: "uppercase",
  },

  // Detail Sections
  sectionBox: {
    borderWidth: 0.5,
    borderRadius: 6,
    padding: pt(4),
    marginBottom: pt(4),
  },
  mangalBox: {
    backgroundColor: "rgba(254, 242, 242, 0.4)",
    borderColor: "#C5A059",
  },
  pitraBox: { backgroundColor: "#FFFFFF", borderColor: "#C5A059" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    paddingBottom: pt(2),
    marginBottom: pt(3),
  },
  sectionHeaderMangal: { borderBottomColor: "#C5A059" },
  sectionHeaderPitra: { borderBottomColor: "#C5A059" },
  sectionTitleMangal: {
    fontSize: 13,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    marginLeft: pt(2),
    textTransform: "uppercase",
  },
  sectionTitlePitra: {
    fontSize: 13,
    fontFamily: "Times-Bold",
    color: "#1F2937",
    marginLeft: pt(2),
    textTransform: "uppercase",
  },

  sectionDesc: {
    fontSize: 9,
    color: "#4B5563",
    fontFamily: "Times-Italic",
    lineHeight: 1.5,
    marginBottom: pt(4),
  },

  detailsGrid: { flexDirection: "row", justifyContent: "space-between" },
  detailsCol: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: pt(3),
    borderRadius: 4,
    borderWidth: 0.5,
  },
  mangalColBorderRed: { borderColor: "#FECDD3" },
  mangalColBorderGray: { borderColor: "#E4E4E7" },
  detailsColTitle: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    marginBottom: pt(2),
  },
  detailsColTitleRed: { color: "#991B1B" },
  detailsColTitleGray: { color: "#52525B" },
  detailsColTitleGreen: { color: "#065F46" },

  // Bullets
  bulletItem: {
    flexDirection: "row",
    marginBottom: pt(1.5),
    alignItems: "flex-start",
  },
  bulletText: {
    fontSize: 9,
    color: "#3F3F46",
    lineHeight: 1.4,
    flex: 1,
    marginLeft: pt(1.5),
    fontFamily: "Times-Roman",
  },

  // Kaalsarp
  kaalSarpSection: { marginTop: pt(2) },
  kaalSarpTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    marginBottom: pt(2),
    color: "#111827",
    textTransform: "uppercase",
  },
  kaalsarpAbsentBox: {
    backgroundColor: "#ECFDF5",
    borderWidth: 0.5,
    borderColor: "#A7F3D0",
    padding: pt(4),
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: pt(2),
  },
  kaalsarpAbsentText: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: "#065F46",
    marginLeft: pt(2),
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

// --- ICONS ---
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

const FlameIcon = ({ size = 16, color = "#DC2626" }) => (
  <Svg viewBox="0 0 24 24" style={{ width: size, height: size, color }}>
    <Path
      d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

const SkullIcon = ({ size = 16, color = "#374151" }) => (
  <Svg viewBox="0 0 24 24" style={{ width: size, height: size, color }}>
    <Circle cx="9" cy="12" r="1" stroke={color} fill={color} />
    <Circle cx="15" cy="12" r="1" stroke={color} fill={color} />
    <Path d="M8 20v2h8v-2" fill="none" stroke={color} strokeWidth={2} />
    <Path
      d="M12.5 17l-.5-1-.5 1h1z"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M16 20a2 2 0 001.56-3.25 8 8 0 10-11.12 0A2 2 0 008 20"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

const ActivityIcon = ({ size = 16, color = "#2563EB" }) => (
  <Svg viewBox="0 0 24 24" style={{ width: size, height: size, color }}>
    <Polyline
      points="22 12 18 12 15 21 9 3 6 12 2 12"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

const ShieldAlertIcon = ({ size = 16, color = "#DC2626" }) => (
  <Svg viewBox="0 0 24 24" style={{ width: size, height: size, color }}>
    <Path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
    <Path d="M12 8v4" fill="none" stroke={color} strokeWidth={2} />
    <Path d="M12 16h.01" fill="none" stroke={color} strokeWidth={2} />
  </Svg>
);

const ShieldCheckIcon = ({ size = 16, color = "#047857" }) => (
  <Svg viewBox="0 0 24 24" style={{ width: size, height: size, color }}>
    <Path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
    <Path d="M9 12l2 2 4-4" fill="none" stroke={color} strokeWidth={2} />
  </Svg>
);

const BadgeCheckIcon = ({ size = 20, color = "#059669" }) => (
  <Svg viewBox="0 0 24 24" style={{ width: size, height: size, color }}>
    <Path
      d="M3.85 8.62a4 4 0 014.78-4.77 4 4 0 016.74 0 4 4 0 014.78 4.78 4 4 0 010 6.74 4 4 0 01-4.77 4.78 4 4 0 01-6.75 0 4 4 0 01-4.78-4.77 4 4 0 010-6.76z"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
    <Path d="M9 12l2 2 4-4" fill="none" stroke={color} strokeWidth={2} />
  </Svg>
);

const DotIcon = () => (
  <View
    style={{
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: "#D4AF37",
      marginTop: 3,
    }}
  />
);

const CheckIcon = () => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: 10, height: 10, color: "#16A34A", marginTop: 1 }}
  >
    <Polyline
      points="20 6 9 17 4 12"
      fill="none"
      stroke="#16A34A"
      strokeWidth={3}
    />
  </Svg>
);

const CrossIcon = () => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: 10, height: 10, color: "#DC2626", marginTop: 1 }}
  >
    <Path
      d="M18 6 6 18M6 6l12 12"
      fill="none"
      stroke="#DC2626"
      strokeWidth={3}
    />
  </Svg>
);

// --- DUMMY DATA ---
const dummyDoshaData: DoshaData = {
  mangal: {
    is_dosha_present: true,
    is_anshik: true,
    score: 65,
    bot_response:
      "Mars is positioned in a mildly sensitive house, causing Anshik (partial) Mangal Dosha. Impact is moderate and manageable.",
    factors: {
      "Mars Aspect": "Mars aspects the 7th house",
      Position: "Mars in 4th house",
    },
  },
  kaalsarp: {
    is_dosha_present: false,
    bot_response:
      "No Kaalsarp Dosha is formed as planets exist outside the Rahu-Ketu axis.",
    remedies: [],
  },
  pitra: {
    is_dosha_present: true,
    bot_response:
      "Sun is heavily afflicted by Rahu, creating a noticeable Pitra Dosha in your chart.",
    effects: [
      "Delays in career progress",
      "Unexplained friction in family matters",
      "Occasional health issues affecting elders",
    ],
    remedies: [
      "Offer water to the Sun daily",
      "Help the elderly or people in need",
      "Perform Amavasya Shraddh regularly",
    ],
  },
  manglik_analysis: {
    manglik_by_mars: true,
    manglik_by_rahuketu: false,
    manglik_by_saturn: false,
    score: 65,
    bot_response:
      "You are Anshik Manglik. Mars brings some intensity into partnerships but it cancels out slightly by Jupiter's aspect.",
    aspects: ["Mars in 4th House", "Venus and Mars conjunction in Navamsha"],
  },
};

// --- HELPERS ---
const StatusBadge = ({
  present,
  label,
  t,
  hindiBold,
}: {
  present: boolean;
  label?: string;
  t: any;
  hindiBold: any;
}) => (
  <View style={present ? styles.badgeRed : styles.badgeGreen}>
    <Text
      style={[present ? styles.badgeTextRed : styles.badgeTextGreen, hindiBold]}
    >
      {label || (present ? t.present : t.absent)}
    </Text>
  </View>
);

const BulletList = ({
  items,
  iconType = "dot",
  hindiFont,
}: {
  items: string[];
  iconType?: "dot" | "check" | "cross";
  hindiFont: any;
}) => (
  <View style={{ flexDirection: "column", gap: pt(1.5) }}>
    {items.map((item, i) => (
      <View key={i} style={styles.bulletItem}>
        {iconType === "check" ? (
          <CheckIcon />
        ) : iconType === "cross" ? (
          <CrossIcon />
        ) : (
          <DotIcon />
        )}
        <Text style={[styles.bulletText, hindiFont]}>{item}</Text>
      </View>
    ))}
  </View>
);

// --- COMPONENT ---
export default function ReactPdfDoshaReportPage({
  lang,
  data,
  loading = false,
}: ReactPdfDoshaReportPageProps) {
  const isHindi = lang === "hi";
  const t = resolveTranslations(doshaTranslations, lang);

  // Hindi font override
  const hindiFont = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBold = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  // Safe defaults so the component never crashes on undefined property access
  const safeMangal = {
    is_dosha_present: false,
    is_anshik: false,
    score: 0,
    bot_response: "",
    factors: {},
  };
  const safeKaalsarp = {
    is_dosha_present: false,
    bot_response: "",
    remedies: [],
  };
  const safePitra = {
    is_dosha_present: false,
    bot_response: "",
    effects: [],
    remedies: [],
  };
  const safeManglik = {
    manglik_by_mars: false,
    manglik_by_rahuketu: false,
    manglik_by_saturn: false,
    score: 0,
    bot_response: "",
    aspects: [],
  };

  const currentData: DoshaData = {
    mangal: { ...safeMangal, ...(data?.mangal || {}) },
    kaalsarp: { ...safeKaalsarp, ...(data?.kaalsarp || {}) },
    pitra: { ...safePitra, ...(data?.pitra || {}) },
    manglik_analysis: { ...safeManglik, ...(data?.manglik_analysis || {}) },
  };

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

      {/* DOSHA SUMMARY CARDS */}
      <View style={styles.cardsRow}>
        {/* Mangal */}
        <View
          style={[
            styles.cardContainer,
            currentData.mangal.is_dosha_present
              ? { borderColor: "#FECDD3" }
              : { borderColor: "#A7F3D0" },
          ]}
        >
          <View style={styles.cardHeader}>
            <FlameIcon size={14} color="#DC2626" />
            <Text style={[styles.cardTitle, hindiBold]}>{t.mangalDosha}</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardRow}>
              <Text style={[styles.cardLabel, hindiFont]}>{t.status}</Text>
              <StatusBadge
                present={currentData.mangal.is_dosha_present}
                label={currentData.mangal.is_anshik ? t.low : undefined}
                t={t}
                hindiBold={hindiBold}
              />
            </View>
            <View style={styles.cardRow}>
              <Text style={[styles.cardLabel, hindiFont]}>{t.intensity}</Text>
              <Text style={styles.cardValueNumber}>
                {currentData.mangal.score}%
              </Text>
            </View>
          </View>
        </View>

        {/* Pitra */}
        <View
          style={[
            styles.cardContainer,
            currentData.pitra.is_dosha_present
              ? { borderColor: "#FECDD3" }
              : { borderColor: "#A7F3D0" },
          ]}
        >
          <View style={styles.cardHeader}>
            <SkullIcon size={14} color="#374151" />
            <Text style={[styles.cardTitle, hindiBold]}>{t.pitraDosha}</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardRow}>
              <Text style={[styles.cardLabel, hindiFont]}>{t.status}</Text>
              <StatusBadge
                present={currentData.pitra.is_dosha_present}
                t={t}
                hindiBold={hindiBold}
              />
            </View>
          </View>
        </View>

        {/* Kaal Sarp */}
        <View
          style={[
            styles.cardContainer,
            currentData.kaalsarp.is_dosha_present
              ? { borderColor: "#FECDD3" }
              : { borderColor: "#A7F3D0" },
          ]}
        >
          <View style={styles.cardHeader}>
            <ActivityIcon size={14} color="#2563EB" />
            <Text style={[styles.cardTitle, hindiBold]}>{t.kaalSarpDosha}</Text>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardRow}>
              <Text style={[styles.cardLabel, hindiFont]}>{t.status}</Text>
              <StatusBadge
                present={currentData.kaalsarp.is_dosha_present}
                t={t}
                hindiBold={hindiBold}
              />
            </View>
          </View>
        </View>
      </View>

      {/* DETAILED ANALYSIS */}

      {!currentData.mangal.is_dosha_present && 
       !currentData.pitra.is_dosha_present &&
       !currentData.kaalsarp.is_dosha_present && (
        <View style={{ marginTop: pt(10), padding: pt(6), backgroundColor: "#F0FDF4", borderRadius: 8, borderWidth: 1, borderColor: "#BBF7D0", alignItems: "center" }}>
          <BadgeCheckIcon />
          <Text style={[{ marginTop: pt(2), fontSize: pt(4.5), color: "#16A34A" }, hindiBold]}>
            {isHindi ? "कोई प्रमुख दोष नहीं पाया गया" : "No Major Doshas Found"}
          </Text>
          <Text style={[{ marginTop: pt(1), fontSize: pt(3), color: "#15803D", textAlign: "center" }, hindiFont]}>
            {isHindi 
              ? "आपकी कुंडली में कोई गंभीर मांगलिक, पितृ या कालसर्प दोष नहीं है।" 
              : "Your astrological chart is free from any severe Manglik, Pitra, or Kaal Sarp doshas."}
          </Text>
        </View>
      )}


      {/* Mangal Detail */}
      {currentData.mangal.is_dosha_present && (
        <View style={[styles.sectionBox, styles.mangalBox]}>
          <View style={[styles.sectionHeader, styles.sectionHeaderMangal]}>
            <FlameIcon size={16} />
            <Text style={[styles.sectionTitleMangal, hindiBold]}>
              {t.manglikAnalysis}
            </Text>
          </View>
          <Text style={[styles.sectionDesc, hindiFont]}>
            "{currentData.mangal.bot_response}"
          </Text>

          <View style={styles.detailsGrid}>
            <View style={[styles.detailsCol, styles.mangalColBorderRed]}>
              <Text
                style={[
                  styles.detailsColTitle,
                  styles.detailsColTitleRed,
                  hindiBold,
                ]}
              >
                {t.factors}
              </Text>
              <BulletList
                items={Object.values(currentData.mangal.factors || {})}
                iconType="dot"
                hindiFont={hindiFont}
              />
            </View>
            <View style={[styles.detailsCol, styles.mangalColBorderGray]}>
              <Text
                style={[
                  styles.detailsColTitle,
                  styles.detailsColTitleGray,
                  hindiBold,
                ]}
              >
                {t.otherContributors}
              </Text>
              <BulletList
                items={(currentData.manglik_analysis.aspects || []).slice(0, 3)}
                iconType="dot"
                hindiFont={hindiFont}
              />
            </View>
          </View>
        </View>
      )}

      {/* Pitra Detail */}
      {currentData.pitra.is_dosha_present && (
        <View style={[styles.sectionBox, styles.pitraBox]}>
          <View style={[styles.sectionHeader, styles.sectionHeaderPitra]}>
            <SkullIcon size={16} />
            <Text style={[styles.sectionTitlePitra, hindiBold]}>
              {t.pitraDetail}
            </Text>
          </View>
          <Text style={[styles.sectionDesc, hindiFont]}>
            {currentData.pitra.bot_response}
          </Text>

          <View style={styles.detailsGrid}>
            <View
              style={[
                styles.detailsCol,
                { borderColor: "#FFFFFF", padding: 0 },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: pt(2),
                }}
              >
                <ShieldAlertIcon size={12} />
                <Text
                  style={[
                    styles.detailsColTitle,
                    styles.detailsColTitleRed,
                    hindiBold,
                    { marginBottom: 0, marginLeft: 6 },
                  ]}
                >
                  {t.effects}
                </Text>
              </View>
              <BulletList
                items={(currentData.pitra.effects || []).slice(0, 5)}
                iconType="cross"
                hindiFont={hindiFont}
              />
            </View>
            <View
              style={[
                styles.detailsCol,
                { borderColor: "#FFFFFF", padding: 0 },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: pt(2),
                }}
              >
                <ShieldCheckIcon size={12} />
                <Text
                  style={[
                    styles.detailsColTitle,
                    styles.detailsColTitleGreen,
                    hindiBold,
                    { marginBottom: 0, marginLeft: 6 },
                  ]}
                >
                  {t.remedies}
                </Text>
              </View>
              <BulletList
                items={(currentData.pitra.remedies || []).slice(0, 5)}
                iconType="check"
                hindiFont={hindiFont}
              />
            </View>
          </View>
        </View>
      )}

      <View style={styles.kaalSarpSection}>
        {/* Kaal Sarp Details */}
        {currentData.kaalsarp.is_dosha_present && (
          <View>
            <Text style={[styles.kaalSarpTitle, hindiBold]}>
              {t.kaalSarpRemedies}
            </Text>
            <BulletList
              items={(currentData.kaalsarp.remedies || []).slice(0, 3)}
              iconType="dot"
              hindiFont={hindiFont}
            />
          </View>
        )}

        {/* Kaal Sarp Absent */}
        {!currentData.kaalsarp.is_dosha_present && (
          <View style={styles.kaalsarpAbsentBox}>
            <BadgeCheckIcon />
            <Text style={[styles.kaalsarpAbsentText, hindiBold]}>
              {t.kaalSarpAbsent}
            </Text>
          </View>
        )}
      </View>

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
    </Page>
  );
}
