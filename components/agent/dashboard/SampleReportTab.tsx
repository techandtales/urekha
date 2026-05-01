"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config/api";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  User,
  Search,
  RefreshCw,
  FileText,
  MapPin,
  Loader2,
  Clock,
  CheckCircle2,
  Zap,
  ChevronLeft,
  Globe,
  History,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import PDFViewer to avoid SSR crash on Vercel
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);
import { SampleReportPDF } from "@/components/admin/SampleReportPDF";
import { getSampleReportAction } from "@/app/actions/report-actions";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SampleReportTabProps {
  user: any; // Supabase User object
  role: "admin" | "agent";
}

interface GeneratedReport {
  report_id: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  progress: string;
  summary: string | null;
  failure_reason: string | null;
  subject_name: string;
  birth_details: any;
  created_at: string;
}

const PROGRESS_LABELS: Record<string, string> = {
  QUEUED: "Initializing celestial request...",
  FETCHING_ASTRO_DATA: "Calculating planetary positions...",
  AGGREGATING_DATA: "Synthesizing cosmic signatures...",
  GENERATING_AI_SUMMARY: "Generating AI interpretation...",
  FINALIZING: "Archiving final report...",
  COMPLETED: "Architecture complete.",
  FAILED: "Stream interrupted.",
};

function progressStep(progress: string): number {
  const order = [
    "QUEUED",
    "FETCHING_ASTRO_DATA",
    "AGGREGATING_DATA",
    "GENERATING_AI_SUMMARY",
    "FINALIZING",
    "COMPLETED",
  ];
  const idx = order.indexOf(progress);
  return idx === -1 ? 0 : Math.round((idx / (order.length - 1)) * 100);
}

export function SampleReportTab({ user, role }: SampleReportTabProps) {
  const [formData, setFormData] = useState({
    name: "Sample Test User",
    date_of_birth: "1990-01-01",
    time_of_birth: "12:00",
    place_of_birth: "New Delhi, Delhi, India",
    latitude: "28.6139",
    longitude: "77.2090",
    timezone: "5.5",
    gender: "male",
    language: "en",
  });

  const [searchQuery, setSearchQuery] = useState("New Delhi");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState<string>("QUEUED");
  const [completedReport, setCompletedReport] = useState<GeneratedReport | null>(null);
  const [fullReportData, setFullReportData] = useState<any>(null);
  const [isFetchingFullData, setIsFetchingFullData] = useState(false);

  const [pastReports, setPastReports] = useState<GeneratedReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  const supabase = createClient();

  const fetchPastReports = async () => {
    setIsLoadingReports(true);
    try {
      const { data } = await supabase
        .from("sample_reports")
        .select("*")
        .eq("agent_id", user.id) // Filter by the Supabase UUID
        .order("created_at", { ascending: false })
        .limit(20);
      setPastReports(data || []);
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchPastReports();
  }, [user.id]);

  // Real-time Polling for Active Job
  useEffect(() => {
    if (!activeReportId) return;
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("sample_reports")
        .select("*")
        .eq("report_id", activeReportId)
        .single();

      if (data) {
        setCurrentProgress(data.progress || "QUEUED");
        if (data.status === "COMPLETED") {
          clearInterval(interval);
          setCompletedReport(data as GeneratedReport);
          setActiveReportId(null);
          setIsSubmitting(false);
          toast.success("Sample generated successfully.");
          fetchPastReports();
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setActiveReportId(null);
          setIsSubmitting(false);
          toast.error(data.failure_reason || "Generation failed.");
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeReportId]);

  const fetchFullReportData = async (reportId: string) => {
    setIsFetchingFullData(true);
    try {
      const result = await getSampleReportAction(reportId);
      if (result.success) {
        setFullReportData(result.data);
      } else {
        toast.error(result.error || "Failed to fetch complete report data.");
      }
    } catch (err) {
      toast.error("Network error while fetching report details.");
    } finally {
      setIsFetchingFullData(false);
    }
  };

  useEffect(() => {
    if (completedReport && !fullReportData) {
      fetchFullReportData(completedReport.report_id);
    }
  }, [completedReport]);

  const handleViewReport = (report: GeneratedReport) => {
    setFullReportData(null); // Clear old data
    setCompletedReport(report);
  };

  const handleSubmit = async (e?: React.FormEvent, retryData?: any) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setCurrentProgress("QUEUED");
    setCompletedReport(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token)
        throw new Error("Session expired. Please log in again.");

      // Format Date & Time for backend (DD/MM/YYYY & HH:MM)
      const [y, m, d] = formData.date_of_birth.split("-");
      const formattedDate = `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
      const timeParts = (formData.time_of_birth || "00:00").split(":");
      const formattedTime = `${timeParts[0].padStart(2, "0")}:${timeParts[1].padStart(2, "0")}`;

      const activePayload = retryData ? {
        ...retryData,
        date: retryData.date || formattedDate,
        time: retryData.time || formattedTime,
        tz: retryData.tz || retryData.timezone || parseFloat(formData.timezone),
        lang: retryData.lang || retryData.language || formData.language,
        latitude: retryData.latitude || parseFloat(formData.latitude),
        longitude: retryData.longitude || parseFloat(formData.longitude),
      } : {
        name: formData.name,
        date: formattedDate,
        time: formattedTime,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        tz: parseFloat(formData.timezone),
        lang: formData.language,
        place_of_birth: formData.place_of_birth,
        gender: formData.gender,
      };

      // Construct Payload precisely as requested
      const body = {
        user: role,
        id: user.id, // Auth User UID
        payload: activePayload,
      };

      const res = await fetch(`${API_BASE_URL}/api/sample-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // JWT Header
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Failed to initiate generation.");

      setActiveReportId(result.report_id);
      toast.info("Synthesizing data stream...");
    } catch (err: any) {
      toast.error(err.message || "Network error.");
      setIsSubmitting(false);
    }
  };

  const handleRetry = (report: GeneratedReport) => {
    // Populate form with past data so they can see what failed or just trigger directly
    setFormData({
      name: report.birth_details.name || report.subject_name,
      date_of_birth: report.birth_details.date_of_birth,
      time_of_birth: report.birth_details.time_of_birth,
      place_of_birth: report.birth_details.place_of_birth || "",
      latitude: String(report.birth_details.latitude),
      longitude: String(report.birth_details.longitude),
      timezone: String(report.birth_details.timezone || "5.5"),
      gender: report.birth_details.gender || "male",
      language: report.birth_details.language || "en",
    });
    setSearchQuery(report.birth_details.place_of_birth || "");

    // Trigger submission with existing payload
    handleSubmit(undefined, report.birth_details);
  };

  const handleSelectLocation = (s: any) => {
    const city =
      s.address?.city ||
      s.address?.town ||
      s.address?.village ||
      s.address?.county ||
      "";
    const state = s.address?.state || "";
    const country = s.address?.country || "";
    const locName =
      [city, state, country].filter(Boolean).join(", ") || s.display_name;
    const tz = s.lon ? Math.round((Number(s.lon) / 15) * 2) / 2 : 5.5;
    setFormData((p) => ({
      ...p,
      place_of_birth: locName,
      latitude: s.lat,
      longitude: s.lon,
      timezone: String(tz),
    }));
    setSearchQuery(s.display_name.split(",")[0]);
    setSuggestions([]);
  };

  const handleSearchLocation = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
      );
      setSuggestions(await res.json());
    } finally {
      setIsSearching(false);
    }
  };

  // UI RENDERING ────────────────────────────────────────────────────────────────

  if (isSubmitting || activeReportId) {
    const pct = progressStep(currentProgress);
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 text-center max-w-lg mx-auto bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl">
        <div className="relative w-44 h-44">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-2 border-primary/10 border-b-primary"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap
              size={48}
              className="text-primary animate-pulse drop-shadow-[0_0_15px_rgba(0,255,148,0.5)]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Architecting Destiny
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">
            {PROGRESS_LABELS[currentProgress] ||
              "Processing celestial metadata..."}
          </p>
        </div>

        <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden ring-1 ring-slate-200 dark:ring-white/10">
          <motion.div
            className="h-full bg-primary shadow-[0_0_15px_rgba(0,255,148,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-zinc-500">
          {pct}% Synchronized
        </p>
      </div>
    );
  }

  if (completedReport) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto h-full min-h-[800px] flex flex-col">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => { setCompletedReport(null); setFullReportData(null); }} 
            className="flex items-center gap-2 text-slate-500 dark:text-zinc-500 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 size={12} /> {completedReport.subject_name}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-[#050A0A] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col min-h-[900px] h-[85vh]">
          {isFetchingFullData ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="animate-spin text-primary" size={32} />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Decrypting Celestial Data...</p>
            </div>
          ) : fullReportData ? (
            <div className="flex-1 w-full h-full">
               <PDFViewer style={{ width: "100%", height: "100%", minHeight: "850px" }} showToolbar={true}>
                  <SampleReportPDF data={fullReportData} />
               </PDFViewer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <FileText className="text-red-500 opacity-20" size={64} />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500/60">Data stream unavailable</p>
              <button 
                onClick={() => fetchFullReportData(completedReport.report_id)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Retry Fetch
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* FORM SECTION */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-xl dark:shadow-2xl">
          <div className="flex items-center gap-3 mb-10 text-primary font-black text-[11px] tracking-[0.4em] uppercase">
            <Zap size={16} fill="currentColor" /> Neural Synthesis Engine
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-zinc-500 ml-1">
                  Client Name
                </label>
                <div className="relative group">
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    type="text"
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 font-medium"
                    placeholder="E.g. Aryan Sharma"
                  />
                  <User
                    size={18}
                    className="absolute right-6 top-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-zinc-500 ml-1">
                    Birth Date
                  </label>
                  <div className="relative group">
                    <input
                      required
                      value={formData.date_of_birth}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          date_of_birth: e.target.value,
                        }))
                      }
                      type="date"
                      className="w-full px-5 py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all font-mono appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <CalendarIcon
                      size={18}
                      className="absolute right-5 top-5 text-slate-400 dark:text-zinc-500 pointer-events-none group-focus-within:text-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-zinc-500 ml-1">
                    Time (24h)
                  </label>
                  <div className="relative group">
                    <input
                      required
                      value={formData.time_of_birth}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9:]/g, "");
                        if (val.length === 2 && !val.includes(":")) val += ":";
                        if (val.length > 5) val = val.substring(0, 5);
                        setFormData((p) => ({ ...p, time_of_birth: val }));
                      }}
                      onBlur={(e) => {
                        const val = e.target.value;
                        const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                        if (val && !regex.test(val)) {
                          toast.error("Invalid time format", {
                            description: "Use HH:MM (00:00 - 23:59)",
                          });
                          setFormData((p) => ({ ...p, time_of_birth: "" }));
                        }
                      }}
                      type="text"
                      placeholder="HH:MM"
                      className="w-full px-5 py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all font-mono placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                    />
                    <Clock
                      size={18}
                      className="absolute right-5 top-5 text-slate-400 dark:text-zinc-500 pointer-events-none group-focus-within:text-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-zinc-500 ml-1">
                Geographical Origin
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearchLocation(e.target.value);
                  }}
                  className="w-full px-6 py-5 pl-14 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 font-medium"
                  placeholder="Search city or region..."
                />
                <MapPin
                  size={20}
                  className="absolute left-6 top-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-primary transition-colors"
                />
                {isSearching && (
                  <Loader2
                    size={18}
                    className="absolute right-6 top-5 text-primary animate-spin"
                  />
                )}
              </div>
              {suggestions.length > 0 && (
                <div className="absolute w-full mt-3 bg-white dark:bg-[#0A0F0F] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectLocation(s)}
                      className="w-full text-left px-6 py-4 text-sm text-slate-600 dark:text-zinc-400 hover:bg-primary/10 hover:text-primary transition-colors border-b border-slate-100 dark:border-white/5 last:border-0 font-medium"
                    >
                      {s.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Lat", name: "latitude", icon: MapPin },
                { label: "Lon", name: "longitude", icon: MapPin },
                { label: "TZ", name: "timezone", icon: Globe },
              ].map((f) => (
                <div key={f.name} className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-zinc-500 ml-1">
                    {f.label}
                  </label>
                  <input
                    required
                    value={(formData as any)[f.name]}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, [f.name]: e.target.value }))
                    }
                    type="number"
                    step="any"
                    className="w-full px-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-zinc-500 ml-1">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["male", "female"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, gender: g }))}
                      className={cn(
                        "py-5 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all",
                        formData.gender === g
                          ? "bg-primary text-black border-primary shadow-[0_0_25px_rgba(0,255,148,0.4)]"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-zinc-600 hover:border-primary/50",
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-zinc-500 ml-1">
                  Language
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: "en", label: "English" },
                    { val: "hi", label: "Hindi" },
                  ].map((l) => (
                    <button
                      key={l.val}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, language: l.val }))
                      }
                      className={cn(
                        "py-5 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all",
                        formData.language === l.val
                          ? "bg-primary text-black border-primary shadow-[0_0_25px_rgba(0,255,148,0.4)]"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-zinc-600 hover:border-primary/50",
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-primary hover:brightness-110 text-black font-black rounded-3xl transition-all flex items-center justify-center gap-4 shadow-[0_15px_45px_-10px_rgba(0,255,148,0.5)] active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.4em] text-xs mt-6"
            >
              <Zap size={22} fill="currentColor" />
              Synthesize Report
            </button>
          </form>
        </div>
      </div>

      {/* HISTORY SIDEBAR */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#050A0A] border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col h-full max-h-[800px] shadow-xl dark:shadow-2xl">
          <div className="p-8 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <History size={16} className="text-primary" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-zinc-400 font-serif">
                Past Samples
              </h2>
            </div>
            <button
              onClick={fetchPastReports}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors text-slate-400 dark:text-zinc-600 hover:text-primary"
            >
              <RefreshCw
                size={14}
                className={isLoadingReports ? "animate-spin" : ""}
              />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {isLoadingReports ? (
              <div className="p-16 text-center space-y-6">
                <Loader2
                  className="animate-spin text-primary mx-auto"
                  size={28}
                />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-700">
                  Syncing History...
                </p>
              </div>
            ) : pastReports.length === 0 ? (
              <div className="p-16 text-center opacity-30 space-y-4">
                <FileText size={48} className="mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Vault Empty
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {pastReports.map((r, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={r.report_id}
                    className={cn(
                      "p-5 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl transition-all group relative overflow-hidden",
                      r.status === "COMPLETED"
                        ? "hover:border-primary/40 hover:bg-primary/[0.02]"
                        : "",
                    )}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all",
                          r.status === "COMPLETED"
                            ? "bg-primary/10 text-primary"
                            : r.status === "FAILED"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-amber-500/10 text-amber-500",
                        )}
                      >
                        {r.subject_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-700 dark:text-zinc-300 text-sm truncate group-hover:text-primary dark:group-hover:text-white transition-colors">
                          {r.subject_name}
                        </h4>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-600 font-mono mt-0.5 uppercase tracking-widest">
                          {new Date(r.created_at).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          r.status === "COMPLETED"
                            ? "bg-primary"
                            : r.status === "FAILED"
                              ? "bg-red-500"
                              : "bg-amber-500 animate-pulse",
                        )}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {r.status === "COMPLETED" ? (
                        <button
                          onClick={() => handleViewReport(r)}
                          className="flex-1 py-2 bg-slate-100 dark:bg-white/5 hover:bg-primary/20 text-slate-500 dark:text-zinc-400 hover:text-primary border border-slate-200 dark:border-white/5 hover:border-primary/30 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          <Eye size={10} /> View Result
                        </button>
                      ) : r.status === "FAILED" ? (
                        <div className="flex flex-col w-full gap-2">
                          <p className="text-[9px] text-red-500/60 italic px-1 line-clamp-1 mb-1">
                            {r.failure_reason || "Stream interrupted"}
                          </p>
                          <button
                            onClick={() => handleRetry(r)}
                            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                            <RefreshCw size={10} /> Retry Logic
                          </button>
                        </div>
                      ) : (
                        <div className="w-full py-2 bg-amber-500/5 text-amber-500/60 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 italic">
                          <Clock size={10} /> Syncing...
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
