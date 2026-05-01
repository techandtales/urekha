"use client";
import React, { useMemo } from "react";
import "@/components/pdf/pdfFontRegistry"; // ── Ensure shared fonts are registered first ──
import { useStore } from "@/lib/store";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFViewer,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";
import type {
  ContentBlock,
  PredictionJSONResponse,
} from "@/types/prediction-response";

// Redundant font registration and high-overhead hyphenation moved to @/components/pdf/pdfFontRegistry

// Hindi-specific style overrides
// Devanagari needs slightly larger font sizes and more line height for readability.
// IMPORTANT: Do NOT add letterSpacing for Hindi — it breaks conjunct letters (matras/half-letters).
const hindiStyleOverrides = {
  p: { fontSize: 11.5, lineHeight: 1.85, textAlign: "left" as const },
  h2: { fontSize: 17 },
  h3: { fontSize: 13 },
  note: { fontSize: 10, lineHeight: 1.7 },
  remarkText: { fontSize: 10.5, lineHeight: 1.7, textAlign: "left" as const },
  bulletItem: { fontSize: 10.5, lineHeight: 1.7, textAlign: "left" as const },
  closing: { fontSize: 11.5, lineHeight: 1.7, textAlign: "left" as const },
  highlightTitle: { fontSize: 12 },
  verseText: { fontSize: 11.5, lineHeight: 1.7, textAlign: "left" as const },
  tableCell: { fontSize: 9.5 },
  tableHeader: { fontSize: 9.5 },
};

// Category meta matches the main PredictionPageLayout
const CATEGORY_META: Record<
  string,
  {
    title: string;
    subtitle: string;
    titleHi: string;
    subtitleHi: string;
    symbol: string;
  }
> = {
  "personal-insight": {
    title: "Personal Insight",
    subtitle: "Nature • Character • Personality",
    titleHi: "व्यक्तिगत अंतर्दृष्टि",
    subtitleHi: "स्वभाव • चरित्र • व्यक्तित्व",
    symbol: "☉",
  },
  health: {
    title: "Health & Vitality",
    subtitle: "Constitution • Wellness • Strength",
    titleHi: "स्वास्थ्य और जीवन शक्ति",
    subtitleHi: "शारीरिक गठन • कल्याण • शक्ति",
    symbol: "♂",
  },
  career: {
    title: "Career & Profession",
    subtitle: "Vocation • Growth • Success",
    titleHi: "करियर और व्यवसाय",
    subtitleHi: "पेशा • विकास • सफलता",
    symbol: "♄",
  },
  education: {
    title: "Education & Learning",
    subtitle: "Intellect • Study • Achievement",
    titleHi: "शिक्षा और अधिगम",
    subtitleHi: "बुद्धि • अध्ययन • उपलब्धि",
    symbol: "☿",
  },
  challenges: {
    title: "Challenges & Rivals",
    subtitle: "Obstacles • Competition • Triumph",
    titleHi: "शत्रु और चुनौतियाँ",
    subtitleHi: "बाधाएँ • प्रतिस्पर्धा • विजय",
    symbol: "♂",
  },
  finance: {
    title: "Wealth & Prosperity",
    subtitle: "Abundance • Investments • Karma",
    titleHi: "धन और समृद्धि",
    subtitleHi: "प्रचुरता • निवेश • कर्म",
    symbol: "♀",
  },
  "love-relation": {
    title: "Love & Relationships",
    subtitle: "Romance • Desire • Connection",
    titleHi: "प्रेम और संबंध",
    subtitleHi: "रोमांस • इच्छा • संबंध",
    symbol: "♀",
  },
  "family-relation": {
    title: "Family & Domestic Life",
    subtitle: "Bonds • Home • Harmony",
    titleHi: "परिवार और घरेलू जीवन",
    subtitleHi: "बंधन • घर • सद्भाव",
    symbol: "☽",
  },
  spirituality: {
    title: "Spirituality & Inner Growth",
    subtitle: "Dharma • Liberation • Peace",
    titleHi: "आध्यात्मिकता और आंतरिक विकास",
    subtitleHi: "धर्म • मुक्ति • शांति",
    symbol: "♃",
  },
  marriage: {
    title: "Marriage & Partnership",
    subtitle: "Union • Harmony • Destiny",
    titleHi: "विवाह और साझेदारी",
    subtitleHi: "संघ • सद्भाव • भाग्य",
    symbol: "♀",
  },
  children: {
    title: "Children & Progeny",
    subtitle: "Legacy • Nurturing • Blessings",
    titleHi: "संतान और वंश",
    subtitleHi: "विरासत • पोषण • आशीर्वाद",
    symbol: "♃",
  },
  travel: {
    title: "Travel & Foreign Lands",
    subtitle: "Journeys • Relocation • Horizons",
    titleHi: "यात्रा और विदेशी भूमि",
    subtitleHi: "यात्राएं • स्थानांतरण • क्षितिज",
    symbol: "☊",
  },
  "lifelong-overview": {
    title: "Lifelong Overview",
    subtitle: "Destiny • Purpose • Soul Map",
    titleHi: "जीवन भर का अवलोकन",
    subtitleHi: "भाग्य • उद्देश्य • आत्मा मानचित्र",
    symbol: "☸",
  },
  "5-year-forecast": {
    title: "5-Year Forecast",
    subtitle: "Phases • Timing • Opportunity",
    titleHi: "5-वर्षीय पूर्वानुमान",
    subtitleHi: "चरण • समय • अवसर",
    symbol: "♄",
  },
  "10-year-forecast": {
    title: "10-Year Forecast",
    subtitle: "Decades • Vision • Cycles",
    titleHi: "10-वर्षीय पूर्वानुमान",
    subtitleHi: "दशक • दृष्टि • चक्र",
    symbol: "♄",
  },
  "15-year-forecast": {
    title: "15-Year Forecast",
    subtitle: "Eras • Transformation • Legacy",
    titleHi: "15-वर्षीय पूर्वानुमान",
    subtitleHi: "युग • परिवर्तन • विरासत",
    symbol: "♄",
  },
};

function getCategoryMeta(cat: string) {
  const normalizedCat = cat.replace(/-\d{4}$/, "");
  return (
    CATEGORY_META[normalizedCat] ?? {
      title: normalizedCat
        .replace(/^predict-/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      subtitle: "Vedic Astrology Insight",
      titleHi: normalizedCat.replace(/^predict-/, "").replace(/-/g, " "),
      subtitleHi: "वैदिक ज्योतिष अंतर्दृष्टि",
      symbol: "✦",
    }
  );
}

// 1mm = 2.83465 pt
const pt = (mm: number) => mm * 2.83465;

const styles = StyleSheet.create({
  page: {
    paddingTop: pt(22), // Ensures overflow pages have a solid gap from the inner border!
    paddingBottom: pt(25),
    paddingHorizontal: pt(16),
    backgroundColor: "#FDFDF9",
    fontFamily: "Helvetica",
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
  headerContainer: {
    alignItems: "center",
    marginTop: pt(2), // Reduced to perfectly counterbalance the new larger page top-padding
    marginBottom: pt(10),
  },
  headerLabel: {
    fontSize: 8,
    color: "#B8963E",
    marginBottom: 5,
  },
  headerSymbol: {
    fontSize: 22,
    color: "#9F1239",
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 26,
    color: "#7B1818",
    marginBottom: 4,
    fontFamily: "Times-Bold",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#78716C",
    marginBottom: 10,
  },

  // ── Content Block Styles ──
  h2: {
    fontSize: 16,
    color: "#9F1239",
    marginTop: 15,
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#F9D5DC",
    paddingBottom: 4,
  },
  h3: {
    fontSize: 12,
    color: "#7C2D12",
    marginTop: 12,
    marginBottom: 4,
  },
  p: {
    fontSize: 10.5,
    color: "#292524",
    marginBottom: 8,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    color: "#9F1239",
  },
  note: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 6,
    paddingLeft: 12,
  },
  remarkBox: {
    borderLeftWidth: 2,
    borderLeftColor: "#B8963E",
    paddingLeft: 10,
    marginBottom: 8,
    marginTop: 4,
  },
  remarkLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#B8963E",
    marginBottom: 2,
  },
  remarkText: {
    fontSize: 10,
    color: "#292524",
    lineHeight: 1.5,
  },
  tableContainer: {
    marginVertical: 8,
  },
  tableCaption: {
    fontSize: 9,
    color: "#78716C",
    marginBottom: 4,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#D6D3D1",
  },
  tableRowEven: {
    backgroundColor: "#FAF5F0",
  },
  tableHeader: {
    flex: 1,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    backgroundColor: "#9F1239",
    padding: 5,
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: "#292524",
    padding: 5,
    textAlign: "center",
  },
  highlightBox: {
    borderWidth: 1,
    borderColor: "#B8963E",
    backgroundColor: "#FFFBEB",
    padding: 10,
    marginVertical: 8,
    borderRadius: 2,
  },
  highlightTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#B8963E",
    marginBottom: 4,
  },
  verseContainer: {
    marginVertical: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  verseText: {
    fontSize: 10.5,
    color: "#9F1239",
    textAlign: "center",
    lineHeight: 1.6,
  },
  verseSource: {
    fontSize: 8,
    color: "#78716C",
    marginTop: 3,
    textAlign: "center",
  },
  bulletList: {
    marginBottom: 8,
    paddingLeft: 10,
  },
  bulletItem: {
    fontSize: 10,
    color: "#292524",
    marginBottom: 3,
    lineHeight: 1.5,
  },
  ornamentalRule: {
    height: 0.75,
    backgroundColor: "#B8963E",
    opacity: 0.3,
    marginVertical: 10,
    alignSelf: "center",
    width: "60%",
  },
  closing: {
    fontSize: 11,
    color: "#78716C",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: pt(18),
    left: pt(22),
    right: pt(22),
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(184, 150, 62, 0.4)",
    paddingTop: pt(3),
  },
  footerText: {
    fontSize: 8,
    color: "#A8A29E",
  },
});

// ── Page Background (borders + footer) ──
const PageBackground = ({ isHindi }: { isHindi: boolean }) => {
  const hindiFont = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  return (
    <>
      <View fixed style={styles.outerBorder} />
      <View fixed style={styles.innerBorder} />
      <View fixed style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            hindiFont,
            !isHindi ? { letterSpacing: 1.5, textTransform: "uppercase" } : {},
          ]}
          hyphenationCallback={isHindi ? (word: string) => [word] : undefined}
        >
          {isHindi
            ? "युरेखा • वैदिक इंटेलिजेंस"
            : "UREKHA • Vedic Intelligence"}
        </Text>
        <Text
          style={[
            styles.footerText,
            !isHindi ? { letterSpacing: 1.5, textTransform: "uppercase" } : {},
          ]}
        >
          www.urekha.com
        </Text>
      </View>
    </>
  );
};

// --- ORNATE DIVIDER ---
const OrnateHeadingDivider = () => (
  <View style={{ alignItems: "center", marginTop: 4, marginBottom: 8 }}>
    <Svg viewBox="0 0 300 30" style={{ width: pt(110), height: pt(11) }}>
      <Path d="M0 15 L105 15" stroke="#C5A059" strokeWidth="1" />
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
      <Path d="M195 15 L300 15" stroke="#C5A059" strokeWidth="1" />
    </Svg>
  </View>
);

// ── Bold text parser (**text** → styled bold) ──
function renderParagraphElements(
  text: any,
  keyPrefix: string,
  hindiBoldOverride?: Record<string, any>,
) {
  if (!text) return null;

  // Handle non-string inputs (e.g., objects or arrays erroneously passed by AI synthesis)
  const safeText = typeof text === "string" ? text : String(text);

  if (!safeText.includes("**")) {
    return safeText;
  }

  const parts = safeText.split(/(\*\*.*?\*\*)/g);
  return parts
    .map((part, idx) => {
      if (!part) return null;
      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = part.slice(2, -2);
        if (!inner) return null;
        return (
          <Text
            key={`${keyPrefix}-b${idx}`}
            style={[styles.bold, hindiBoldOverride || {}]}
          >
            {inner}
          </Text>
        );
      }
      return <Text key={`${keyPrefix}-t${idx}`}>{part}</Text>;
    })
    .filter((v): v is JSX.Element | string => v !== null);
}

// ══════════════════════════════════════════════════════════════════════════
// BLOCK-BASED RENDERER (New JSON format)
// ══════════════════════════════════════════════════════════════════════════

function renderContentBlock(
  block: ContentBlock,
  idx: number,
  hindiFont: any,
  hindiBold: any,
  isHindi: boolean = false,
) {
  switch (block.type) {
    case "heading":
      return (
        <Text
          key={idx}
          style={[styles.h2, hindiFont, isHindi ? hindiStyleOverrides.h2 : {}]}
        >
          {block.text}
        </Text>
      );

    case "subheading":
      return (
        <Text
          key={idx}
          style={[styles.h3, hindiFont, isHindi ? hindiStyleOverrides.h3 : {}]}
        >
          {block.text}
        </Text>
      );

    case "paragraph":
      return (
        <Text
          key={idx}
          style={[styles.p, hindiFont, isHindi ? hindiStyleOverrides.p : {}]}
          hyphenationCallback={isHindi ? (word: string) => [word] : undefined}
        >
          {renderParagraphElements(block.text, `b-${idx}`, hindiBold)}
        </Text>
      );

    case "note":
      return (
        <Text
          key={idx}
          style={[
            styles.note,
            hindiFont,
            isHindi ? { fontStyle: "normal", ...hindiStyleOverrides.note } : {},
          ]}
          hyphenationCallback={isHindi ? (word: string) => [word] : undefined}
        >
          ℹ {renderParagraphElements(block.text, `n-${idx}`, hindiBold)}
        </Text>
      );

    case "remark":
      return (
        <View key={idx} style={styles.remarkBox}>
          <Text style={[styles.remarkLabel, hindiFont]}>{block.label}:</Text>
          <Text
            style={[
              styles.remarkText,
              hindiFont,
              isHindi ? hindiStyleOverrides.remarkText : {},
            ]}
            hyphenationCallback={isHindi ? (word: string) => [word] : undefined}
          >
            {renderParagraphElements(block.text, `r-${idx}`, hindiBold)}
          </Text>
        </View>
      );

    case "table":
      return (
        <View key={idx} style={styles.tableContainer}>
          {block.caption && (
            <Text
              style={[
                styles.tableCaption,
                hindiFont,
                isHindi ? { fontStyle: "normal" } : {},
              ]}
              hyphenationCallback={
                isHindi ? (word: string) => [word] : undefined
              }
            >
              {renderParagraphElements(block.caption, `tc-${idx}`, hindiBold)}
            </Text>
          )}
          <View style={styles.tableRow}>
            {block.headers.map((h: string, i: number) => (
              <Text
                key={i}
                style={[
                  styles.tableHeader,
                  hindiFont,
                  isHindi ? hindiStyleOverrides.tableHeader : {},
                ]}
                hyphenationCallback={
                  isHindi ? (word: string) => [word] : undefined
                }
              >
                {renderParagraphElements(h, `th-${idx}-${i}`, hindiBold)}
              </Text>
            ))}
          </View>
          {block.rows.map((row: string[], ri: number) => (
            <View
              key={ri}
              style={[styles.tableRow, ri % 2 === 0 ? styles.tableRowEven : {}]}
            >
              {row.map((cell: string, ci: number) => (
                <Text
                  key={ci}
                  style={[
                    styles.tableCell,
                    hindiFont,
                    isHindi ? hindiStyleOverrides.tableCell : {},
                  ]}
                  hyphenationCallback={
                    isHindi ? (word: string) => [word] : undefined
                  }
                >
                  {renderParagraphElements(
                    cell,
                    `tb-${idx}-${ri}-${ci}`,
                    hindiBold,
                  )}
                </Text>
              )).filter(Boolean)}
            </View>
          )).filter(Boolean)}
        </View>
      );

    case "highlight_box":
      return (
        <View key={idx} style={styles.highlightBox}>
          <Text
            style={[
              styles.highlightTitle,
              hindiFont,
              isHindi ? hindiStyleOverrides.highlightTitle : {},
            ]}
            hyphenationCallback={isHindi ? (word: string) => [word] : undefined}
          >
            {renderParagraphElements(block.title, `hbt-${idx}`, hindiBold)}
          </Text>
          <Text
            style={[styles.p, hindiFont, isHindi ? hindiStyleOverrides.p : {}]}
            hyphenationCallback={isHindi ? (word: string) => [word] : undefined}
          >
            {renderParagraphElements(block.text, `hb-${idx}`, hindiBold)}
          </Text>
        </View>
      );

    case "verse":
      return (
        <View key={idx} style={styles.verseContainer}>
          <Text
            style={[
              styles.verseText,
              hindiFont,
              isHindi
                ? { fontStyle: "normal", ...hindiStyleOverrides.verseText }
                : {},
            ]}
          >
            {renderParagraphElements(block.text, `v-${idx}`, hindiBold)}
          </Text>
          {block.source && (
            <Text style={[styles.verseSource, hindiFont]}>
              — {block.source}
            </Text>
          )}
        </View>
      );

    case "bullet_list":
      return (
        <View key={idx} style={styles.bulletList}>
          {block.items.map((item: string, i: number) => (
            <Text
              key={i}
              style={[
                styles.bulletItem,
                hindiFont,
                isHindi ? hindiStyleOverrides.bulletItem : {},
              ]}
              hyphenationCallback={
                isHindi ? (word: string) => [word] : undefined
              }
            >
              • {renderParagraphElements(item, `bl-${idx}-${i}`, hindiBold)}
            </Text>
          )).filter(Boolean)}
        </View>
      );

    case "separator":
      return <View key={idx} style={styles.ornamentalRule} />;

    case "closing":
      return (
        <Text
          key={idx}
          style={[
            styles.closing,
            hindiFont,
            isHindi
              ? { fontStyle: "normal", ...hindiStyleOverrides.closing }
              : {},
          ]}
          hyphenationCallback={isHindi ? (word: string) => [word] : undefined}
        >
          {renderParagraphElements(block.text, `cl-${idx}`, hindiBold)}
        </Text>
      );

    default:
      return null;
  }
}

function renderContentBlocks(blocks: ContentBlock[], isHindi: boolean) {
  const hindiFont = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBold = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: "bold" as const }
    : {};
  return blocks.map((block, idx) =>
    renderContentBlock(block, idx, hindiFont, hindiBold, isHindi),
  ).filter(Boolean);
}

// ══════════════════════════════════════════════════════════════════════════
// LEGACY MARKDOWN RENDERER (Fallback for old responses)
// ══════════════════════════════════════════════════════════════════════════

function renderMarkdownBlocks(raw: string, isHindi: boolean = false) {
  const nodes = [];
  const lines = raw.split("\n");
  let i = 0;
  const hindiFont = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const }
    : {};
  const hindiBold = isHindi
    ? { fontFamily: "NotoSansDevanagari" as const, fontWeight: "bold" as const }
    : {};

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      nodes.push(
        <Text key={`h2-${i}`} style={[styles.h2, hindiFont]}>
          {line.slice(3)}
        </Text>,
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      nodes.push(
        <Text key={`h3-${i}`} style={[styles.h3, hindiFont]}>
          {line.slice(4)}
        </Text>,
      );
      i++;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ")
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    const combined = paraLines.join(" ");
    nodes.push(
      <Text
        key={`p-${i}`}
        style={[styles.p, hindiFont, isHindi ? hindiStyleOverrides.p : {}]}
        hyphenationCallback={isHindi ? (word: string) => [word] : undefined}
      >
        {renderParagraphElements(combined, `p-${i}`, hindiBold)}
      </Text>,
    );
  }

  return nodes;
}

// ══════════════════════════════════════════════════════════════════════════
// CATEGORY PAGE — renders either blocks or markdown fallback
// ══════════════════════════════════════════════════════════════════════════

export const CategoryPage = ({
  category,
  data,
  structured,
  isHindi,
}: {
  category: string;
  data: string;
  structured?: PredictionJSONResponse | null;
  isHindi: boolean;
}) => {
  const meta = getCategoryMeta(category);
  const displayTitle = isHindi ? meta.titleHi : meta.title;
  const displaySubtitle = isHindi ? meta.subtitleHi : meta.subtitle;
  const hindiFont = isHindi ? { fontFamily: "NotoSansDevanagari" } : {};

  // Determine if we can use structured blocks
  let resolvedStructured = structured;

  // Last-resort: if structured is null but data looks like JSON (wrapped in fences), try parsing
  if (!resolvedStructured && typeof data === "string") {
    try {
      let cleanStr = data.trim();

      const start = cleanStr.indexOf("{");
      const arrStart = cleanStr.indexOf("[");
      let isArr = arrStart !== -1 && (start === -1 || arrStart < start);

      const openChar = isArr ? "[" : "{";
      const closeChar = isArr ? "]" : "}";
      const firstIdx = isArr ? arrStart : start;

      let jsonObjStr = cleanStr;

      if (firstIdx !== -1) {
        let depth = 0;
        let inString = false;
        let escape = false;
        for (let i = firstIdx; i < cleanStr.length; i++) {
          const char = cleanStr[i];
          if (escape) {
            escape = false;
            continue;
          }
          if (char === "\\") {
            escape = true;
            continue;
          }
          if (char === '"') {
            inString = !inString;
            continue;
          }
          if (!inString) {
            if (char === openChar) depth++;
            else if (char === closeChar) {
              depth--;
              if (depth === 0) {
                jsonObjStr = cleanStr.substring(firstIdx, i + 1);
                break;
              }
            }
          }
        }
      }

      let parsed: any;
      try {
        parsed = JSON.parse(jsonObjStr);
      } catch {
        // Attempt 2: Sanitize newlines
        try {
          const sanitized = jsonObjStr.replace(/[\n\r\t]+/g, " ");
          parsed = JSON.parse(sanitized);
        } catch {
          // Attempt 3: CATASTROPHIC SALVAGE MODE
          // The AI output invalid JSON (e.g. unescaped quotes). Do not show code bracket soup to the user!
          // We will forcefully extract blocks using permissive Regex.
          const salvagedBlocks: any[] = [];

          // Match objects that look like: { "type": "paragraph", "text": "some text" }
          // This regex looks for "type" followed by the type name, then "text" followed by its contents
          // (stopping at the next likely key boundary or end of line/object)
          const blockRegex =
            /"type"\s*:\s*"([^"]+)"\s*,\s*"text"\s*:\s*"((?:[^"\\]|\\.)*)/gi;

          let bMatch;
          while ((bMatch = blockRegex.exec(jsonObjStr)) !== null) {
            let type = bMatch[1].toLowerCase();
            let text = bMatch[2];

            // Cleanup trailing junk from the greedy match if it caught the next property
            if (text.endsWith(`","`)) text = text.substring(0, text.length - 3);
            if (text.endsWith(`", "`))
              text = text.substring(0, text.length - 4);
            if (text.endsWith(`"}`)) text = text.substring(0, text.length - 2);
            if (text.endsWith(`"`)) text = text.substring(0, text.length - 1);

            text = text.replace(/\\"/g, '"').replace(/\\n/g, "\n").trim();

            if (["heading", "subheading", "paragraph"].includes(type)) {
              salvagedBlocks.push({ type, text });
            } else {
              salvagedBlocks.push({ type: "paragraph", text }); // fallback type
            }
          }

          if (salvagedBlocks.length > 0) {
            parsed = { blocks: salvagedBlocks, keywords: [] };
          }
        }
      }

      if (parsed && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
        resolvedStructured = parsed;
      } else {
        // Complete fallback formatting just to be safe: strip out remaining JSON syntax if it still forces Markdown mode
        data = data
          .replace(/`{3,}\w*\s*/g, "")
          .replace(/`{3,}/g, "")
          .trim();
        data = data.replace(/"blocks"\s*:\s*\[/, "");
        data = data.replace(/[\[\]{}]/g, ""); // Strip surviving brackets
        data = data
          .replace(/"text"\s*:\s*"/g, "\n\n")
          .replace(/"type"\s*:\s*"[^"]*",/g, "");
      }
    } catch {
      /* not JSON, will use markdown fallback */
    }
  }

  const hasBlocks =
    resolvedStructured &&
    Array.isArray(resolvedStructured.blocks) &&
    resolvedStructured.blocks.length > 0;

  // Give non-heading blocks (like paragraphs) extra breathing room below the primary category header
  const firstBlockIsHeading = hasBlocks
    ? resolvedStructured!.blocks[0].type === "heading"
    : data.trim().startsWith("##");

  const contentPaddingTop = firstBlockIsHeading ? 0 : pt(10);
  return (
    <Page size="A4" style={[styles.page, hindiFont]}>
      <PageBackground isHindi={isHindi} />

      {/* Category Header */}
      <View style={styles.headerContainer}>
        {/* Vedic Astrology Insight label and Symbol removed per request */}
        <Text
          style={[
            styles.headerTitle,
            hindiFont,
            !isHindi ? { letterSpacing: 2, textTransform: "uppercase" } : {},
          ]}
        >
          {displayTitle}
        </Text>
        <OrnateHeadingDivider />
        <Text
          style={[
            styles.headerSubtitle,
            hindiFont,
            !isHindi ? { letterSpacing: 1.5, textTransform: "uppercase" } : {},
          ]}
        >
          {displaySubtitle}
        </Text>
      </View>

      {/* Physical spacer to guarantee margin is respected by the PDF engine's flow calculate */}
      <View style={{ height: contentPaddingTop, width: "100%" }} />

      {/* Content — Block-based or Markdown fallback */}
      <View style={{ flex: 1, paddingHorizontal: pt(4) }}>
        {hasBlocks
          ? renderContentBlocks(resolvedStructured!.blocks, isHindi)
          : renderMarkdownBlocks(data, isHindi)}
      </View>
    </Page>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════════════════

export const ReactPdfPredictionPages = ({
  lang,
  predictions,
}: {
  lang: string;
  predictions: any;
}) => {
  const hasPredictions = Object.keys(predictions).some(
    (cat) => predictions[cat]?.status === "success" && predictions[cat]?.data,
  );

  if (!hasPredictions) return <></>;

  const validCategories = Object.keys(predictions).filter(
    (cat) => predictions[cat]?.status === "success" && predictions[cat]?.data,
  );

  return (
    <>
      {validCategories.map((cat) => {
        const pred = predictions[cat];

        return (
          <CategoryPage
            key={cat}
            category={cat}
            data={pred.data}
            structured={pred.structured}
            isHindi={lang === "hi"}
          />
        );
      })}
    </>
  );
};

export default function ReactPdfPredictionsView() {
  const { birthDetails, jyotishamData } = useStore();
  const lang = birthDetails.language || "en";
  const predictions = jyotishamData.predictions;

  const hasPredictions = Object.keys(predictions).some(
    (cat) => predictions[cat]?.status === "success" && predictions[cat]?.data,
  );

  const pdfDocument = useMemo(() => {
    if (!hasPredictions) return <Document />;

    const predictionCategories = Object.keys(predictions);

    return (
      <Document title="Predictions Report" author="Urekha">
        {predictionCategories.map((cat) => {
          const pred = predictions[cat];
          if (pred?.status !== "success" || !pred.data) return null;

          return (
            <CategoryPage
              key={cat}
              category={cat}
              data={pred.data}
              structured={pred.structured}
              isHindi={lang === "hi"}
            />
          );
        }).filter(Boolean)}
      </Document>
    );
  }, [predictions, lang, hasPredictions]);

  if (!hasPredictions) return null;

  return (
    <div className="w-full print:hidden flex flex-col items-center">
      <PDFViewer
        style={{ width: "100%", height: "900px", maxWidth: "210mm" }}
        className="border-4 border-[#1c1c1c] rounded-xl shadow-2xl"
      >
        {pdfDocument}
      </PDFViewer>
    </div>
  );
}
