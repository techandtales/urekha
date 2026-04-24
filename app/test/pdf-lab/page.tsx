"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import {
  Document,
  PDFViewer,
} from "@react-pdf/renderer";
import { useStore } from "@/lib/store";
import {
  type PipelineActions,
  type BaseArgs
} from "@/lib/pipeline/constants";
import { ModularOrchestrator as createPipeline } from "@/lib/pipeline/modularOrchestrator";
import "@/components/pdf/pdfFontRegistry";

// --- React PDF Components ---
import ReactPdfCoverPage from "@/components/ReactPdfRendererPages/ReactPdfCoverPage";
import ReactPdfIntroPage from "@/components/ReactPdfRendererPages/ReactPdfIntroPage";
import ReactPdfIndexPage from "@/components/ReactPdfRendererPages/ReactPdfIndexPage";
import ReactPdfBirthDetailsPage from "@/components/ReactPdfRendererPages/ReactPdfBirthDetailsPage";
import ReactPdfPlanetaryDetailsPage from "@/components/ReactPdfRendererPages/ReactPdfPlanetaryDetailsPage";
import ReactPdfFriendshipPage from "@/components/ReactPdfRendererPages/ReactPdfFriendshipPage";
import ReactPdfKpPlanetsPage from "@/components/ReactPdfRendererPages/ReactPdfKpPlanetsPage";
import ReactPdfKpHousesPage from "@/components/ReactPdfRendererPages/ReactPdfKpHousesPage";
import ReactPdfKpSignificatorsPage from "@/components/ReactPdfRendererPages/ReactPdfKpSignificatorsPage";
import ReactPdfDivisionalChartsPage from "@/components/ReactPdfRendererPages/ReactPdfDivisionalChartsPage";
import ReactPdfAshtakavargaPage from "@/components/ReactPdfRendererPages/ReactPdfAshtakavargaPage";
import ReactPdfSarvashtakavargaPage from "@/components/ReactPdfRendererPages/ReactPdfSarvashtakavargaPage";
import ReactPdfVimshottariDashaPage from "@/components/ReactPdfRendererPages/ReactPdfVimshottariDashaPage";
import ReactPdfDoshaReportPage from "@/components/ReactPdfRendererPages/ReactPdfDoshaReportPage";
import ReactPdfYoginiDashaPage from "@/components/ReactPdfRendererPages/ReactPdfYoginiDashaPage";
import { ReactPdfPredictionPages } from "@/components/ReactPdfRendererPages/predictions/ReactPdfPredictionsView";

import ReactPdfDocFromRawSvg from "@/components/ReactPdfRendererPages/ReactPdfRawSvgRenderer";

import ReactPdfReportGuidePage from "@/components/ReactPdfRendererPages/ReactPdfReportGuidePage";
import ReactPdfHowToReadKundliPage from "@/components/ReactPdfRendererPages/ReactPdfHowToReadKundliPage";
import ReactPdfLagnaProfilePage from "@/components/ReactPdfRendererPages/ReactPdfLagnaProfilePage";

// ═══════════════════════════════════════
//  Page Groups Definition
// ═══════════════════════════════════════

interface PageGroup {
  id: string;
  label: string;
  icon: string;
  renderPages: (lang: "en" | "hi", data: ReturnType<typeof useStore.getState>) => React.ReactElement[];
}

const PAGE_GROUPS: PageGroup[] = [
  {
    id: "fundamentals",
    label: "Cover & Intro",
    icon: "📄",
    renderPages: (lang) => [
      <ReactPdfCoverPage key="cover" lang={lang} />,
      <ReactPdfIndexPage key="index" lang={lang} />,
      <ReactPdfIntroPage key="intro" lang={lang} />,
      <ReactPdfReportGuidePage key="guide" lang={lang} />,
      <ReactPdfHowToReadKundliPage key="howTo" lang={lang} />,
    ],
  },
  {
    id: "birth-details",
    label: "Birth Details",
    icon: "🌟",
    renderPages: (lang, store) => [
      <ReactPdfBirthDetailsPage
        key="birth"
        lang={lang}
        data={store.jyotishamData.extendedHoro.extendedKundli?.response as any}
      />,
      (() => {
        const divisionalPngs = (store.jyotishamData.charts?.divisionalChartSvgs || {}) as Record<string, string>;
        // Use a generic placeholder logic or just pass null if missing
        return (
          <ReactPdfLagnaProfilePage
            key="lagna"
            lang={lang}
            data={store.jyotishamData.horoscope.ascendantReport?.response as any}
            chartImage={divisionalPngs["D1"] || null}
          />
        );
      })(),
    ],
  },
  {
    id: "planets",
    label: "Planets & Lagna",
    icon: "🪐",
    renderPages: (lang, store) => [
      <ReactPdfPlanetaryDetailsPage
        key="planets"
        lang={lang}
        data={store.jyotishamData.horoscope.planetDetails?.response as any}
      />,
    ],
  },
  {
    id: "friendship",
    label: "Friendship Table",
    icon: "🤝",
    renderPages: (lang, store) => [
      <ReactPdfFriendshipPage
        key="friendship"
        lang={lang}
        data={store.jyotishamData.extendedHoro.friendshipTable?.response as any}
      />,
    ],
  },
  {
    id: "kp",
    label: "KP Astrology",
    icon: "🔬",
    renderPages: (lang, store) => [
      <ReactPdfKpPlanetsPage
        key="kp-planets"
        lang={lang}
        data={store.jyotishamData.kpAstrology.planetDetails?.response as any}
      />,
      <ReactPdfKpHousesPage
        key="kp-houses"
        lang={lang}
        houses={store.jyotishamData.kpAstrology.cuspDetails?.response as any}
      />,
      <ReactPdfKpSignificatorsPage
        key="kp-sig"
        lang={lang}
        planets={store.jyotishamData.kpAstrology.significators?.response as any}
        houses={store.jyotishamData.kpAstrology.houseSignificators?.response as any}
      />,
    ],
  },
  {
    id: "charts",
    label: "Divisional Charts",
    icon: "📊",
    renderPages: (lang, store) => {
      const divisionalPngs = (store.jyotishamData.charts?.divisionalChartSvgs || {}) as Record<string, string>;
      const transitPng = store.jyotishamData.charts?.transitChartSvg || null;
      return [
        <ReactPdfDivisionalChartsPage
          key="div-charts"
          lang={lang}
          chartData={store.jyotishamData.horoscope.divisionalCharts as any}
          chartImages={divisionalPngs}
          transitImage={transitPng}
        />,
      ];
    },
  },
  {
    id: "ashtakavarga",
    label: "Ashtakavarga",
    icon: "🔢",
    renderPages: (lang, store) => [
      <ReactPdfAshtakavargaPage
        key="binn"
        lang={lang}
        data={store.jyotishamData.horoscope.binnashtakvarga?.response as any}
      />,
      <ReactPdfSarvashtakavargaPage
        key="sarv"
        lang={lang}
        data={store.jyotishamData.horoscope.ashtakvarga?.response as any}
      />,
    ],
  },
  {
    id: "dashas",
    label: "Dashas",
    icon: "⏳",
    renderPages: (lang, store) => [
      <ReactPdfVimshottariDashaPage
        key="vim"
        lang={lang}
        data={store.jyotishamData.dasha.currentMahadashaFull?.response as any}
      />,
      <ReactPdfYoginiDashaPage
        key="yog"
        lang={lang}
        data={store.jyotishamData.dasha.yoginiDasha?.response as any}
      />,
    ],
  },
  {
    id: "doshas",
    label: "Doshas",
    icon: "⚠️",
    renderPages: (lang, store) => {
      const doshaData = {
        mangal: store.jyotishamData.dosha.mangal?.response,
        kaalsarp: store.jyotishamData.dosha.kaalsarp?.response,
        pitra: store.jyotishamData.dosha.pitra?.response,
        manglik_analysis: store.jyotishamData.dosha.manglik?.response,
      };
      return [
        <ReactPdfDoshaReportPage
          key="dosha"
          lang={lang}
          data={doshaData as any}
        />,
      ];
    },
  },
  {
    id: "predictions",
    label: "AI Predictions",
    icon: "🔮",
    renderPages: (lang, store) => {
      const preds = store.jyotishamData.predictions;
      const hasAny = Object.keys(preds).some(
        (cat) => preds[cat]?.status === "success" && preds[cat]?.data
      );
      if (!hasAny) return [];
      return [
        <ReactPdfPredictionPages key="preds" lang={lang} predictions={preds} />,
      ];
    },
  },
];

// ═══════════════════════════════════════
//  Test Page Component
// ═══════════════════════════════════════

export default function UnifiedPdfTestPage() {
  const store = useStore();
  const {
    setBirthDetails,
    setJyotishamData,
    pushMessage,
    updateMessage,
    pushError,
    removeError,
    incrementCompleted,
    setProgress,
    setPipelineRunning,
    resetPipeline,
    setPrediction,
    pipelineProgress,
    pipelineRunning,
    pipelineMessages,
    pipelineErrors,
    jyotishamData,
  } = store;

  const pipelineRef = useRef<createPipeline | null>(null);
  const hasStarted = useRef(false);
  const [pipelineComplete, setPipelineComplete] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Test birth details
  const testArgs: BaseArgs = {
    date: "15/01/1995",
    time: "10:30",
    latitude: 25.5941,
    longitude: 85.1376,
    tz: 5.5,
    lang: "hi",
  };

  const actions: PipelineActions = useMemo(() => ({
    setJyotishamData,
    pushMessage,
    updateMessage,
    pushError,
    removeError,
    incrementCompleted,
    setProgress,
    setPipelineRunning,
    setPrediction,
    resetPipeline,
  }), [
    setJyotishamData, pushMessage, updateMessage, pushError, removeError,
    incrementCompleted, setProgress, setPipelineRunning, setPrediction, resetPipeline,
  ]);

  // Track completion
  const isComplete =
    !pipelineRunning &&
    pipelineProgress.total > 0 &&
    pipelineProgress.completed >= pipelineProgress.total;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setPipelineComplete(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  // Start pipeline
  const handleGenerateReport = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Set birth details first
    setBirthDetails({
      username: "Roshan Kumar",
      dob: new Date("1995-01-15T10:30:00+05:30"),
      tob: "10:30",
      pob: "Patna, Bihar",
      latitude: 25.5941,
      longitude: 85.1376,
      timezone: 5.5,
      language: "en",
    });

    resetPipeline();
    pipelineRef.current = new createPipeline(testArgs, actions);
    pipelineRef.current.runPhase1();
  };

  // Render active group
  const activePages = useMemo(() => {
    if (!activeGroup) return null;
    const group = PAGE_GROUPS.find((g) => g.id === activeGroup);
    if (!group) return null;
    const currentStore = useStore.getState();
    const pages = group.renderPages(testArgs.lang as "en" | "hi", currentStore);
    if (pages.length === 0) return null;
    return (
      <Document title={`Test: ${group.label}`} author="Urekha Test Lab">
        {pages}
      </Document>
    );
  }, [activeGroup, pipelineComplete]);

  // Progress percentage
  const progressPct =
    pipelineProgress.total > 0
      ? Math.round((pipelineProgress.completed / pipelineProgress.total) * 100)
      : 0;

  // Count successful/failed messages
  const successCount = pipelineMessages.filter((m) => m.status === "success").length;
  const errorCount = pipelineErrors.length;

  return (
    <div className="flex flex-col min-h-screen bg-[#050A0A] text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-3xl font-black tracking-tighter text-[#00FF94] uppercase italic">
          PDF Verification Lab
        </h1>
        <p className="text-white/30 font-mono text-xs mt-1">
          Production Pipeline → Isolated Page Renderer
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Pipeline Control */}
        <div className="w-[360px] border-r border-white/5 flex flex-col overflow-hidden">
          {/* Generate Button */}
          {!hasStarted.current && (
            <div className="p-4">
              <button
                onClick={handleGenerateReport}
                className="w-full py-4 bg-gradient-to-r from-[#00FF94] to-[#00E5FF] text-[#050A0A] rounded-xl font-bold text-lg tracking-wide hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] transition-all active:scale-95"
              >
                ⚡ Generate Report
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {hasStarted.current && (
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
                  Pipeline Progress
                </span>
                <span className="text-sm font-bold text-[#00FF94]">{progressPct}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00FF94] to-[#00E5FF] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex gap-4 mt-2 text-[10px] font-mono text-white/30">
                <span>✓ {successCount}</span>
                {errorCount > 0 && <span className="text-red-400">✗ {errorCount}</span>}
                <span>
                  {pipelineProgress.completed}/{pipelineProgress.total}
                </span>
              </div>
            </div>
          )}

          {/* Pipeline Log */}
          {hasStarted.current && (
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {pipelineMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                    msg.status === "success"
                      ? "text-[#00FF94]/80 bg-[#00FF94]/5"
                      : msg.status === "error"
                      ? "text-red-400/80 bg-red-400/5"
                      : "text-white/40 bg-white/[0.02]"
                  }`}
                >
                  {msg.status === "success" ? (
                    <span className="text-[#00FF94]">✓</span>
                  ) : msg.status === "error" ? (
                    <span className="text-red-400">✗</span>
                  ) : (
                    <span className="animate-pulse">◌</span>
                  )}
                  <span className="truncate">{msg.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Group Buttons */}
          {pipelineComplete && (
            <div className="p-4 border-b border-white/5 bg-white/[0.01]">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
                Select Page Group to Render
              </p>
              <div className="flex flex-wrap gap-2">
                {PAGE_GROUPS.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setActiveGroup(group.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      activeGroup === group.id
                        ? "bg-[#00FF94]/20 border border-[#00FF94] text-[#00FF94] shadow-[0_0_15px_rgba(0,255,148,0.15)]"
                        : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{group.icon}</span>
                    <span>{group.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PDF Viewport */}
          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            {activePages ? (
              <PDFViewer
                style={{ width: "100%", height: "100%", border: "none" }}
                showToolbar={true}
              >
                {activePages}
              </PDFViewer>
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/15">
                {!hasStarted.current ? (
                  <>
                    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-lg font-bold uppercase tracking-widest italic">
                      Click Generate to Start
                    </p>
                  </>
                ) : !pipelineComplete ? (
                  <>
                    <div className="w-16 h-16 border-4 border-[#00FF94]/30 border-t-[#00FF94] rounded-full animate-spin" />
                    <p className="text-lg font-bold uppercase tracking-widest italic text-white/30">
                      Pipeline Running...
                    </p>
                  </>
                ) : (
                  <>
                    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-bold uppercase tracking-widest italic">
                      Select a Page Group ↑
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
