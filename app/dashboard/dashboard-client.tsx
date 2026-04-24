"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Image from "next/image";
import { AgentNavbar } from "@/components/agent/AgentNavbar";
import { AstrologyBackground } from "@/components/admin/AstrologyBackground";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  Lock,
  Check,
  LayoutDashboard,
  FileText,
  Settings,
  Bot,
  LogOut,
  Phone,
  Mail,
  Hash,
  Wallet,
  TrendingUp,
  Building,
  CalendarDays,
  Download,
  Plus,
  X,
  Loader2,
  TriangleAlert,
  History,
  Search,
  Menu,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { generateReport, updateAgentProfile } from "./actions";
import {
  checkKundliExists,
  finalizeKundliGeneration,
} from "@/app/actions/kundli-actions";
import { requestTokens, cancelTokenRequest } from "@/app/actions/token-actions";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import EmbeddedPipeline from "@/components/pipeline/EmbeddedPipeline";
import SocketInitializer from "@/components/socket-initializer";
import { socket } from "@/lib/socketio/client";
import { API_BASE_URL } from "@/lib/config/api";
import { JYOTISHAM_MAPPINGS } from "@/lib/pipeline/constants";
import dynamic from "next/dynamic";
import type { Language } from "@/types/languages";
import { HistoryTab } from "@/components/agent/dashboard/HistoryTab";
import { ViewReportTab } from "@/components/agent/dashboard/ViewReportTab";
import { ReportsOverviewTab } from "@/components/agent/dashboard/ReportsOverviewTab";
import { GenerateTab } from "@/components/agent/dashboard/GenerateTab";

type PackageType = "basic" | "plus" | "pro" | "premium";

interface AgentDashboardProps {
  agentData: any;
  recentReports: any[];
  branchData: any;
  agentPlans: any[];
  tokenRequests: any[];
}

export default function AgentDashboardClient({
  agentData,
  recentReports,
  branchData,
  agentPlans,
  tokenRequests,
}: AgentDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Deterministic formatting helpers to prevent hydration mismatches
  const formatDeterministicTime = (date: Date | string | number) => {
    const d = new Date(date);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const hh = h.toString().padStart(2, "0");
    return `${hh}:${m} ${ampm}`;
  };

  const formatDeterministicDate = (date: Date | string | number) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const tabParam = searchParams.get("tab") as
    | "generate"
    | "reports"
    | "history"
    | "view_report"
    | null;
  const activeTab = tabParam || "reports";
  
  const reportIdParam = searchParams.get("report_id");

  const setActiveTab = (tab: "generate" | "reports" | "history" | "view_report", reportId?: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    
    if (reportId) {
      params.set("report_id", String(reportId));
    } else {
      // Correctly clear report_id when no ID is provided, enabling the "Back to Selection" flow
      params.delete("report_id");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const [selectedReportId, setSelectedReportId] = useState<number | string | null>(reportIdParam);

  // Sync state with URL
  useEffect(() => {
    setSelectedReportId(reportIdParam);
  }, [reportIdParam]);
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "pipeline" | "viewing"
  >("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { setBirthDetails, resetPipeline } = useStore();

  // Token deduction & kundli dedup state
  const [isNewKundli, setIsNewKundli] = useState(true);
  const [finalized, setFinalized] = useState(false);
  const [saveReportState, setSaveReportState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveRetryCount, setSaveRetryCount] = useState<number>(0);
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);

  // Pipeline completion tracking for auto-finalization
  const pipelineRunning = useStore((s) => s.pipelineRunning);
  const pipelineProgress = useStore((s) => s.pipelineProgress);
  const predictions = useStore((s) => s.jyotishamData.predictions);

  // User Details
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");

  // Computed Age
  const [ageString, setAgeString] = useState("");

  // Location
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locationName, setLocationName] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Package
  const [selectedPackage, setSelectedPackage] = useState<PackageType | "">("");
  const [language, setLanguage] = useState<Language>("en");
  const [paperQuality, setPaperQuality] = useState<"regular" | "premium">(
    "regular",
  );

  // Live Time
  const [liveTime, setLiveTime] = useState<Date | null>(null);

  // Modal States
  const [isAddTokensModalOpen, setIsAddTokensModalOpen] = useState(false);
  const [selectedTokenAmount, setSelectedTokenAmount] = useState<number | null>(
    null,
  );
  const [isRequestingTokens, setIsRequestingTokens] = useState(false);
  const [tokenRequestSuccess, setTokenRequestSuccess] = useState(false);

  // Profile Edit State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(agentData?.name || "");
  const [editPhone, setEditPhone] = useState(agentData?.phone || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Sync edit state when agentData changes
  useEffect(() => {
    if (agentData) {
      setEditName(agentData.name || "");
      setEditPhone(agentData.phone || "");
    }
  }, [agentData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const res = await updateAgentProfile(editName, editPhone);
    setIsUpdatingProfile(false);
    
    if (res.success) {
      toast.success("Success", { description: res.message });
      setIsEditProfileModalOpen(false);
      router.refresh();
    } else {
      toast.error("Error", { description: res.message });
    }
  };

  // Pending request derived from server state
  const serverPendingRequest = tokenRequests?.find(
    (tx) => tx.status === "pending",
  );
  const [pendingTokenRequest, setPendingTokenRequest] = useState<number | null>(
    serverPendingRequest ? serverPendingRequest.amount : null,
  );

  // Cancel Request Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Credit History Modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Location Search
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      toast.error("Location search failed", {
        description: "Could not retrieve address suggestions from the server.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      searchLocation(value);
    }, 800);
  };

  const handleSelectLocation = (s: any) => {
    setLat(s.lat);
    setLng(s.lon);

    const city =
      s.address?.city ||
      s.address?.town ||
      s.address?.village ||
      s.address?.county ||
      "";
    const state = s.address?.state || "";
    const country = s.address?.country || "";
    const parts = [city, state, country].filter(Boolean);

    setLocationName(parts.length > 0 ? parts.join(", ") : s.display_name);
    setSearchQuery(s.display_name.split(",")[0]);
    setSuggestions([]);
  };

  const handleCancelRequest = async () => {
    const result = await cancelTokenRequest();
    if (result.success) {
      setPendingTokenRequest(null);
      setIsCancelModalOpen(false);
      toast.success("Request Cancelled", { description: "Your pending token request has been cancelled." });
      router.refresh();
    } else {
      toast.error("Failed to Cancel", { description: result.error || "Something went wrong." });
      setIsCancelModalOpen(false);
    }
  };

  useEffect(() => {
    setLiveTime(new Date());
    const interval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Age Calculation Effect
  useEffect(() => {
    if (!dob) {
      setAgeString("");
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setAgeString(`${years} Years, ${months} Months, ${days} Days`);
  }, [dob]);

  // Auto-Fetch Location Name when Lat/Lng changes
  useEffect(() => {
    const fetchLocationName = async () => {
      if (!lat || !lng) {
        setLocationName("");
        return;
      }

      // Simple debounce to avoid spamming API on every keystroke
      const timer = setTimeout(async () => {
        setIsFetchingLocation(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          const data = await response.json();
          if (data && data.display_name) {
            // Extract a cleaner name (City, State, Country)
            const address = data.address || {};
            const city =
              address.city || address.town || address.village || address.hamlet;
            const state = address.state || address.region;
            const country = address.country;

            const parts = [city, state, country].filter(Boolean);
            setLocationName(
              parts.length > 0 ? parts.join(", ") : data.display_name,
            );
          } else {
            setLocationName("Location not found");
          }
        } catch (error) {
          toast.error("Reverse geocoding failed", {
            description: "Could not determine the location name from coordinates.",
          });
          setLocationName("Error fetching location");
        } finally {
          setIsFetchingLocation(false);
        }
      }, 800);

      return () => clearTimeout(timer);
    };

    fetchLocationName();
  }, [lat, lng]);

  const handleOpenMap = () => {
    const url =
      lat && lng
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        : "https://www.google.com/maps";
    window.open(url, "_blank");
  };

  const handleRequestTokens = async () => {
    if (!selectedTokenAmount) return;
    setIsRequestingTokens(true);
    const res = await requestTokens(
      selectedTokenAmount,
      "Requested from agent dashboard",
    );
    setIsRequestingTokens(false);

    if (res.success) {
      setTokenRequestSuccess(true);
      setPendingTokenRequest(selectedTokenAmount);
    } else {
      toast.error(`Request Failed`, { description: res.error });
    }
  };

  const closeTokenModal = () => {
    setIsAddTokensModalOpen(false);
    setTimeout(() => {
      setSelectedTokenAmount(null);
      setTokenRequestSuccess(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check tokens against the selected plan's actual cost
    const selectedPlan = agentPlans.find(
      (p: any) => String(p.id) === String(selectedPackage),
    );
    const tokenCost = selectedPlan?.token_cost || 0;
    const available =
      (agentData?.tokens_total || 0) - (agentData?.tokens_used || 0);

    if (available < tokenCost) {
      toast.error("Insufficient credits", {
        description: `You need at least ${tokenCost.toLocaleString()} credits for the ${selectedPlan?.name || "selected"} plan. You have ${available.toLocaleString()} available.`,
      });
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleConfirmGenerate = async () => {
    setIsConfirmModalOpen(false);
    setIsLoading(true);
    setFinalized(false);

    // 1. Check if this kundli already exists (global deduplication)
    const kundliCheck = await checkKundliExists(
      dob,
      tob,
      Number(lat),
      Number(lng),
    );
    const isNew = !kundliCheck.exists;
    setIsNewKundli(isNew);

    // 2. If new kundli, validate token sufficiency server-side
    if (isNew) {
      const formData = new FormData();
      formData.append("plan", selectedPackage || "");
      const result = await generateReport(formData);
      if (!result || !result.success) {
        toast.error("Action Failed", { description: result?.message || "Unknown server error" });
        setIsLoading(false);
        return;
      }
    } else {
      toast.info("Cached Kundli Detected", {
        description:
          "This birth chart already exists in the database. No tokens will be deducted.",
        duration: 5000,
      });
    }

    // 3. Start pipeline
    toast.success("Generation Initiated", {
      description: "Connecting to the celestial pipeline.",
    });

    const derivedTz = lat && lng ? Math.round((Number(lng) / 15) * 2) / 2 : 5.5;

    const details = {
      username: name,
      dob: new Date(dob),
      tob: tob || "12:00",
      pob: locationName || "Unknown Location",
      latitude: Number(lat),
      longitude: Number(lng),
      timezone: derivedTz,
      language: language,
    };

    setBirthDetails(details);
    resetPipeline();

    const store = useStore.getState();
    const socketRoomId = `room_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    store.setJyotishamData("socketRoom", socketRoomId as any);
    store.setJyotishamData("planId", (selectedPackage || null) as any);

    // SPA Flow: Mount the pipeline natively
    setGenerationStatus("pipeline");
  };

  const initiateReportSave = useCallback(async (existingId?: string) => {
    const report_id = existingId || crypto.randomUUID();
    if (!existingId) setGeneratedReportId(report_id);
    
    setSaveReportState("saving");
    const currentSocketRoom = useStore.getState().jyotishamData.socketRoom;

    // 1. Format date (DD/MM/YYYY) and prepare final birth details to match backend identity fields
    const [year, month, day] = dob.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    const finalBirthDetails = {
      username: name,
      date: formattedDate,
      time: tob || "12:00",
      latitude: Number(lat),
      longitude: Number(lng),
      tz: lat && lng ? Math.round((Number(lng) / 15) * 2) / 2 : 5.5,
      lang: language,
      room: currentSocketRoom,
    };

    // 2. Gather all shortcuts for the backend to pull from Redis
    const predictionKeys = Object.keys(predictions || {});
    const shortcuts = {
      jyotisham: JYOTISHAM_MAPPINGS.map((m) => m.slug),
      predictions: predictionKeys,
    };

    // 2. Setup listener
    const onReportSaved = async (data: any) => {
      if (data.report_id !== report_id) return;
      socket.off("savedreportdata", onReportSaved);

      // 3. Backend Success -> Now finalize Supabase (tokens + records)
      const result = await finalizeKundliGeneration({
        name,
        dob,
        tob,
        lat: Number(lat),
        lng: Number(lng),
        gender,
        locationName,
        planId: Number(selectedPackage),
        isNewKundli,
        paperQuality: paperQuality,
        report_id: report_id,
      });

      if (result.success) {
        setSaveReportState("success");
        if (result.tokensDeducted > 0) {
          toast.success("Kundli Generated Successfully");
        }
      } else {
        setSaveReportState("error");
        toast.error("Supabase Finalization Failed", { description: result.error });
      }
    };

    socket.on("savedreportdata", onReportSaved);

    // 4. Trigger the backend save process
    try {
      const response = await fetch(`${API_BASE_URL}/savekundlidata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: finalBirthDetails,
          report_id,
          shortcuts,
          user_id: agentData.id, // Identify the agent who generated this
        }),
      });
      
      if (!response.ok) throw new Error("Backend save failed");
    } catch (err: any) {
      console.error(`[initiateReportSave] Error: ${err.message}`);
      socket.off("savedreportdata", onReportSaved);
      setSaveReportState("error");
      toast.error("Data aggregation failed", { description: "Click retry to try again." });
    }
  }, [
    name, dob, tob, lat, lng, language, predictions, 
    gender, locationName, selectedPackage, isNewKundli, paperQuality
  ]);

  // ── Auto-Finalize Trace: Detect when pipeline + all predictions are done ──
  useEffect(() => {
    if (generationStatus !== "pipeline") return;
    if (finalized) return;

    const isComplete =
      !pipelineRunning &&
      pipelineProgress.total > 0 &&
      pipelineProgress.completed >= pipelineProgress.total;

    const predictionKeys = Object.keys(predictions || {});
    const allPredictionsSuccessful =
      predictionKeys.length > 0 &&
      predictionKeys.every((key) => predictions[key]?.status === "success");

    if (isComplete && allPredictionsSuccessful) {
      setFinalized(true);
      setGenerationStatus("viewing"); // Change status to show the view result / retry screen
      initiateReportSave();
    }
  }, [
    generationStatus,
    finalized,
    pipelineRunning,
    pipelineProgress,
    predictions,
    initiateReportSave,
  ]);

  const resetGenerationForm = () => {
    setGenerationStatus("idle");
    setName("");
    setDob("");
    setTob("");
    setLat("");
    setLng("");
    setGender("");
    setLocationName("");
    setSearchQuery("");
    setSelectedPackage("");
    setLanguage("en");
    setPaperQuality("regular");
    setIsLoading(false);
    setIsNewKundli(true);
    setFinalized(false);
    setSaveReportState("idle");
    setSaveRetryCount(0);
    setGeneratedReportId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050A0A] text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      {/* Background Layer */}
      <AstrologyBackground />

      {/* Top Navbar */}
        <AgentNavbar agentData={agentData} />

        {/* Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-64 pt-24 border-r border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#020408]/80 backdrop-blur-md z-40 hidden md:flex flex-col transition-colors duration-500">
        

        <nav className="flex flex-col gap-2 flex-1 pt-4 px-4">
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl group border transition-all duration-300 ${
              activeTab === "reports"
                ? "border-primary text-primary dark:text-primary bg-transparent shadow-none"
                : "border-transparent text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <LayoutDashboard size={18} className={activeTab === "reports" ? "text-primary" : "text-slate-400 dark:text-zinc-500 group-hover:text-primary transition-colors"} />
            <span className="text-sm font-medium tracking-wide">Dashboard</span>
           {activeTab === "reports" && <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 rounded-full bg-primary" />}
</button>

          <button
            onClick={() => setActiveTab("generate")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl group border transition-all duration-300 ${
              activeTab === "generate"
                ? "border-primary text-primary dark:text-primary bg-transparent shadow-none"
                : "border-transparent text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <FileText size={18} className={activeTab === "generate" ? "text-primary" : "text-slate-400 dark:text-zinc-500 group-hover:text-primary transition-colors"} />
            <span className="text-sm font-medium tracking-wide">Generate Report</span>
           {activeTab === "generate" && <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 rounded-full bg-primary" />}
</button>


          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl group border transition-all duration-300 ${
              activeTab === "history"
                ? "border-primary text-primary dark:text-primary bg-transparent shadow-none"
                : "border-transparent text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <CalendarDays size={18} className={activeTab === "history" ? "text-primary" : "text-slate-400 dark:text-zinc-500 group-hover:text-primary transition-colors"} />
            <span className="text-sm font-medium tracking-wide">Report History</span>
           {activeTab === "history" && <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 rounded-full bg-primary" />}
          </button>

          <button
            onClick={() => setActiveTab("view_report")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl group border transition-all duration-300 ${
              activeTab === "view_report"
                ? "border-primary text-primary dark:text-primary bg-transparent shadow-none"
                : "border-transparent text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            <Eye size={18} className={activeTab === "view_report" ? "text-primary" : "text-slate-400 dark:text-zinc-500 group-hover:text-primary transition-colors"} />
            <span className="text-sm font-medium tracking-wide">View Report</span>
           {activeTab === "view_report" && <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 rounded-full bg-primary" />}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-md"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 pt-24 md:p-8 md:pt-28 relative pb-28 md:pb-8">
        <SocketInitializer />
        {activeTab === "generate" && (
          <GenerateTab
            agentData={agentData}
            agentPlans={agentPlans}
            name={name}
            setName={setName}
            dob={dob}
            setDob={setDob}
            tob={tob}
            setTob={setTob}
            gender={gender}
            setGender={setGender}
            ageString={ageString}
            lat={lat}
            setLat={setLat}
            lng={lng}
            setLng={setLng}
            locationName={locationName}
            isFetchingLocation={isFetchingLocation}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            isSearching={isSearching}
            suggestions={suggestions}
            handleSelectLocation={handleSelectLocation}
            handleOpenMap={handleOpenMap}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            language={language}
            setLanguage={setLanguage}
            paperQuality={paperQuality}
            setPaperQuality={setPaperQuality}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            isConfirmModalOpen={isConfirmModalOpen}
            setIsConfirmModalOpen={setIsConfirmModalOpen}
            handleSubmit={handleSubmit}
            handleConfirmGenerate={handleConfirmGenerate}
            generationStatus={generationStatus}
            setGenerationStatus={setGenerationStatus}
            resetGenerationForm={resetGenerationForm}
            saveReportState={saveReportState}
            saveRetryCount={saveRetryCount}
            setSaveRetryCount={setSaveRetryCount}
            initiateReportSave={initiateReportSave}
            generatedReportId={generatedReportId}
            setActiveTab={setActiveTab}
            setSelectedReportId={setSelectedReportId}
          />
        )}



        {activeTab === "reports" && (
          <ReportsOverviewTab
            agentData={agentData}
            recentReports={recentReports}
            branchData={branchData}
            tokenRequests={tokenRequests}
            setActiveTab={setActiveTab}
            formatDeterministicTime={formatDeterministicTime}
            formatDeterministicDate={formatDeterministicDate}
            setIsEditProfileModalOpen={setIsEditProfileModalOpen}
            isAddTokensModalOpen={isAddTokensModalOpen}
            setIsAddTokensModalOpen={setIsAddTokensModalOpen}
            selectedTokenAmount={selectedTokenAmount}
            setSelectedTokenAmount={setSelectedTokenAmount}
            isRequestingTokens={isRequestingTokens}
            tokenRequestSuccess={tokenRequestSuccess}
            handleRequestTokens={handleRequestTokens}
            closeTokenModal={closeTokenModal}
            pendingTokenRequest={pendingTokenRequest}
            isCancelModalOpen={isCancelModalOpen}
            setIsCancelModalOpen={setIsCancelModalOpen}
            handleCancelRequest={handleCancelRequest}
            isHistoryModalOpen={isHistoryModalOpen}
            setIsHistoryModalOpen={setIsHistoryModalOpen}
            setSelectedReportId={setSelectedReportId}
          />
        )}

        {/* --- REPORT HISTORY TAB --- */}
        {activeTab === "history" && (
          <HistoryTab
            recentReports={recentReports}
            setActiveTab={setActiveTab}
            setSelectedReportId={setSelectedReportId}
            formatDeterministicDate={formatDeterministicDate}
          />
        )}

        {/* --- VIEW REPORT OVERLAY/TAB --- */}
        {activeTab === "view_report" && (
          <ViewReportTab
            selectedReportId={selectedReportId as string}
            recentReports={recentReports}
            setActiveTab={setActiveTab}
            formatDeterministicDate={formatDeterministicDate}
            formatDeterministicTime={formatDeterministicTime}
          />
        )}

        {/* Edit Profile Modal */}
        {isEditProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsEditProfileModalOpen(false)}
              className="absolute inset-0 bg-[#050A0A]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0A1010] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary" />
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Update <span className="text-primary italic">Profile</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Modify account credentials</p>
                </div>
                <button 
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/40 ml-1">Full Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                      placeholder="Enter legal name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/40 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="flex-1 px-6 py-4 rounded-2xl bg-primary text-slate-900 font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#020408]/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50 px-6 py-3 pb-safe flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-colors">
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "reports"
              ? "text-amber-600 dark:text-primary scale-110"
              : "text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <LayoutDashboard
            size={20}
            className={
              activeTab === "reports"
                ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                : ""
            }
          />
          <span className="text-[10px] uppercase font-semibold tracking-wider">
            Dashboard
          </span>
        </button>

        <button
          onClick={() => setActiveTab("generate")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "generate"
              ? "text-amber-600 dark:text-primary scale-110"
              : "text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileText
            size={20}
            className={
              activeTab === "generate"
                ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                : ""
            }
          />
          <span className="text-[10px] uppercase font-semibold tracking-wider">
            Generate
          </span>
        </button>


        <button
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "history"
              ? "text-amber-600 dark:text-primary scale-110"
              : "text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <CalendarDays
            size={20}
            className={
              activeTab === "history"
                ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                : ""
            }
          />
          <span className="text-[10px] uppercase font-semibold tracking-wider">
            History
          </span>
        </button>
      </nav>
    </div>
  );
}
