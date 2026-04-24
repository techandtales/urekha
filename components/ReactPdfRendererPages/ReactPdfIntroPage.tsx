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
import { Language } from "@/types/languages";

// Register custom fonts (same as ReactPdfPredictionsView)
import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// --- ELEGANT STYLING WITH ROUNDED CORNERS ---
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFDF5",
    width: pt(210),
    height: pt(297),
    padding: pt(20),
    position: "relative",
    fontFamily: "Roboto",
    color: "#111827",
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
  bold: {
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  italic: {
    fontFamily: "Roboto",
    fontStyle: "normal",
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 3.5,
    textTransform: "uppercase",
    color: "#C5A059",
    textAlign: "center",
    marginTop: pt(8),
  },
  mainTitle: {
    fontSize: 28,
    letterSpacing: 2.5,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#7B1818",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  contentContainer: {
    paddingHorizontal: pt(10),
    marginTop: pt(6),
    marginBottom: pt(8),
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.8,
    textAlign: "justify",
    color: "#374151",
  },
  philosophyBlock: {
    textAlign: "center",
    paddingVertical: pt(8),
    paddingHorizontal: pt(16),
    marginHorizontal: pt(5),
    backgroundColor: "#FDFBF7",
    borderWidth: 0.5,
    borderColor: "#C5A059",
    borderRadius: 6,
  },
  philosophyTitle: {
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: "#7B1818",
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginBottom: pt(4),
  },
  philosophyQuote: {
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: "Roboto",
    fontStyle: "normal",
    color: "#4B5563",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: pt(6),
    paddingTop: 8,
    marginBottom: pt(2),
    marginHorizontal: pt(5),
    borderTopWidth: 0.5,
    borderTopColor: "#C5A059",
  },
  footerText: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#7B1818",
    fontFamily: "Roboto",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

// --- ORNATE DIVIDER (Consistent across pages) ---
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

const getIntroTextEn = () => (
  <>
    <View style={styles.contentContainer}>
      <Text style={[styles.paragraph, { marginBottom: pt(8) }]}>
        <Text style={styles.bold}>UREKHA</Text> is a Vedic Intelligence system
        designed to interpret the subtle patterns of life through the timeless
        science of <Text style={styles.italic}>Jyotisha</Text>. Rooted in
        classical astrology and refined through modern analytical systems,
        UREKHA does not merely predict events — it reveals the{" "}
        <Text style={styles.bold}>structure of karma</Text> operating within
        time.
      </Text>

      <Text style={[styles.paragraph, { marginBottom: pt(8) }]}>
        Every birth chart is a sacred map — a convergence of planetary forces,
        cosmic rhythms, and individual consciousness. This document has been
        generated to help you understand your life's tendencies, cycles, and
        opportunities with clarity, respect, and balance.
      </Text>

      <Text style={styles.paragraph}>
        UREKHA combines{" "}
        <Text style={styles.bold}>traditional astrological principles</Text>{" "}
        with structured intelligence to present insights that are meaningful,
        practical, and aligned with dharma. Interpretations are offered as
        guidance — empowering awareness rather than enforcing fate.
      </Text>
    </View>

    <View style={styles.philosophyBlock}>
      <Text style={styles.philosophyTitle}>Core Philosophy</Text>
      <Text style={styles.philosophyQuote}>
        {"\u201C"}Jyotisha is the light that reveals time.{"\n"}
        Karma is the pattern within it.{"\n"}
        Awareness is the freedom.{"\u201D"}
      </Text>
    </View>
  </>
);

const getIntroTextHi = (hindiFont: any = {}, hindiBold: any = {}) => (
  <>
    <View style={styles.contentContainer}>
      <Text
        style={[
          styles.paragraph,
          hindiFont,
          { marginBottom: pt(8), fontSize: 11.5, lineHeight: 1.85 },
        ]}
      >
        <Text style={[styles.bold, hindiBold]}>
          {"\u092F\u0941\u0930\u0947\u0916\u093E"} (UREKHA)
        </Text>{" "}
        {
          "\u090F\u0915 \u0935\u0948\u0926\u093F\u0915 \u0907\u0902\u091F\u0947\u0932\u093F\u091C\u0947\u0902\u0938 \u092A\u094D\u0930\u0923\u093E\u0932\u0940 \u0939\u0948 \u091C\u093F\u0938\u0947"
        }{" "}
        <Text style={[styles.bold, hindiBold]}>
          {"\u091C\u094D\u092F\u094B\u0924\u093F\u0937"}
        </Text>{" "}
        {
          "\u0915\u0947 \u0915\u093E\u0932\u093E\u0924\u0940\u0924 \u0935\u093F\u091C\u094D\u091E\u093E\u0928 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u091C\u0940\u0935\u0928 \u0915\u0947 \u0938\u0942\u0915\u094D\u0937\u094D\u092E \u092A\u0948\u091F\u0930\u094D\u0928 \u0915\u0940 \u0935\u094D\u092F\u093E\u0916\u094D\u092F\u093E \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0921\u093F\u091C\u093C\u093E\u0907\u0928 \u0915\u093F\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u0936\u093E\u0938\u094D\u0924\u094D\u0930\u0940\u092F \u091C\u094D\u092F\u094B\u0924\u093F\u0937 \u092E\u0947\u0902 \u0928\u093F\u0939\u093F\u0924 \u0914\u0930 \u0906\u0927\u0941\u0928\u093F\u0915 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923\u093E\u0924\u094D\u092E\u0915 \u092A\u094D\u0930\u0923\u093E\u0932\u093F\u092F\u094B\u0902 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u092A\u0930\u093F\u0937\u094D\u0915\u0943\u0924, \u092F\u0941\u0930\u0947\u0916\u093E \u0915\u0947\u0935\u0932 \u0918\u091F\u0928\u093E\u0913\u0902 \u0915\u0940 \u092D\u0935\u093F\u0937\u094D\u092F\u0935\u093E\u0923\u0940 \u0928\u0939\u0940\u0902 \u0915\u0930\u0924\u093E"
        }{" "}
        {"\u2014"}{" "}
        {
          "\u092F\u0939 \u0938\u092E\u092F \u0915\u0947 \u092D\u0940\u0924\u0930 \u0938\u0902\u091A\u093E\u0932\u093F\u0924"
        }{" "}
        <Text style={[styles.bold, hindiBold]}>
          {
            "\u0915\u0930\u094D\u092E \u0915\u0940 \u0938\u0902\u0930\u091A\u0928\u093E"
          }
        </Text>{" "}
        {
          "\u0915\u094B \u092A\u094D\u0930\u0915\u091F \u0915\u0930\u0924\u093E \u0939\u0948\u0964"
        }
      </Text>

      <Text
        style={[
          styles.paragraph,
          hindiFont,
          { marginBottom: pt(8), fontSize: 11.5, lineHeight: 1.85 },
        ]}
      >
        {
          "\u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u091C\u0928\u094D\u092E \u0915\u0941\u0902\u0921\u0932\u0940 \u090F\u0915 \u092A\u0935\u093F\u0924\u094D\u0930 \u092E\u093E\u0928\u091A\u093F\u0924\u094D\u0930 \u0939\u0948 \u2014 \u0917\u094D\u0930\u0939\u0940\u092F \u0936\u0915\u094D\u0924\u093F\u092F\u094B\u0902, \u092C\u094D\u0930\u0939\u094D\u092E\u093E\u0902\u0921\u0940\u092F \u0932\u092F \u0914\u0930 \u0935\u094D\u092F\u0915\u094D\u0924\u093F\u0917\u0924 \u091A\u0947\u0924\u0928\u093E \u0915\u093E \u0938\u0902\u0917\u092E\u0964 \u092F\u0939 \u0926\u0938\u094D\u0924\u093E\u0935\u0947\u091C \u0906\u092A\u0915\u094B \u091C\u0940\u0935\u0928 \u0915\u0940 \u092A\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F\u092F\u094B\u0902, \u091A\u0915\u094D\u0930\u094B\u0902 \u0914\u0930 \u0905\u0935\u0938\u0930\u094B\u0902 \u0915\u094B \u0938\u094D\u092A\u0937\u094D\u091F\u0924\u093E, \u0938\u092E\u094D\u092E\u093E\u0928 \u0914\u0930 \u0938\u0902\u0924\u0941\u0932\u0928 \u0915\u0947 \u0938\u093E\u0925 \u0938\u092E\u091D\u0928\u0947 \u092E\u0947\u0902 \u092E\u0926\u0926 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0924\u0948\u092F\u093E\u0930 \u0915\u093F\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964"
        }
      </Text>

      <Text
        style={[
          styles.paragraph,
          hindiFont,
          { fontSize: 11.5, lineHeight: 1.85 },
        ]}
      >
        {"\u092F\u0941\u0930\u0947\u0916\u093E"}{" "}
        <Text style={[styles.bold, hindiBold]}>
          {
            "\u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u091C\u094D\u092F\u094B\u0924\u093F\u0937 \u0938\u093F\u0926\u094D\u0927\u093E\u0902\u0924\u094B\u0902"
          }
        </Text>{" "}
        {
          "\u0915\u094B \u0938\u0902\u0930\u091A\u093F\u0924 \u092C\u0941\u0926\u094D\u0927\u093F\u092E\u0924\u094D\u0924\u093E (Structured Intelligence) \u0915\u0947 \u0938\u093E\u0925 \u091C\u094B\u0921\u093C\u0924\u093E \u0939\u0948 \u0924\u093E\u0915\u093F \u0910\u0938\u0940 \u0905\u0902\u0924\u0930\u094D\u0926\u0943\u0937\u094D\u091F\u093F \u092A\u094D\u0930\u0938\u094D\u0924\u0941\u0924 \u0915\u0940 \u091C\u093E \u0938\u0915\u0947 \u091C\u094B \u0938\u093E\u0930\u094D\u0925\u0915, \u0935\u094D\u092F\u093E\u0935\u0939\u093E\u0930\u093F\u0915 \u0914\u0930 \u0927\u0930\u094D\u092E \u0915\u0947 \u0905\u0928\u0941\u0930\u0942\u092A \u0939\u094B\u0964 \u0935\u094D\u092F\u093E\u0916\u094D\u092F\u093E\u090F\u0902 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0926\u0940 \u091C\u093E\u0924\u0940 \u0939\u0948\u0902 \u2014 \u091C\u094B \u092D\u093E\u0917\u094D\u092F \u0915\u094B \u0925\u094B\u092A\u0928\u0947 \u0915\u0947 \u092C\u091C\u093E\u092F \u091C\u093E\u0917\u0930\u0942\u0915\u0924\u093E \u0915\u094B \u0938\u0936\u0915\u094D\u0924 \u092C\u0928\u093E\u0924\u0940 \u0939\u0948\u0902\u0964"
        }
      </Text>
    </View>

    <View style={styles.philosophyBlock}>
      <Text style={[styles.philosophyTitle, hindiBold]}>
        {"\u092E\u0942\u0932 \u0926\u0930\u094D\u0936\u0928"}
      </Text>
      <Text
        style={[
          styles.philosophyQuote,
          hindiFont,
          { fontStyle: "normal", fontSize: 11.5, lineHeight: 1.7 },
        ]}
      >
        {
          "\u201C\u091C\u094D\u092F\u094B\u0924\u093F\u0937 \u0935\u0939 \u092A\u094D\u0930\u0915\u093E\u0936 \u0939\u0948 \u091C\u094B \u0938\u092E\u092F \u0915\u094B \u092A\u094D\u0930\u0915\u091F \u0915\u0930\u0924\u093E \u0939\u0948\u0964"
        }
        {"\n"}
        {
          "\u0915\u0930\u094D\u092E \u0909\u0938\u0915\u0947 \u092D\u0940\u0924\u0930 \u0915\u093E \u092A\u0948\u091F\u0930\u094D\u0928 \u0939\u0948\u0964"
        }
        {"\n"}
        {
          "\u091C\u093E\u0917\u0930\u0942\u0915\u0924\u093E \u0939\u0940 \u0938\u094D\u0935\u0924\u0902\u0924\u094D\u0930\u0924\u093E \u0939\u0948\u0964\u201D"
        }
      </Text>
    </View>
  </>
);

export default function ReactPdfIntroPage({ lang }: { lang: Language }) {
  const isHi = lang === "hi";
  const sectionTitle = isHi ? "\u092A\u0930\u093F\u091A\u092F" : "Introduction";
  const mainTitle = isHi
    ? "\u092F\u0941\u0930\u0947\u0916\u093E (UREKHA)"
    : "UREKHA";
  const brandName = isHi
    ? "\u092F\u0941\u0930\u0947\u0916\u093E \u2022 \u0935\u0948\u0926\u093F\u0915 \u0907\u0902\u091F\u0947\u0932\u093F\u091C\u0947\u0902\u0938"
    : "UREKHA \u2022 Vedic Intelligence";
  const footerTitle = isHi ? "\u092A\u0930\u093F\u091A\u092F" : "Introduction";

  // Hindi font override - applied at page level and to all Text elements
  const hindiFont = isHi ? { fontFamily: "NotoSansDevanagari" as const } : {};
  const hindiBold = isHi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: 700 as const }
    : {};

  return (
    <Page size="A4" style={[styles.page, hindiFont]}>
      {/* Borders */}
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      {/* Top Title Section */}
      <Text
        style={[
          styles.sectionTitle,
          hindiFont,
          { letterSpacing: isHi ? 0 : 3.5 },
        ]}
      >
        {sectionTitle}
      </Text>
      <Text
        style={[styles.mainTitle, hindiBold, { letterSpacing: isHi ? 0 : 2.5 }]}
      >
        {mainTitle}
      </Text>

      <OrnateHeadingDivider />

      {/* Content Section & Philosophy */}
      {isHi ? getIntroTextHi(hindiFont, hindiBold) : getIntroTextEn()}

      {/* Spacer to push footer to the bottom */}
      <View style={{ flexGrow: 1 }} />

      <View fixed style={styles.footer}>
        <Text style={[styles.footerText, hindiFont]}>{brandName}</Text>
        <Text style={[styles.footerText, { color: "#9CA3AF" }]}>
          {footerTitle}
        </Text>
      </View>
    </Page>
  );
}
