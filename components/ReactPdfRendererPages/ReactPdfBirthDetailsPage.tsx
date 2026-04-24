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
import { useStore } from "@/lib/store";
import { Language } from "@/types/languages";
import {
  resolveTranslations,
  birthDetailsTranslations,
  panchangTranslations,
} from "@/lib/i18n";

// Register custom fonts
import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- ELEGANT STYLING WITH ROUNDED CORNERS ---
const styles = StyleSheet.create({
  page: {
    paddingTop: pt(18),
    paddingBottom: pt(25),
    paddingHorizontal: pt(18),
    backgroundColor: "#FFFDF5", // Soft parchment/cream color
    fontFamily: "Times-Roman",
  },
  outerBorder: {
    position: "absolute",
    top: pt(10),
    left: pt(10),
    right: pt(10),
    bottom: pt(10),
    borderWidth: 1.5,
    borderColor: "#7B1818", // Deep Crimson
    borderRadius: 5, // Beautiful rounded corners
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
    borderRadius: 5, // Inner rounded corners
    opacity: 0.8,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: pt(10),
    marginBottom: pt(12),
  },
  headerTitle: {
    fontSize: 28,
    color: "#7B1818",
    marginBottom: 0,
    textTransform: "uppercase",
    letterSpacing: 3,
    fontFamily: "Times-Bold",
  },
  // Basic Info Box
  basicInfoBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 8,
    padding: pt(5),
    marginBottom: pt(8),
  },
  infoTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
    paddingBottom: 6,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 12,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoName: {
    fontSize: 12,
    color: "#1F2937",
    fontFamily: "Times-Bold",
  },
  gridTwoCol: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoRow: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 10,
    color: "#374151", // Dark, highly visible slate gray
  },
  infoValue: {
    fontSize: 11,
    color: "#111827",
    fontFamily: "Times-Bold",
  },
  // Disclaimer
  disclaimerBox: {
    backgroundColor: "#FDFBF7",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
    padding: pt(3),
    marginBottom: pt(8),
  },
  disclaimerText: {
    fontSize: 9,
    color: "#4B5563",
    fontFamily: "Times-Italic",
    textAlign: "center",
  },
  // Cards (Replaced Tables)
  tableGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tableBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 8,
    marginBottom: pt(6),
    paddingBottom: 4,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#FCFAF5",
    borderBottomWidth: 1,
    borderBottomColor: "#C5A059",
    padding: 6,
    marginBottom: 4,
  },
  tableTitle: {
    fontSize: 11,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F9FAFB",
  },
  rowLabel: {
    fontSize: 10,
    color: "#374151",
  },
  rowValue: {
    fontSize: 10.5,
    color: "#111827",
    fontFamily: "Times-Bold",
  },
  footer: {
    position: "absolute",
    bottom: pt(16),
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
    fontFamily: "Times-Bold",
    letterSpacing: 1,
  },
});

// --- DUMMY DATA ---
const defaultDummyData = {
  username: "Ayushmann Khurrana",
  dob: "1984-09-14",
  tob: "12:30:00",
  pob: "Chandigarh, India",
  latitude: 30.7333,
  longitude: 76.7794,
  timezone: "+05:30",
  tithi: "Krishna Panchami",
  yoga: "Harshana",
  karana: "Taitila",
  nakshatra: "Krittika",
  nakshatra_lord: "Sun",
  nakshatra_pada: 2,
  gana: "Rakshasa",
  yoni: "Mesh",
  nadi: "Antya",
  varna: "Kshatriya",
  vasya: "Chatushpada",
  paya: "Iron",
  tatva: "Fire",
  name_start: "U",
  ascendant_sign: "Scorpio",
  rasi: "Aries",
  rasi_lord: "Mars",
  sun_sign: "Leo",
  life_stone: "Red Coral",
  lucky_stone: "Pearl",
  fortune_stone: "Yellow Sapphire",
};

const defaultDummyDataHi = {
  ...defaultDummyData,
  username: "आयुष्मान खुराना",
  pob: "चंडीगढ़, भारत",
  tithi: "कृष्ण पंचमी",
  yoga: "हर्षण",
  karana: "तैतिल",
  nakshatra: "कृत्तिका",
  nakshatra_lord: "सूर्य",
  gana: "राक्षस",
  yoni: "मेष",
  nadi: "अन्त्य",
  varna: "क्षत्रिय",
  vasya: "चतुष्पद",
  paya: "लोहा",
  tatva: "अग्नि",
  ascendant_sign: "वृश्चिक",
  rasi: "मेष",
  rasi_lord: "मंगल",
  sun_sign: "सिंह",
  life_stone: "लाल मूंगा",
  lucky_stone: "मोती",
  fortune_stone: "पीला नीलम",
};

// --- NEW ORNATE VEDIC DIVIDER ---
const OrnateHeadingDivider = () => (
  <View style={{ alignItems: "center", marginTop: 6, marginBottom: 8 }}>
    <Svg viewBox="0 0 300 30" style={{ width: pt(110), height: pt(11) }}>
      {/* Left Line & Tapering Dots */}
      <Path d="M 0 15 L 105 15" stroke="#C5A059" strokeWidth="1" />
      <Circle cx="112" cy="15" r="1" fill="#C5A059" />
      <Circle cx="118" cy="15" r="1.5" fill="#C5A059" />
      <Circle cx="126" cy="15" r="2" fill="#C5A059" />

      {/* Center Lotus / Eye Motif */}
      <Path
        d="M135,15 Q150,0 165,15 Q150,30 135,15 Z"
        fill="none"
        stroke="#C5A059"
        strokeWidth="1"
      />

      {/* Center Layered Diamond */}
      <Path d="M150,4 L161,15 L150,26 L139,15 Z" fill="#7B1818" />
      <Path d="M150,8 L157,15 L150,22 L143,15 Z" fill="#C5A059" />
      <Circle cx="150" cy="15" r="1.5" fill="#FFFDF5" />

      {/* Right Line & Tapering Dots */}
      <Circle cx="174" cy="15" r="2" fill="#C5A059" />
      <Circle cx="182" cy="15" r="1.5" fill="#C5A059" />
      <Circle cx="188" cy="15" r="1" fill="#C5A059" />
      <Path d="M 195 15 L 300 15" stroke="#C5A059" strokeWidth="1" />
    </Svg>
  </View>
);

const DataRow = ({
  label,
  value,
  hindiFont,
}: {
  label: string;
  value: string | number;
  hindiFont?: any;
}) => (
  <View style={styles.dataRow}>
    <Text style={[styles.rowLabel, hindiFont]}>{label}</Text>
    <Text style={[styles.rowValue, hindiFont]}>{value}</Text>
  </View>
);

export default function ReactPdfBirthDetailsPage({
  lang,
  data: passedData,
}: {
  lang: Language;
  data?: any;
}) {
  // --- EXACT DATA LOGIC ---
  const isHi = lang === "hi";
  const birthDetails = useStore((state) => state.birthDetails);

  // Hindi font override
  const hindiFont = isHi ? { fontFamily: "NotoSansDevanagari" as const } : {};
  const hindiBold = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  const data =
    passedData && Object.keys(passedData).length > 0
      ? {
          ...passedData,
          username: birthDetails.username || "-",
          dob:
            birthDetails.dob instanceof Date
              ? birthDetails.dob.toLocaleDateString(isHi ? "hi-IN" : "en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : String(birthDetails.dob || "-"),
          tob: birthDetails.tob || "-",
          pob: birthDetails.pob || "-",
          latitude: birthDetails.latitude || 0,
          longitude: birthDetails.longitude || 0,
          timezone: birthDetails.timezone || "+05:30",
        }
      : {
          username: birthDetails.username || "-",
          dob:
            birthDetails.dob instanceof Date
              ? birthDetails.dob.toLocaleDateString(isHi ? "hi-IN" : "en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : String(birthDetails.dob || "-"),
          tob: birthDetails.tob || "-",
          pob: birthDetails.pob || "-",
          latitude: birthDetails.latitude || 0,
          longitude: birthDetails.longitude || 0,
          timezone: birthDetails.timezone || "+05:30",
        };

  const labels = resolveTranslations(birthDetailsTranslations, lang);
  const pLabels = resolveTranslations(panchangTranslations, lang);

  const title = isHi
    ? "\u091C\u0928\u094D\u092E \u0935\u093F\u0935\u0930\u0923"
    : "Birth Details";
  const disclaimer = isHi
    ? "\u0907\u0938 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C\u093C \u092E\u0947\u0902 \u0938\u092D\u0940 \u091C\u094D\u092F\u094B\u0924\u093F\u0937\u0940\u092F \u0917\u0923\u0928\u093E\u090F\u0901 \u0914\u0930 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 \u090A\u092A\u0930 \u0926\u093F\u090F \u0917\u090F \u091C\u0928\u094D\u092E \u0935\u093F\u0935\u0930\u0923 \u092A\u0930 \u0939\u0940 \u0906\u0927\u093E\u0930\u093F\u0924 \u0939\u0948\u0902\u0964 \u0915\u0943\u092A\u092F\u093E \u0921\u0947\u091F\u093E \u0915\u0940 \u0938\u091F\u0940\u0915\u0924\u093E \u0938\u0941\u0928\u093F\u0936\u094D\u091A\u093F\u0924 \u0915\u0930\u0947\u0902\u0964"
    : "All astrological calculations and analyses in this document are strictly based on the birth details provided above. Please ensure the accuracy of this data.";

  // --- RENDER UI ---
  return (
    <Page size="A4" style={[styles.page, hindiFont]}>
      {/* Borders */}
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.headerTitle,
            hindiBold,
            { letterSpacing: isHi ? 0 : 3 },
          ]}
        >
          {title}
        </Text>
        <OrnateHeadingDivider />
      </View>

      {/* Basic Info */}
      <View style={styles.basicInfoBox}>
        <View style={styles.infoTitleRow}>
          <Text style={[styles.infoTitle, hindiBold]}>{labels.title}</Text>
          <Text style={[styles.infoName, hindiBold]}>{data.username}</Text>
        </View>
        <View style={styles.gridTwoCol}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, hindiFont]}>{labels.date}</Text>
            <Text style={[styles.infoValue, hindiBold]}>{data.dob}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, hindiFont]}>{labels.time}</Text>
            <Text style={[styles.infoValue, hindiBold]}>{data.tob}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, hindiFont]}>{labels.place}</Text>
            <Text style={[styles.infoValue, hindiBold]}>{data.pob}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, hindiFont]}>{labels.lat}</Text>
            <Text style={[styles.infoValue, hindiBold]}>
              {data.latitude.toFixed(4)}
              {"\u00B0"} N
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, hindiFont]}>{labels.long}</Text>
            <Text style={[styles.infoValue, hindiBold]}>
              {data.longitude.toFixed(4)}
              {"\u00B0"} E
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, hindiFont]}>{labels.tz}</Text>
            <Text style={[styles.infoValue, hindiBold]}>{data.timezone}</Text>
          </View>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerBox}>
        <Text
          style={[
            styles.disclaimerText,
            hindiFont,
            isHi ? { fontStyle: "normal", fontSize: 9.5, lineHeight: 1.6 } : {},
          ]}
        >
          {disclaimer}
        </Text>
      </View>

      {/* 4-Box Grid Layout */}
      <View style={styles.tableGrid}>
        {/* Box 1: Panchang */}
        <View style={styles.tableBox}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableTitle, hindiBold]}>
              {pLabels.panchang}
            </Text>
          </View>
          <DataRow
            label={pLabels.tithi}
            value={data.tithi}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.yoga}
            value={data.yoga}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.karana}
            value={data.karana}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.nakshatra}
            value={`${data.nakshatra} (${pLabels.lord}: ${data.nakshatra_lord})`}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.pada}
            value={data.nakshatra_pada}
            hindiFont={hindiFont}
          />
        </View>

        {/* Box 2: Attributes */}
        <View style={styles.tableBox}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableTitle, hindiBold]}>
              {pLabels.attributes}
            </Text>
          </View>
          <DataRow
            label={pLabels.gana}
            value={data.gana}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.yoni}
            value={data.yoni}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.nadi}
            value={data.nadi}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.varna}
            value={data.varna}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.vasya}
            value={data.vasya}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.tatva}
            value={data.tatva}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.paya}
            value={data.paya}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.name}
            value={data.name_start}
            hindiFont={hindiFont}
          />
        </View>

        {/* Box 3: Signs */}
        <View style={styles.tableBox}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableTitle, hindiBold]}>{pLabels.signs}</Text>
          </View>
          <DataRow
            label={pLabels.asc}
            value={data.ascendant_sign}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.moon}
            value={`${data.rasi} (${pLabels.lord}: ${data.rasi_lord})`}
            hindiFont={hindiFont}
          />
          <DataRow
            label={pLabels.sun}
            value={data.sun_sign}
            hindiFont={hindiFont}
          />
        </View>

        {/* Box 4: Gems */}
        <View style={[styles.tableBox, { borderStyle: "dashed" }]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableTitle, hindiBold]}>{pLabels.gems}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={[styles.rowLabel, hindiFont]}>{pLabels.lStone}</Text>
            <Text style={[styles.rowValue, hindiFont, { color: "#B91C1C" }]}>
              {data.life_stone}
            </Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={[styles.rowLabel, hindiFont]}>{pLabels.lkStone}</Text>
            <Text style={[styles.rowValue, hindiFont, { color: "#15803D" }]}>
              {data.lucky_stone}
            </Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={[styles.rowLabel, hindiFont]}>{pLabels.fStone}</Text>
            <Text style={[styles.rowValue, hindiFont, { color: "#1D4ED8" }]}>
              {data.fortune_stone}
            </Text>
          </View>
        </View>
      </View>

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
