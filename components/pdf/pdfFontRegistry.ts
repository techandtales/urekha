"use client";
import { Font } from "@react-pdf/renderer";

// ─── NotoSansDevanagari (Hindi / Devanagari script) ──────────────────
// Using absolute paths starting with / for public directory access in Next.js
Font.register({
  family: "NotoSansDevanagari",
  fonts: [
    { src: "/fonts/NotoSansDevanagari-Medium.ttf", fontWeight: 400 },
    { src: "/fonts/NotoSansDevanagari-Bold.ttf", fontWeight: 600 },
  ],
});

// ─── Roboto (Latin fallback) ─────────────────────────────────────────
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

// ─── Hyphenation Callback (Devanagari-safe & Performant) ──────────────
// This is a global singleton for react-pdf.
// By returning [word], we force the layout engine to keep the word as a single unit.
const DEVANAGARI_REGEX = /[\u0900-\u097F]/;

Font.registerHyphenationCallback((word: string) => {
  return [word];
});

export const hindiFont = { fontFamily: "NotoSansDevanagari" as const };
export const hindiBold = {
  fontFamily: "NotoSansDevanagari" as const,
  fontWeight: 600 as const,
};

export {};
