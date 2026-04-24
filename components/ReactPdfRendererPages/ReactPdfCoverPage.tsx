import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
  Circle,
  G,
} from "@react-pdf/renderer";
import { useStore } from "@/lib/store";
import { Language } from "@/types/languages";

// Import the shared font registry — this registers NotoSansDevanagari
// as a SIDE EFFECT without putting Font.register in this file (which
// crashes when combined with <Image fixed>).
import "@/components/pdf/pdfFontRegistry";

const pt = (mm: number) => mm * 2.83465;

// ─── Translations ────────────────────────────────────────────────────
export const coverPageText = {
  en: {
    invocation: "|| Sri Ganeshaya Namah ||",
    brandTitle: "UREKHA",
    brandSubtitle: "ASTROLOGICAL INSIGHTS",
    website: "www.urekha.com",
    preparedFor: "Prepared for",
  },
  hi: {
    invocation:
      "\u0965 \u0936\u094D\u0930\u0940 \u0917\u0923\u0947\u0936\u093E\u092F \u0928\u092E\u0903 \u0965",
    brandTitle: "\u092F\u0941\u0930\u0947\u0916\u093E",
    brandSubtitle:
      "\u091C\u094D\u092F\u094B\u0924\u093F\u0937\u0940\u092F \u0905\u0902\u0924\u0930\u094D\u0926\u0943\u0937\u094D\u091F\u093F",
    website: "www.urekha.com",
    preparedFor:
      "\u0915\u0947 \u0932\u093F\u090F \u0924\u0948\u092F\u093E\u0930",
  },
};

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#EAE0C8",
    padding: pt(20),
    position: "relative",
    fontFamily: "Roboto",
  },
  bgFullImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  cornerOrnament: {
    position: "absolute",
    width: pt(12),
    height: pt(12),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  invocationWrapper: {
    textAlign: "center",
    marginTop: pt(8),
  },
  invocationText: {
    fontSize: 16,
    letterSpacing: 1,
    color: "#7B1818",
    fontFamily: "Roboto",
    fontWeight: "bold",
    textAlign: "center",
  },
  omContainer: {
    width: pt(10),
    height: pt(10),
    marginHorizontal: "auto",
    marginTop: pt(4),
    marginBottom: pt(4),
    alignItems: "center",
    justifyContent: "center",
  },
  ganeshaContainer: {
    height: pt(130),
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  ganeshaImage: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
  },
  brandingContainer: {
    textAlign: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: pt(4),
  },
  brandTitle: {
    fontSize: 48,
    color: "#7B1818",
    fontFamily: "Roboto",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  brandSubtitle: {
    fontSize: 12,
    color: "#C5A059",
    marginTop: 8,
    fontFamily: "Roboto",
    textTransform: "uppercase",
  },
  userPreparedFor: {
    fontSize: 12,
    color: "#4B5563",
    fontFamily: "Roboto",
    marginTop: 20,
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    color: "#111827",
    fontFamily: "Roboto",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  website: {
    fontSize: 9,
    letterSpacing: 3,
    color: "#7B1818",
    fontFamily: "Roboto",
    fontWeight: "bold",
    textTransform: "uppercase",
    opacity: 0.8,
    marginTop: 10,
  },
});

// ─── SVG Components ──────────────────────────────────────────────────
const CornerFlowerSvg = () => (
  <Svg viewBox="0 0 100 100">
    <Path
      d="M100 0 C100 40 60 100 0 100"
      stroke="#C5A059"
      strokeWidth="1.5"
      fill="none"
      strokeDasharray="2,2"
    />
    <G transform="translate(65, 35) rotate(-15)">
      <Path d="M0 0 Q-15 -25 0 -40 Q15 -25 0 0" fill="#7B1818" opacity="0.9" />
      <Path d="M0 0 Q25 -15 40 0 Q25 15 0 0" fill="#C5A059" opacity="0.8" />
      <Path d="M0 0 Q-25 15 -40 0 Q-25 -15 0 0" fill="#7B1818" opacity="0.7" />
      <Path d="M0 0 Q15 25 0 40 Q-15 25 0 0" fill="#C5A059" opacity="0.6" />
      <Circle cx="0" cy="0" r="5" fill="#4A0E12" />
      <Circle cx="0" cy="0" r="2.5" fill="#C5A059" />
    </G>
    <G transform="translate(30, 80) scale(0.6) rotate(30)">
      <Path d="M0 0 Q-10 -20 0 -30 Q10 -20 0 0" fill="#7B1818" />
      <Path d="M0 0 Q10 -20 20 -10 Q10 0 0 0" fill="#C5A059" />
      <Circle cx="0" cy="0" r="4" fill="#4A0E12" />
    </G>
    <Circle cx="85" cy="70" r="2" fill="#C5A059" opacity="0.5" />
    <Circle cx="20" cy="40" r="1.5" fill="#7B1818" opacity="0.4" />
  </Svg>
);

const OrnateHeadingDivider = () => (
  <View style={{ alignItems: "center", marginTop: 12, marginBottom: 12 }}>
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

// ─── Main Component ──────────────────────────────────────────────────
export default function ReactPdfCoverPage({
  lang,
  userName: userNameProp,
}: {
  lang: Language;
  userName?: string;
}) {
  const t =
    coverPageText[lang as keyof typeof coverPageText] || coverPageText.en;
  const isHi = lang === "hi";

  const { birthDetails } = useStore();
  const userName =
    userNameProp || birthDetails?.username || "Ayushmann Khurrana (Dummy)";

  // Hindi font applied ONLY to individual <Text> — never to <Page>
  const hFont: any = isHi ? { fontFamily: "NotoSansDevanagari" } : {};
  const hBold: any = isHi
    ? { fontFamily: "NotoSansDevanagari", fontWeight: 700 }
    : {};

  return (
    <Page size="A4" style={styles.page}>
      {/* Background Image */}
      <Image fixed src="/bgframe.jpeg" style={styles.bgFullImage} />

      {/* Double Border Frame */}
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />

      {/* Corner Ornaments */}
      <View style={[styles.cornerOrnament, { top: pt(5.5), left: pt(5.5) }]}>
        <CornerFlowerSvg />
      </View>
      <View
        style={[
          styles.cornerOrnament,
          { top: pt(5.5), right: pt(5.5), transform: "rotate(90deg)" },
        ]}
      >
        <CornerFlowerSvg />
      </View>
      <View
        style={[
          styles.cornerOrnament,
          { bottom: pt(5.5), left: pt(5.5), transform: "rotate(270deg)" },
        ]}
      >
        <CornerFlowerSvg />
      </View>
      <View
        style={[
          styles.cornerOrnament,
          { bottom: pt(5.5), right: pt(5.5), transform: "rotate(180deg)" },
        ]}
      >
        <CornerFlowerSvg />
      </View>

      {/* Invocation */}
      <View style={styles.invocationWrapper}>
        <Text style={[styles.invocationText, hBold]}>{t.invocation}</Text>
      </View>

      {/* Small Ornament */}
      <View style={styles.omContainer}>
        <CornerFlowerSvg />
      </View>

      {/* Ganesha Image — disabled to debug crash */}
      {/* <View style={styles.ganeshaContainer}>
      </View> */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: pt(20),
        }}
      >
        <Image
          style={{
            width: pt(100),
            height: pt(100),
            justifyContent: "center",
            alignItems: "center",
          }}
          src="/newganesha.png"
        />
      </View>

      {/* Branding Block */}
      <View style={styles.brandingContainer}>
        <Text
          style={[styles.brandTitle, hBold, { letterSpacing: isHi ? 0 : 4 }]}
        >
          {t.brandTitle}
        </Text>
        <Text
          style={[
            styles.brandSubtitle,
            hFont,
            { letterSpacing: isHi ? 1.5 : 4 },
          ]}
        >
          {t.brandSubtitle}
        </Text>

        <OrnateHeadingDivider />

        {userName && (
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.userPreparedFor, hFont]}>{t.preparedFor}</Text>
            <Text style={[styles.userName, hBold]}>{userName}</Text>
          </View>
        )}

        <Text style={styles.website}>{t.website}</Text>
      </View>
    </Page>
  );
}
