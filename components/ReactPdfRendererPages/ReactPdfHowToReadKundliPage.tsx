import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";
import { Language } from "@/types/languages";
import { readingGuideText } from "../pdf/static/howtoread";
import { hindiFont, hindiBold } from "@/components/pdf/pdfFontRegistry";

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
  bold: {
    fontFamily: "Times-Bold",
  },
  italic: {
    fontFamily: "Times-Italic",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: pt(8),
    marginBottom: pt(4),
  },
  headerTitle: {
    fontSize: 26,
    color: "#7B1818",
    marginBottom: 4,
    textTransform: "uppercase",
    fontFamily: "Times-Bold",
  },
  contentContainer: {
    paddingHorizontal: pt(10),
    marginTop: pt(4),
    marginBottom: pt(8),
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.8,
    textAlign: "justify",
    color: "#374151", // Dark, highly visible slate gray
  },
  principlesBox: {
    paddingVertical: pt(8),
    paddingHorizontal: pt(16),
    marginHorizontal: pt(5),
    backgroundColor: "#FDFBF7",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
  },
  principlesTitle: {
    fontSize: 11,
    textTransform: "uppercase",
    color: "#7B1818",
    marginBottom: pt(4),
    textAlign: "center",
    fontFamily: "Times-Bold",
  },
  principlesList: {
    fontSize: 11.5,
    lineHeight: 1.6,
    color: "#374151",
  },
  listItem: {
    marginBottom: 6,
    textAlign: "justify",
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

const getParagraphsEn = () => (
  <>
    <Text style={[styles.paragraph, { marginBottom: pt(8) }]}>
      A <Text style={styles.bold}>Kundli</Text> (birth chart) is a symbolic
      representation of the sky at the exact moment of birth. It reflects how
      planetary forces interact with individual consciousness over time. This
      report has been prepared using classical principles of{" "}
      <Text style={styles.italic}>Jyotisha</Text>, presented in a structured and
      readable form.
    </Text>
    <Text style={[styles.paragraph, { marginBottom: pt(8) }]}>
      Interpretations in this document are based on the relationship between{" "}
      <Text style={styles.bold}>Grahas</Text> (planets),{" "}
      <Text style={styles.bold}>Bhavas</Text> (houses),{" "}
      <Text style={styles.bold}>Rashis</Text> (signs), and time cycles such as{" "}
      <Text style={styles.bold}>Dasha</Text>. Results should be understood as
      tendencies and potentials, not as fixed outcomes.
    </Text>
    <Text style={styles.paragraph}>
      When reading this Kundli, move sequentially through the sections. Begin
      with birth details to understand the data foundation, then observe chart
      structures, followed by interpretative sections. Dashas and transits
      indicate <Text style={styles.italic}>timing</Text>, while remedies offer
      alignment rather than control.
    </Text>
  </>
);

const getParagraphsHi = () => (
  <>
    <Text style={[styles.paragraph, { marginBottom: pt(8) }, hindiFont]}>
      <Text style={hindiBold}>कुंडली</Text> (जन्म पत्रिका) जन्म के ठीक समय आकाश
      का एक प्रतीकात्मक प्रतिनिधित्व है। यह दर्शाता है कि समय के साथ ग्रहीय
      शक्तियां व्यक्तिगत चेतना के साथ कैसे अंतःक्रिया करती हैं। यह रिपोर्ट{" "}
      <Text style={hindiBold}>ज्योतिष</Text> के शास्त्रीय सिद्धांतों का उपयोग
      करके तैयार की गई है और इसे एक सुव्यवस्थित और पठनीय रूप में प्रस्तुत किया
      गया है।
    </Text>
    <Text style={[styles.paragraph, { marginBottom: pt(8) }, hindiFont]}>
      इस दस्तावेज़ में व्याख्याएं <Text style={hindiBold}>ग्रहों</Text>,{" "}
      <Text style={hindiBold}>भावों</Text>,{" "}
      <Text style={hindiBold}>राशियों</Text> और{" "}
      <Text style={hindiBold}>दशा</Text> जैसे समय चक्रों के बीच के संबंधों पर
      आधारित हैं। परिणामों को प्रवृत्तियों और संभावनाओं के रूप में समझा जाना
      चाहिए, न कि निश्चित परिणामों के रूप में।
    </Text>
    <Text style={[styles.paragraph, hindiFont]}>
      इस कुंडली को पढ़ते समय, अनुभागों के माध्यम से क्रमवार आगे बढ़ें। डेटा आधार
      को समझने के लिए जन्म विवरण से शुरू करें, फिर चार्ट संरचनाओं का अवलोकन
      करें, जिसके बाद व्याख्यात्मक खंड आते हैं। दशा और गोचर{" "}
      <Text style={hindiBold}>समय</Text> का संकेत देते हैं, जबकि उपाय नियंत्रण
      के बजाय संतुलन प्रदान करते हैं।
    </Text>
  </>
);

export default function ReactPdfHowToReadKundliPage({
  lang,
}: {
  lang: Language;
}) {
  const isHi = lang === "hi";
  const t =
    readingGuideText[lang as keyof typeof readingGuideText] ||
    readingGuideText.en;

  // Local font overrides for absolute consistency with other report pages
  const hindiFontOverride = isHi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBoldOverride = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  return (
    <Page size="A4" style={[styles.page, hindiFontOverride]}>
      {/* Borders */}
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.headerTitle,
            hindiBoldOverride,
            {
              textTransform: isHi ? "none" : "uppercase",
              letterSpacing: isHi ? 0 : 2,
            },
          ]}
        >
          {t.title}
        </Text>
        <OrnateHeadingDivider />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {isHi ? getParagraphsHi() : getParagraphsEn()}
      </View>

      {/* Key Principles Box */}
      <View style={styles.principlesBox}>
        <Text
          style={[
            styles.principlesTitle,
            hindiBoldOverride,
            { letterSpacing: isHi ? 0.5 : 3 },
          ]}
        >
          {t.principlesTitle}
        </Text>
        <View style={styles.principlesList}>
          {t.principlesList.map((item, index) => (
            <Text key={index} style={[styles.listItem, hindiFontOverride]}>
              • {item}
            </Text>
          ))}
        </View>
      </View>

      {/* Spacer to push footer to the bottom */}
      <View style={{ flexGrow: 1 }} />

      {/* Footer */}
      <View fixed style={styles.footer}>
        <Text style={[styles.footerText, hindiBoldOverride]}>
          {t.brandName}
        </Text>
        <Text
          style={[styles.footerText, hindiBoldOverride, { color: "#9CA3AF" }]}
        >
          {t.footerTitle}
        </Text>
      </View>
    </Page>
  );
}
