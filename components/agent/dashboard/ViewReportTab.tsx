"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { 
  Loader2, 
  ChevronLeft, 
  Layout, 
  User, 
  Orbit, 
  Zap, 
  Layers, 
  Table, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  ChevronRight,
  Monitor,
  History as HistoryIcon,
  Eye,
  Calendar,
  Check,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PDFViewer, Document, pdf } from "@react-pdf/renderer";
import "@/components/pdf/pdfFontRegistry";
import { fetchUserReportFromMongo } from "@/app/actions/report-actions";
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

interface ViewReportTabProps {
  selectedReportId: string | null;
  recentReports: any[];
  setActiveTab: (tab: "generate" | "reports" | "history" | "view_report", reportId?: string | number) => void;
  formatDeterministicDate: (date: Date | string | number) => string;
  formatDeterministicTime: (date: Date | string | number) => string;
}

interface PageGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  renderPages: (
    lang: string,
    store: any,
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
    renderPages: (lang, store) => {
      const divisionalPngs = (store.jyotishamData.charts?.divisionalChartSvgs || {}) as Record<string, string>;
      return [
        <ReactPdfBirthDetailsPage
          key="birth"
          lang={lang as any}
          data={store.jyotishamData.extendedHoro.extendedKundli?.response as any}
        />,
        <ReactPdfLagnaProfilePage
          key="lagna"
          lang={lang as any}
          data={store.jyotishamData.horoscope.ascendantReport?.response as any}
          chartImage={divisionalPngs["D1"] || null}
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
        houses={store.jyotishamData.kpAstrology.houseSignificators?.response as any}
      />,
    ],
  },
  {
    id: "charts",
    label: "Charts & Transit",
    icon: <Layers size={18} />,
    renderPages: (lang, store) => {
      const divisionalPngs = (store.jyotishamData.charts?.divisionalChartSvgs || {}) as Record<string, string>;
      const transitPng = store.jyotishamData.charts?.transitChartSvg || null;
      return [
        <ReactPdfDivisionalChartsPage
          key="div-charts"
          lang={lang as any}
          chartData={store.jyotishamData.horoscope.divisionalCharts as any}
          chartImages={divisionalPngs}
          transitImage={transitPng}
          dummyImage={null}
        />,
      ];
    },
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
        data={{
          mangal: store.jyotishamData.dosha.mangal?.response,
          kaalsarp: store.jyotishamData.dosha.kaalsarp?.response,
          pitra: store.jyotishamData.dosha.pitra?.response,
          manglik_analysis: store.jyotishamData.dosha.manglik?.response,
        } as any}
      />,
    ],
  },
  {
    id: "predictions",
    label: "AI Predictions",
    icon: <Sparkles size={18} />,
    renderPages: (lang, store) => {
      const preds = store.jyotishamData.predictions;
      const hasAny = Object.keys(preds).some(cat => preds[cat]?.status === "success" && preds[cat]?.data);
      if (!hasAny) return [];
      return [<ReactPdfPredictionPages key="preds" lang={lang} predictions={preds} />];
    },
  },
];

// --- Full Report Aggregator Wrapper ---
const FullReportDoc = ({ name, children }: { name: string, children: React.ReactNode }) => {
  return (
    <Document
      title={`Complete Kundli Report - ${name}`}
      author="Urekha Vedic Intelligence"
    >
      {children}
    </Document>
  );
};

export function ViewReportTab({
  selectedReportId,
  recentReports,
  setActiveTab,
  formatDeterministicDate,
  formatDeterministicTime,
}: ViewReportTabProps) {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string>(PAGE_GROUPS[0].id);
  const [isDownloading, setIsDownloading] = useState(false);
  const [prepProgress, setPrepProgress] = useState(0);
  const [prepStatus, setPrepStatus] = useState("Initializing Cosmic Aggregator...");
  const [docBuffer, setDocBuffer] = useState<React.ReactNode[]>([]);

  const handleDownloadFullReport = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setPrepProgress(0);
    setDocBuffer([]);
    
    const lang = store.birthDetails.language || "en";
    let accumulatedPages: React.ReactNode[] = []; // Local source of truth to avoid stale closures
    
    // 1. Define all segments to be rendered incrementally
    // This spreads the React reconciliation cost over time
    const tasks = [
        // Base Sections
        ...PAGE_GROUPS.filter(g => g.id !== "predictions").map(group => ({
            label: `Buffering ${group.label}...`,
            render: () => group.renderPages(lang, store)
        })),
        // Granular Prediction Sections (One by One)
        ...Object.keys(store.jyotishamData.predictions)
            .filter(cat => store.jyotishamData.predictions[cat]?.status === "success")
            .map(cat => ({
                label: `Encoding ${cat.replace(/-/g, ' ')}...`,
                render: () => {
                    const singlePred = { [cat]: store.jyotishamData.predictions[cat] };
                    return [<ReactPdfPredictionPages key={cat} lang={lang} predictions={singlePred} />];
                }
            }))
    ];

    let currentStep = 0;
    const totalSteps = tasks.length;
    
    const processNextTask = async () => {
        if (currentStep < totalSteps) {
            const task = tasks[currentStep];
            setPrepStatus(task.label);
            
            // Add the new pages to the buffer
            const newPages = task.render();
            accumulatedPages = [...accumulatedPages, ...newPages];
            setDocBuffer([...accumulatedPages]); // UI Feedback
            
            currentStep++;
            setPrepProgress((currentStep / totalSteps) * 95); 

            // Small delay to keep UI buttery smooth
            setTimeout(processNextTask, 600);
        } else {
            // All pages are in memory! Start the final one-off serialization.
            setPrepStatus("Finalizing High-Fidelity Serialization...");
            setPrepProgress(98);
            
            // Allow state to settle before the heavy hit
            setTimeout(() => executeFinalSerialization(accumulatedPages), 1000);
        }
    };

    const executeFinalSerialization = async (finalPages: React.ReactNode[]) => {
        try {
            // We pass the pre-built buffer directly to avoid re-rendering the whole tree
            const doc = <FullReportDoc name={store.birthDetails.username || "Report"}>{finalPages}</FullReportDoc>;
            const blob = await pdf(doc).toBlob();
            
            setPrepProgress(100);
            setPrepStatus("Cosmic Compilation Complete!");
            
            setTimeout(() => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `Urekha_Full_Report_${store.birthDetails.username || "Report"}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setIsDownloading(false);
                setDocBuffer([]); // Clear memory
                toast.success("Full report downloaded successfully!");
            }, 800);
        } catch (err) {
            console.error("Incremental PDF Error:", err);
            toast.error("Cloud failure during serialization. Please retry.");
            setIsDownloading(false);
        }
    };

    // Kick off the slow-burn process
    processNextTask();
  };

  useEffect(() => {
    async function loadReport() {
      if (!selectedReportId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetchUserReportFromMongo(selectedReportId);
        if (res.success && res.coreData) {
          // Inject data into store
          store.injectSavedReportData(res.coreData, res.predictions);
          
          // Map birth details
          const bd = res.birth_details || res.meta?.birth_details || res.meta?.user_details;
          if (bd) {
            const birthDateStr = bd.date || bd.dob || bd.date_of_birth || "";
            let birthDate = new Date();
            if (birthDateStr.includes('/')) {
              const [d, m, y] = birthDateStr.split('/');
              birthDate = new Date(`${y}-${m}-${d}`);
            } else if (birthDateStr) {
              birthDate = new Date(birthDateStr);
            }

            store.setBirthDetails({
              username: bd.username || bd.name || res.meta?.user_details?.name || "Client",
              dob: birthDate,
              tob: bd.time || bd.time_of_birth || bd.tob || "",
              latitude: bd.latitude || bd.lat || 0,
              longitude: bd.longitude || bd.lng || 0,
              timezone: bd.tz || bd.timezone || 5.5,
              language: bd.lang || bd.language || "en",
            });
          }
        } else {
          setError(res.error || "Vault entry corrupted or missing. The cosmic data could not be localized.");
        }
      } catch (err: any) {
        setError(err.message || "Celestial interference detected. Vault communication offline.");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [selectedReportId]);

  const activeDoc = useMemo(() => {
    if (loading || !!error || !selectedReportId) return null;
    const group = PAGE_GROUPS.find((g) => g.id === activeGroupId);
    if (!group) return null;
    const pages = group.renderPages(store.birthDetails.language || "en", store);
    if (pages.length === 0) return null;

    return (
      <Document
        title={`${group.label} - ${store.birthDetails.username || "Report"}`}
        author="Urekha Vedic Intelligence"
      >
        {pages}
      </Document>
    );
  }, [activeGroupId, loading, error, selectedReportId, store.jyotishamData]);

  if (loading) {
    return (
        <div className="w-full flex flex-col h-[750px] bg-white/10 dark:bg-black/10 rounded-[2.5rem] border border-blue-500/30 dark:border-white/10 items-center justify-center gap-6 relative shadow-sm transition-all duration-500 overflow-hidden backdrop-blur-3xl">
             {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF94]/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />
            </div>
            
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Orbit className="text-primary w-6 h-6 animate-pulse" />
                </div>
            </div>
            <div className="text-center space-y-1 relative z-10">
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Accessing Vault Data</p>
                <p className="text-[10px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">Calibrating celestial coordinates...</p>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="w-full flex flex-col h-[750px] bg-white/10 dark:bg-black/10 rounded-[2.5rem] border border-blue-500/30 dark:border-white/10 items-center justify-center p-12 text-center relative shadow-sm transition-all duration-500 overflow-hidden backdrop-blur-3xl">
             {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full" />
            </div>

            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 relative">
                <ShieldAlert size={32} className="text-red-500" />
                <div className="absolute inset-0 rounded-full border border-red-500/10 animate-ping" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter italic font-mono">Quantum Extraction <span className="text-red-500">Failed</span></h3>
            <p className="text-sm text-slate-500 dark:text-white/40 max-w-sm leading-relaxed mb-8">{error}</p>
            <button 
                onClick={() => setActiveTab("view_report", "")}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
                Return to Archive
            </button>
        </div>
    );
  }

  if (!selectedReportId) {
    return (
      <div className="w-full flex flex-col h-[750px] bg-white/20 dark:bg-black/40 rounded-[2.5rem] border border-blue-500/30 dark:border-white/10 overflow-hidden shadow-xl relative transition-all duration-500 backdrop-blur-3xl">
        {/* Glossy Reflection Overlay */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-30" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent z-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-0" />
        
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF94]/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />
        </div>

        <header className="p-8 border-b border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 backdrop-blur-xl z-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <HistoryIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Report <span className="text-blue-600 dark:text-blue-400 italic">Archives</span>
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-white/40 uppercase tracking-[0.2em] font-mono mt-0.5">Select a node to materialize report</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 text-[10px] font-bold uppercase tracking-widest">
              Total Records: {recentReports?.length || 0}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative z-10">
          {recentReports?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentReports.map((report: any) => {
                const name = report.user_details?.name || "Unknown Client";
                const planName = (report.pricing_plans?.name || report.plan)?.replace(" Astrology Report", "") || "Standard";
                return (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -4 }}
                    key={report.id}
                    onClick={() => setActiveTab("view_report", report.report_id || report.id)}
                    className="flex flex-col p-6 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-white/[0.06] shadow-sm hover:shadow-xl transition-all group text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye size={20} className="text-blue-500" />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 font-bold group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            {name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors truncate max-w-[140px]">{name}</h4>
                            <span className="text-[9px] font-mono text-slate-400 dark:text-white/30 uppercase tracking-tighter">{String(report.id).substring(0, 13)}...</span>
                        </div>
                    </div>

                    <div className="space-y-3 mt-auto">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest">Package</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                                planName === "Premium" ? "text-blue-600 dark:text-blue-400" : "text-blue-500 dark:text-blue-400"
                            }`}>
                                {planName}
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-3">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-white/60">
                                <Calendar size={12} className="text-blue-500/50" />
                                <span className="text-[10px] font-mono font-bold">{formatDeterministicDate(report.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-white/60">
                                <Clock size={12} className="text-blue-500/50" />
                                <span className="text-[10px] font-mono font-bold">{formatDeterministicTime(report.created_at)}</span>
                            </div>
                        </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 py-20">
               <div className="w-20 h-20 rounded-full bg-blue-500/5 dark:bg-white/5 border border-blue-500/10 dark:border-white/10 flex items-center justify-center mb-6">
                  <ShieldAlert size={32} className="text-blue-500/40" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 underline decoration-blue-500 underline-offset-8">No Records Materialized</h3>
               <p className="text-xs text-slate-500 dark:text-white/60 max-w-xs">Generate your first celestial intelligence report to populate this archive portal.</p>
            </div>
          )}
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.2);
            border-radius: 20px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row h-[750px] bg-white/20 dark:bg-black/40 rounded-[2.5rem] border border-blue-500/30 dark:border-white/5 overflow-hidden shadow-xl relative transition-all duration-500 backdrop-blur-3xl">
      {/* Glossy Reflection Overlay */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-30" />
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent z-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-0" />
      {/* Preparation Overlay */}
      <AnimatePresence>
        {isDownloading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex flex-col items-center justify-center p-6 bg-white/20 dark:bg-black/40 backdrop-blur-3xl"
          >
            <div className="max-w-md w-full flex flex-col items-center gap-12">
              {/* Animated Geometry */}
              <div className="relative w-32 h-32">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-blue-500/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border border-blue-500/40 rounded-full flex items-center justify-center"
                >
                    <Zap className="text-blue-500 w-8 h-8 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </motion.div>
                <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                    <span className="bg-blue-500/20 text-blue-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                        Safe Mode
                    </span>
                </div>
              </div>

              {/* Progress HUD */}
              <div className="w-full space-y-6 text-center">
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">{Math.round(prepProgress)}%</h3>
                    <p className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.3em] font-bold h-4">
                        {prepStatus}
                    </p>
                </div>
                
                <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-300 dark:border-white/10 p-[1px]">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${prepProgress}%` }}
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                    />
                </div>
              </div>

              <p className="text-[9px] text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] font-medium text-center">
                Optimizing serialization thread... Dashboard remains interactive.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar - Node Selection */}
      <aside className="w-full md:w-[320px] border-r border-white/20 dark:border-white/5 bg-white/15 dark:bg-white/[0.05] backdrop-blur-3xl z-10 flex flex-col relative overflow-hidden">
        {/* Sidebar Glossy Detail */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent z-20" />
        
        <div className="p-6 border-b border-white/10 dark:border-white/5 flex items-center justify-between bg-white/5 dark:bg-black/20 relative z-20">
            <button 
                onClick={() => setActiveTab("view_report", "")}
                className="flex items-center gap-2 text-slate-500 dark:text-white/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Select Report</span>
            </button>
            <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[9px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-tighter">Live_Link</span>
            </div>
        </div>

        <div className="p-6 space-y-3 overflow-y-auto custom-scrollbar flex-1 relative z-10">
            <p className="px-2 text-[10px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-4 text-center">Segments</p>
            {PAGE_GROUPS.map((group) => {
                const isActive = activeGroupId === group.id;
                const pages = group.renderPages(store.birthDetails.language || "en", store);
                if (pages.length === 0) return null;

                return (
                    <button
                        key={group.id}
                        onClick={() => setActiveGroupId(group.id)}
                        className={`w-full group relative rounded-2xl border transition-all duration-300 p-4 flex items-center gap-4 text-left ${
                            isActive 
                                ? "border-blue-500/60 dark:border-blue-500/50 bg-white/30 dark:bg-white/10 shadow-lg"
                                : "bg-white/5 dark:bg-white/[0.02] border-white/5 dark:border-white/[0.05] hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-white/15 dark:hover:bg-white/5 shadow-sm"
                        }`}
                    >
                        {/* Reflective shine on button */}
                        {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-2xl" />
                        )}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isActive ? "bg-blue-600 dark:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-slate-100/50 dark:bg-white/5 text-slate-400 dark:text-white/40 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}>
                            {group.icon}
                        </div>
                        <div className="flex-1">
                            <span className={`text-xs font-bold block leading-tight ${isActive ? "text-blue-700 dark:text-blue-200" : "text-slate-500 dark:text-white/60"}`}>
                                {group.label}
                            </span>
                        </div>
                        {isActive && <ChevronRight size={14} className="text-blue-600 dark:text-blue-400" />}
                    </button>
                );
            })}
        </div>
        
        {/* User Card inside Sidebar */}
        <div className="p-4 bg-white/10 dark:bg-white/5 border-t border-white/10 dark:border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                    {store.birthDetails.username?.charAt(0) || "U"}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-slate-900 dark:text-white text-xs font-bold truncate">{store.birthDetails.username}</p>
                    <p className="text-slate-500 dark:text-white/30 text-[9px] font-mono">{store.birthDetails.dob?.toLocaleDateString()}</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative transition-colors">
        <header className="p-4 px-8 border-b border-white/10 dark:border-white/5 flex items-center justify-between bg-white/10 dark:bg-black/20 backdrop-blur-xl z-20">
            <div className="flex items-center gap-3">
                <Monitor className="text-blue-500 w-4 h-4" />
                <h4 className="text-xs font-bold text-slate-700 dark:text-white/90 uppercase tracking-widest leading-none">
                    {PAGE_GROUPS.find(g => g.id === activeGroupId)?.label} Viewport
                </h4>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-widest hidden lg:block">ID: {String(selectedReportId).substring(0, 8)}...</span>
                
                <button
                  onClick={handleDownloadFullReport}
                  disabled={isDownloading}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                    isDownloading 
                      ? "bg-blue-500/20 text-blue-600 border-blue-500/30 cursor-wait" 
                      : "bg-blue-500/10 dark:bg-blue-500/10 hover:bg-blue-500/20 dark:hover:bg-blue-500/20 border-blue-500/30 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-blue-500" />
                      Serializing Report...
                    </>
                  ) : (
                    <>
                      <Download size={14} className="group-hover:animate-bounce" />
                      Download Full PDF
                    </>
                  )}
                </button>
            </div>
        </header>

        <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-hidden">
             <AnimatePresence mode="wait">
                <motion.div
                    key={activeGroupId}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full rounded-2xl overflow-hidden border border-blue-500/40 dark:border-white/10 shadow-sm bg-white/10 dark:bg-black/20 relative z-10 backdrop-blur-xl"
                >
                    {activeDoc ? (
                        <PDFViewer 
                            style={{ width: "100%", height: "100%", border: "none", opacity: 0.9 }}
                            showToolbar={true}
                        >
                            {activeDoc as any}
                        </PDFViewer>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            <p className="text-slate-400 dark:text-white/20 font-mono text-xs uppercase tracking-widest">Rendering Segment Geometry...</p>
                        </div>
                    )}
                </motion.div>
             </AnimatePresence>
        </div>

        {/* CSS for custom scrollbar */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.2);
            border-radius: 20px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.4);
          }
        `}</style>
      </main>
    </div>
  );
}
