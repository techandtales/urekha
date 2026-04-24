import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { Language } from "@/types/languages";

const PdfPageLayout = ({
  lang,
  children,
  className,
}: {
  lang: Language;
  children: React.ReactNode;
  className?: string;
}) => {
  const isHindi = lang === "hi";
  const fontSizeFooter = "11pt";

  return (
    <div
      className="flex items-center justify-center font-serif print:bg-white"
      style={{ minHeight: "100vh", backgroundColor: UREKHA_COLORS.paper }}
    >
      {/* ================= MAIN A4 FRAME ================= */}
      <div
        className={`relative flex flex-col justify-between text-[#2D2A26] ${className || ""}`}
        style={{
          width: "210mm",
          height: "297mm",
          padding: "15mm",
          backgroundColor: UREKHA_COLORS.paper,
          boxSizing: "border-box",
          fontSize: "11pt",
        }}
      >
        {/* ================= BACKGROUND PATTERN ================= */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            opacity: 0.04,
            backgroundImage: `url('/images/mandala-bg.png')`,
            backgroundSize: "500px",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            // Removed radial gradient to ensure pure white background
          }}
        />

        {/* ================= ELEGANT THIN FRAME ================= */}
        {/* Outer Thin Line */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "10mm", // consistent margin
            border: `1px solid ${UREKHA_COLORS.goldPrimary}`,
            opacity: 0.5,
            zIndex: 0,
          }}
        />
        {/* Inner Faint Line (Double Border Effect) */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "11.5mm", // consistent double margin
            border: `0.5px solid ${UREKHA_COLORS.goldPrimary}`,
            opacity: 0.3,
            zIndex: 0,
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
              width: "14mm",
              height: "14mm",
              transform: `rotate(${style.rotate})`,
              backgroundColor: UREKHA_COLORS.paper, // Hide lines behind the flower
            }}
          >
            <span
              style={{
                color: UREKHA_COLORS.goldPrimary,
                fontSize: "20pt",
                lineHeight: 0,
                opacity: 0.8,
              }}
            >
              ❃
            </span>
          </div>
        ))}

        {/* ================= CONTENT LIST ================= */}
        <div className="z-10 flex-1 min-h-0 flex flex-col">{children}</div>

        {/* ================= FOOTER ================= */}
        <div
          className="flex justify-between items-center z-10 mt-auto pt-4 px-6 mb-2"
          style={{
            borderTop: `1px solid ${UREKHA_COLORS.goldSoft}`,
          }}
        >
          <div
            style={{
              fontSize: "9pt", // Small footer text
              letterSpacing: isHindi ? "0.1em" : "0.2em",
              textTransform: "uppercase",
              color: UREKHA_COLORS.inkMuted,
            }}
            className="pdf-caption" // Use standard caption class
          >
            {isHindi
              ? "युरेखा • वैदिक इंटेलिजेंस"
              : "UREKHA • Vedic Intelligence"}
          </div>

          <div
            style={{
              fontSize: "9pt",
              letterSpacing: isHindi ? "0.1em" : "0.2em",
              color: UREKHA_COLORS.inkMuted,
              fontFamily: "var(--font-serif), serif",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {"www.urekha.com"}
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

export default PdfPageLayout;
