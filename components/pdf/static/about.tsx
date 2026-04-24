"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { Language } from "@/types/languages";
import { useStore } from "@/lib/store";

// --- 2. TRANSLATION DATA ---
export const introText = {
  en: {
    sectionTitle: "Introduction",
    mainTitle: "UREKHA",
    p1: (
      <>
        <strong>UREKHA</strong> is a Vedic Intelligence system designed to
        interpret the subtle patterns of life through the timeless science of{" "}
        <em>Jyotiṣa</em>. Rooted in classical astrology and refined through
        modern analytical systems, UREKHA does not merely predict events — it
        reveals the <strong>structure of karma</strong> operating within time.
      </>
    ),
    p2: "Every birth chart is a sacred map — a convergence of planetary forces, cosmic rhythms, and individual consciousness. This document has been generated to help you understand your life’s tendencies, cycles, and opportunities with clarity, respect, and balance.",
    p3: (
      <>
        UREKHA combines <strong>traditional astrological principles</strong>{" "}
        with structured intelligence to present insights that are meaningful,
        practical, and aligned with dharma. Interpretations are offered as
        guidance — empowering awareness rather than enforcing fate.
      </>
    ),
    philosophyTitle: "Core Philosophy",
    philosophyQuote: (
      <>
        “Jyotiṣa is the light that reveals time. <br />
        Karma is the pattern within it. <br />
        Awareness is the freedom.”
      </>
    ),
    brandName: "UREKHA • Vedic Intelligence",
    footerTitle: "Introduction",
  },
  hi: {
    sectionTitle: "परिचय",
    mainTitle: "युरेखा (UREKHA)",
    p1: (
      <>
        <strong>युरेखा</strong> (UREKHA) एक वैदिक इंटेलिजेंस प्रणाली है जिसे{" "}
        <strong>ज्योतिष</strong> के कालातीत विज्ञान के माध्यम से जीवन के सूक्ष्म
        पैटर्न की व्याख्या करने के लिए डिज़ाइन किया गया है। शास्त्रीय ज्योतिष
        में निहित और आधुनिक विश्लेषणात्मक प्रणालियों के माध्यम से परिष्कृत,
        युरेखा केवल घटनाओं की भविष्यवाणी नहीं करता — यह समय के भीतर संचालित{" "}
        <strong>कर्म की संरचना</strong> को प्रकट करता है।
      </>
    ),
    p2: "प्रत्येक जन्म कुंडली एक पवित्र मानचित्र है — ग्रहीय शक्तियों, ब्रह्मांडीय लय और व्यक्तिगत चेतना का संगम। यह दस्तावेज आपको जीवन की प्रवृत्तियों, चक्रों और अवसरों को स्पष्टता, सम्मान और संतुलन के साथ समझने में मदद करने के लिए तैयार किया गया है।",
    p3: (
      <>
        युरेखा <strong>पारंपरिक ज्योतिष सिद्धांतों</strong> को संरचित
        बुद्धिमत्ता (Structured Intelligence) के साथ जोड़ता है ताकि ऐसी
        अंतर्दृष्टि प्रस्तुत की जा सके जो सार्थक, व्यावहारिक और धर्म के अनुरूप
        हो। व्याख्याएं मार्गदर्शन के रूप में दी जाती हैं — जो भाग्य को थोपने के
        बजाय जागरूकता को सशक्त बनाती हैं।
      </>
    ),
    philosophyTitle: "मूल दर्शन",
    philosophyQuote: (
      <>
        “ज्योतिष वह प्रकाश है जो समय को प्रकट करता है। <br />
        कर्म उसके भीतर का पैटर्न है। <br />
        जागरूकता ही स्वतंत्रता है।”
      </>
    ),
    brandName: "युरेखा • वैदिक इंटेलिजेंस",
    footerTitle: "परिचय",
  },
};

const UrekhaIntroPage = ({ lang }: { lang: Language }) => {
  const { birthDetails } = useStore();
  const t = introText[lang];
  const isHindi = lang === "hi";

  // A4 Scaled Font Sizes
  const fontSizeBody = "12pt";
  const fontSizeTitle = "28pt";

  return (
    <div
      className="flex items-center justify-center font-serif print:bg-white"
      style={{ minHeight: "100vh", backgroundColor: UREKHA_COLORS.paper }}
    >
      {/* ================= MAIN A4 FRAME ================= */}
      <div
        className="relative flex flex-col justify-between"
        style={{
          width: "210mm",
          height: "297mm",
          padding: "20mm",
          backgroundColor: UREKHA_COLORS.paper,
          // Subtle drop shadow instead of hard border
          // boxShadow: "none",
          color: UREKHA_COLORS.inkBody,
          boxSizing: "border-box",
        }}
      >
        {/* ================= ELEGANT THIN FRAME ================= */}
        {/* Replaces the thick border. Sits comfortably inside padding. */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "10mm",
            border: `1px solid ${UREKHA_COLORS.goldPrimary}`,
            opacity: 0.5, // Subtle visibility
            zIndex: 0,
          }}
        />
        {/* Inner faint line for double-border effect */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "11.5mm",
            border: `0.5px solid ${UREKHA_COLORS.goldPrimary}`,
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        {/* ================= TOP: SECTION TITLE ================= */}
        <div className="text-center space-y-4 z-10 mt-6">
          <p
            style={{
              fontSize: "10pt",
              letterSpacing: isHindi ? "0" : "0.35em",
              textTransform: "uppercase",
              color: "#9A7B2F",
              fontFamily: "var(--font-sans), sans-serif",
              fontWeight: 600,
            }}
          >
            {t.sectionTitle}
          </p>

          <h1
            style={{
              fontSize: fontSizeTitle,
              letterSpacing: isHindi ? "0" : "0.25em",
              fontWeight: 800,
              color: UREKHA_COLORS.inkPrimary,
              lineHeight: "1.2",
            }}
          >
            {t.mainTitle}
          </h1>

          <div
            style={{
              width: "40mm",
              height: "2px",
              background: `linear-gradient(to right, transparent, ${UREKHA_COLORS.goldPrimary}, transparent)`,
              margin: "0 auto",
              opacity: 0.8,
            }}
          />
        </div>

        {/* ================= CENTER: INTRO CONTENT ================= */}
        <div
          className="z-10"
          style={{
            padding: "0 10mm",
            marginTop: "8mm",
            marginBottom: "8mm",
          }}
        >
          <p
            style={{
              fontSize: fontSizeBody,
              lineHeight: "1.8",
              textAlign: "justify",
              marginBottom: "8mm",
              fontFamily: "var(--font-lora), var(--font-hindi-serif), serif",
            }}
          >
            {t.p1}
          </p>

          <p
            style={{
              fontSize: fontSizeBody,
              lineHeight: "1.8",
              textAlign: "justify",
              marginBottom: "8mm",
            }}
          >
            {t.p2}
          </p>

          <p
            style={{
              fontSize: fontSizeBody,
              lineHeight: "1.8",
              textAlign: "justify",
            }}
          >
            {t.p3}
          </p>
        </div>

        {/* ================= PHILOSOPHY BLOCK ================= */}
        <div
          className="text-center z-10"
          style={{
            padding: "8mm 16mm",
            backgroundColor: "rgba(212,175,55,0.06)", // Very faint gold background
            borderTop: `1px solid ${UREKHA_COLORS.goldSoft}`,
            borderBottom: `1px solid ${UREKHA_COLORS.goldSoft}`,
            margin: "0 5mm", // Indent from sides
          }}
        >
          <p
            style={{
              fontSize: "10pt",
              letterSpacing: isHindi ? "0.05em" : "0.25em",
              textTransform: "uppercase",
              color: "#6B4F1D",
              marginBottom: "4mm",
              fontFamily: "var(--font-sans), sans-serif",
              fontWeight: 700,
            }}
          >
            {t.philosophyTitle}
          </p>

          <p
            style={{
              fontSize: "12pt",
              lineHeight: "1.6",
              fontStyle: "italic",
              fontFamily: "var(--font-serif), serif",
              color: UREKHA_COLORS.inkPrimary, // Using primary color for quote
            }}
          >
            {t.philosophyQuote}
          </p>
        </div>

        {/* ================= FOOTER ================= */}
        <div
          className="flex justify-between items-center z-10 mt-6 pt-4 mb-2"
          style={{
            borderTop: `1px solid ${UREKHA_COLORS.goldSoft}`,
            margin: "0 10mm", // Align with inner frame
          }}
        >
          <div
            style={{
              fontSize: "9pt",
              letterSpacing: isHindi ? "0.1em" : "0.3em",
              textTransform: "uppercase",
              color: UREKHA_COLORS.inkMuted,
              fontFamily: "var(--font-serif), serif",
              fontWeight: 600,
            }}
          >
            {t.brandName}
          </div>

          <div
            style={{
              fontSize: "9pt",
              letterSpacing: isHindi ? "0.1em" : "0.3em",
              color: UREKHA_COLORS.inkMuted,
              fontFamily: "var(--font-serif), serif",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {t.footerTitle}
          </div>
        </div>
      </div>

      {/* ================= PRINT RULES ================= */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default UrekhaIntroPage;
