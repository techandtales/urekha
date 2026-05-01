"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useTheme } from "next-themes";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Zap,
  Loader2,
  Sparkles,
  Cpu,
  Fingerprint,
  Crown,
  Sun,
  Moon,
  ChevronRight,
  AlertCircle,
  Gem,
  Search,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { initializeUserKundliGeneration } from "@/app/actions/user-kundli-actions";
import { checkKundliExists } from "@/app/actions/kundli-actions";
import PremiumPipelineUI from "@/components/pipeline/PremiumPipelineUI";
import SocketInitializer from "@/components/socket-initializer";

interface GenerateKundliClientProps {
  userData: any;
  userPlans: any[];
}

const PLAN_THEMES = [
  {
    icon: Cpu,
    gradient: "from-cyan-500 via-emerald-500 to-teal-500",
    glow: "shadow-cyan-500/20",
    activeColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    label: "Standard Plan"
  },
  {
    icon: Fingerprint,
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    glow: "shadow-amber-500/20",
    activeColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-500/30",
    bg: "bg-amber-500/5",
    label: "Premium Plan"
  },
  {
    icon: Crown,
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
    glow: "shadow-purple-500/20",
    activeColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-500/30",
    bg: "bg-purple-500/5",
    label: "Elite Plan"
  },
];

function WanderingParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => {
        const isAmber = i % 3 === 0;
        const color = isAmber ? "#FF8C00" : "#00FF94";
        const glowingShadow = isAmber 
          ? "0 0 10px 2px rgba(255,140,0,0.4)" 
          : "0 0 10px 2px rgba(0,255,148,0.4)";

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 2 + "px",
              height: Math.random() * 3 + 2 + "px",
              backgroundColor: color,
              boxShadow: glowingShadow,
            }}
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              x: [
                `${Math.random() * 100}vw`,
                `${Math.random() * 100}vw`,
                `${Math.random() * 100}vw`,
                `${Math.random() * 100}vw`,
              ],
              y: [
                `${Math.random() * 100}vh`,
                `${Math.random() * 100}vh`,
                `${Math.random() * 100}vh`,
                `${Math.random() * 100}vh`,
              ],
              opacity: [0.1, 0.8, 0.3, 0.8, 0.1],
              scale: [1, 1.5, 1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 60 + 40, // ultra slow fluid wandering
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}

function GenerateKundliContent({
  userData,
  userPlans,
}: GenerateKundliClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { setBirthDetails, resetPipeline, setJyotishamData } = useStore();

  const [generationStatus, setGenerationStatus] = useState<"idle" | "pipeline">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [isNewKundli, setIsNewKundli] = useState(true);
  const [reportId, setReportId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("male");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locationName, setLocationName] = useState("");
  const [timezone, setTimezone] = useState("5.5");
  const [language, setLanguage] = useState("en");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const pipelineRunning = useStore((s) => s.pipelineRunning);
  const pipelineProgress = useStore((s) => s.pipelineProgress);
  const predictions = useStore((s) => s.jyotishamData.predictions);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pid = searchParams.get("planId");
    if (pid) {
      setSelectedPlanId(Number(pid));
    }
  }, [searchParams]);

  const searchLocation = async (query: string) => {
    if (!query.trim() || query.length < 3) { setSuggestions([]); return; }
    setIsSearching(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`, { headers: { "Accept-Language": "en" } });
      setSuggestions(await r.json());
    } catch { /* ignore */ } finally { setIsSearching(false); }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => searchLocation(e.target.value), 800);
  };

  const handleSelectLocation = (s: any) => {
    setLat(s.lat); setLng(s.lon);
    const tz = Math.round((Number(s.lon) / 15) * 2) / 2;
    setTimezone(tz.toString());
    const a = s.address || {};
    const parts = [a.city || a.town || a.village, a.state, a.country].filter(Boolean);
    setLocationName(parts.length > 0 ? parts.join(", ") : s.display_name);
    setSearchQuery(s.display_name.split(",")[0]);
    setSuggestions([]);
  };

  const handleGenerateForMyself = () => {
    if (!userData) { toast.error("Please complete your profile first."); return; }
    setName(userData.name || ""); setDob(userData.date_of_birth || ""); setTob(userData.time_of_birth || "");
    setGender(userData.gender || "male"); setLat(userData.latitude?.toString() || ""); setLng(userData.longitude?.toString() || "");
    setLocationName(`${userData.city || ""}, ${userData.state || ""}, ${userData.country || ""}`);
    if (userData.longitude) setTimezone((Math.round((Number(userData.longitude) / 15) * 2) / 2).toString());
    toast.success("Profile data synchronized.");
  };

  const availableCredits = (userData?.tokens_total || 0) - (userData?.tokens_used || 0);
  const normalizedPlans = userPlans.map((p, i) => ({ ...p, token_cost: p.token_cost > 0 ? p.token_cost : ([20, 50, 150][i] || 50) }));
  const selectedPlan = normalizedPlans.find((p) => p.id === selectedPlanId);
  const canAfford = selectedPlan ? availableCredits >= selectedPlan.token_cost : false;
  const formValid = !!(name && dob && tob && lat && lng && selectedPlanId);

  const handleInitialSubmit = () => {
    if (!formValid) { toast.error("Please fill in all the required birth details."); return; }
    if (!canAfford) { setShowPurchaseModal(true); return; }
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);
    setIsLoading(true); setFinalized(false);
    
    // Check cache
    const kundliCheck = await checkKundliExists(dob, tob, Number(lat), Number(lng));
    const isNew = !kundliCheck.exists; setIsNewKundli(isNew);
    if (!isNew) toast.info("Celestial data for this person is already processed. Checking credit flow.");

    // Initialize report, deducting token and creating 'processing' report row
    const initRes = await initializeUserKundliGeneration({
      name, dob, tob, lat: Number(lat), lng: Number(lng), gender, locationName, planId: selectedPlanId!, isNewKundli: isNew
    });

    if (!initRes.success || !initRes.reportId) {
      toast.error(initRes.error || "Failed to initialize pipeline");
      setIsLoading(false);
      return;
    }

    setReportId(initRes.reportId);
    
    const socketRoomId = `user_room_${initRes.reportId}`; // Link room id to report id
    setBirthDetails({ username: name, dob: new Date(dob), tob, pob: locationName, latitude: Number(lat), longitude: Number(lng), timezone: Number(timezone), language: language as "en" | "hi" });
    resetPipeline();
    setJyotishamData("socketRoom", socketRoomId as any);
    setJyotishamData("planId", selectedPlanId as any);
    setGenerationStatus("pipeline"); setIsLoading(false);
  };

  useEffect(() => {
    if (generationStatus !== "pipeline" || finalized) return;
    const done = !pipelineRunning && pipelineProgress.total > 0 && pipelineProgress.completed >= pipelineProgress.total;
    // We removed the prediction status check here since UserOrchestrator handles standard success status locally.
    // Instead we just rely on `done` flag indicating the orchestrator finished pipeline Phase 2 execution.
    if (done) {
      setFinalized(true);
      // Wait, pipeline handles finalize DB pushing itself.
      // So here we do nothing. The component `PremiumPipelineUI` has `onComplete` prop to route.
    }
  }, [generationStatus, finalized, pipelineRunning, pipelineProgress]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050A0A] text-slate-900 dark:text-white selection:bg-emerald-500/30 font-sans relative overflow-x-hidden transition-colors duration-500">
      <SocketInitializer />
      
      {/* ═══ PREMIUM BACKGROUND DECORATION ═══ */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
        {/* Wandering Neon Particles overlay */}
        <div className="absolute inset-0 opacity-30 dark:opacity-100 transition-opacity duration-1000">
          <WanderingParticles />
        </div>
      </div>

      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-white/5 backdrop-blur-2xl bg-white/40 dark:bg-black/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group pointer-events-auto">
            <motion.div
              whileHover={{ scale: 1.15, y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative flex items-center justify-center p-1"
            >
              <Image
                src="/logo.svg"
                alt="Urekha Logo"
                width={140}
                height={40}
                className="h-7 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                priority
              />
            </motion.div>
            <span className="relative text-xl font-bold tracking-[0.02em] text-[#111111] dark:text-white uppercase mt-0.5 cursor-pointer select-none -ml-1">
              UREKHA
            </span>
          </Link>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-4 bg-slate-900/10 dark:bg-white/5 border border-slate-900/20 dark:border-white/10 rounded-xl px-4 py-2">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] text-slate-800 dark:text-white/40 uppercase tracking-widest font-bold">Total Credits</span>
                   <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{availableCredits} CR</span>
                </div>
                <div className="w-px h-8 bg-slate-900/20 dark:bg-white/10" />
                <Gem className="w-5 h-5 text-emerald-500" />
             </div>

             <button
               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
               className="w-10 h-10 rounded-xl bg-slate-900/10 dark:bg-white/5 border border-slate-900/20 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-900/20 dark:hover:bg-white/10 shadow-sm"
             >
               {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
             </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {generationStatus === "idle" ? (
            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
              
              {/* TOP: Context & Title */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 mb-10 w-full"
              >
                
                
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                  Create Your{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">Premium Kundli</span>
                </h1>
                
                <p className="text-slate-600 dark:text-white/50 text-sm md:text-base font-bold leading-relaxed max-w-lg mx-auto">
                  Enter your birth details below to generate a detailed astrological profile and future predictions.
                </p>
              </motion.div>

              {/* BOTTOM: The Form Interface */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 backdrop-blur-3xl p-6 md:p-10 shadow-2xl relative group overflow-visible">
                  
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                          <User size={18} className="text-emerald-600 dark:text-emerald-400" />
                       </div>
                       <span className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">Birth Details</span>
                    </div>

                    <button 
                      onClick={handleGenerateForMyself}
                      className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/5 dark:bg-white/10 hover:bg-emerald-500/10 dark:hover:bg-white/20 border border-slate-900/10 dark:border-white/5 transition-all active:scale-95 shadow-sm"
                    >
                      <Sparkles size={16} className="text-emerald-700 dark:text-emerald-400" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-white/80 group-hover:text-emerald-700 dark:group-hover:text-white">Use My Profile</span>
                    </button>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                       <label className="text-[11px] text-slate-900 dark:text-white/40 uppercase tracking-widest ml-1 font-black">Full Name</label>
                       <div className="relative group/field">
                          <input 
                            type="text" 
                            required 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Enter person's name" 
                            className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-5 py-4 text-base focus:outline-none focus:border-emerald-500/50 focus:bg-white dark:focus:bg-white/[0.08] transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/40 font-medium"
                          />
                          <User className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30 group-focus-within/field:text-emerald-500/50 transition-colors" />
                       </div>
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-2">
                       <label className="text-[11px] text-slate-900 dark:text-white/40 uppercase tracking-widest ml-1 font-black">Gender</label>
                       <div className="grid grid-cols-2 gap-3">
                          {["male", "female"].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setGender(g as "male" | "female")}
                              className={cn(
                                "py-4 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all",
                                gender === g 
                                  ? "bg-emerald-600 text-white dark:text-black border-emerald-600 shadow-lg shadow-emerald-500/20" 
                                  : "bg-slate-900/10 dark:bg-white/5 border-slate-300 dark:border-white/5 text-slate-600 dark:text-white/40 hover:bg-slate-900/20 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                              )}
                            >
                              {g}
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* DOB */}
                    <div className="space-y-2">
                       <label className="text-[11px] text-slate-900 dark:text-white/40 uppercase tracking-widest ml-1 font-black">Birth Date</label>
                       <div className="relative group/field">
                         <input 
                           type="date" 
                           required 
                           value={dob} 
                           onChange={(e) => setDob(e.target.value)} 
                           className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                         />
                         <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20 pointer-events-none" />
                       </div>
                    </div>

                    {/* TOB */}
                    <div className="space-y-2">
                       <label className="text-[11px] text-slate-900 dark:text-white/40 uppercase tracking-widest ml-1 font-black">Birth Time (24h)</label>
                       <div className="relative group/field">
                         <input 
                           type="text" 
                           required 
                           value={tob} 
                           placeholder="HH:MM"
                           onChange={(e) => {
                             let val = e.target.value.replace(/[^0-9:]/g, "");
                             if (val.length === 2 && !val.includes(":")) val += ":";
                             if (val.length > 5) val = val.substring(0, 5);
                             setTob(val);
                           }} 
                           onBlur={(e) => {
                             const val = e.target.value;
                             const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                             if (val && !regex.test(val)) {
                               setTob("");
                               toast.error("Invalid time format", { description: "Use HH:MM (00:00 - 23:59)" });
                             }
                           }}
                           className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold font-mono placeholder:text-slate-400 dark:placeholder:text-white/20"
                         />
                         <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20 pointer-events-none" />
                       </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[11px] text-slate-900 dark:text-white/40 uppercase tracking-widest ml-1 font-black">Birth Location</label>
                       <div className="relative group/field">
                          <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={handleSearchChange} 
                            placeholder="Enter city or town name" 
                            className="w-full bg-slate-900/5 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-5 py-4 text-base focus:outline-none focus:border-emerald-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/40 font-medium" 
                          />
                          {isSearching ? <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" /> : <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />}
                          
                          <AnimatePresence>
                            {suggestions.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute z-50 left-0 right-0 top-full mt-3 bg-white dark:bg-[#0B1221]/95 backdrop-blur-2xl border border-slate-300 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-emerald-500/10"
                              >
                                {suggestions.map((s, i) => (
                                  <button key={i} type="button" onClick={() => handleSelectLocation(s)}
                                    className="w-full text-left px-5 py-4 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0 flex items-center gap-4 text-xs group"
                                  >
                                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                                    <span className="text-slate-700 dark:text-white/70 group-hover:text-slate-900 dark:group-hover:text-white truncate font-bold">{s.display_name}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                    </div>

                    {/* Editable Coordinates Display */}
                    <div className="md:col-span-2 space-y-3 mt-2">
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-slate-900/5 dark:bg-black/40 border border-slate-300 dark:border-white/10 focus-within:border-emerald-500/50 transition-colors">
                            <label className="text-[9px] text-slate-600 dark:text-white/30 uppercase tracking-widest font-black">Latitude</label>
                            <input 
                              type="text"
                              value={lat}
                              onChange={(e) => setLat(e.target.value)}
                              placeholder="Required"
                              className="bg-transparent border-none outline-none text-sm font-bold text-emerald-700 dark:text-emerald-400 placeholder:text-slate-400 dark:placeholder:text-white/20 w-full"
                            />
                         </div>
                         <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-slate-900/5 dark:bg-black/40 border border-slate-300 dark:border-white/10 focus-within:border-emerald-500/50 transition-colors">
                            <label className="text-[9px] text-slate-600 dark:text-white/30 uppercase tracking-widest font-black">Longitude</label>
                            <input 
                              type="text"
                              value={lng}
                              onChange={(e) => setLng(e.target.value)}
                              placeholder="Required"
                              className="bg-transparent border-none outline-none text-sm font-bold text-emerald-700 dark:text-emerald-400 placeholder:text-slate-400 dark:placeholder:text-white/20 w-full"
                            />
                         </div>
                       </div>
                       <p className="text-[11px] font-medium text-slate-700 dark:text-white/40 leading-relaxed">
                         Note: If you believe the auto-detected coordinates are inaccurate, you can edit them manually below. Ensure precision for the best astrological calculation.
                       </p>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-2 md:col-span-2 mt-4">
                       <label className="text-[11px] text-slate-900 dark:text-white/40 uppercase tracking-widest ml-1 font-black">Report Language</label>
                       <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "en", label: "English" },
                            { id: "hi", label: "हिंदी" }
                          ].map((lang) => (
                            <button
                              key={lang.id}
                              type="button"
                              onClick={() => setLanguage(lang.id)}
                              className={cn(
                                "py-4 rounded-xl text-[12px] font-black uppercase tracking-widest border transition-all",
                                language === lang.id 
                                  ? "bg-emerald-600 text-white dark:text-black border-emerald-600 shadow-lg shadow-emerald-500/20" 
                                  : "bg-slate-900/10 dark:bg-white/5 border-slate-300 dark:border-white/5 text-slate-600 dark:text-white/40 hover:bg-slate-900/20 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                              )}
                            >
                              {lang.label}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="mt-12 pt-8 border-t border-slate-300 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
                          <Zap size={16} className="text-amber-700 dark:text-amber-400" />
                       </div>
                       <span className="text-sm font-bold tracking-tight uppercase text-slate-900 dark:text-white/90">Choose Your Report Type</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {normalizedPlans.map((plan, i) => {
                        const themeObj = PLAN_THEMES[i % PLAN_THEMES.length];
                        const Icon = themeObj.icon;
                        const isSelected = selectedPlanId === plan.id;

                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlanId(plan.id)}
                            className={cn(
                              "relative flex flex-col p-6 rounded-2xl border transition-all duration-500 overflow-hidden group text-left",
                              isSelected 
                                ? `${themeObj.borderColor} bg-slate-50 dark:bg-black/40 ${themeObj.glow} ring-1 ring-inset ring-slate-900/5 dark:ring-white/10 shadow-2xl scale-[1.02]` 
                                : "bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                            )}
                          >
                            <div className="absolute top-0 right-0 p-3 opacity-40 dark:opacity-20 group-hover:opacity-100 transition-opacity">
                               <span className="text-[8px] font-black tracking-widest text-slate-900 dark:text-white uppercase px-2 py-1 rounded-full border border-slate-200 dark:border-white/10">{themeObj.label}</span>
                            </div>

                            {isSelected && (
                              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                            )}

                            <div className="relative w-12 h-12 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <Icon className={cn("w-5 h-5 transition-all", isSelected ? themeObj.activeColor : "text-slate-500 dark:text-white/40")} />
                            </div>
                            
                            <div className="space-y-1.5 mb-8">
                              <span className={cn("text-[13px] uppercase tracking-widest block font-black", isSelected ? themeObj.activeColor : "text-slate-700 dark:text-white/80")}>{plan.name}</span>
                              <span className="text-[10px] leading-relaxed text-slate-500 dark:text-white/40 font-semibold line-clamp-3 pr-2">{plan.description || "System architecture calculation node."}</span>
                            </div>

                            <div className="mt-auto flex items-end justify-between w-full pt-4 border-t border-slate-200 dark:border-white/5">
                               <div className="flex flex-col">
                                  <span className="text-[8px] text-slate-500 dark:text-white/30 uppercase tracking-widest font-black mb-0.5">Execution Cost</span>
                                  <div className="flex items-baseline gap-1">
                                    <span className={cn("text-2xl font-black leading-none tracking-tight", isSelected ? themeObj.activeColor : "text-slate-700 dark:text-white/70")}>{plan.token_cost || 0}</span>
                                    <span className="text-[9px] uppercase font-black text-slate-500 dark:text-white/30">CR</span>
                                  </div>
                               </div>
                               <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-all", isSelected ? `bg-emerald-500/10 dark:bg-emerald-500/20 ${themeObj.activeColor}` : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/20")}>
                                  <ChevronRight size={14} className={cn("transition-transform group-hover:translate-x-0.5", isSelected && "font-black")} />
                               </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Area */}
                  <div className="mt-12 space-y-4">
                    <AnimatePresence>
                      {!canAfford && selectedPlanId && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="p-4 bg-red-500/10 dark:bg-red-500/10 border border-red-500/40 dark:border-red-500/30 rounded-2xl flex items-center gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-red-500/20 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                             <AlertCircle className="text-red-700 dark:text-red-500" size={20} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black uppercase tracking-widest text-red-700 dark:text-red-400">Insufficient Credits</span>
                             <span className="text-xs text-slate-800 dark:text-white/50 font-bold">This plan requires {selectedPlan?.token_cost} credits. Please check your balance.</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="button"
                      onClick={handleInitialSubmit}
                      disabled={isLoading || !formValid}
                      className={cn(
                        "w-full py-6 rounded-2xl text-[14px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all relative overflow-hidden group/btn",
                        (!formValid)
                          ? "bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-white/10 cursor-not-allowed border border-slate-300 dark:border-white/5"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                      
                      {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Generating Your Kundli...</>
                      ) : (
                        <><Zap className="w-5 h-5 fill-current" /> Generate My Kundli</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div key="pipeline" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto"
            >
              <div className="relative pt-8">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-emerald-500 to-transparent" />
                 <PremiumPipelineUI
                  args={{
                    date: dob,
                    time: tob,
                    latitude: Number(lat),
                    longitude: Number(lng),
                    tz: Number(timezone),
                    lang: language as "en" | "hi",
                    planId: selectedPlanId || undefined,
                    planTokenCost: selectedPlan?.token_cost || 0,
                    reportId: reportId as string,
                    socketRoom: `user_room_${reportId}`
                  }}
                  onComplete={() => { toast.success("Calculation complete."); router.push(`/user-report/${reportId}`); }}
                  onCancel={() => setGenerationStatus("idle")}
                 />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- CONFIRMATION MODAL --- */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-[#0B1221] w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-white/10 relative"
              >
                <div className="absolute top-4 right-4 cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition" onClick={() => setShowConfirmModal(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </div>
                <div className="w-14 h-14 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">Confirm Generation</h3>
                <p className="text-sm font-medium text-slate-600 dark:text-white/60 mb-8 leading-relaxed">
                  Generating this Premium Kundli report will securely process your birth details. It requires <strong>{selectedPlan?.token_cost} credits</strong> from your balance. 
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 rounded-xl font-bold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    Cancel
                  </button>
                  <button onClick={handleConfirmedSubmit} className="flex-1 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition">
                    Proceed
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- INSUFFICIENT CREDITS MODAL --- */}
        <AnimatePresence>
          {showPurchaseModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-[#0B1221] w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-red-500/20 dark:border-red-500/20 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                <div className="absolute top-4 right-4 cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition" onClick={() => setShowPurchaseModal(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </div>
                <div className="w-14 h-14 bg-red-500/10 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-white tracking-tight">Insufficient Credits</h3>
                <p className="text-sm font-medium text-slate-600 dark:text-white/60 mb-8 leading-relaxed">
                  You need <strong>{selectedPlan?.token_cost} credits</strong> to generate this report, but you only have {availableCredits} available. Purchase more credits to continue unraveling your destiny.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/rates" className="w-full">
                    <button className="w-full py-3.5 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg hover:shadow-xl transition-all">
                      Purchase Credits
                    </button>
                  </Link>
                  <button onClick={() => setShowPurchaseModal(false)} className="w-full py-3 rounded-xl font-bold text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition">
                    Maybe Later
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default function GenerateKundliClient(props: GenerateKundliClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-[#050A0A] flex items-center justify-center">
         <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse">
               <Loader2 className="text-emerald-500 animate-spin [animation-duration:3s]" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.4em] text-slate-400 dark:text-white/30 uppercase animate-pulse">Opening Engine...</span>
         </div>
      </div>
    }>
      <GenerateKundliContent {...props} />
    </Suspense>
  );
}