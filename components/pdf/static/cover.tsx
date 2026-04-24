"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { Language } from "@/types/languages";
import { useStore } from "@/lib/store";

// --- 2. TRANSLATION DATA ---
export const coverPageText = {
  en: {
    invocation: "॥ Śrī Gaṇēśāya Namaḥ ॥",
    brandTitle: "UREKHA",
    brandSubtitle: "ASTROLOGICAL INSIGHTS",
    website: "www.urekha.com",
  },
  hi: {
    invocation: "॥ श्री गणेशाय नमः ॥",
    brandTitle: "युरेखा",
    brandSubtitle: "ज्योतिषीय अंतर्दृष्टि",
    website: "www.urekha.com",
  },
};

const UrekhaCoverPage = ({ lang }: { lang: Language }) => {
  const t = coverPageText[lang];
  const { birthDetails } = useStore();
  const isHindi = lang === "hi";

  return (
    <div
      className="flex items-center justify-center font-serif print:bg-white"
      style={{
        minHeight: "100vh",
        backgroundColor: UREKHA_COLORS.paper,
      }}
    >
      {/* ================= MAIN A4 CANVAS ================= */}
      <div
        className="relative flex flex-col items-center justify-between overflow-hidden"
        style={{
          width: "210mm",
          height: "297mm",
          padding: "20mm",
          backgroundColor: UREKHA_COLORS.paper,
          color: UREKHA_COLORS.inkPrimary,
          boxSizing: "border-box",
        }}
      >
        {/* ================= BACKGROUND PATTERN ================= */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            opacity: 0.06,
            backgroundImage: `url('/images/mandala-bg.png')`,
            backgroundSize: "500px",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            background:
              "radial-gradient(circle at center, transparent 0%, rgba(212, 175, 55, 0.1) 100%)",
          }}
        />

        {/* ================= ELEGANT DOUBLE FRAME ================= */}
        {/* Outer Thin Line */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "10mm",
            border: `1px solid ${UREKHA_COLORS.goldPrimary}`,
            opacity: 0.6,
            zIndex: 2,
          }}
        />
        {/* Inner Slightly Thicker Line */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "12mm",
            border: `2px solid ${UREKHA_COLORS.goldPrimary}`,
            zIndex: 2,
          }}
        />

        {/* ================= CORNER FLOWERS ================= */}
        {/* These sit exactly on the corners of the inner frame */}
        {[
          { top: "9mm", left: "9mm", rotate: "0deg" },
          { top: "9mm", right: "9mm", rotate: "90deg" },
          { bottom: "9mm", left: "9mm", rotate: "270deg" },
          { bottom: "9mm", right: "9mm", rotate: "180deg" },
        ].map((style, i) => (
          <div
            key={i}
            className="absolute z-10 flex items-center justify-center"
            style={{
              ...style,
              width: "14mm", // Size of the corner flower
              height: "14mm",
              transform: `rotate(${style.rotate})`,
              backgroundColor: UREKHA_COLORS.paper, // Hide lines behind the flower
            }}
          >
            {/* Fallback Character */}
            <span
              style={{
                color: UREKHA_COLORS.goldPrimary,
                fontSize: "24pt",
                lineHeight: 0,
                opacity: 1,
              }}
            >
              ❃
            </span>
          </div>
        ))}

        {/* ================= TOP: INVOCATION ================= */}
        <div className="text-center w-full z-10 mt-12">
          <p
            style={{
              fontSize: "16pt",
              letterSpacing: "0.08em",
              lineHeight: "1.6",
              color: UREKHA_COLORS.highlightText,
              fontWeight: 600,
              fontFamily: "var(--font-lora), var(--font-hindi-serif), serif",
            }}
          >
            {t.invocation}
          </p>

          <div
            style={{
              width: "10mm",
              height: "10mm",
              margin: "16px auto 0",
              opacity: 0.8,
              backgroundImage: `url('/images/om-symbol.png')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundColor: "transparent",
              borderRadius: "50%",
            }}
          >
            <span
              style={{ color: UREKHA_COLORS.goldPrimary, fontSize: "20pt" }}
            >
              ❈
            </span>
          </div>
        </div>

        {/* ================= CENTER: GANESHA ================= */}
        <div className="grow flex items-center justify-center relative w-full z-10">
          <div className="relative" style={{ width: "80mm" }}>
            <img
              src="/ganesha.png"
              alt="Lord Ganesha"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* ================= BOTTOM: BRANDING ================= */}
        <div className="text-center space-y-4 w-full z-10 mb-12">
          <div>
            <h1
              className="pdf-title text-[56pt] leading-none" // Overlay specific size for cover
              style={{
                letterSpacing: isHindi ? "0" : "0.25em",
                textTransform: "uppercase",
                color: UREKHA_COLORS.inkPrimary,
                textShadow: "2px 2px 0px rgba(0,0,0,0.05)",
              }}
            >
              {t.brandTitle}
            </h1>

            <p
              className="pdf-header text-[12pt] mt-3"
              style={{
                letterSpacing: isHindi ? "0.1em" : "0.4em",
                color: UREKHA_COLORS.inkMuted,
              }}
            >
              {t.brandSubtitle}
            </p>

            {/* User Name Display */}
            {birthDetails.username && (
              <div className="mt-8">
                <p
                  style={{
                    fontSize: "14pt",
                    fontFamily:
                      "var(--font-lora), var(--font-hindi-serif), serif",
                    fontStyle: "italic",
                    color: UREKHA_COLORS.inkPrimary,
                    marginBottom: "4px",
                  }}
                >
                  {isHindi ? "के लिए तैयार (Prepared for)" : "Prepared for"}
                </p>
                <h2
                  style={{
                    fontSize: "24pt",
                    fontFamily:
                      "var(--font-lora), var(--font-hindi-serif), serif",
                    fontWeight: 700,
                    color: UREKHA_COLORS.inkPrimary,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {birthDetails.username}
                </h2>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 opacity-60">
            <div
              style={{
                width: "40mm",
                height: "1px",
                background: `linear-gradient(to right, transparent, ${UREKHA_COLORS.goldPrimary})`,
              }}
            />
            <span
              style={{ color: UREKHA_COLORS.goldPrimary, fontSize: "14pt" }}
            >
              ❖
            </span>
            <div
              style={{
                width: "40mm",
                height: "1px",
                background: `linear-gradient(to left, transparent, ${UREKHA_COLORS.goldPrimary})`,
              }}
            />
          </div>

          <p
            style={{
              fontSize: "9pt",
              letterSpacing: "0.3em",
              color: UREKHA_COLORS.inkBody,
              textTransform: "uppercase",
              fontFamily: "var(--font-serif), serif",
              opacity: 0.7,
            }}
          >
            {t.website}
          </p>
        </div>
      </div>

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

export default UrekhaCoverPage;
