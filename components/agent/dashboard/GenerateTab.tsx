import { 
  FileText, Clock, 
  User, Calendar, MapPin, Search, Loader2, 
  Lock, Check, Bot, Hash, X 
} from "lucide-react";
import { motion } from "framer-motion";
import EmbeddedPipeline from "@/components/pipeline/EmbeddedPipeline";
import type { Language } from "@/types/languages";
import { useRouter } from "next/navigation";

interface GenerateTabProps {
  agentData: any;
  agentPlans: any[];
  name: string;
  setName: (val: string) => void;
  dob: string;
  setDob: (val: string) => void;
  tob: string;
  setTob: (val: string) => void;
  gender: "male" | "female" | "";
  setGender: (val: "male" | "female" | "") => void;
  ageString: string;
  lat: string;
  setLat: (val: string) => void;
  lng: string;
  setLng: (val: string) => void;
  locationName: string;
  isFetchingLocation: boolean;
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSearching: boolean;
  suggestions: any[];
  handleSelectLocation: (s: any) => void;
  handleOpenMap: () => void;
  selectedPackage: string | number;
  setSelectedPackage: (val: any) => void;
  language: Language;
  setLanguage: (val: Language) => void;
  paperQuality: "regular" | "premium";
  setPaperQuality: (val: "regular" | "premium") => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: (val: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleConfirmGenerate: () => void;
  generationStatus: "idle" | "pipeline" | "viewing" | "processing";
  reportProgress: string;
  reportError: string | null;
  setGenerationStatus: (val: "idle" | "pipeline" | "viewing" | "processing") => void;
  resetGenerationForm: () => void;
  saveReportState: "idle" | "saving" | "success" | "error";
  saveRetryCount: number;
  setSaveRetryCount: (val: number | ((prev: number) => number)) => void;
  initiateReportSave: (existingId?: string) => Promise<void>;
  generatedReportId: string | null;
  setActiveTab: (val: "generate" | "reports" | "history" | "view_report", reportId?: string | number) => void;
  setSelectedReportId: (val: string | null) => void;
}

export function GenerateTab({
  agentData,
  agentPlans,
  name,
  setName,
  dob,
  setDob,
  tob,
  setTob,
  gender,
  setGender,
  ageString,
  lat,
  setLat,
  lng,
  setLng,
  locationName,
  isFetchingLocation,
  searchQuery,
  handleSearchChange,
  isSearching,
  suggestions,
  handleSelectLocation,
  handleOpenMap,
  selectedPackage,
  setSelectedPackage,
  language,
  setLanguage,
  paperQuality,
  setPaperQuality,
  isLoading,
  setIsLoading,
  isConfirmModalOpen,
  setIsConfirmModalOpen,
  handleSubmit,
  handleConfirmGenerate,
  generationStatus,
  setGenerationStatus,
  resetGenerationForm,
  reportProgress,
  reportError,
  saveReportState,
  saveRetryCount,
  setSaveRetryCount,
  initiateReportSave,
  generatedReportId,
  setActiveTab,
  setSelectedReportId
}: GenerateTabProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (saveRetryCount < 2) {
      setSaveRetryCount(prev => prev + 1);
      initiateReportSave(generatedReportId || undefined);
    }
  };

  const handleViewResult = () => {
    if (generatedReportId) {
      setActiveTab("view_report", generatedReportId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      {generationStatus === "idle" && (
        <>
          <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-primary font-mono text-[13px] font-bold uppercase tracking-widest">
                <FileText className="w-4 h-4" />
                <span>Neural Engine</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-900 dark:text-white flex flex-wrap items-center gap-3">
                <span>REPORT</span>
                <span className="text-primary italic font-serif">GENERATOR</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium tracking-wide">
                Enter client details to generate a comprehensive Kundli report.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md shadow-sm dark:shadow-[0_0_15px_rgba(0,255,148,0.1)] transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00FF94] animate-pulse shadow-[0_0_5px_rgba(0,255,148,0.5)] dark:shadow-[0_0_8px_#00FF94]" />
                <span className="text-sm font-medium text-slate-800 dark:text-white/90 transition-colors">
                  System Online
                </span>
              </div>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="w-full space-y-8 md:space-y-10 fade-in zoom-in duration-300 animate-in"
          >
            {/* Section 1: Client Information */}
            <section className="space-y-5 md:space-y-6 bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-5 md:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col group transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 dark:from-primary to-slate-900 dark:to-white md:bg-none md:text-amber-600 md:dark:text-primary relative z-10 leading-relaxed uppercase md:capitalize drop-shadow-[0_0_10px_rgba(212,175,55,0.2)] md:drop-shadow-none">
                <User
                  size={18}
                  className="md:w-5 md:h-5 text-amber-600 dark:text-primary shrink-0 transition-colors"
                />
                Client Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-primary/10 transition-all font-sans"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors">
                    Date of Birth
                  </label>
                  <div className="relative group/input">
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-primary/10 transition-all hide-picker-indicator uppercase font-sans"
                    />
                    <Calendar
                      className="absolute right-4 top-3.5 text-slate-400 dark:text-white/30 group-focus-within/input:text-primary transition-colors pointer-events-none"
                      size={18}
                    />
                  </div>
                  {ageString && (
                    <div className="flex items-center gap-2 mt-2 px-1">
                      <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                      <p className="text-xs text-primary font-mono tracking-wide">
                        {ageString}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors flex items-center justify-between">
                    <span>Time of Birth</span>
                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">24H Format</span>
                  </label>
                  <div className="relative group/input">
                    <input
                      type="text"
                      placeholder="HH:MM (e.g. 23:45)"
                      value={tob}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9:]/g, '');
                        if (val.length === 2 && !val.includes(':')) val += ':';
                        if (val.length > 5) val = val.substring(0, 5);
                        setTob(val);
                      }}
                      className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-primary/10 transition-all font-mono placeholder:text-slate-300 dark:placeholder:text-white/10"
                    />
                    <Clock
                      className="absolute right-4 top-3.5 text-slate-400 dark:text-white/30 group-focus-within/input:text-primary transition-colors pointer-events-none"
                      size={18}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["male", "female"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g as any)}
                        className={`px-4 py-3 rounded-xl border capitalize transition-all duration-300 ${
                          gender === g
                            ? "bg-primary text-black border-brand-gold font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-[1.02]"
                            : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Location */}
            <section className="space-y-5 md:space-y-6 bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-5 md:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col group transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-3">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00FF94] to-primary md:bg-none md:text-primary leading-relaxed uppercase md:capitalize drop-shadow-[0_0_10px_rgba(0,255,148,0.2)] md:drop-shadow-none">
                  <MapPin
                    size={18}
                    className="md:w-5 md:h-5 text-primary md:text-primary shrink-0"
                  />
                  Birth Location
                </h3>
                {(locationName || isFetchingLocation) && (
                  <div className="text-xs md:text-sm font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-brand-gold/20 bg-primary/10 text-primary animate-in fade-in zoom-in duration-300 shadow-primary/10 self-start sm:self-auto">
                    {isFetchingLocation ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        Detecting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        📍 {locationName}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="space-y-2 relative z-20">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors">
                  Search Place or City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="e.g. New Delhi, India"
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-primary/10 transition-all font-sans"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 w-4 h-4 transition-colors" />
                  {isSearching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4 animate-spin" />
                  )}
                </div>

                {/* Dropdown Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute w-full mt-2 bg-white dark:bg-[#0A0F0F] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-xl flex flex-col max-h-[220px] overflow-y-auto custom-scrollbar transition-colors">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectLocation(s)}
                        className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-white/80 hover:bg-primary/10 hover:text-primary transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
                      >
                        {s.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="00.000000"
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-primary/10 transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="00.000000"
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-primary/10 transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenMap}
                className="w-full py-3.5 md:py-4 border border-dashed border-slate-300 dark:border-white/10 rounded-xl text-slate-500 dark:text-white/50 hover:text-amber-600 dark:hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group/btn relative z-10 text-sm md:text-base"
              >
                <MapPin
                  size={16}
                  className="group-hover/btn:scale-110 transition-transform"
                />
                Open Google Maps Pick Location
              </button>
            </section>

            {/* Section 3: Package Selection */}
            <section className="space-y-5 md:space-y-6 relative z-10 bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-5 md:p-8 rounded-[2.5rem] shadow-sm dark:shadow-2xl overflow-hidden group transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-primary md:bg-none md:text-primary relative z-10 leading-relaxed uppercase md:capitalize drop-shadow-[0_0_10px_rgba(255,140,0,0.2)] md:drop-shadow-none">
                <Lock
                  size={18}
                  className="md:w-5 md:h-5 text-primary shrink-0"
                />
                Select Report Package
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 relative z-10">
                {agentPlans.map((pkg) => {
                  const featuresList: string[] = Array.isArray(
                    pkg.features,
                  )
                    ? pkg.features
                    : [];
                  return (
                    <div
                      key={pkg.id}
                      onClick={() =>
                        setSelectedPackage(pkg.id)
                      }
                      className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-500 overflow-hidden group ${
                        String(selectedPackage) === String(pkg.id)
                          ? "border-brand-gold shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-primary/10 scale-105"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] hover:border-primary/50 dark:hover:border-primary/50 hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {String(selectedPackage) === String(pkg.id) && (
                        <div className="absolute top-4 right-4 bg-primary text-black p-1 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)] z-10">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      )}

                      <div className="mb-4 relative z-10">
                        <div className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-primary transition-colors">
                          {pkg.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-white/50 h-10 leading-tight transition-colors">
                          {pkg.description}
                        </div>
                      </div>

                      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-white/10 relative z-10 flex items-baseline gap-1.5 transition-colors">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">
                          <span className="text-primary mr-1">✦</span>
                          {pkg.token_cost}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-white/50 mt-1 transition-colors">
                          tokens
                        </div>
                      </div>

                      <ul className="space-y-3 relative z-10">
                        {featuresList.map((f, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-600 dark:text-white/70 flex items-start gap-2 transition-colors"
                          >
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(212,175,55,0.8)] flex-shrink-0" />
                            <span className="leading-relaxed">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 4: Language Selection */}
            <section className="space-y-5 md:space-y-6 relative z-10 bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-5 md:p-8 rounded-[2.5rem] shadow-sm dark:shadow-2xl overflow-hidden group transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-primary md:bg-none md:text-primary relative z-10 leading-relaxed uppercase md:capitalize drop-shadow-[0_0_10px_rgba(255,140,0,0.2)] md:drop-shadow-none">
                <FileText
                  size={18}
                  className="md:w-5 md:h-5 text-primary shrink-0"
                />
                Report Language
              </h3>
              <p className="text-sm text-slate-500 dark:text-white/40 -mt-2 relative z-10 transition-colors">
                Choose the language for AI-generated predictions and
                report content.
              </p>

              <div className="grid grid-cols-2 gap-4 relative z-10 max-w-md">
                {[
                  {
                    value: "en" as Language,
                    label: "English",
                    sublabel: "Default",
                  },
                  {
                    value: "hi" as Language,
                    label: "हिन्दी",
                    sublabel: "Hindi",
                  },
                ].map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => setLanguage(lang.value)}
                    className={`px-4 py-3.5 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1 ${
                      language === lang.value
                        ? "bg-primary text-black border-brand-gold font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-[1.02]"
                        : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span className="text-base">{lang.label}</span>
                    <span
                      className={`text-[10px] uppercase tracking-widest ${
                        language === lang.value
                          ? "text-black/60"
                          : "text-white/30"
                      }`}
                    >
                      {lang.sublabel}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Section 5: Paper Quality */}
            <section className="space-y-5 md:space-y-6 relative z-10 bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-5 md:p-8 rounded-[2.5rem] shadow-sm dark:shadow-2xl overflow-hidden group transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00FF94] to-primary md:bg-none md:text-primary relative z-10 leading-relaxed uppercase md:capitalize drop-shadow-[0_0_10px_rgba(0,255,148,0.2)] md:drop-shadow-none">
                <Hash
                  size={18}
                  className="md:w-5 md:h-5 text-primary shrink-0"
                />
                Paper Printing Quality
              </h3>
              <p className="text-sm text-slate-500 dark:text-white/40 -mt-2 relative z-10 transition-colors">
                Select the paper quality for the physical printed report. 
                Premium paper adds ₹300 to the total revenue.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {[
                  {
                    value: "regular" as const,
                    label: "Standard Paper",
                    description: "Standard high-quality output",
                    cost: "Base Price",
                    icon: <FileText size={20} />,
                  },
                  {
                    value: "premium" as const,
                    label: "Premium Glossy",
                    description: "Ultra-premium textured finish",
                    cost: "+₹300 Revenue",
                    icon: <Bot size={20} />,
                  }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPaperQuality(item.value)}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 text-left group/card ${
                      paperQuality === item.value
                        ? "bg-primary/10 border-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                        : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-primary/50"
                    }`}
                  >
                    <div className={`p-3 rounded-xl transition-colors ${
                      paperQuality === item.value 
                      ? "bg-primary text-black" 
                      : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 group-hover/card:text-primary"
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className={`font-bold transition-colors ${
                        paperQuality === item.value ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-white/50"
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-white/30 mt-0.5">
                        {item.description}
                      </p>
                      <div className={`text-[11px] font-mono mt-1 ${
                         paperQuality === item.value ? "text-primary font-bold" : "text-slate-400 dark:text-white/20"
                      }`}>
                        {item.cost}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <div className="pt-8 flex justify-end relative z-10">
              <button
                type="submit"
                disabled={isLoading || !selectedPackage || !gender}
                className="w-full sm:w-auto bg-primary text-black px-8 md:px-12 py-4 rounded-xl font-bold text-sm md:text-lg hover:brightness-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] uppercase tracking-widest relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                <span className="relative z-10">
                  {isLoading
                    ? `Processing (${reportProgress.replace(/_/g, " ") || "Wait..."})`
                    : "Generate Report Now"}
                </span>
              </button>
            </div>
          </form>
        </>
      )}

      {/* Removed dedicated processing view to keep the form visible */}

      {/* Integrated Loading & Finalization View */}
      {generationStatus === "viewing" && (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in fade-in duration-500">
          <div className="w-24 h-24 mb-8 relative">
            <div className={`absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin ${saveReportState === 'saving' ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center`}>
              {saveReportState === "saving" && <Loader2 className="w-10 h-10 text-primary animate-spin" />}
              {saveReportState === "success" && <Check className="w-12 h-12 text-[#00FF94]" />}
              {saveReportState === "error" && <X className="w-12 h-12 text-red-500" />}
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            {saveReportState === "saving" && "SYNCHRONIZING CORE DATA"}
            {saveReportState === "success" && "REPORT READY"}
            {saveReportState === "error" && "PERSISTENCE ERROR"}
          </h2>
          
          <p className="text-slate-400 text-center max-w-md mb-10 px-6">
            {saveReportState === "saving" && "Our neural engine is archiving your findings into the secure vault. This ensures permanent access and accurate billing."}
            {saveReportState === "success" && "Excellent. The report has been verified and stored. You can now access the full architectural interpretation."}
            {saveReportState === "error" && saveRetryCount < 2 && "The data stream was interrupted. You have remaining synchronization attempts."}
            {saveReportState === "error" && saveRetryCount >= 2 && "A critical network failure occurred after multiple attempts. Please capture your findings and contact support."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {saveReportState === "success" && (
              <button
                onClick={handleViewResult}
                className="bg-primary text-black px-12 py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_30px_rgba(0,255,148,0.3)]"
              >
                View Result
              </button>
            )}

            {saveReportState === "error" && saveRetryCount < 2 && (
              <button
                onClick={handleRetry}
                className="bg-primary text-black px-12 py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Retry Finalizing ({2 - saveRetryCount} attempts remaining)
              </button>
            )}

            {(saveReportState === "error" || (saveReportState === "success" && false)) && (
               <button
                onClick={resetGenerationForm}
                className="px-8 py-4 border border-white/10 rounded-xl text-white/60 font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      )}

      {/* Processing Phase View */}
      {generationStatus === "processing" && (
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              className="h-full bg-primary shadow-[0_0_15px_#00FF94]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 30, ease: "linear" }}
            />
          </div>

          <div className="relative mb-12">
            <div className="w-32 h-32 rounded-full border-2 border-primary/20 flex items-center justify-center">
              <Bot className="w-16 h-16 text-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>

          <div className="text-center space-y-6 px-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-serif font-black tracking-tight text-white uppercase italic">
                Sourcing <span className="text-primary">Celestial</span> Data
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-primary/30" />
                <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase">
                  Neural Sync in Progress
                </span>
                <span className="h-px w-8 bg-primary/30" />
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl px-10 py-5 backdrop-blur-md">
              <span className="text-xl font-mono text-white tracking-widest">
                {reportProgress.replace(/_/g, " ")}
              </span>
            </div>

            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              We are currently fetching 73 points of astrological data and generating AI interpretations. 
              <br/>
              <span className="text-primary/60 italic font-medium mt-2 block">
                This typically takes 45-90 seconds.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Embedded Pipeline View */}
      {generationStatus === "pipeline" && (
        <EmbeddedPipeline
          onComplete={() => {
            // No longer auto-redirecting here, handled by the automator useEffect
          }}
          onCancel={() => {
            resetGenerationForm();
          }}
        />
      )}

      {/* Confirm Generate Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300 transition-colors">
          <div className="bg-white dark:bg-[#050A0A] border border-slate-200 dark:border-brand-gold/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl dark:shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden flex flex-col transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <FileText size={32} className="text-primary" />
            </div>

            <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white text-center mb-2 transition-colors">
              Confirm Report Generation
            </h3>
            <p className="text-slate-500 dark:text-white/50 text-sm text-center mb-8 transition-colors">
              Please verify the cosmological data before initializing the
              pipeline.
            </p>

            <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-xl p-5 space-y-4 mb-8 relative z-10 transition-colors">
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-3 transition-colors">
                <span className="text-slate-500 dark:text-white/40 text-xs uppercase tracking-widest font-semibold transition-colors">
                  Subject
                </span>
                <span className="text-slate-900 dark:text-white font-medium transition-colors">
                  {name} ({gender})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-3 transition-colors">
                <span className="text-slate-500 dark:text-white/40 text-xs uppercase tracking-widest font-semibold transition-colors">
                  Birth Info
                </span>
                <span className="text-slate-900 dark:text-white font-medium transition-colors">
                  {dob} at {tob || "12:00"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-3 transition-colors">
                <span className="text-slate-500 dark:text-white/40 text-xs uppercase tracking-widest font-semibold transition-colors">
                  Origin
                </span>
                <span className="text-slate-900 dark:text-white font-medium text-right max-w-[200px] truncate transition-colors">
                  {locationName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-white/40 text-xs uppercase tracking-widest font-semibold transition-colors">
                  Package
                </span>
                <span className="text-primary font-bold uppercase">
                  {(agentPlans.find(p => String(p.id) === String(selectedPackage)))?.name || selectedPackage}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full gap-4 relative z-10">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isLoading}
                className="flex-1 py-3 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white font-medium transition-colors"
              >
                Edit Details
              </button>
              <button
                onClick={handleConfirmGenerate}
                disabled={isLoading}
                className="flex-1 py-3 bg-primary text-black rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Confirm & Setup Pipeline"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
