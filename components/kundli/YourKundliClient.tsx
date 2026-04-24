"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  FileText,
  Sparkles,
  User,
  CalendarDays,
  Clock,
  MapPin,
  Globe,
  ChevronDown,
  CheckCircle2,
  ShieldAlert,
  Activity,
  LayoutGrid,
  Info,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { socket } from "@/lib/socketio/client";
import { API_BASE_URL } from "@/lib/config/api";

interface YourKundliClientProps {
  userData: any;
  userId?: string;
  hideNavbar?: boolean;
  autoGenerate?: boolean;
}

export default function YourKundliClient({
  userData,
  userId,
  hideNavbar = false,
  autoGenerate = false,
}: YourKundliClientProps) {
  const [language, setLanguage] = useState(userData?.language || "en");
  const [kundliData, setKundliData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Derive display language: Priority to kundliData if it exists, otherwise state language
  const displayLang =
    kundliData?.language === "hi" || kundliData?.language === "en"
      ? kundliData.language
      : language;

  const TRANSLATIONS: Record<string, any> = {
    en: {
      hero: "Your Report",
      subHero: "In-depth Vedic Astrological Overview",
      profileConfig: "Birth Details",
      fields: {
        name: "Full Name",
        dob: "Date of Birth",
        tob: "Time of Birth",
        pob: "Place of Birth",
        gender: "Gender",
        coordinates: "Location",
      },
      tabs: {
        overview: "Summary",
        horoscope: "Horoscope",
        planetary: "Planets",
        dasha: "Time Periods",
        dosha: "Faults",
      },
      status: {
        engine: "System Ready",
        data: "Data Verified",
        version: "Verified",
        idle: "Ready to Start",
        idleDesc: "Click the button below to start your life analysis.",
        loading: "Preparing your report...",
      },
      actions: {
        generate: "Create Report",
        cancel: "Cancel",
        execute: "Confirm",
      },
      modal: {
        initiate: "Create your report?",
        processing: "Generating...",
        lock: "Details ready",
        streams: "Analyzing your planetary data",
        descInit:
          "This will process your birth details to generate a personalized report covering all aspects of your life.",
        descProc:
          "We are preparing your personalized report. This might take a few moments.",
      },
    },
    hi: {
      hero: "आपकी रिपोर्ट",
      subHero: "आपके जीवन का विस्तृत वैदिक ज्योतिष विवरण",
      profileConfig: "जन्म विवरण",
      fields: {
        name: "पूर्ण नाम",
        dob: "जन्म तिथि",
        tob: "जन्म समय",
        pob: "जन्म स्थान",
        gender: "लिंग",
        coordinates: "स्थान",
      },
      tabs: {
        overview: "सारांश",
        horoscope: "राशिफल",
        planetary: "ग्रह स्थिति",
        dasha: "समय चक्र",
        dosha: "दोष",
      },
      status: {
        engine: "सिस्टम तैयार",
        data: "डेटा सत्यापित",
        version: "सत्यापित",
        idle: "शुरू करने के लिए तैयार",
        idleDesc: "अपनी रिपोर्ट देखने के लिए नीचे दिए गए बटन पर क्लिक करें।",
        loading: "रिपोर्ट तैयार हो रही है...",
      },
      actions: {
        generate: "रिपोर्ट बनाएँ",
        cancel: "रद्द करें",
        execute: "पुष्टि करें",
      },
      modal: {
        initiate: "रिपोर्ट तैयार करें?",
        processing: "बन रहा है...",
        lock: "विवरण तैयार",
        streams: "ग्रहीय डेटा का विश्लेषण",
        descInit:
          "यह आपके जन्म विवरण का उपयोग करके आपके जीवन के बारे में एक विस्तृत रिपोर्ट तैयार करेगा।",
        descProc:
          "आपकी रिपोर्ट तैयार की जा रही है। कृपया कुछ पल प्रतीक्षा करें।",
      },
    },
  };

  const t = TRANSLATIONS[displayLang] || TRANSLATIONS["en"];

  useEffect(() => {
    const fetchKundli = async () => {
      try {
        if (!userId) {
          setIsFetching(false);
          return;
        }
        const res = await fetch(`${API_BASE_URL}/getkundli/${userId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setKundliData(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch generated Kundli", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchKundli();
  }, [userId]);

  // Auto-generate if requested and data not already present
  useEffect(() => {
    if (autoGenerate && !isFetching && !kundliData && !isGenerating && userId) {
      handleGenerateConfirm();
    }
  }, [autoGenerate, isFetching, kundliData, isGenerating, userId]);

  const handleGenerateConfirm = async () => {
    if (!userId) return;

    setIsGenerating(true);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_summary", { room_id: userId });

    socket.on(`/summary/${userId}`, (response: any) => {
      setIsGenerating(false);
      setShowConfirmation(false);

      if (response.success) {
        console.log("Here is the massive astrological summary!", response.data);
        setKundliData(response.data);
        socket.emit("ack_summary", { room_id: userId });
        socket.off(`/summary/${userId}`);
      } else {
        console.error("The worker failed:", response.error);
        alert(
          response.error ||
            "Something went wrong while preparing your report. Please try again.",
        );
        socket.off(`/summary/${userId}`);
      }
    });

    try {
      const payload = {
        name: String(userData.name || ""),
        date_of_birth: String(userData.date_of_birth || ""),
        time_of_birth: String(userData.time_of_birth || "").slice(0, 5),
        latitude: String(userData.latitude || ""),
        longitude: String(userData.longitude || ""),
        timezone: String(userData.timezone || ""),
        language: String(language),
      };

      const res = await fetch(`${API_BASE_URL}/summary/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: payload }),
      });

      const queueResponse = await res.json();
      if (!queueResponse.success) {
        setIsGenerating(false);
        setShowConfirmation(false);
        alert(queueResponse.error || "Failed to start the analysis.");
        socket.off(`/summary/${userId}`);
      }
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      setShowConfirmation(false);
      alert("Network error: Could not reach the analysis service.");
      socket.off(`/summary/${userId}`);
    }
  };

  // ── Helpers ──
  const safeGetYear = (dateStr: any) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : date.getFullYear();
  };

  const safeFormatDate = (dateStr: any) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString(displayLang === "hi" ? "hi-IN" : "en-GB");
  };

  const formatDob = (dob: string) =>
    dob
      ? new Date(dob).toLocaleDateString(
          displayLang === "hi" ? "hi-IN" : "en-GB",
          { day: "numeric", month: "long", year: "numeric" },
        )
      : "Not provided";

  const locationDisplay =
    [userData?.city, userData?.state, userData?.country]
      .filter(Boolean)
      .join(", ") || "Not provided";

  const DETAIL_FIELDS = [
    {
      label: t.fields.name,
      value: userData?.name || "Anonymous User",
      icon: User,
    },
    {
      label: t.fields.dob,
      value: formatDob(userData?.date_of_birth),
      icon: CalendarDays,
    },
    {
      label: t.fields.tob,
      value: userData?.time_of_birth || "Not provided",
      icon: Clock,
    },
    { label: t.fields.pob, value: locationDisplay, icon: MapPin },
    {
      label: t.fields.gender,
      value: userData?.gender || "Not provided",
      icon: Star,
    },
    {
      label: t.fields.coordinates,
      value:
        userData?.latitude && userData?.longitude
          ? `${Number(userData.latitude).toFixed(4)}°, ${Number(userData.longitude).toFixed(4)}°`
          : "Not set",
      icon: Globe,
    },
  ];

  const isProfileComplete = Boolean(
    userData?.date_of_birth &&
    userData?.time_of_birth &&
    userData?.latitude &&
    userData?.longitude,
  );

  // ── Tab Renderers ──
  const renderOverview = () => {
    const report = kundliData.summary_report;
    if (!report)
      return <div className="text-zinc-500 italic">No summary generated.</div>;

    // Helper for inner-text markdown (bolding)
    const formatRichText = (text: string) => {
      if (!text.includes("**")) return text;
      const parts = text.split("**");
      return parts.map((p, idx) =>
        idx % 2 === 1 ? (
          <strong key={idx} className="text-[#7e56da] font-bold">
            {p}
          </strong>
        ) : (
          p
        ),
      );
    };

    const OverviewContent = () => {
      // Support for the new structured block format
      if (typeof report === "object" && Array.isArray(report.blocks)) {
        return (
          <div className="space-y-8 pr-4">
            {report.blocks.map((block: any, idx: number) => {
              if (block.type === "heading") {
                return (
                  <h3
                    key={idx}
                    className="text-2xl font-bold text-white mt-10 mb-6 flex items-center gap-3"
                  >
                    <div className="w-1.5 h-6 bg-[#7e56da] rounded-full shadow-[0_0_15px_#7e56da]" />
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "paragraph") {
                return (
                  <p
                    key={idx}
                    className="text-lg text-zinc-300 leading-relaxed font-sans subpixel-antialiased"
                  >
                    {formatRichText(block.text)}
                  </p>
                );
              }
              if (block.type === "closing") {
                return (
                  <div
                    key={idx}
                    className="mt-12 p-8 bg-[#7e56da]/5 border border-[#7e56da]/20 rounded-[2rem] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sparkles size={48} className="text-[#7e56da]" />
                    </div>
                    <p className="text-zinc-200 italic leading-relaxed relative z-10">
                      {formatRichText(block.text)}
                    </p>
                  </div>
                );
              }
              return null;
            })}

            {Array.isArray(report.keywords) && report.keywords.length > 0 && (
              <div className="pt-8 border-t border-white/5">
                <h4 className="font-mono text-[10px] text-[#7e56da] uppercase tracking-[0.3em] mb-4 opacity-60">
                  Key Insights
                </h4>
                <div className="flex flex-wrap gap-3">
                  {report.keywords.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-[#7e56da]/10 border border-[#7e56da]/20 rounded-full text-xs font-mono text-[#7e56da] uppercase tracking-wider hover:bg-[#7e56da]/20 transition-all cursor-default"
                    >
                      # {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      // Default: Fallback to the original markdown-lite string parser
      const formatText = (text: any) => {
        if (!text) return null;
        const content =
          typeof text === "string" ? text : JSON.stringify(text, null, 2);

        return content.split("\n").map((line, i) => {
          if (line.startsWith("#"))
            return (
              <h3
                key={i}
                className="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2"
              >
                <Sparkles size={18} className="text-[#7e56da]" />{" "}
                {line.replace(/^#+\s*/, "")}
              </h3>
            );
          return (
            <p key={i} className="mb-4 text-zinc-300 leading-relaxed font-sans">
              {formatRichText(line)}
            </p>
          );
        });
      };

      return (
        <div className="prose prose-invert max-w-none pr-4">
          {formatText(report)}
        </div>
      );
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Scrollable Container with Custom Styling */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-cool custom-scroll-area">
          {/* Header now inside scrollable area */}
          <div className="text-center mb-10 pt-4">
            <h4 className="text-2xl font-bold text-[#7e56da] tracking-wider uppercase">
              {t.tabs.overview}
              <div className="h-0.5 w-16 bg-[#7e56da]/50 mx-auto mt-2 rounded-full" />
            </h4>
          </div>
          <OverviewContent />
        </div>
      </div>
    );
  };

  const renderHoroscope = () => {
    const report = kundliData.ascendant_report?.response?.[0];
    if (!report)
      return (
        <div className="text-zinc-500 italic">No horoscope data available.</div>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-6">
          <div className="bg-[#0A1212]/50 border border-[#7e56da]/10 rounded-2xl p-6">
            <h4 className="font-mono text-xs text-[#7e56da] opacity-60 uppercase tracking-widest mb-4">
              Lagna / Ascendant
            </h4>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-white tracking-tight">
                {report.ascendant}
              </span>
              <span className="text-sm font-mono text-zinc-500">
                House {report.ascendant_lord_house_location}
              </span>
            </div>
            <p className="text-sm text-zinc-400">
              {displayLang === "hi"
                ? "आपका मुख्य लग्न "
                : "Your personality is governed by "}
              <span className="text-[#7e56da]">{report.ascendant_lord}</span>
              {displayLang === "hi"
                ? " द्वारा शासित है, जो "
                : ", positioned in the "}
              <span className="text-[#7e56da]">{report.verbal_location}</span>
              {displayLang === "hi" ? " में स्थित है।" : "."}
            </p>
          </div>

          <div className="bg-[#0A1212]/50 border border-[#7e56da]/10 rounded-2xl p-6">
            <h4 className="font-mono text-xs text-[#7e56da] opacity-60 uppercase tracking-widest mb-4">
              {displayLang === "hi" ? "भाग्यशाली चिह्न" : "Lucky Indicators"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                  {displayLang === "hi" ? "भाग्यशाली रत्न" : "Lucky Gem"}
                </p>
                <p className="text-sm text-white font-medium">
                  {report.lucky_gem}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                  {displayLang === "hi" ? "उपवास का दिन" : "Fasting Day"}
                </p>
                <p className="text-sm text-white font-medium">
                  {report.day_for_fasting}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0A1212]/50 border border-[#7e56da]/10 rounded-2xl p-6">
          <h4 className="font-mono text-xs text-[#7e56da] opacity-60 uppercase tracking-widest mb-4">
            {displayLang === "hi"
              ? "व्यक्तित्व संरचना"
              : "Personality Overview"}
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                {displayLang === "hi"
                  ? "सामान्य भविष्यवाणी"
                  : "General Prediction"}
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {report.general_prediction}
              </p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                {displayLang === "hi" ? "विशेषताएँ" : "Qualities"}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {report.flagship_qualities.split(",").map((q: string) => (
                  <span
                    key={q}
                    className="px-2 py-1 bg-[#7e56da]/10 border border-[#7e56da]/20 rounded text-[10px] font-mono text-[#7e56da] uppercase"
                  >
                    {q.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlanetary = () => {
    const response =
      kundliData.planet_details?.response ||
      kundliData.planetry_details?.response;
    if (!response)
      return <div className="text-zinc-500 italic">No planetary data.</div>;

    const planets = Object.keys(response)
      .filter((key) => !isNaN(Number(key)))
      .map((key) => response[key]);

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-h-[60vh] overflow-y-auto overflow-x-auto scrollbar-cool pr-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 uppercase font-mono text-[10px] text-zinc-500 tracking-widest">
                <th className="py-4 px-2">
                  {displayLang === "hi" ? "ग्रह" : "Planet"}
                </th>
                <th className="py-4 px-2">
                  {displayLang === "hi" ? "राशि" : "Zodiac"}
                </th>
                <th className="py-4 px-2">
                  {displayLang === "hi" ? "भाव" : "House"}
                </th>
                <th className="py-4 px-2">
                  {displayLang === "hi" ? "नक्षत्र" : "Nakshatra"}
                </th>
                <th className="py-4 px-2">
                  {displayLang === "hi" ? "अंश" : "Degree"}
                </th>
                <th className="py-4 px-2">
                  {displayLang === "hi" ? "स्थिति" : "Status"}
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-sans">
              {planets.map((p, i) => (
                <tr
                  key={p.name || i}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-2 font-bold text-white">
                    {p.full_name || p.name}
                  </td>
                  <td className="py-4 px-2 text-zinc-400">{p.zodiac}</td>
                  <td className="py-4 px-2 text-zinc-400">{p.house}</td>
                  <td className="py-4 px-2">
                    <div className="text-white">{p.nakshatra}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {displayLang === "hi" ? "चरण " : "Pada "}{" "}
                      {p.nakshatra_pada}
                    </div>
                  </td>
                  <td className="py-4 px-2 font-mono text-zinc-400">
                    {!isNaN(Number(p.local_degree))
                      ? Number(p.local_degree).toFixed(2)
                      : "0.00"}
                    °
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex gap-1">
                      {p.is_combust && (
                        <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-500 text-[9px] font-mono rounded">
                          {displayLang === "hi" ? "स्तंभित" : "COMBUST"}
                        </span>
                      )}
                      {p.is_planet_set && (
                        <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-500 text-[9px] font-mono rounded">
                          {displayLang === "hi" ? "अस्त" : "SET"}
                        </span>
                      )}
                      {!p.is_combust && !p.is_planet_set && (
                        <span className="text-zinc-600 text-[9px] font-mono tracking-widest">
                          {displayLang === "hi" ? "सामान्य" : "NORMAL"}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDasha = () => {
    const cur = kundliData.dasha_current_maha?.response;
    const maha = kundliData.dasha_maha?.response;

    if (!cur && !maha)
      return (
        <div className="text-zinc-500 italic">No dasha data available.</div>
      );

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {cur && (
          <div className="bg-gradient-to-br from-[#0A1212] to-[#050A0A] border border-[#7e56da]/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7e56da]/5 blur-3xl rounded-full" />
            <h4 className="font-mono text-xs text-[#7e56da] uppercase tracking-widest mb-6">
              {displayLang === "hi"
                ? "वर्तमान सक्रिय काल"
                : "Current Active Period"}
            </h4>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4 w-full">
                <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-zinc-500 text-xs font-mono">
                    {displayLang === "hi" ? "मुख्य काल" : "MAJOR PERIOD"}
                  </span>
                  <span className="text-[#7e56da] font-bold text-lg">
                    {cur.mahadasha.name}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-zinc-500 text-xs font-mono">
                    {displayLang === "hi" ? "उप काल" : "SUB PERIOD"}
                  </span>
                  <span className="text-white font-bold text-lg">
                    {cur.antardasha.name}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5 opacity-60">
                  <span className="text-zinc-500 text-[10px] font-mono">
                    {displayLang === "hi" ? "प्रत्यंतर" : "PARYANTAR"}
                  </span>
                  <span className="text-zinc-300 font-medium">
                    {cur.paryantardasha.name}
                  </span>
                </div>
              </div>

              <div className="w-px h-24 bg-white/10 hidden md:block" />

              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                  {displayLang === "hi" ? "काल अवधि" : "Time Window"}
                </p>
                <div className="text-2xl font-bold text-white mb-1">
                  {safeGetYear(cur.mahadasha.start)} —{" "}
                  {safeGetYear(cur.mahadasha.end)}
                </div>
                <p className="text-sm text-zinc-400">
                  {displayLang === "hi"
                    ? "वर्तमान में "
                    : "Currently navigating the "}
                  <span className="text-white">{cur.antardasha.name}</span>{" "}
                  {displayLang === "hi"
                    ? "उप-अवधि जो "
                    : "sub-period ending on "}
                  {safeFormatDate(cur.antardasha.end)}
                  {displayLang === "hi" ? " को समाप्त होगी।" : "."}
                </p>
              </div>
            </div>
          </div>
        )}

        {maha && (
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest pl-2">
              {displayLang === "hi" ? "समयरेखा अवलोकन" : "Timeline Overview"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {maha.mahadasha.map((m: string, i: number) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${m === cur?.mahadasha.name ? "bg-[#7e56da]/10 border-[#7e56da]/30" : "bg-[#0A1212]/50 border-white/5"} transition-all`}
                >
                  <div className="text-[9px] font-mono text-zinc-500 uppercase mb-1">
                    {m === cur?.mahadasha.name
                      ? displayLang === "hi"
                        ? "सक्रिय"
                        : "ACTIVE"
                      : displayLang === "hi"
                        ? `चरण ${i + 1}`
                        : `PHASE ${i + 1}`}
                  </div>
                  <div
                    className={`font-bold ${m === cur?.mahadasha.name ? "text-[#7e56da]" : "text-white"}`}
                  >
                    {m}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-2">
                    {safeGetYear(maha.mahadasha_order[i])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDosha = () => {
    const ks = kundliData.dosha_kaalsarp?.response;
    const mg = kundliData.dosha_mangal?.response;
    const pt = kundliData.dosha_pitra?.response;

    const doshas = [
      {
        name: displayLang === "hi" ? "कालसर्प दोष" : "Kaalsarp Dosha",
        data: ks,
        icon: Activity,
      },
      {
        name: displayLang === "hi" ? "मंगल दोष" : "Mangal Dosha",
        data: mg,
        icon: ShieldAlert,
      },
      {
        name: displayLang === "hi" ? "पितृ दोष" : "Pitra Dosha",
        data: pt,
        icon: User,
      },
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doshas.map((d, i) => (
            <div
              key={i}
              className={`rounded-3xl p-6 border transition-all ${d.data?.is_dosha_present ? "bg-orange-500/5 border-orange-500/20" : "bg-purple-500/5 border-purple-500/20"}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg border ${d.data?.is_dosha_present ? "bg-orange-500/10 border-orange-500/30 text-orange-500" : "bg-purple-500/10 border-purple-500/30 text-purple-500"}`}
                >
                  <d.icon size={18} />
                </div>
                <h5 className="font-bold text-white text-sm">{d.name}</h5>
              </div>

              <div className="mb-4">
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded ${d.data?.is_dosha_present ? "bg-orange-500/20 text-orange-400" : "bg-purple-500/20 text-purple-400"}`}
                >
                  {d.data?.is_dosha_present
                    ? displayLang === "hi"
                      ? "पता चला"
                      : "Detected"
                    : displayLang === "hi"
                      ? "उपस्थित नहीं"
                      : "Not Present"}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed h-12 overflow-hidden line-clamp-3">
                {d.data?.bot_response ||
                  (displayLang === "hi"
                    ? "विश्लेषण पूर्ण। कोई महत्वपूर्ण संरेखण नहीं मिला।"
                    : "Analysis complete. No significant alignments found.")}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#0A1212]/30 border border-white/5 rounded-3xl p-8">
          <h4 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Info size={14} />{" "}
            {displayLang === "hi"
              ? "संरेखण बुद्धिमत्ता"
              : "Alignment Intelligence"}
          </h4>
          <p className="text-sm text-zinc-300 max-w-3xl">
            {displayLang === "hi"
              ? "आपका चार्ट जटिल ग्रहीय संरेखणों की एक श्रृंखला दिखाता है। जबकि कुछ पारंपरिक 'दोष' मौजूद हो सकते हैं, वैदिक ज्योतिष इस बात पर जोर देता है कि कोई भी संरेखण पूरी तरह से नकारात्मक नहीं है। ये आपके कर्म संरचना में दबाव बिंदु हैं जो विकास और आत्म-जागरूकता को ट्रिगर करने के लिए डिज़ाइन किए गए हैं।"
              : 'Your chart shows a series of complex planetary alignments. While some traditional "doshas" may be present, Vedic astrology emphasizes that no alignment is purely negative. These are simply pressure points in your karmic architecture designed to trigger growth and self-awareness.'}
          </p>
        </div>
      </div>
    );
  };

  const TABS = [
    {
      id: "overview",
      label: t.tabs.overview,
      icon: Sparkles,
      render: renderOverview,
    },
    {
      id: "horoscope",
      label: t.tabs.horoscope,
      icon: Star,
      render: renderHoroscope,
    },
    {
      id: "planetary",
      label: t.tabs.planetary,
      icon: LayoutGrid,
      render: renderPlanetary,
    },
    { id: "dasha", label: t.tabs.dasha, icon: Calendar, render: renderDasha },
    {
      id: "dosha",
      label: t.tabs.dosha,
      icon: ShieldAlert,
      render: renderDosha,
    },
  ];

  const firstName = userData?.name ? userData.name.split(" ")[0] : "User";

  return (
    <main className="min-h-screen bg-[#050A0A] text-white selection:bg-[#7e56da]/30">
      {!hideNavbar && <Navbar />}

      {/* ── Background Mesh ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#7e56da]/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[600px] h-[600px] bg-[#FF8C00]/[0.03] rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #7e56da 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* ═══ HERO ═══ */}
        <section className="pt-32 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-left"
          >
            <h1 className="text-xl text-center md:text-3xl font-bold tracking-tight mb-4 font-sans uppercase">
              {firstName}'s{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7e56da] to-[#3b82f6]">
                REPORT
              </span>
            </h1>
            <p className="text-sm md:text-base text-center text-zinc-500 font-mono tracking-widest uppercase">
              {t.subHero}
            </p>
          </motion.div>
        </section>

        {/* ═══ MAIN CONTENT GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
          {/* LEFT: BIRTH DATA (STICKY-ISH) */}
          <aside className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0A1212]/80 backdrop-blur-md border border-[#7e56da]/20 rounded-3xl p-8 sticky top-24 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-[#7e56da] shadow-[0_0_10px_#7e56da]" />
                <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#7e56da]">
                  {t.profileConfig}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-x-4 gap-y-6">
                {DETAIL_FIELDS.map((field, i) => (
                  <div key={i} className="group">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <field.icon
                        size={10}
                        className="group-hover:text-[#7e56da] transition-colors"
                      />{" "}
                      {field.label}
                    </p>
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>

              {!kundliData && (
                <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                  <div className="relative group">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full appearance-none bg-[#050A0A] border border-[#7e56da]/20 text-[10px] font-mono tracking-[0.2em] uppercase rounded-xl px-4 py-4 outline-none focus:border-[#7e56da] cursor-pointer"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                    />
                  </div>

                  <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={!isProfileComplete}
                    className="w-full py-4 rounded-xl bg-[#7e56da] text-white font-bold font-mono text-[11px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(126,86,218,0.2)] hover:shadow-[0_0_30px_rgba(126,86,218,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t.actions.generate}
                  </button>

                  <button
                    onClick={() => window.location.href = '/profile'}
                    className="w-full py-3 rounded-xl border border-white/10 text-zinc-400 font-mono text-[10px] uppercase tracking-[0.2em] hover:text-white hover:border-[#7e56da]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <User size={12} /> Change Birth Details
                  </button>
                </div>
              )}
            </motion.div>
          </aside>

          {/* RIGHT: REPORT VIEWER */}
          <main className="lg:col-span-8 relative">
            <AnimatePresence>
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[60] bg-[#050A0A] rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center border border-[#7e56da]/30 overflow-hidden"
                >
                  {/* Decorative background for the prep screen */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7e56da]/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #7e56da 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                  </div>

                  <div className="relative z-10 space-y-8 max-w-md">
                    <div className="relative flex justify-center">
                      <div className="w-24 h-24 border-2 border-[#7e56da]/20 rounded-full animate-[spin_3s_linear_infinite]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={40} className="text-[#7e56da] animate-pulse" />
                      </div>
                      <div className="absolute -inset-4 border border-[#7e56da]/10 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7e56da] to-[#3b82f6]">Destiny</span>
                      </h2>
                      <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#7e56da] to-transparent mx-auto rounded-full" />
                      <p className="text-zinc-400 font-mono text-[11px] uppercase tracking-[0.4em] animate-pulse">
                        Synchronizing Celestial Nodes...
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
                      <p className="text-sm text-zinc-500 leading-relaxed italic">
                        "Wait while your personal Kundli is being prepared by our predictive intelligence engine. We are analyzing planetary alignments for {userData?.name}."
                      </p>
                      <div className="flex justify-center gap-2">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7e56da]" style={{ animation: `bounce 1s infinite ${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>


                </motion.div>
              )}
            </AnimatePresence>

            {!isFetching && kundliData ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A1212]/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] overflow-hidden min-h-[600px] flex flex-col max-w-[800px] mx-auto w-full"
              >
                {/* TABS NAVIGATION */}
                <nav className="flex px-4 pt-2 border-b border-white/5 overflow-x-auto no-scrollbar bg-white/[0.02]">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-6 py-5 flex items-center gap-2 transition-all group shrink-0 ${activeTab === tab.id ? "text-[#7e56da]" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                      <tab.icon
                        size={14}
                        className={
                          activeTab === tab.id
                            ? "animate-pulse"
                            : "opacity-40 group-hover:opacity-100"
                        }
                      />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                        {tab.label}
                      </span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7e56da] shadow-[0_0_10px_#7e56da]"
                        />
                      )}
                    </button>
                  ))}
                </nav>

                {/* TAB CONTENT */}
                <div className="p-8 md:p-12 flex-1 overflow-y-auto no-scrollbar max-h-[800px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {TABS.find((t) => t.id === activeTab)?.render()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* FOOTER STATS */}
                <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center px-8">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="text-[8px] font-mono text-zinc-500 uppercase">
                        {t.status.engine}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[8px] font-mono text-zinc-500 uppercase">
                        {t.status.data}
                      </span>
                    </div>
                  </div>
                  <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                    {t.status.version}
                  </div>
                </div>
              </motion.div>
            ) : !isFetching ? (
              <div className="h-full flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] w-full">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                  <FileText size={32} className="text-zinc-700" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">
                  {t.status.idle}
                </h3>
                <p className="text-sm text-zinc-500 font-mono tracking-widest uppercase max-w-xs text-center leading-relaxed">
                  {t.status.idleDesc}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-40">
                <div className="w-12 h-12 border-2 border-[#7e56da] border-t-transparent rounded-full animate-spin mb-6" />
                <span className="text-[10px] font-mono text-[#7e56da] animate-pulse uppercase tracking-[0.3em]">
                  {t.status.loading}
                </span>
              </div>
            ) }
          </main>
        </div>

        {/* ═══ CONFIRMATION MODAL ═══ */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#050A0A]/90 backdrop-blur-md"
              onClick={() => !isGenerating && setShowConfirmation(false)}
            ></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-lg bg-[#0A1212] border border-[#7e56da]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl p-10 overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#7e56da]/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#7e56da]/5 border border-[#7e56da]/20 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(126,86,218,0.1)]">
                  {isGenerating ? (
                    <div className="w-12 h-12 border-2 border-[#7e56da] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles size={32} className="text-[#7e56da]" />
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                  {isGenerating ? t.modal.processing : t.modal.initiate}
                </h3>

                <p className="text-[10px] font-mono text-[#7e56da] uppercase tracking-[0.4em] mb-8">
                  {isGenerating ? t.modal.streams : t.modal.lock}
                </p>

                <p className="text-sm text-zinc-500 mb-10 max-w-sm mx-auto leading-relaxed">
                  {isGenerating ? t.modal.descProc : t.modal.descInit}
                </p>

                {!isGenerating && (
                  <div className="flex gap-4 w-full">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 py-4 rounded-xl border border-white/10 text-white font-mono uppercase text-[10px] tracking-widest hover:bg-white/5 transition-colors"
                    >
                      {t.actions.cancel}
                    </button>
                    <button
                      onClick={handleGenerateConfirm}
                      className="flex-1 py-4 rounded-xl bg-[#7e56da] hover:bg-[#7e56da]/90 text-white font-bold font-mono uppercase text-[10px] tracking-widest shadow-[0_0_30px_rgba(126,86,218,0.3)] transition-all transform active:scale-[0.98]"
                    >
                      {t.actions.execute}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-cool::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-cool::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .scrollbar-cool::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #7e56da, #3b82f6);
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(126, 86, 218, 0.2);
        }
        .scrollbar-cool::-webkit-scrollbar-thumb:hover {
          background: #7e56da;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
