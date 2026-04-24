"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { Language } from "@/types/languages";
import { useStore } from "@/lib/store";

// --- 1. LANGUAGE CONFIGURATION ---
// (Using props)

// --- 2. TRANSLATION DATA ---
export const indexPageText = {
  en: {
    headerSubtitle: "Contents",
    headerTitle: "Anukramanika",
    items: [
      { title: "Introduction", subtitle: "Purpose of This Report", page: "01" },
      { title: "Birth Details", subtitle: "Janma Vivarana", page: "02" },
      { title: "Planetary Positions", subtitle: "Graha Sthiti", page: "03" },
      { title: "Planetary Friendship", subtitle: "Graha Maitri", page: "04" },
      { title: "KP Planets", subtitle: "KP Graha Sthiti", page: "05" },
      { title: "KP Houses", subtitle: "KP Bhava Sthiti", page: "06" },
      { title: "KP Significators", subtitle: "KP Karyesh", page: "07" },
      { title: "Divisional Charts", subtitle: "Varga Kundli", page: "08" },
      { title: "Ashtakavarga", subtitle: "Bhinnashtakavarga", page: "09" },
      { title: "Sarvashtakavarga", subtitle: "Sarvashtakavarga", page: "10" },
      { title: "Vimshottari Dasha", subtitle: "Vimshottari Dasha", page: "11" },
      { title: "Yogini Dasha", subtitle: "Yogini Dasha", page: "12" },
      { title: "Dosha Report", subtitle: "Dosha Vichar", page: "13" },
      { title: "Life Predictions", subtitle: "Sampurna Phala", page: "14" },
    ],
    brandName: "UREKHA • Vedic Intelligence",
    footerTitle: "Contents",
  },
  hi: {
    headerSubtitle: "विषय सूची",
    headerTitle: "अनुक्रमणिका",
    items: [
      { title: "परिचय", subtitle: "इस रिपोर्ट का उद्देश्य", page: "01" },
      { title: "जन्म विवरण", subtitle: "जातक की जानकारी", page: "02" },
      { title: "ग्रह स्थिति", subtitle: "ग्रहों का विस्तृत विवरण", page: "03" },
      { title: "ग्रह मैत्री", subtitle: "ग्रहों की मित्रता", page: "04" },
      { title: "के.पी. ग्रह", subtitle: "के.पी. पद्धति में ग्रहों की स्थिति", page: "05" },
      { title: "के.पी. भाव", subtitle: "के.पी. पद्धति में भावों की स्थिति", page: "06" },
      { title: "के.पी. कार्येश", subtitle: "के.पी. पद्धति में कार्येश", page: "07" },
      { title: "वर्ग कुंडलियां", subtitle: "सभी महत्वपूर्ण वर्ग कुंडलियां", page: "08" },
      { title: "अष्टकवर्ग", subtitle: "अष्टकवर्ग चक्र", page: "09" },
      { title: "सर्वाष्टकवर्ग", subtitle: "सर्वाष्टकवर्ग चक्र", page: "10" },
      { title: "विंशोत्तरी दशा", subtitle: "दशा और अंतर्दशा", page: "11" },
      { title: "योगिनी दशा", subtitle: "योगिनी दशा का विवरण", page: "12" },
      { title: "दोष विचार", subtitle: "कुंडली में स्थित दोष", page: "13" },
      { title: "फलादेश", subtitle: "संपूर्ण जीवन फलादेश", page: "14" },
    ],
    brandName: "युरेखा • वैदिक इंटेलिजेंस",
    footerTitle: "विषय सूची",
  },
};

const UrekhaIndexPage = ({ lang }: { lang: Language }) => {
  const { birthDetails } = useStore();
  const t = indexPageText[lang];
  const isHindi = lang === "hi";

  // --- A4 SCALED STYLES ---
  const fontSizeHeaderSubtitle = "10pt";
  const fontSizeTitle = "28pt";
  const fontSizeListTitle = "14pt";
  const fontSizeListSubtitle = "10pt";
  const fontSizePageNum = "12pt";
  const fontSizeFooter = "9pt";

  // Spacing Logic
  const spacingSubtitle = isHindi ? "0.1em" : "0.35em";
  const spacingTitle = isHindi ? "0" : "0.22em";
  const spacingListSubtitle = isHindi ? "0.05em" : "0.15em";

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
            className="pdf-caption font-bold text-black"
            style={{
              letterSpacing: spacingSubtitle,
              textTransform: "uppercase",
              fontSize: fontSizeHeaderSubtitle, // Keep specific size logic
            }}
          >
            {t.headerSubtitle}
          </p>

          <h1
            className="pdf-title"
            style={{
              fontSize: fontSizeTitle,
              letterSpacing: spacingTitle,
              color: UREKHA_COLORS.inkPrimary,
            }}
          >
            {t.headerTitle}
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

        {/* ================= CONTENT LIST ================= */}
        <div
          className="z-10"
          style={{
            marginTop: "8mm",
            marginBottom: "8mm",
            paddingLeft: "8mm",
            paddingRight: "8mm",
          }}
        >
          {t.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "8mm",
              }}
            >
              {/* Title & Subtitle */}
              <div style={{ flexGrow: 1 }}>
                <p
                  className="pdf-header normal-case text-zinc-900" // Override uppercase for title
                  style={{
                    fontSize: fontSizeListTitle,
                    marginBottom: "2px",
                  }}
                >
                  {item.title}
                </p>
                <p
                  className="pdf-caption"
                  style={{
                    fontSize: fontSizeListSubtitle,
                    letterSpacing: spacingListSubtitle,
                    color: UREKHA_COLORS.inkMuted,
                  }}
                >
                  {item.subtitle}
                </p>
              </div>

              {/* Dotted leader */}
              <div
                style={{
                  flexGrow: 1,
                  borderBottom: `2px dotted ${UREKHA_COLORS.goldSoft}`,
                  margin: "0 5mm",
                  transform: "translateY(-4px)",
                  opacity: 0.6,
                }}
              />

              {/* Page number */}
              <div
                style={{
                  fontSize: fontSizePageNum,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: UREKHA_COLORS.inkPrimary,
                }}
              >
                {item.page}
              </div>
            </div>
          ))}
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

export default UrekhaIndexPage;
