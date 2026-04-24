import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Rect,
} from "@react-pdf/renderer";

// Premium Color Palette
const colors = {
  background: "#040712", // Near-black midnight blue
  primary: "#D4AF37", // Classic Gold
  secondary: "#C5A028", // Deeper Gold
  accent: "#F3E5AB", // Soft Creamy Gold
  glow: "rgba(212, 175, 55, 0.15)",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    position: "relative",
    height: "100%",
    width: "100%",
  },
  svgBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  borderFrame: {
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    border: `1pt solid ${colors.primary}`,
    opacity: 0.6,
  },
  cornerDecorator: {
    position: "absolute",
    width: 60,
    height: 60,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 56,
    color: colors.primary,
    letterSpacing: 12,
    textAlign: "center",
    textTransform: "uppercase",
  },
  tagline: {
    fontFamily: "Times-Italic",
    fontSize: 14,
    color: colors.accent,
    letterSpacing: 4,
    marginTop: 10,
    textAlign: "center",
    opacity: 0.8,
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  userName: {
    fontFamily: "Times-Roman",
    fontSize: 28,
    color: colors.primary,
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 15,
  },
  reportType: {
    fontFamily: "Helvetica",
    fontSize: 12,
    color: colors.accent,
    letterSpacing: 6,
    textAlign: "center",
    textTransform: "uppercase",
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.primary,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 5,
    textAlign: "center",
    fontFamily: "Helvetica",
    opacity: 0.7,
  },
});

interface StarProps {
  cx: number;
  cy: number;
  scale?: number;
  opacity?: number;
}

const Star = ({ cx, cy, scale = 1, opacity = 1 }: StarProps) => (
  <Path
    d={`M${cx},${cy - 4 * scale} L${cx + 1 * scale},${cy - 1 * scale} L${cx + 4 * scale},${cy} L${cx + 1 * scale},${cy + 1 * scale} L${cx},${cy + 4 * scale} L${cx - 1 * scale},${cy + 1 * scale} L${cx - 4 * scale},${cy} L${cx - 1 * scale},${cy - 1 * scale} Z`}
    fill={colors.primary}
    opacity={opacity}
  />
);

const CelestialMandala = () => (
  <Svg height="841" width="595" style={styles.svgBackground}>
    {/* Concentric Celestial Rings */}
    <Circle
      cx="297.5"
      cy="420.5"
      r="340"
      stroke={colors.primary}
      strokeWidth="0.5"
      fill="none"
      opacity="0.1"
    />
    <Circle
      cx="297.5"
      cy="420.5"
      r="280"
      stroke={colors.primary}
      strokeWidth="0.8"
      fill="none"
      opacity="0.15"
    />
    <Circle
      cx="297.5"
      cy="420.5"
      r="220"
      stroke={colors.primary}
      strokeWidth="0.5"
      fill="none"
      opacity="0.2"
      strokeDasharray="5,10"
    />

    {/* Zodiac Ring */}
    <Circle
      cx="297.5"
      cy="420.5"
      r="180"
      stroke={colors.primary}
      strokeWidth="1.5"
      fill="none"
      opacity="0.3"
    />

    {/* Rays from Center */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
      <Rect
        key={angle}
        x="297"
        y="240"
        width="1"
        height="360"
        fill={colors.primary}
        opacity={0.1}
        style={{ transform: `rotate(${angle}deg, 297.5, 420.5)` }}
      />
    ))}

    {/* Decorative Elements */}
    <Path
      d="M 297.5,350 L 310,420 L 297.5,490 L 285,420 Z"
      fill={colors.primary}
      opacity="0.2"
    />

    {/* Stars Scattered */}
    <Star cx={100} cy={120} scale={1.2} opacity={0.4} />
    <Star cx={500} cy={150} scale={0.8} opacity={0.6} />
    <Star cx={150} cy={700} scale={1.5} opacity={0.3} />
    <Star cx={450} cy={750} scale={1} opacity={0.5} />
    <Star cx={50} cy={420} scale={0.7} opacity={0.4} />
    <Star cx={545} cy={420} scale={0.7} opacity={0.4} />

    {/* Corner Motifs */}
    <Path d="M 30,30 L 80,30 L 30,80 Z" fill={colors.primary} opacity="0.4" />
    <Path
      d="M 565,30 L 515,30 L 565,80 Z"
      fill={colors.primary}
      opacity="0.4"
    />
    <Path
      d="M 30,811 L 80,811 L 30,761 Z"
      fill={colors.primary}
      opacity="0.4"
    />
    <Path
      d="M 565,811 L 515,811 L 565,761 Z"
      fill={colors.primary}
      opacity="0.4"
    />
  </Svg>
);

interface UrekhaCoverPageProps {
  userName?: string;
  reportName?: string;
}

const UrekhaCoverPage = ({
  userName = "Raushan Kumar",
  reportName = "COMPLETE ASTROLOGICAL PROFILE",
}: UrekhaCoverPageProps) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* Background Artwork */}
      <CelestialMandala />

      {/* Framing */}
      <View style={styles.borderFrame} />

      {/* Content */}
      <View style={styles.contentWrapper}>
        {/* Header Section */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>UREKHA</Text>
          <Text style={styles.tagline}>THE COSMIC BLUEPRINT</Text>
        </View>

        {/* Center Graphic Placeholder (Optional) */}
        <View style={{ height: 200 }} />

        {/* User Details */}
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.reportType}>{reportName}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            PREPARED BY UREKHA INTELLIGENCE SYSTEM
          </Text>
          <Text
            style={[
              styles.footerText,
              { marginTop: 8, fontSize: 7, letterSpacing: 2 },
            ]}
          >
            © {new Date().getFullYear()} UREKHA. ALL RIGHTS RESERVED.
          </Text>
        </View>
      </View>
    </Page>
  );
};

export default UrekhaCoverPage;
