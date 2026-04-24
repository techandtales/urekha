"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { getSampleUsers, createSampleUser } from "./actions";
import { API_BASE_URL } from "@/lib/config/api";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronLeft, Calendar as CalendarIcon, User, Search, RefreshCw, FileText, MapPin, Loader2, Clock } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SampleReportPDF } from "@/components/admin/SampleReportPDF";
import { toast } from "sonner";

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);
import { cn } from "@/lib/utils";

export function SampleReportsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlReportId = searchParams.get("report_id");

  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState("Initializing...");

  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    time_of_birth: "",
    place_of_birth: "",
    latitude: "",
    longitude: "",
    timezone: "5.5",
    gender: "male",
    language: "en"
  });

  // Location Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const searchLocation = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
        { headers: { "Accept-Language": "en" } },
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      toast.error("Location search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    
    const timer = setTimeout(() => {
      searchLocation(value);
    }, 800);
    return () => clearTimeout(timer);
  };

  const handleSelectLocation = (s: any) => {
    const city = s.address?.city || s.address?.town || s.address?.village || s.address?.county || "";
    const state = s.address?.state || "";
    const country = s.address?.country || "";
    const parts = [city, state, country].filter(Boolean);
    const locName = parts.length > 0 ? parts.join(", ") : s.display_name;
    const derivedTz = s.lon ? Math.round((Number(s.lon) / 15) * 2) / 2 : 5.5;

    setFormData(prev => ({
      ...prev,
      place_of_birth: locName,
      latitude: s.lat,
      longitude: s.lon,
      timezone: String(derivedTz)
    }));
    setSearchQuery(s.display_name.split(",")[0]);
    setSuggestions([]);
  };

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await getSampleUsers();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (urlReportId && !jsonResult) {
      handleReportSelect(urlReportId);
    }
  }, [urlReportId]);

  const handleReportSelect = async (reportId: string) => {
    setIsPreparing(true);
    setCurrentStatus("Retrieving archived cosmic data...");
    try {
      const response = await fetch(`${API_BASE_URL}/getkundli/${reportId}`);
      if (!response.ok) throw new Error("Report not found");
      const result = await response.json();
      setJsonResult(result.data);
      if (urlReportId !== reportId) {
        router.push(`/admin/sample-reports?report_id=${reportId}`, { scroll: false });
      }
    } catch (err) {
      toast.error("Could not find generated report data.");
      router.push("/admin/sample-reports", { scroll: false });
    } finally {
      setIsPreparing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsPreparing(true);
    setCurrentStatus("Aligning celestial bodies...");
    
    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        timezone: parseFloat(formData.timezone),
      };

      const statusInterval = setInterval(() => {
        const statuses = [
          "Calculating planetary positions...",
          "Analyzing cosmic signatures...",
          "Synthesizing Vedic blueprints...",
          "Architecting destiny...",
          "Generating intelligence summary..."
        ];
        setCurrentStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }, 3000);
      
      const response = await fetch(`${API_BASE_URL}/admin/sample-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      clearInterval(statusInterval);
      if (!response.ok) throw new Error("Backend generation failed");
      
      const result = await response.json();
      setJsonResult(result.data);
      if (result.data?._id) {
        router.push(`/admin/sample-reports?report_id=${result.data._id}`, { scroll: false });
      }
      toast.success("Sample report architected successfully!");
      fetchReports();
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate sample report");
    } finally {
      setIsSubmitting(false);
      setIsPreparing(false);
    }
  };

  if (isPreparing || jsonResult) {
    return (
      <div className="space-y-4">
        <div className="relative border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-[#050A0A] p-4 md:p-8">
          <AnimatePresence mode="wait">
            {isPreparing ? (
              <motion.div 
                key="preparing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto min-h-[500px]"
              >
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute inset-4 rounded-full border-2 border-primary/10 border-b-primary animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText size={48} className="text-primary animate-pulse" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white">Architecting Destiny</h2>
                  <p className="text-slate-500 dark:text-zinc-400 text-lg animate-pulse">{currentStatus}</p>
                </div>

                <div className="grid grid-cols-3 gap-8 w-full max-w-md pt-8 border-t border-slate-200 dark:border-white/10">
                  {[
                    { icon: MapPin, label: "Geocoding" },
                    { icon: Clock, label: "Time-sync" },
                    { icon: RefreshCw, label: "Synthesis" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <item.icon size={20} className="text-primary" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                  <button 
                    onClick={() => {
                      setJsonResult(null);
                      setIsPreparing(false);
                      router.push("/admin/sample-reports", { scroll: false });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs"
                  >
                    <ChevronLeft size={20} />
                    <span>Back to Dashboard</span>
                  </button>

                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border border-primary/20">
                    <FileText size={20} className="text-primary" />
                    <h3 className="font-bold text-primary uppercase tracking-widest text-xs">Live Fidelity Preview</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {jsonResult && (
                      <PDFDownloadLink
                        document={<SampleReportPDF data={jsonResult} />}
                        fileName={`${jsonResult.profile?.name || "Sample"}_Kundli.pdf`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:brightness-110 transition-all font-bold shadow-xl shadow-primary/20 text-sm uppercase tracking-widest"
                      >
                        {/* @ts-ignore */}
                        {({ loading }) => (
                          <>
                            <Download size={18} />
                            <span>{loading ? "Syncing..." : "Download PDF"}</span>
                          </>
                        )}
                      </PDFDownloadLink>
                    )}
                  </div>
                </div>

                <div className="w-full h-[850px] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-slate-100 ring-1 ring-primary/5">
                  <PDFViewer width="100%" height="100%" showToolbar={true} className="border-none">
                    <SampleReportPDF data={jsonResult} />
                  </PDFViewer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-xl relative overflow-hidden group">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Client Name</label>
                <div className="relative group/input">
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all" placeholder="E.g. Siddharth" />
                  <User size={18} className="absolute right-4 top-3.5 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Date of Birth</label>
                  <div className="relative group/input">
                    <input required name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all" />
                    <CalendarIcon size={18} className="absolute right-4 top-3.5 text-slate-400 group-focus-within/input:text-primary transition-colors pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Time of Birth</label>
                  <div className="relative group/input">
                    <input required name="time_of_birth" value={formData.time_of_birth} onChange={handleChange} type="time" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all" />
                    <Clock size={18} className="absolute right-4 top-3.5 text-slate-400 group-focus-within/input:text-primary transition-colors pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Place of Birth (Search City)</label>
              <div className="relative group/input">
                <input type="text" value={searchQuery} onChange={handleSearchChange} className="w-full px-4 py-3 pl-11 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all" placeholder="Search city e.g. Patna, Bihar" />
                <Search size={18} className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                {isSearching && <Loader2 size={18} className="absolute right-4 top-3.5 text-primary animate-spin" />}
              </div>
              {suggestions.length > 0 && (
                <div className="absolute w-full mt-2 bg-white dark:bg-[#0A0F0F] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {suggestions.map((s, idx) => (
                    <button key={idx} type="button" onClick={() => handleSelectLocation(s)} className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-zinc-300 hover:bg-primary/10 hover:text-primary transition-colors border-b border-slate-100 dark:border-white/5 last:border-0">
                      {s.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Latitude</label>
                <input required name="latitude" value={formData.latitude} onChange={handleChange} type="number" step="any" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all font-mono" placeholder="25.5941" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Longitude</label>
                <input required name="longitude" value={formData.longitude} onChange={handleChange} type="number" step="any" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all font-mono" placeholder="85.1376" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Timezone</label>
                <input required name="timezone" value={formData.timezone} onChange={handleChange} type="number" step="0.5" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-primary transition-all font-mono" placeholder="5.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {['male', 'female'].map(g => (
                    <button key={g} type="button" onClick={() => setFormData(prev => ({ ...prev, gender: g }))} className={`py-3 rounded-xl border capitalize transition-all font-bold ${formData.gender === g ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:border-primary/50"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-slate-500 ml-1">Report Language</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ val: 'en', label: 'English' }, { val: 'hi', label: 'Hindi' }].map(l => (
                    <button key={l.val} type="button" onClick={() => setFormData(prev => ({ ...prev, language: l.val }))} className={`py-3 rounded-xl border transition-all font-bold ${formData.language === l.val ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:border-primary/50"}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary hover:brightness-110 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : <FileText size={20} />}
                <span className="uppercase tracking-widest">{isSubmitting ? "Generating Profile..." : "Create & View Report"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col h-full min-h-[400px]">
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white font-serif">Previously Generated Reports</h2>
            <button onClick={fetchReports} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-primary transition-colors">
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
          
          <div className="flex-1 p-2 overflow-y-auto max-h-[600px] custom-scrollbar">
            {isLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="animate-spin text-primary mx-auto mb-4" size={32} />
                <p className="text-slate-500 dark:text-zinc-500 font-medium">Synchronizing celestial data...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-60">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <FileText size={36} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium text-lg">No reports generated yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {reports.map((report) => (
                  <div key={report._id} onClick={() => handleReportSelect(report._id)} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-white dark:bg-white/[0.02] dark:hover:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/30 rounded-2xl cursor-pointer transition-all group shadow-sm hover:shadow-xl active:scale-[0.99]">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transition-transform group-hover:scale-110">
                      {report.name ? report.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 dark:text-zinc-200 group-hover:text-primary transition-colors truncate">{report.name}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><CalendarIcon size={12} className="text-primary" /> {report.date_of_birth}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {report.place_of_birth}</span>
                      </div>
                    </div>
                    <span className={cn("px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-md border", report.language === 'hi' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20")}>
                      {report.language === 'hi' ? 'HINDI' : 'ENGLISH'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
