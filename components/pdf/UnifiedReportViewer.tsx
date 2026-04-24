"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { TriangleAlert, ArrowLeft, Printer } from "lucide-react";
import { PDFViewer, Document } from "@react-pdf/renderer";

// --- Custom Debounce Hook to stop aggressive iframe flashing during socket stream ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

import { useSvgToPng, useMultipleSvgToPng, DUMMY_SVG } from "@/utils/svgToPng";
import "@/app/pdfreport/pdf-styles.css";

// --- React PDF Components ---
import ReactPdfCoverPage from "@/components/ReactPdfRendererPages/ReactPdfCoverPage";
import ReactPdfIntroPage from "@/components/ReactPdfRendererPages/ReactPdfIntroPage";
import ReactPdfIndexPage from "@/components/ReactPdfRendererPages/ReactPdfIndexPage";

import Birthdetails from "@/components/pdf/birthDetails/birthdetails";

// Successfully converted React PDF Primitives
import ReactPdfBirthDetailsPage from "@/components/ReactPdfRendererPages/ReactPdfBirthDetailsPage";
import ReactPdfPlanetaryDetailsPage from "@/components/ReactPdfRendererPages/ReactPdfPlanetaryDetailsPage";
import ReactPdfFriendshipPage from "@/components/ReactPdfRendererPages/ReactPdfFriendshipPage";
import ReactPdfKpPlanetsPage from "../ReactPdfRendererPages/ReactPdfKpPlanetsPage";
import ReactPdfKpHousesPage from "@/components/ReactPdfRendererPages/ReactPdfKpHousesPage";
import ReactPdfKpSignificatorsPage from "@/components/ReactPdfRendererPages/ReactPdfKpSignificatorsPage";
import ReactPdfDivisionalChartsPage from "@/components/ReactPdfRendererPages/ReactPdfDivisionalChartsPage";
import ReactPdfAshtakavargaPage from "@/components/ReactPdfRendererPages/ReactPdfAshtakavargaPage";
import ReactPdfSarvashtakavargaPage from "@/components/ReactPdfRendererPages/ReactPdfSarvashtakavargaPage";
import ReactPdfVimshottariDashaPage from "@/components/ReactPdfRendererPages/ReactPdfVimshottariDashaPage";
import ReactPdfDoshaReportPage from "@/components/ReactPdfRendererPages/ReactPdfDoshaReportPage";
import ReactPdfYoginiDashaPage from "@/components/ReactPdfRendererPages/ReactPdfYoginiDashaPage";

import { ReactPdfPredictionPages } from "@/components/ReactPdfRendererPages/predictions/ReactPdfPredictionsView";

import { Language } from "@/types/languages";

interface UnifiedReportViewerProps {
  onBack: () => void;
}

export default function UnifiedReportViewer({
  onBack,
}: UnifiedReportViewerProps) {
  const birthDetails = useStore((state) => state.birthDetails);
  const rawJyotishamData = useStore((state) => state.jyotishamData);
  const resetPipeline = useStore((state) => state.resetPipeline);

  // Debounce the entire store data by 2.5 seconds to throttle aggressive React-PDF Document remounts
  const jyotishamData = useDebounce(rawJyotishamData, 2500);

  const lang: Language = birthDetails.language;

  const transitSvg = jyotishamData.charts?.transitChartSvg || null;
  const transitPng = useSvgToPng(transitSvg);
  const dummyPng = useSvgToPng(DUMMY_SVG);

  // Convert all divisional chart SVGs into an object map of base64 PNGs
  // SVGs are stored at charts.divisionalChartSvgs (NOT horoscope.divisionalCharts which is JSON data)
  const divisionalChartSvgs = jyotishamData.charts?.divisionalChartSvgs || {};
  const divisionalPngs = useMultipleSvgToPng(divisionalChartSvgs);


  // Compute a stable memoized PDF Document to completely shield the PDFViewer
  // from dashboard-driven parent clock timer re-renders!
  const memoizedPdf = React.useMemo(() => {
    return (
      <PDFViewer
        style={{
          width: "95%",
          height: "85vh",
          border: "1px solid #1c1c1c",
          borderRadius: "12px",
        }}
      >
        <Document title="Urekha Report" author="Urekha Vedic Intelligence">
          {/* The newly ported React-PDF pages using actual fetched jyotishamData */}
          <ReactPdfCoverPage lang={lang} />
          <ReactPdfIndexPage lang={lang} />
          <ReactPdfIntroPage lang={lang} />

          <ReactPdfBirthDetailsPage
            lang={lang}
            data={jyotishamData.extendedHoro.extendedKundli?.response as any}
          />

          <ReactPdfPlanetaryDetailsPage
            lang={lang}
            data={jyotishamData.horoscope.planetDetails?.response as any}
          />

          <ReactPdfFriendshipPage
            lang={lang}
            data={jyotishamData.extendedHoro.friendshipTable?.response as any}
          />

          <ReactPdfKpPlanetsPage
            lang={lang}
            data={jyotishamData.kpAstrology.planetDetails?.response as any}
          />

          <ReactPdfKpHousesPage
            lang={lang}
            houses={jyotishamData.kpAstrology.cuspDetails?.response as any}
          />

          <ReactPdfKpSignificatorsPage
            lang={lang}
            planets={jyotishamData.kpAstrology.significators?.response as any}
            houses={
              jyotishamData.kpAstrology.houseSignificators?.response as any
            }
          />

          <ReactPdfDivisionalChartsPage
            lang={lang}
            chartData={jyotishamData.horoscope.divisionalCharts as any}
            chartImages={divisionalPngs}
            transitData={{ svg: jyotishamData.charts?.transitChartSvg }}
            transitImage={transitPng}
            dummyImage={dummyPng}
          />

          <ReactPdfAshtakavargaPage
            lang={lang}
            data={jyotishamData.horoscope.binnashtakvarga?.response as any}
          />

          <ReactPdfSarvashtakavargaPage
            lang={lang}
            data={jyotishamData.horoscope.ashtakvarga?.response as any}
          />

          <ReactPdfVimshottariDashaPage
            lang={lang}
            data={jyotishamData.dasha.currentMahadashaFull?.response as any}
          />

          <ReactPdfYoginiDashaPage
            lang={lang}
            data={jyotishamData.dasha.yoginiDasha?.response as any}
          />

          <ReactPdfDoshaReportPage
            lang={lang as any}
            data={
              {
                mangal: jyotishamData.dosha.mangal?.response,
                kaalsarp: jyotishamData.dosha.kaalsarp?.response,
                pitra: jyotishamData.dosha.pitra?.response,
                manglik_analysis: jyotishamData.dosha.manglik?.response,
              } as any
            }
          />

          {jyotishamData.predictions &&
            Object.keys(jyotishamData.predictions).some(
              (cat) =>
                jyotishamData.predictions[cat]?.status === "success" &&
                jyotishamData.predictions[cat]?.data,
            ) && (
              <ReactPdfPredictionPages
                lang={lang}
                predictions={jyotishamData.predictions}
              />
            )}
        </Document>
      </PDFViewer>
    );
  }, [lang, jyotishamData, divisionalPngs, transitPng, dummyPng]);

  // Check if data is loaded in the store
  const isDataLoaded = !!jyotishamData.extendedHoro.extendedKundli;

  const handleReturnToDashboard = () => {
    resetPipeline();
    onBack();
  };

  // Case 1: No birth details set yet or data not loaded (Should not occur in SPA, but protective fallback)
  if (!birthDetails.username || !isDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white/[0.02] border border-white/5 rounded-[2rem]">
        <TriangleAlert className="text-[#FF8C00] mb-4" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">
          Report Data Unavailable
        </h2>
        <p className="text-white/50 mb-6">
          The celestial vault data is not loaded into context.
        </p>
        <button
          onClick={handleReturnToDashboard}
          className="px-8 py-3 bg-[#00FF94]/10 text-[#00FF94] border border-[#00FF94]/30 rounded-xl font-bold hover:bg-[#00FF94]/20 transition-all font-cinzel tracking-widest"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Case 2: Data is ready -> Render the full report
  return (
    <div className="relative w-full overflow-hidden bg-[#050a0a] rounded-[2rem] border border-white/5 shadow-2xl pb-20">
      {/* Sticky Top Navigation Bar */}
      <div className="sticky top-0 z-[100] px-6 py-4 bg-[#050a0a]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shadow-xl">
        <button
          onClick={handleReturnToDashboard}
          className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-[#00FF94] hover:bg-[#00FF94]/10 rounded-full transition-all border border-transparent hover:border-[#00FF94]/30 text-sm font-semibold tracking-wide"
        >
          <ArrowLeft size={16} />
          <span>Exit Document</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-bold">
            Generated Vault
          </p>
          <p className="text-white font-serif">{birthDetails.username}</p>
        </div>

        {/* Empty placeholder for alignment */}
        <div className="w-[120px]" />
      </div>

      <div className="w-full flex justify-center py-6">
        {/* Render memoized PDFViewer here bridging all dynamic React-PDF pages */}
        {memoizedPdf}
      </div>

      <div className="px-6 py-6 border-t border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">
          Legacy HTML View (Debugging)
        </h3>
        <div className="bg-white rounded-[1rem] overflow-hidden max-h-[800px] overflow-y-auto w-full max-w-5xl mx-auto ring-4 ring-white/10">
          <Birthdetails
            lang={lang}
            data={jyotishamData.extendedHoro.extendedKundli?.response as any}
          />
        </div>
      </div>
    </div>
  );
}
