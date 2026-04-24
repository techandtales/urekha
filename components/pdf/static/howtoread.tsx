"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { Language } from "@/types/languages";
import { useStore } from "@/lib/store";

// --- 2. TRANSLATION DATA ---
export const readingGuideText = {
  en: {
    subtitle: "Guidance",
    title: "How to Read This Kundli",
    p1: (
      <>
        A <strong>Kundli</strong> (birth chart) is a symbolic representation of
        the sky at the exact moment of birth. It reflects how planetary forces
        interact with individual consciousness over time. This report has been
        prepared using classical principles of <em>Jyotiṣa</em>, presented in a
        structured and readable form.
      </>
    ),
    p2: (
      <>
        Interpretations in this document are based on the relationship between{" "}
        <strong>Grahas</strong> (planets), <strong>Bhāvas</strong> (houses),{" "}
        <strong>Rāśis</strong> (signs), and time cycles such as{" "}
        <strong>Daśā</strong>. Results should be understood as tendencies and
        potentials, not as fixed outcomes.
      </>
    ),
    p3: (
      <>
        When reading this Kundli, move sequentially through the sections. Begin
        with birth details to understand the data foundation, then observe chart
        structures, followed by interpretative sections. Daśās and transits
        indicate <em>timing</em>, while remedies offer alignment rather than
        control.
      </>
    ),
    principlesTitle: "Reading Principles",
    principlesList: [
      "• Astrology reveals patterns, not guarantees.",
      "• Free will operates within karmic structure.",
      "• Timing modifies outcomes, awareness refines response.",
      "• Remedies support balance, not escape from karma.",
    ],
    brandName: "UREKHA • Vedic Intelligence",
    footerTitle: "Reading Guide",
  },
  hi: {
    subtitle: "मार्गदर्शन",
    title: "इस कुंडली को कैसे पढ़ें",
    p1: (
      <>
        <strong>कुंडली</strong> (जन्म पत्रिका) जन्म के ठीक समय आकाश का एक
        प्रतीकात्मक प्रतिनिधित्व है। यह दर्शाता है कि समय के साथ ग्रहीय शक्तियां
        व्यक्तिगत चेतना के साथ कैसे अंतःक्रिया करती हैं। यह रिपोर्ट
        <em> ज्योतिष</em> के शास्त्रीय सिद्धांतों का उपयोग करके तैयार की गई है
        और इसे एक सुव्यवस्थित और पठनीय रूप में प्रस्तुत किया गया है।
      </>
    ),
    p2: (
      <>
        इस दस्तावेज़ में व्याख्याएं <strong>ग्रहों</strong>,{" "}
        <strong>भावों</strong>, <strong>राशियों</strong> और <strong>दशा</strong>{" "}
        जैसे समय चक्रों के बीच के संबंधों पर आधारित हैं। परिणामों को
        प्रवृत्तियों और संभावनाओं के रूप में समझा जाना चाहिए, न कि निश्चित
        परिणामों के रूप में।
      </>
    ),
    p3: (
      <>
        इस कुंडली को पढ़ते समय, अनुभागों के माध्यम से क्रमवार आगे बढ़ें। डेटा
        आधार को समझने के लिए जन्म विवरण से शुरू करें, फिर चार्ट संरचनाओं का
        अवलोकन करें, जिसके बाद व्याख्यात्मक खंड आते हैं। दशा और गोचर{" "}
        <em>समय</em> का संकेत देते हैं, जबकि उपाय नियंत्रण के बजाय संतुलन प्रदान
        करते हैं।
      </>
    ),
    principlesTitle: "पठन सिद्धांत",
    principlesList: [
      "• ज्योतिष पैटर्न को प्रकट करता है, गारंटी नहीं।",
      "• स्वतंत्र इच्छा (Free Will) कर्म संरचना के भीतर कार्य करती है।",
      "• समय परिणामों को संशोधित करता है, जागरूकता प्रतिक्रिया को परिष्कृत करती है।",
      "• उपाय संतुलन का समर्थन करते हैं, कर्म से पलायन का नहीं।",
    ],
    brandName: "युरेखा • वैदिक इंटेलिजेंस",
    footerTitle: "पठन गाइड",
  },
};

const UrekhaHowToReadKundliPage = ({ lang }: { lang: Language }) => {
  const { birthDetails } = useStore();
  const t = readingGuideText[lang];
  const isHindi = lang === "hi";

  // --- A4 SCALED STYLES ---
  const headerSpacing = isHindi ? "0.1em" : "0.35em";
  const titleSpacing = isHindi ? "0" : "0.02em";

  const fontSizeTitle = "28pt";
  const fontSizeSubtitle = "10pt";
  const fontSizeBody = "12pt";
  const fontSizeFooter = "9pt";

  return (
    <div
      className="flex items-center justify-center font-serif print:bg-white"
      style={{ minHeight: "100vh", backgroundColor: UREKHA_COLORS.paper }}
    >
      {/* ================= MAIN A4 FRAME ================= */}
      <div
        className="relative flex flex-col justify-between text-[#2D2A26]"
        style={{
          width: "210mm",
          height: "297mm",
          padding: "20mm",
          backgroundColor: UREKHA_COLORS.paper,
          // Soft shadow, no heavy border
          // boxShadow: "none",
          boxSizing: "border-box",
        }}
      >
        {/* ================= ELEGANT THIN FRAME ================= */}
        {/* Outer Thin Line */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "10mm",
            border: `1px solid ${UREKHA_COLORS.goldPrimary}`,
            opacity: 0.5,
            zIndex: 0,
          }}
        />
        {/* Inner Faint Line (Double Border Effect) */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "11.5mm",
            border: `0.5px solid ${UREKHA_COLORS.goldPrimary}`,
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        {/* ================= HEADER ================= */}
        <div className="text-center z-10 space-y-4 mt-6">
          <p
            style={{
              fontSize: fontSizeSubtitle,
              letterSpacing: headerSpacing,
              textTransform: "uppercase",
              color: "#000",
              fontFamily: "var(--font-sans), sans-serif", // Subtitles nice in Sans
              fontWeight: 600,
            }}
          >
            {t.subtitle}
          </p>

          <h1
            style={{
              fontSize: fontSizeTitle,
              letterSpacing: titleSpacing,
              fontWeight: 800,
              color: UREKHA_COLORS.inkPrimary,
              lineHeight: "1.2",
              textTransform: isHindi ? "none" : "capitalize",
            }}
          >
            {t.title}
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

        {/* ================= MAIN CONTENT ================= */}
        <div
          className="z-10"
          style={{
            marginTop: "8mm",
            marginBottom: "8mm",
            paddingLeft: "8mm",
            paddingRight: "8mm",
          }}
        >
          <p
            style={{
              fontSize: fontSizeBody,
              lineHeight: "1.8",
              textAlign: "justify",
            }}
          >
            {t.p1}
          </p>

          <p
            style={{
              fontSize: fontSizeBody,
              lineHeight: "1.8",
              marginTop: "8mm",
              textAlign: "justify",
            }}
          >
            {t.p2}
          </p>

          <p
            style={{
              fontSize: fontSizeBody,
              lineHeight: "1.8",
              marginTop: "8mm",
              textAlign: "justify",
            }}
          >
            {t.p3}
          </p>
        </div>

        {/* ================= KEY PRINCIPLES BOX ================= */}
        <div
          className="z-10"
          style={{
            padding: "8mm 16mm",
            backgroundColor: "rgba(212,175,55,0.06)", // Very faint gold background
            borderTop: `1px solid ${UREKHA_COLORS.goldSoft}`,
            borderBottom: `1px solid ${UREKHA_COLORS.goldSoft}`,
            margin: "0 5mm", // Indented to align with inner frame
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
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            {t.principlesTitle}
          </p>

          <ul
            style={{
              fontSize: fontSizeBody,
              lineHeight: "1.6",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {t.principlesList.map((item, index) => (
              <li key={index} style={{ marginBottom: "2px" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ================= FOOTER ================= */}
        <div
          className="flex justify-between items-center z-10 mt-6 pt-4 mb-2"
          style={{
            borderTop: `1px solid ${UREKHA_COLORS.goldSoft}`,
            margin: "0 10mm", // Align with frame
          }}
        >
          <div
            style={{
              fontSize: fontSizeFooter,
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
              fontSize: fontSizeFooter,
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

          * {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UrekhaHowToReadKundliPage;
