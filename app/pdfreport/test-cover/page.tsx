"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Document } from "@react-pdf/renderer";

// CRITICAL: Import font registry BEFORE the cover page component.
// This ensures NotoSansDevanagari is registered before any PDF rendering.
import "@/components/pdf/pdfFontRegistry";

import ReactPdfCoverPage from "@/components/ReactPdfRendererPages/ReactPdfCoverPage";

// Dynamic import PDFViewer to avoid SSR crash
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

function CoverTestInner({ lang }: { lang: "en" | "hi" }) {
  return (
    <PDFViewer
      style={{
        width: "90%",
        maxWidth: "900px",
        height: "85vh",
        border: "1px solid #333",
        borderRadius: "12px",
      }}
    >
      <Document
        title="Urekha Cover Page Test"
        author="Urekha Vedic Intelligence"
      >
        <ReactPdfCoverPage lang={lang} userName="Ayushmann Khurrana" />
      </Document>
    </PDFViewer>
  );
}

export default function TestCoverPage() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [viewerKey, setViewerKey] = useState(0);

  const switchLang = (newLang: "en" | "hi") => {
    setLang(newLang);
    setViewerKey((k) => k + 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        gap: "16px",
      }}
    >
      <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "bold" }}>
        Cover Page Test
      </h1>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => switchLang("en")}
          style={{
            padding: "8px 24px",
            borderRadius: "8px",
            border: lang === "en" ? "2px solid #C5A059" : "1px solid #555",
            backgroundColor: lang === "en" ? "#7B1818" : "#1c1c1c",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: lang === "en" ? "bold" : "normal",
          }}
        >
          English
        </button>
        <button
          onClick={() => switchLang("hi")}
          style={{
            padding: "8px 24px",
            borderRadius: "8px",
            border: lang === "hi" ? "2px solid #C5A059" : "1px solid #555",
            backgroundColor: lang === "hi" ? "#7B1818" : "#1c1c1c",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: lang === "hi" ? "bold" : "normal",
          }}
        >
          Hindi ({"\u0939\u093F\u0902\u0926\u0940"})
        </button>
      </div>

      <p style={{ color: "#999", fontSize: "12px" }}>
        Current language:{" "}
        <strong style={{ color: "#C5A059" }}>
          {lang === "en" ? "English" : "Hindi"}
        </strong>
      </p>

      <CoverTestInner key={viewerKey} lang={lang} />
    </div>
  );
}
