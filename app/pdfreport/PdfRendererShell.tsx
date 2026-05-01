"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Document, pdf } from "@react-pdf/renderer";
import dynamic from "next/dynamic";

// Dynamically import PDFViewer to avoid SSR crash on Vercel
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);
import "@/components/pdf/pdfFontRegistry";
import { ReportLoadingScreen } from "./page";
import {
  Download,
  FileText,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Eye,
  Sparkles,
  Layout,
  User,
  Orbit,
  Zap,
  Layers,
  Table,
  Clock,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
import ReactPdfReportGuidePage from "@/components/ReactPdfRendererPages/ReactPdfReportGuidePage";
import ReactPdfHowToReadKundliPage from "@/components/ReactPdfRendererPages/ReactPdfHowToReadKundliPage";
import ReactPdfLagnaProfilePage from "@/components/ReactPdfRendererPages/ReactPdfLagnaProfilePage";

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#FAFAF9"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="#E4E4E7" stroke-width="1.5"/>
  <text x="50" y="55" text-anchor="middle" fill="#D4D4D8" font-size="9" font-family="sans-serif">Chart</text>
</svg>`;

// ── Shared Page Groups Logic ───────────────────────────────────────────────
interface PageGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  renderPages: (
    lang: string,
    store: ReturnType<typeof useStore.getState>,
    dummyPng: string | null,
  ) => React.ReactNode[];
}

const PAGE_GROUPS: PageGroup[] = [
  {
    id: "fundamentals",
    label: "Cover & Guide",
    icon: <Layout size={18} />,
    renderPages: (lang) => [
      <ReactPdfCoverPage key="cover" lang={lang as any} />,
      <ReactPdfIndexPage key="index" lang={lang as any} />,
      <ReactPdfIntroPage key="intro" lang={lang as any} />,
      <ReactPdfReportGuidePage key="guide" lang={lang as any} />,
      <ReactPdfHowToReadKundliPage key="howTo" lang={lang as any} />,
    ],
  },
  {
    id: "birth-profile",
    label: "Birth & Lagna",
    icon: <User size={18} />,
    renderPages: (lang, store, dummy) => {
      const divisionalPngs = (store.jyotishamData.charts?.divisionalChartSvgs ||
        {}) as Record<string, string>;
      return [
        <ReactPdfBirthDetailsPage
          key="birth"
          lang={lang as any}
          data={
            store.jyotishamData.extendedHoro.extendedKundli?.response as any
          }
        />,
        <ReactPdfLagnaProfilePage
          key="lagna"
          lang={lang as any}
          data={store.jyotishamData.horoscope.ascendantReport?.response as any}
          chartImage={divisionalPngs["D1"] || dummy}
        />,
      ];
    },
  },
  {
    id: "planets",
    label: "Planetary Stats",
    icon: <Orbit size={18} />,
    renderPages: (lang, store) => [
      <ReactPdfPlanetaryDetailsPage
        key="planets"
        lang={lang as any}
        data={store.jyotishamData.horoscope.planetDetails?.response as any}
      />,
      <ReactPdfFriendshipPage
        key="friendship"
        lang={lang as any}
        data={store.jyotishamData.extendedHoro.friendshipTable?.response as any}
      />,
    ],
  },
  {
    id: "kp",
    label: "KP Astrology",
    icon: <Zap size={18} />,
    renderPages: (lang, store) => [
      <ReactPdfKpPlanetsPage
        key="kp-planets"
        lang={lang as any}
        data={store.jyotishamData.kpAstrology.planetDetails?.response as any}
      />,
      <ReactPdfKpHousesPage
        key="kp-houses"
        lang={lang as any}
        houses={store.jyotishamData.kpAstrology.cuspDetails?.response as any}
      />,
      <ReactPdfKpSignificatorsPage
        key="kp-sig"
        lang={lang as any}
        planets={store.jyotishamData.kpAstrology.significators?.response as any}
        houses={
          store.jyotishamData.kpAstrology.houseSignificators?.response as any
        }
      />,
    ],
  },
  {
    id: "charts",
    label: "Charts & Transit",
    icon: <Layers size={18} />,
    renderPages: (lang, store, dummy) => {
      const divisionalPngs = (store.jyotishamData.charts?.divisionalChartSvgs ||
        {}) as Record<string, string>;
      const transitPng = store.jyotishamData.charts?.transitChartSvg || null;
      return [
        <ReactPdfDivisionalChartsPage
          key="div-charts"
          lang={lang as any}
          chartData={store.jyotishamData.horoscope.divisionalCharts as any}
          chartImages={divisionalPngs}
          transitImage={transitPng}
          dummyImage={dummy}
        />,
      ];
    },
  },
  {
    id: "ashtakavarga",
    label: "Ashtakavarga",
    icon: <Table size={18} />,
    renderPages: (lang, store) => [
      <ReactPdfAshtakavargaPage
        key="binn"
        lang={lang as any}
        data={store.jyotishamData.horoscope.binnashtakvarga?.response as any}
      />,
      <ReactPdfSarvashtakavargaPage
        key="sarv"
        lang={lang as any}
        data={store.jyotishamData.horoscope.ashtakvarga?.response as any}
      />,
    ],
  },
  {
    id: "dashas",
    label: "Time Cycles",
    icon: <Clock size={18} />,
    renderPages: (lang, store) => [
      <ReactPdfVimshottariDashaPage
        key="vim"
        lang={lang as any}
        data={store.jyotishamData.dasha.currentMahadashaFull?.response as any}
      />,
      <ReactPdfYoginiDashaPage
        key="yog"
        lang={lang as any}
        data={store.jyotishamData.dasha.yoginiDasha?.response as any}
      />,
    ],
  },
  {
    id: "doshas",
    label: "Dosha Report",
    icon: <ShieldAlert size={18} />,
    renderPages: (lang, store) => [
      <ReactPdfDoshaReportPage
        key="dosha"
        lang={lang as any}
        data={
          {
            mangal: store.jyotishamData.dosha.mangal?.response,
            kaalsarp: store.jyotishamData.dosha.kaalsarp?.response,
            pitra: store.jyotishamData.dosha.pitra?.response,
            manglik_analysis: store.jyotishamData.dosha.manglik?.response,
          } as any
        }
      />,
    ],
  },
  {
    id: "predictions",
    label: "AI Predictions",
    icon: <Sparkles size={18} />,
    renderPages: (lang, store) => {
      const preds = store.jyotishamData.predictions;
      const hasAny = Object.keys(preds).some(
        (cat) => preds[cat]?.status === "success" && preds[cat]?.data,
      );
      if (!hasAny) return [];
      return [
        <ReactPdfPredictionPages key="preds" lang={lang} predictions={preds} />,
      ];
    },
  },
];

export default function PdfRendererShell() {
  const store = useStore();
  const birthDetails = store.birthDetails;
  const jyotishamData = store.jyotishamData;
  const lang = birthDetails.language || "en";

  const [dummyPng, setDummyPng] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string>(PAGE_GROUPS[0].id);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [completedDownloads, setCompletedDownloads] = useState<Set<string>>(
    new Set(),
  );
  const [canRender, setCanRender] = useState(false);

  // Initial setup delay
  useEffect(() => {
    const timer = setTimeout(() => setCanRender(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Sync placeholder PNG
  useEffect(() => {
    fetch("/api/svg-to-png", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ svg: PLACEHOLDER_SVG, width: 100, height: 100 }),
    })
      .then((r) => r.json())
      .then((d) => setDummyPng(d.png ?? null))
      .catch(() => {});
  }, []);

  // Logic to generate the PDF Document for a specific group
  const getGroupDocument = (groupId: string) => {
    const group = PAGE_GROUPS.find((g) => g.id === groupId);
    if (!group) return null;
    const pages = group.renderPages(lang, store, dummyPng);
    if (pages.length === 0) return null;
    return (
      <Document
        title={`${group.label} - ${birthDetails.username || "Urekha"}`}
        author="Urekha Vedic Intelligence"
      >
        {pages}
      </Document>
    );
  };

  const handleDownloadGroup = async (groupId: string, label: string) => {
    const doc = getGroupDocument(groupId);
    if (!doc) return;

    setDownloadingIds((prev) => new Set(prev).add(groupId));
    try {
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${birthDetails.username || "Report"}_${label.replace(/\s+/g, "_")}.pdf`;
      link.click();
      setCompletedDownloads((prev) => new Set(prev).add(groupId));
    } catch (err) {
      toast.error("PDF Download Failed", {
        description: "An error occurred while generating the document blob.",
      });
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
    }
  };

  const activeDoc = useMemo(
    () => getGroupDocument(activeGroupId),
    [activeGroupId, lang, jyotishamData, dummyPng],
  );

  if (!canRender) {
    return <ReportLoadingScreen />;
  }

  return (
    <div className="w-full h-screen bg-[#050A0A] flex flex-col md:flex-row overflow-hidden font-sans selection:bg-[#00FF94]/30 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FF94]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* --- Sidebar: Control Panel --- */}
      <aside className="w-full md:w-[380px] border-r border-white/5 bg-[#080D0D]/80 backdrop-blur-3xl z-20 flex flex-col overflow-hidden relative">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF94] to-[#00E5FF] p-[1px]">
              <div className="w-full h-full rounded-xl bg-[#050A0A] flex items-center justify-center">
                <FileText className="text-[#00FF94] w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">
                Urekha Arc
              </h2>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mt-1">
                Vedic Map Orchestrator
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] relative group">
            <div className="relative z-10">
              <span className="text-[10px] text-[#00FF94] font-bold uppercase tracking-[0.2em]">
                Subject
              </span>
              <h3 className="text-white font-bold tracking-tight truncate">
                {birthDetails.username}
              </h3>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">
                {birthDetails.dob?.toLocaleDateString()} • {lang.toUpperCase()}
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          </div>
        </div>

        {/* Scrollable Node List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
          <p className="px-2 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-4">
            Report Segments
          </p>
          {PAGE_GROUPS.map((group) => {
            const isActive = activeGroupId === group.id;
            const isDownloading = downloadingIds.has(group.id);
            const isDone = completedDownloads.has(group.id);

            return (
              <div
                key={group.id}
                className={`group relative rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "bg-[#00FF94]/10 border-[#00FF94]/30 shadow-[0_0_20px_rgba(0,255,148,0.05)]"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                <div className="p-4 flex items-center justify-between">
                  <button
                    onClick={() => setActiveGroupId(group.id)}
                    className="flex-1 flex items-center gap-4 text-left"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-[#00FF94] text-[#050A0A]"
                          : "bg-white/5 text-white/40 group-hover:text-white"
                      }`}
                    >
                      {group.icon}
                    </div>
                    <div>
                      <span
                        className={`text-sm font-bold block leading-tight ${isActive ? "text-white" : "text-white/60"}`}
                      >
                        {group.label}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono tracking-tight uppercase">
                        Segment 0{PAGE_GROUPS.indexOf(group) + 1}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadGroup(group.id, group.label)}
                      disabled={isDownloading}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isDone
                          ? "bg-[#00FF94]/20 text-[#00FF94]"
                          : isDownloading
                            ? "bg-white/5 text-cyan-400"
                            : "bg-white/5 text-white/20 hover:bg-white/10 hover:text-white"
                      }`}
                      title="Download Segment"
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} />
                      ) : isDownloading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Download size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveGroupId(group.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isActive
                          ? "text-[#00FF94] rotate-90"
                          : "text-white/10 hover:text-white/30"
                      }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-white/5 bg-[#050A0A]">
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="w-full py-3 bg-[#00FF94] text-black rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 uppercase tracking-widest mb-2"
          >
            <Layout size={14} /> Back to Dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 text-xs font-mono text-white/30 hover:text-white transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <RefreshCcw size={14} /> Full System Reload
          </button>
        </div>
      </aside>

      {/* --- Main Viewport: The Visualizer --- */}
      <main className="flex-1 relative flex flex-col bg-[#050A0A] overflow-hidden">
        {/* Header Overlay */}
        <div className="p-4 px-8 border-b border-white/5 flex items-center justify-between bg-[#050A0A]/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Live Viewport Ready
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              {PAGE_GROUPS.find((g) => g.id === activeGroupId)?.label}
            </h4>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">
                Render Engine
              </span>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider italic">
                Vedic-PDF-V4
              </span>
            </div>
            <Eye className="text-white/10" size={16} />
          </div>
        </div>

        {/* The PDF Canvas */}
        <div className="flex-1 relative z-0 flex items-center justify-center p-4 md:p-10">
          {/* Shadows/Glow behind the paper */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] h-[80%] bg-[#00FF94]/5 blur-[100px] rounded-full" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeGroupId}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full max-w-[900px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] bg-[#121212]"
            >
              <div className="w-full h-full bg-white relative">
                {activeDoc ? (
                  <PDFViewer
                    style={{ width: "100%", height: "100%", border: "none" }}
                    showToolbar={true}
                  >
                    {activeDoc}
                  </PDFViewer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#080D0D]">
                    <Loader2 className="w-10 h-10 text-[#00FF94] animate-spin" />
                    <p className="text-white/20 font-mono text-xs uppercase tracking-widest">
                      Synthesizing Geometry...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global CSS for scrollbar */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 255, 148, 0.1);
            border-radius: 20px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 255, 148, 0.3);
          }
        `}</style>
      </main>
    </div>
  );
}
