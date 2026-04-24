import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { Language } from "@/types/languages";

// ─────────────────────────────────────────────────────
// Category slug → display title & subtitle
// ─────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { title: string; subtitle: string; symbol: string }> = {
  "personal-insight":  { title: "Personal Insight",              subtitle: "Nature • Character • Personality",         symbol: "☉" },
  "health":            { title: "Health & Vitality",             subtitle: "Constitution • Wellness • Strength",        symbol: "♂" },
  "career":            { title: "Career & Profession",           subtitle: "Vocation • Growth • Success",               symbol: "♄" },
  "education":         { title: "Education & Learning",          subtitle: "Intellect • Study • Achievement",           symbol: "☿" },
  "enemies":           { title: "Challenges & Rivals",           subtitle: "Obstacles • Competition • Triumph",         symbol: "♂" },
  "finance":           { title: "Wealth & Prosperity",           subtitle: "Abundance • Investments • Karma",           symbol: "♀" },
  "love-relation":     { title: "Love & Relationships",          subtitle: "Romance • Desire • Connection",             symbol: "♀" },
  "family-relation":   { title: "Family & Domestic Life",        subtitle: "Bonds • Home • Harmony",                   symbol: "☽" },
  "spirituality":      { title: "Spirituality & Inner Growth",   subtitle: "Dharma • Liberation • Peace",               symbol: "♃" },
  "marriage":          { title: "Marriage & Partnership",        subtitle: "Union • Harmony • Destiny",                symbol: "♀" },
  "children":          { title: "Children & Progeny",            subtitle: "Legacy • Nurturing • Blessings",            symbol: "♃" },
  "travel":            { title: "Travel & Foreign Lands",        subtitle: "Journeys • Relocation • Horizons",          symbol: "☊" },
  "lifelong-overview": { title: "Lifelong Overview",             subtitle: "Destiny • Purpose • Soul Map",              symbol: "☸" },
  "5-year-forecast":   { title: "5-Year Forecast",               subtitle: "Phases • Timing • Opportunity",             symbol: "♄" },
  "10-year-forecast":  { title: "10-Year Forecast",              subtitle: "Decades • Vision • Cycles",                 symbol: "♄" },
  "15-year-forecast":  { title: "15-Year Forecast",              subtitle: "Eras • Transformation • Legacy",            symbol: "♄" },
};

function getCategoryMeta(cat: string) {
  // Strip tier suffixes like -1200, -1500, -2000 so UI matches properly
  const normalizedCat = cat.replace(/-\d{4}$/, "");
  
  return (
    CATEGORY_META[normalizedCat] ?? {
      title: normalizedCat.replace(/^predict-/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      subtitle: "Vedic Astrology Insight",
      symbol: "✦",
    }
  );
}

// ─────────────────────────────────────────────────────
// Corner ornament (same as PdfPageLayout)
// ─────────────────────────────────────────────────────
const CornerOrnament = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute z-10 flex items-center justify-center"
    style={{
      ...style,
      width: "14mm",
      height: "14mm",
      backgroundColor: UREKHA_COLORS.paper,
    }}
  >
    <span style={{ color: UREKHA_COLORS.goldPrimary, fontSize: "20pt", lineHeight: 0, opacity: 0.8 }}>
      ❃
    </span>
  </div>
);

// ─────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────
interface PredictionPageLayoutProps {
  lang: Language;
  category: string;          // e.g. "predict-health"
  children: React.ReactNode;
  isContinuation?: boolean;  // true for page 2, 3...
  pageNumber?: number;       // e.g. 2, 3
}

const PredictionPageLayout: React.FC<PredictionPageLayoutProps> = ({
  lang,
  category,
  children,
  isContinuation = false,
  pageNumber,
}) => {
  const isHindi = lang === "hi";
  const meta = getCategoryMeta(category);

  return (
    <div
      className="flex items-center justify-center font-serif print:bg-white"
      style={{ minHeight: "100vh", backgroundColor: UREKHA_COLORS.paper }}
    >
      {/* ═══════════════════ STRICT A4 FRAME ═══════════════════ */}
      <div
        className="relative text-[#2D2A26]"
        style={{
          width: "210mm",
          height: "297mm",
          backgroundColor: UREKHA_COLORS.paper,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Faint mandala bg ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            opacity: 0.03,
            backgroundImage: `url('/images/mandala-bg.png')`,
            backgroundSize: "500px",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
          }}
        />

        {/* ── Outer gold border ── */}
        <div
          className="absolute pointer-events-none"
          style={{ inset: "8mm", border: `1px solid ${UREKHA_COLORS.goldPrimary}`, opacity: 0.55, zIndex: 0 }}
        />
        {/* ── Inner gold border ── */}
        <div
          className="absolute pointer-events-none"
          style={{ inset: "9.5mm", border: `0.5px solid ${UREKHA_COLORS.goldPrimary}`, opacity: 0.28, zIndex: 0 }}
        />

        {/* ── Corner flowers ── */}
        <CornerOrnament style={{ top: "7mm", left: "7mm",  transform: "rotate(0deg)"   }} />
        <CornerOrnament style={{ top: "7mm", right: "7mm", transform: "rotate(90deg)"  }} />
        <CornerOrnament style={{ bottom: "7mm", left: "7mm",  transform: "rotate(270deg)" }} />
        <CornerOrnament style={{ bottom: "7mm", right: "7mm", transform: "rotate(180deg)" }} />

        {/* ═══════════════════ CHAPTER HEADER BLOCK ═══════════════════ */}
        {isContinuation ? (
          /* ── Compact header for continuation pages ── */
          <div
            className="z-10 flex flex-col items-center justify-center text-center"
            style={{
              paddingTop: "14mm",
              paddingLeft: "16mm",
              paddingRight: "16mm",
              paddingBottom: "4mm",
            }}
          >
            <div style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: "7.5pt", letterSpacing: "0.28em", textTransform: "uppercase", color: UREKHA_COLORS.goldPrimary, fontWeight: 700, marginBottom: "2mm" }}>
              {isHindi ? "वैदिक ज्योतिष अंतर्दृष्टि" : "✦ Vedic Astrology Insight ✦"}
            </div>
            <h1 style={{ fontFamily: "var(--font-lora), serif", fontSize: "15pt", fontWeight: 700, color: "#1C1917", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.2, margin: "0 0 1.5mm" }}>
              {meta.title}
            </h1>
            <div style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: "7.5pt", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9F1239", fontWeight: 600, marginBottom: "3.5mm" }}>
              {pageNumber ? `— Continued (Page ${pageNumber}) —` : "— Continued —"}
            </div>
            <div style={{ width: "55mm", height: "1px", background: `linear-gradient(to right, transparent, #9F1239 30%, #9F1239 70%, transparent)`, opacity: 0.5 }} />
          </div>
        ) : (
          /* ── Full chapter header for first page ── */
          <div
            className="z-10 flex flex-col items-center justify-center text-center"
            style={{ paddingTop: "14mm", paddingLeft: "16mm", paddingRight: "16mm", paddingBottom: "5mm" }}
          >
            {/* Category label */}
            <div style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: "7.5pt", letterSpacing: "0.28em", textTransform: "uppercase", color: UREKHA_COLORS.goldPrimary, fontWeight: 700, marginBottom: "3mm" }}>
              {isHindi ? "वैदिक ज्योतिष अंतर्दृष्टि" : "✦ Vedic Astrology Insight ✦"}
            </div>
            {/* Planet Symbol */}
            <div style={{ fontSize: "22pt", color: "#9F1239", lineHeight: 1, marginBottom: "2.5mm", opacity: 0.8 }}>
              {meta.symbol}
            </div>
            {/* Chapter Title */}
            <h1 style={{ fontFamily: "var(--font-lora), serif", fontSize: "21pt", fontWeight: 700, color: "#1C1917", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.15, margin: "0 0 2mm" }}>
              {meta.title}
            </h1>
            {/* Subtitle */}
            <div style={{ fontFamily: "var(--font-lato), sans-serif", fontSize: "8.5pt", letterSpacing: "0.18em", textTransform: "uppercase", color: "#78716C", fontWeight: 400, marginBottom: "4mm" }}>
              {meta.subtitle}
            </div>
            {/* Crimson rule */}
            <div style={{ width: "55mm", height: "1.5px", background: `linear-gradient(to right, transparent, #9F1239 30%, #9F1239 70%, transparent)`, opacity: 0.6, marginBottom: "1.5mm" }} />
            {/* Thin gold rule */}
            <div style={{ width: "40mm", height: "0.75px", background: `linear-gradient(to right, transparent, ${UREKHA_COLORS.goldPrimary} 30%, ${UREKHA_COLORS.goldPrimary} 70%, transparent)`, opacity: 0.4 }} />
          </div>
        )}

        {/* ═══════════════════ BODY CONTENT ═══════════════════ */}
        {/*
          Content area budget:
          297mm total
          − 14mm top padding (header top)
          − ~55mm for header block
          − 12mm bottom padding
          − ~12mm footer
          ≈ ~204mm usable for body → fits ~350 words at 11pt / 1.85 line-height
        */}
        <div
          className="z-10 flex-1 overflow-hidden"
          style={{
            paddingLeft: "16mm",
            paddingRight: "16mm",
            paddingTop: "4mm",
            paddingBottom: "2mm",
          }}
        >
          {/* Inner scroll-block — clips at boundary, wraps in prose */}
          <div
            style={{
              fontSize: "10.5pt",
              lineHeight: "1.9",
              wordSpacing: "0.04em",
              letterSpacing: "0.01em",
              color: "#292524",
              fontFamily: "var(--font-lato), var(--font-hindi-sans), sans-serif",
              textAlign: "justify",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {children}
          </div>
        </div>

        {/* ═══════════════════ FOOTER (always at bottom) ═══════════════════ */}
        <div
          className="z-10"
          style={{
            paddingLeft: "22mm",
            paddingRight: "22mm",
            paddingBottom: "18mm",
            paddingTop: "3mm",
          }}
        >
          <div
            style={{
              borderTop: `1px solid ${UREKHA_COLORS.goldSoft}`,
              paddingTop: "3mm",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-lato), sans-serif",
                fontSize: "8pt",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: UREKHA_COLORS.inkMuted,
              }}
            >
              {isHindi ? "युरेखा • वैदिक इंटेलिजेंस" : "UREKHA • Vedic Intelligence"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-lora), serif",
                fontSize: "8pt",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: UREKHA_COLORS.inkMuted,
                fontWeight: 600,
              }}
            >
              www.urekha.com
            </span>
          </div>
        </div>
      </div>

      {/* ── Print rules ── */}
      <style jsx global>{`
        @page { size: A4; margin: 0; }
        @media print {
          body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          * { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PredictionPageLayout;