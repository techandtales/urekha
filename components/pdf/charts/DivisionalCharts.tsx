"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";

import { Sparkles, ScrollText } from "lucide-react";
import { useStore } from "@/lib/store";
import { ChartResponse, ChartData } from "@/types/horoscope/divisionalChart";

// Transit chart still fetched client-side (needs live date/time) - now via backend proxy

// ── i18n: Centralized translations ──
import {
  PAGE_1_CHARTS,
  OTHER_CHARTS,
  CHART_DETAILS,
  divisionalChartsTranslations,
  TRANSIT_DESCRIPTION,
  TRANSIT_EXPLANATION,
  resolveTranslations,
} from "@/lib/i18n";
import type { ChartDef } from "@/lib/i18n";
import type { Language } from "@/types/languages";

// --- TYPES ---
export interface DivisionalChartsProps {
  lang: string;
}

// Empty fallback when data hasn't loaded yet
const EMPTY_CHART_DATA: ChartData = { house_no: {}, zodiac_no: {} };

// --- MAIN COMPONENT ---
const DivisionalCharts: React.FC<DivisionalChartsProps> = ({ lang }) => {
  const { birthDetails, jyotishamData, setJyotishamData } = useStore();
  const isHindi = lang === "hi";

  // Resolve UI labels from centralized translations
  const uiT = resolveTranslations(
    divisionalChartsTranslations,
    lang as Language,
  );

  // Pull real charts from store (fetched in pipeline)
  const chartsData = jyotishamData.horoscope.divisionalCharts ?? {};
  const isLoading = jyotishamData.horoscope.divisionalCharts === null;

  // Helper: return chart data by id, or empty fallback
  const getChartData = (id: string): ChartData =>
    chartsData[id]?.response ?? EMPTY_CHART_DATA;

  // --- SVG charts: read directly from Zustand (fetched by pipeline) ---
  const svgCache = jyotishamData.charts.divisionalChartSvgs ?? {};
  const svgLoading = Object.keys(svgCache).length === 0;

  // --- Transit Chart SVG (current date/time, fetched client-side) ---
  const [transitSvg, setTransitSvg] = React.useState<string | null>(null);
  const [transitLoading, setTransitLoading] = React.useState(true);

  // Helper: parse/clean the raw SVG text from API (only for transit)
  const parseSvg = (raw: string): string => {
    let svg = raw.trim();
    if (svg.startsWith('"') && svg.endsWith('"')) {
      try {
        svg = JSON.parse(svg);
      } catch {
        /* use raw */
      }
    }
    svg = svg.replace(
      /<svg([^>]*?)height="(\d+)"([^>]*?)width="(\d+)"/,
      (_, pre, h, mid, w) =>
        `<svg${pre}viewBox="0 0 ${w} ${h}"${mid}width="100%" height="100%"`,
    );
    return svg;
  };

  React.useEffect(() => {
    if (!birthDetails?.latitude || !birthDetails?.longitude) return;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const date = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${pad(now.getFullYear())}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.urekha.com";
    
    // Format DOB correctly (DD/MM/YYYY)
    let birthDateStr: string;
    if (birthDetails.dob instanceof Date) {
      const d = birthDetails.dob;
      birthDateStr = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    } else {
      birthDateStr = String(birthDetails.dob);
    }

    fetch(`${backendUrl}/jyotisham/test/transit_chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload: {
          date: birthDateStr,
          time: birthDetails.tob,
          latitude: birthDetails.latitude,
          longitude: birthDetails.longitude,
          tz: birthDetails.timezone ?? 5.5,
          style: "north",
          lang: (lang as "en" | "hi") ?? "en",
          colored_planets: true,
          divisional_chart: "transit_chart",
          chart_type: "chart_image",
          transit_date: date,
          transit_time: time,
        }
      })
    })
      .then(res => res.json())
      .then((res: any) => {
        if (res.success && res.data) {
          const raw = res.data;
          const svg = parseSvg(raw);
          setTransitSvg(svg);
          // Persist transit SVG to Zustand
          setJyotishamData("charts", { transitChartSvg: svg });
        }
      })
      .catch((err) => {
        console.error("Transit fetch error:", err);
        setTransitSvg(null);
      })
      .finally(() => setTransitLoading(false));
  }, [birthDetails, lang]);

  // Loading overlay while charts are being fetched
  if (isLoading) {
    return (
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            {lang === "hi"
              ? "कुंडलियाँ लोड हो रही हैं..."
              : "Loading Divisional Charts..."}
          </p>
        </div>
      </PdfPageLayout>
    );
  }

  // Chunk OTHER_CHARTS into groups of 3
  const chunkSize = 3;
  const chartPages = [];
  for (let i = 0; i < OTHER_CHARTS.length; i += chunkSize) {
    chartPages.push(OTHER_CHARTS.slice(i, i + chunkSize));
  }

  return (
    <>
      {/* ================= PAGE 1: PRIMARY CHARTS (D1, D9, Moon) ================= */}
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={uiT.coreVedicTitle_en}
          titleHi={uiT.coreVedicTitle_hi}
          lang={lang as "en" | "hi"}
        />

        <div className="w-full flex-1 min-h-0 px-0 pt-2 pb-2 flex flex-col gap-2">
          {PAGE_1_CHARTS.map((def, index) => {
            const isReverse = index % 2 !== 0;
            return (
              <React.Fragment key={def.id}>
                <div
                  className={`flex-1 min-h-0 w-full bg-white flex ${
                    isReverse ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* CHART SIDE */}
                  <div
                    className={`w-[45%] flex flex-col items-center justify-start pt-1 ${
                      isReverse ? "pl-6" : "pr-6"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3 justify-center py-[2px]">
                      <h3 className="font-bold text-zinc-800 text-lg font-serif text-center uppercase tracking-wide">
                        {def.title[lang] ?? def.title["en"]}
                      </h3>
                    </div>

                    <div className="flex-1 w-full flex items-start justify-center min-h-0">
                      <div className="w-[80%] aspect-square flex items-center justify-center">
                        {svgLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                          </div>
                        ) : svgCache[def.id] ? (
                          <div
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{
                              __html: svgCache[def.id]!,
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 border border-zinc-200 rounded flex items-center justify-center">
                            <span className="text-zinc-400 text-[9px]">—</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BASIC DETAILS SIDE */}
                  <div className="flex-1 px-6 flex flex-col justify-start pt-1 relative">
                    <div className="absolute top-0 right-0 p-3 opacity-5">
                      <Sparkles size={120} className="text-orange-500" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2 py-[2px]">
                        <ScrollText size={16} className="text-orange-500" />
                        <h4 className="text-sm font-bold text-orange-800 uppercase tracking-widest">
                          {isHindi
                            ? `${def.title["hi"]} ${uiT.aboutPrefixHi}`
                            : `${uiT.aboutPrefix} ${def.title["en"]}`}
                        </h4>
                      </div>

                      <p className="pdf-body text-zinc-600 leading-relaxed text-justify">
                        {CHART_DETAILS[def.id]?.[lang] ??
                          CHART_DETAILS[def.id]?.["en"] ??
                          uiT.chartDetailsUnavailable}
                      </p>
                    </div>
                  </div>
                </div>
                {index < PAGE_1_CHARTS.length - 1 && (
                  <div className="flex items-center gap-4 w-full py-1">
                    <div className="flex-1 h-px bg-linear-to-r from-transparent via-orange-200 to-transparent" />
                    <span className="font-serif text-orange-300 text-[9px] tracking-[10px] select-none px-2">
                      ◆ ◆ ◆
                    </span>
                    <div className="flex-1 h-px bg-linear-to-r from-transparent via-orange-200 to-transparent" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </PdfPageLayout>

      {/* ================= SUBSEQUENT PAGES: VERTICAL LIST (3 PER PAGE) ================= */}
      {chartPages.map((pageCharts, pageIndex) => (
        <PdfPageLayout key={`div-page-${pageIndex}`} lang={lang as "en" | "hi"}>
          <FloralHeader
            titleEn={`${uiT.divisionalPartTitle_en} (Part ${pageIndex + 1})`}
            titleHi={`${uiT.divisionalPartTitle_hi} (भाग ${pageIndex + 1})`}
            lang={lang as "en" | "hi"}
          />

          <div className="w-full h-full px-0 pt-1 pb-0 flex flex-col gap-2">
            {pageCharts.map((def, index) => {
              const isReverse = index % 2 !== 0;
              return (
                <React.Fragment key={def.id}>
                  <div
                    className={`flex-1 min-h-0 w-full bg-white rounded-xl flex overflow-hidden ${
                      isReverse ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* CHART SIDE (Spacious 35%) */}
                    <div
                      className={`w-[42%] relative flex flex-col items-center justify-start pt-px bg-zinc-50/30`}
                    >
                      <div className="w-[85%] aspect-square flex items-center justify-center">
                        {svgLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="w-7 h-7 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                          </div>
                        ) : svgCache[def.id] ? (
                          <div
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{
                              __html: svgCache[def.id]!,
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-zinc-400 text-[10px]">—</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* INSIGHT SIDE (65%) */}
                    <div className="flex-1 p-3 flex flex-col justify-start pt-2 relative">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-zinc-800 text-xl font-serif leading-tight">
                          {def.title[lang] ?? def.title["en"]}
                        </h3>
                      </div>

                      <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
                        <p className="pdf-body text-zinc-600 leading-relaxed text-justify text-base line-clamp-6">
                          {CHART_DETAILS[def.id]?.[lang] ??
                            CHART_DETAILS[def.id]?.["en"] ??
                            uiT.chartDetailsUnavailable}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < pageCharts.length - 1 && (
                    <div className="flex items-center gap-4 w-full py-1">
                      <div className="flex-1 h-px bg-linear-to-r from-transparent via-orange-200 to-transparent" />
                      <span className="font-serif text-orange-300 text-[8px] tracking-[8px] select-none px-2">
                        ◆ ◆ ◆
                      </span>
                      <div className="flex-1 h-px bg-linear-to-r from-transparent via-orange-200 to-transparent" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </PdfPageLayout>
      ))}

      {/* ================= LAST PAGE: TRANSIT CHART (CURRENT DATE/TIME SVG) ================= */}
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={uiT.transitTitle_en}
          titleHi={uiT.transitTitle_hi}
          lang={lang as "en" | "hi"}
        />

        <div className="w-full flex flex-col pt-1 pb-1 gap-3">
          {/* ══════ SECTION 1: 2-column top row ══════ */}
          <div className="flex flex-row gap-0">
            {/* LEFT — SVG Chart */}
            <div className="w-[42%] flex flex-col items-center justify-start pt-1 pr-3">
              {/* Timestamp pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 border border-zinc-200 mb-2 self-center">
                <Sparkles size={10} className="text-[#9F1239]" />
                <span className="text-xs font-medium text-zinc-700 tracking-wide">
                  {isHindi
                    ? `${new Date().toLocaleString("hi-IN")}`
                    : `${new Date().toLocaleString("en-IN")}`}
                </span>
              </div>
              {/* SVG — fixed size so it doesn't balloon */}
              <div className="w-full" style={{ height: "260px" }}>
                {transitLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-zinc-400 text-xs tracking-wide">
                      {uiT.transitLoading}
                    </p>
                  </div>
                ) : transitSvg ? (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: transitSvg }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Sparkles size={28} className="text-zinc-300" />
                    <p className="text-zinc-400 text-xs">
                      {uiT.transitUnavailable}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Vertical divider */}
            <div className="w-px self-stretch bg-zinc-200 mx-2" />

            {/* RIGHT — What is Transit Chart */}
            <div className="flex-1 flex flex-col justify-start pt-1 pl-3 gap-2">
              <div className="flex items-center gap-2 mb-1">
                <ScrollText size={14} className="text-[#9F1239]" />
                <h3 className="text-sm font-bold text-[#9F1239] uppercase tracking-widest">
                  {isHindi
                    ? "गोचर कुंडली क्या है?"
                    : "What is a Transit Chart?"}
                </h3>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed text-justify">
                {isHindi
                  ? "गोचर कुंडली वर्तमान क्षण में आकाश में ग्रहों की वास्तविक स्थिति दर्शाती है। यह आपकी जन्म कुंडली से भिन्न है — जन्म कुंडली जन्म के समय की स्थिति है, जबकि गोचर कुंडली आज के क्षण की जीवंत तस्वीर है।"
                  : "The Transit Chart (Gochar Kundli) maps the real-time positions of the planets in the sky at this exact moment. Unlike your natal chart — which is fixed at birth — the transit chart is a living snapshot of the cosmos as it moves through time."}
              </p>

              {/* Key points */}
              <div className="flex flex-col gap-1.5 mt-1">
                {(isHindi
                  ? [
                      {
                        label: "गोचर का उद्देश्य",
                        text: "वर्तमान ग्रहीय प्रवाह को जन्म कुंडली से मिलाकर जीवन के सक्रिय चरणों की पहचान करना।",
                      },
                      {
                        label: "शनि गोचर",
                        text: "शनि प्रत्येक राशि में ढाई वर्ष रहता है और कर्म शुद्धि, अनुशासन व परिश्रम के क्षेत्रों को प्रभावित करता है।",
                      },
                      {
                        label: "गुरु गोचर",
                        text: "बृहस्पति प्रतिवर्ष एक राशि पार करता है और जिस भाव से गुजरता है उसमें विस्तार, सौभाग्य व ज्ञान लाता है।",
                      },
                      {
                        label: "राहु-केतु गोचर",
                        text: "छाया ग्रह लगभग 18 माह एक राशि में रहते हैं और कर्मिक उथल-पुथल व आत्मिक परिवर्तन लाते हैं।",
                      },
                    ]
                  : [
                      {
                        label: "Purpose",
                        text: "Correlating the current planetary flow with your natal chart identifies active life themes, opportunities, and challenges.",
                      },
                      {
                        label: "Saturn Transit (Sade Sati)",
                        text: "Saturn stays ~2.5 years per sign. It activates karma, discipline, and restructuring in whichever house it transits.",
                      },
                      {
                        label: "Jupiter Transit",
                        text: "Jupiter moves one sign per year, expanding fortune, wisdom, and growth in the house it occupies.",
                      },
                      {
                        label: "Rahu–Ketu Axis",
                        text: "The shadow planets shift every ~18 months, triggering karmic reversals, obsessions, and spiritual transformation.",
                      },
                    ]
                ).map((pt) => (
                  <div key={pt.label} className="flex gap-2 items-start">
                    <span className="text-[#9F1239] mt-0.5 text-[8px] leading-none shrink-0">
                      ◆
                    </span>
                    <p className="text-[11px] text-zinc-600 leading-snug">
                      <span className="font-semibold text-zinc-700">
                        {pt.label}:{" "}
                      </span>
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════ SECTION 2: Divider ══════ */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-red-100 to-transparent" />
            <span className="font-serif text-red-200 text-[9px] tracking-[10px] select-none px-2">
              ◆ ◆ ◆
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-red-100 to-transparent" />
          </div>

          {/* ══════ SECTION 3: Insight ══════ */}
          <div className="w-full bg-zinc-50 border border-zinc-200 p-4 relative overflow-hidden">
            <div className="absolute top-2 right-4 opacity-5">
              <Sparkles size={72} className="text-zinc-500" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} className="text-[#9F1239]" />
              <h4 className="text-xs font-bold text-[#9F1239] uppercase tracking-widest">
                {uiT.transitInsight}
              </h4>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed text-justify relative z-10">
              {TRANSIT_DESCRIPTION[lang] ?? TRANSIT_DESCRIPTION["en"]}
            </p>
          </div>
        </div>
      </PdfPageLayout>
    </>
  );
};

export default DivisionalCharts;
