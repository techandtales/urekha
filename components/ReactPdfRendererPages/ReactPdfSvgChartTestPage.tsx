/**
 * ReactPdfSvgChartTestPage.tsx
 *
 * A minimal React-PDF Document used exclusively in the SVG→PNG test suite.
 * Accepts an array of { id, label, png } objects where `png` is already a
 * PNG data URL produced by the server-side /api/svg-to-png route.
 *
 * This validates that server-converted PNGs are correctly embeddable in React-PDF
 * without any client-side canvas conversion.
 */

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const pt = (mm: number) => mm * 2.83465;

import "@/components/pdf/pdfFontRegistry";

const styles = StyleSheet.create({
  page: {
    paddingTop: pt(14),
    paddingBottom: pt(14),
    paddingHorizontal: pt(16),
    backgroundColor: "#FFFDF5",
    fontFamily: "Times-Roman",
  },

  // Cover / title page
  titlePage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 22,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 11,
    color: "#6B7280",
    letterSpacing: 0.5,
  },

  // Chart page
  chartPage: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  chartHeader: {
    width: "100%",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C5A059",
    paddingBottom: pt(3),
    marginBottom: pt(6),
    alignItems: "center",
  },
  chartLabel: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    color: "#7B1818",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  chartSubLabel: {
    fontSize: 8,
    color: "#9CA3AF",
    marginTop: 3,
    letterSpacing: 0.5,
  },
  chartImageWrapper: {
    width: "70%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    padding: pt(2),
  },
  chartImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: pt(4),
  },
  badge: {
    backgroundColor: "#F0FDF4",
    borderWidth: 0.5,
    borderColor: "#86EFAC",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 8,
    color: "#16A34A",
    fontFamily: "Times-Bold",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: pt(12),
    left: pt(16),
    right: pt(16),
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#C5A059",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: "#7B1818",
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Borders (shared, fixed position on every page)
  outerBorder: {
    position: "absolute",
    top: pt(8),
    left: pt(8),
    right: pt(8),
    bottom: pt(8),
    borderWidth: 1.5,
    borderColor: "#7B1818",
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
    borderColor: "#C5A059",
    borderRadius: 5,
    opacity: 0.8,
  },
});

interface ChartEntry {
  id: string;
  label: string;
  png: string; // data:image/png;base64,...
}

interface Props {
  charts: ChartEntry[];
}

export default function ReactPdfSvgChartTestPage({ charts }: Props) {
  return (
    <Document
      title="SVG → PNG Conversion Test"
      author="Urekha Test Suite"
    >
      {/* ─── Cover Page ───────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder} fixed />
        <View style={styles.innerBorder} fixed />

        <View style={styles.titlePage}>
          <Text style={styles.titleText}>SVG → PNG Test</Text>
          <Text style={styles.subtitleText}>
            {charts.length} chart{charts.length !== 1 ? "s" : ""} converted server-side via sharp
          </Text>
          <Text style={[styles.subtitleText, { marginTop: 8, color: "#9CA3AF", fontSize: 9 }]}>
            POST /api/svg-to-png  •  Node.js + sharp  •  No browser canvas
          </Text>
        </View>

        <View fixed style={styles.footer}>
          <Text style={styles.footerText}>UREKHA • VEDIC INTELLIGENCE</Text>
          <Text style={styles.footerText}>Test Suite</Text>
        </View>
      </Page>

      {/* ─── One page per chart ──────────────────────────────────── */}
      {charts.map((chart) => (
        <Page key={chart.id} size="A4" style={styles.page}>
          <View style={styles.outerBorder} fixed />
          <View style={styles.innerBorder} fixed />

          <View style={styles.chartPage}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartLabel}>{chart.label}</Text>
              <Text style={styles.chartSubLabel}>
                Chart ID: {chart.id}  •  Format: PNG (server-side via sharp)
              </Text>
            </View>

            <View style={styles.chartImageWrapper}>
              <Image src={chart.png} style={styles.chartImage} />
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓ PNG Data URL</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓ sharp 2x rasterised</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✓ No browser canvas</Text>
              </View>
            </View>
          </View>

          <View fixed style={styles.footer}>
            <Text style={styles.footerText}>UREKHA • VEDIC INTELLIGENCE</Text>
            <Text style={[styles.footerText, { color: "#9CA3AF" }]}>
              {chart.id.toUpperCase()} CHART
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}


