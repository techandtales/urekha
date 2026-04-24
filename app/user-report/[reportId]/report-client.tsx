"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User, Calendar, MapPin, Sparkles, AlertCircle, FileText, Activity,
  Clock, Globe, Compass, Flame, Skull, ShieldCheck, BadgeCheck,
  ChevronRight, ArrowLeft, Star, BarChart3, TrendingUp,
  Zap, Sun, Moon, Hash
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface ReportClientProps {
  meta: any;
  coreData: any;
  predictions: any;
}

type TabId = "overview" | "charts" | "predictions" | "horoscope" | "dasha";

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const TABS: TabDef[] = [
  { id: "overview", label: "Overview", icon: Star },
  { id: "charts", label: "Charts", icon: BarChart3 },
  { id: "predictions", label: "Predictions", icon: Sparkles },
  { id: "horoscope", label: "Horoscope", icon: Sun },
  { id: "dasha", label: "Dasha", icon: TrendingUp },
];

const PREDICTION_LABELS: Record<string, { title: string; icon: React.ElementType; gradient: string }> = {
  "personal-insight-1200": { title: "Personal Insight", icon: User, gradient: "from-violet-500/20 to-purple-500/10" },
  "health-1200": { title: "Health Analysis", icon: Activity, gradient: "from-rose-500/20 to-pink-500/10" },
  "education-1200": { title: "Education Analysis", icon: FileText, gradient: "from-blue-500/20 to-cyan-500/10" },
  "career-1200": { title: "Career & Professional Journey", icon: TrendingUp, gradient: "from-amber-500/20 to-yellow-500/10" },
  "finance-1200": { title: "Finance & Money Flow", icon: BarChart3, gradient: "from-emerald-500/20 to-green-500/10" },
  "love-relation-1200": { title: "Love, Emotions & Relationships", icon: Sparkles, gradient: "from-pink-500/20 to-rose-500/10" },
  "family-relation-1200": { title: "Family & Social Support", icon: User, gradient: "from-teal-500/20 to-cyan-500/10" },
  "challenges-1200": { title: "Enemy & Challenges", icon: Zap, gradient: "from-red-500/20 to-orange-500/10" },
  "spirituality-1200": { title: "Spirituality", icon: Moon, gradient: "from-indigo-500/20 to-violet-500/10" },
};

const CHART_LABELS: Record<string, string> = {
  D1: "Lagna (Birth Chart)", D2: "Hora", D3: "Drekkana", D4: "Chaturthamsa",
  D5: "Panchamsha", D7: "Saptamsha", D9: "Navamsa", D10: "Dasamsa",
  D12: "Dwadasamsa", D16: "Shodasamsa", D20: "Vimshamsha", D24: "Chaturvimshamsha",
  D27: "Bhamsha", D30: "Trimshamsha", D40: "Khavedamsha", D45: "Akshavedamsha",
  D60: "Shashtiamsha", moon: "Moon Chart",
};

/* ─────────────────────────────────────────────
   GLASSMORPHISM CARD
───────────────────────────────────────────── */
function GlassCard({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-[#00FF94]/10 border border-[#00FF94]/20 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#00FF94]" />
      </div>
      <div>
        <h2 className="text-lg font-black uppercase tracking-widest text-white">{title}</h2>
        {subtitle && <p className="text-xs text-white/30 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-white/20" />
      </div>
      <p className="text-white/30 font-medium text-sm">{message}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   OVERVIEW TAB
───────────────────────────────────────────── */
function OverviewTab({ meta, coreData }: { meta: any; coreData: any }) {
  const birth = meta?.birthdetails || {};
  const dosha = coreData?.dosha || {};

  const birthFields = [
    { label: "Date of Birth", value: birth.dob || birth.date_of_birth || "—", icon: Calendar },
    { label: "Time of Birth", value: birth.tob || birth.time_of_birth || "—", icon: Clock },
    { label: "Location", value: birth.locationName || birth.pob || "—", icon: MapPin },
    { label: "Latitude", value: birth.latitude ? `${Number(birth.latitude).toFixed(4)}° N` : "—", icon: Compass },
    { label: "Longitude", value: birth.longitude ? `${Number(birth.longitude).toFixed(4)}° E` : "—", icon: Globe },
    { label: "Timezone", value: birth.timezone ? `UTC +${birth.timezone}` : "—", icon: Activity },
  ];

  const doshaEntries = [
    {
      key: "mangal", label: "Mangal Dosha", icon: Flame,
      isPresent: dosha.mangal?.response?.is_dosha_present ?? dosha.mangal?.is_dosha_present,
      score: dosha.mangal?.response?.score ?? dosha.mangal?.score,
      bot: dosha.mangal?.response?.bot_response ?? dosha.mangal?.bot_response,
    },
    {
      key: "kaalsarp", label: "Kaal Sarp Dosha", icon: Activity,
      isPresent: dosha.kaalsarp?.response?.is_dosha_present ?? dosha.kaalsarp?.is_dosha_present,
      bot: dosha.kaalsarp?.response?.bot_response ?? dosha.kaalsarp?.bot_response,
    },
    {
      key: "pitra", label: "Pitra Dosha", icon: Skull,
      isPresent: dosha.pitra?.response?.is_dosha_present ?? dosha.pitra?.is_dosha_present,
      bot: dosha.pitra?.response?.bot_response ?? dosha.pitra?.bot_response,
    },
    {
      key: "manglik", label: "Manglik Analysis", icon: ShieldCheck,
      isPresent: dosha.manglik?.response?.manglik_by_mars ?? dosha.manglik?.manglik_by_mars,
      score: dosha.manglik?.response?.score ?? dosha.manglik?.score,
      bot: dosha.manglik?.response?.bot_response ?? dosha.manglik?.bot_response,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Birth Details Grid */}
      <GlassCard className="p-8">
        <SectionHeader icon={Calendar} title="Birth Details" subtitle="Foundational data for all calculations" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {birthFields.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="group flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#00FF94]/5 border border-[#00FF94]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={14} className="text-[#00FF94]/60" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-bold mb-1">{f.label}</p>
                  <p className="text-sm font-bold text-white/90 truncate">{f.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Dosha Dashboard */}
      <GlassCard className="p-8">
        <SectionHeader icon={Flame} title="Dosha Analysis" subtitle="Planetary afflictions and their presence in chart" />
        {Object.keys(dosha).length === 0 ? (
          <EmptyState message="No Dosha data generated for this plan." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {doshaEntries.map((d) => {
              const Icon = d.icon;
              const present = !!d.isPresent;
              return (
                <div
                  key={d.key}
                  className={`relative overflow-hidden rounded-2xl p-5 border transition-all hover:scale-[1.01] ${
                    present
                      ? "bg-red-500/[0.06] border-red-500/20 hover:border-red-500/30"
                      : "bg-[#00FF94]/[0.04] border-[#00FF94]/15 hover:border-[#00FF94]/25"
                  }`}
                >
                  <div className="absolute top-3 right-3 opacity-[0.06]">
                    <Icon size={56} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={16} className={present ? "text-red-400" : "text-[#00FF94]"} />
                      <h3 className="text-xs font-black uppercase tracking-widest text-white/80">{d.label}</h3>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      present
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-[#00FF94]/10 text-[#00FF94] border-[#00FF94]/20"
                    }`}>
                      {present ? <AlertCircle size={10} /> : <BadgeCheck size={10} />}
                      {present ? "Present" : "Not Present"}
                    </div>
                    {d.score !== undefined && d.score !== null && (
                      <p className="mt-2 text-xs text-white/40 font-bold">Intensity: <span className="text-white/70">{d.score}%</span></p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Dosha Bot Responses */}
        {doshaEntries.some(d => d.bot) && (
          <div className="mt-6 space-y-3">
            {doshaEntries.filter(d => d.bot).map((d) => (
              <div key={`${d.key}-detail`} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{d.label} — Analysis</h4>
                <p className="text-sm text-white/60 leading-relaxed italic">"{d.bot}"</p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CHARTS TAB
───────────────────────────────────────────── */
function ChartsTab({ coreData }: { coreData: any }) {
  const svgs = coreData?.charts?.divisionalChartSvgs || {};
  const transitSvg = coreData?.charts?.transitChartSvg || null;
  const entries = Object.entries(svgs);

  if (entries.length === 0 && !transitSvg) {
    return <EmptyState message="No charts generated for this plan." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Divisional Charts Grid */}
      {entries.length > 0 && (
        <GlassCard className="p-8">
          <SectionHeader icon={BarChart3} title="Divisional Charts" subtitle="Vedic astrological chart representations" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map(([chartId, svg]: [string, any]) => (
              <div
                key={chartId}
                className="group bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:border-[#00FF94]/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#00FF94]/70">
                    {chartId.toUpperCase()}
                  </h3>
                  <span className="text-[9px] text-white/20 font-medium">
                    {CHART_LABELS[chartId] || "Divisional Chart"}
                  </span>
                </div>
                <div className="w-full aspect-square bg-white rounded-xl p-3 shadow-inner overflow-hidden">
                  <div
                    className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: typeof svg === "string" ? svg : "" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Transit Chart */}
      {transitSvg && (
        <GlassCard className="p-8">
          <SectionHeader icon={Globe} title="Transit Chart (Gochar)" subtitle="Current planetary positions overlaid on birth chart" />
          <div className="max-w-lg mx-auto">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
              <div className="w-full aspect-square bg-white rounded-xl p-4 shadow-inner overflow-hidden">
                <div
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: typeof transitSvg === "string" ? transitSvg : "" }}
                />
              </div>
              <p className="text-center text-[10px] text-white/30 font-medium mt-4 tracking-wide">
                Generated at the time of report creation
              </p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PREDICTIONS TAB
───────────────────────────────────────────── */
function PredictionsTab({ predictions }: { predictions: any }) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  if (!predictions || Object.keys(predictions).length === 0) {
    return <EmptyState message="No AI predictions generated for this plan." />;
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {Object.entries(predictions).map(([slug, pred]: [string, any]) => {
        if (!pred) return null;
        const structured = pred.structured;
        const config = PREDICTION_LABELS[slug] || {
          title: slug.split("-")[0].replace(/_/g, " "),
          icon: Sparkles,
          gradient: "from-white/5 to-white/[0.02]",
        };
        const Icon = config.icon;
        const isExpanded = expandedSlug === slug;

        return (
          <GlassCard key={slug} className="overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setExpandedSlug(isExpanded ? null : slug)}
              className="w-full flex items-center gap-4 p-6 hover:bg-white/[0.02] transition-all text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} border border-white/[0.06] flex items-center justify-center shrink-0`}>
                <Icon size={20} className="text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/90">{config.title}</h3>
                <p className="text-[10px] text-white/30 font-medium mt-0.5">
                  {structured?.blocks?.length
                    ? `${structured.blocks.length} insight blocks`
                    : "Raw analysis available"}
                </p>
              </div>
              <ChevronRight
                size={18}
                className={`text-white/20 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="border-t border-white/[0.05] pt-5 space-y-4">
                  {structured?.blocks?.map((block: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#00FF94]/70 mb-2">
                        {block.title || block.heading || `Insight ${idx + 1}`}
                      </h4>
                      <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                        {block.content || block.description || block.text || ""}
                      </p>
                    </div>
                  ))}

                  {!structured && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">
                        {typeof pred.raw === "string"
                          ? pred.raw
                          : JSON.stringify(pred.raw, null, 2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOROSCOPE TAB
───────────────────────────────────────────── */
function HoroscopeTab({ coreData }: { coreData: any }) {
  const horoscope = coreData?.horoscope || {};
  const extendedHoro = coreData?.extendedHoro || {};
  const kp = coreData?.kpAstrology || {};

  /* ---------- PLANET DETAILS ---------- */
  const planetData = horoscope.planetDetails?.response || horoscope.planetDetails;
  const planets: any[] = Array.isArray(planetData) ? planetData : [];

  /* ---------- ASCENDANT ---------- */
  const ascendant = horoscope.ascendantReport?.response || horoscope.ascendantReport || null;

  /* ---------- DIVISIONAL CHART DATA ---------- */
  const divCharts = horoscope.divisionalCharts || {};
  const divKeys = Object.keys(divCharts);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Ascendant Report */}
      {ascendant && (
        <GlassCard className="p-8">
          <SectionHeader icon={Star} title="Ascendant Report" subtitle="Your rising sign analysis" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(ascendant).map(([key, value]: [string, any]) => {
              if (typeof value === "object") return null;
              return (
                <div key={key} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 font-bold mb-1">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm font-bold text-white/80 truncate">{String(value)}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Planetary Positions Table */}
      {planets.length > 0 && (
        <GlassCard className="p-8 overflow-x-auto">
          <SectionHeader icon={Sun} title="Planetary Positions" subtitle="Detailed placement of all celestial bodies" />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  {["Planet", "Sign", "Sign Lord", "Degree", "House", "Nakshatra", "Retro"].map((h) => (
                    <th key={h} className="py-3 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planets.map((p: any, i: number) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-sm font-bold text-[#00FF94]/80">{p.name || p.planet}</td>
                    <td className="py-3 px-4 text-sm text-white/60 font-medium">{p.sign || p.zodiac}</td>
                    <td className="py-3 px-4 text-sm text-white/40 font-medium">{p.signLord || p.sign_lord || "—"}</td>
                    <td className="py-3 px-4 text-sm text-white/50 font-mono">{p.fullDegree || p.full_degree || p.degree || "—"}</td>
                    <td className="py-3 px-4 text-sm text-white/50 font-mono">{p.house || "—"}</td>
                    <td className="py-3 px-4 text-sm text-white/50 font-medium">{p.nakshatra || "—"}</td>
                    <td className="py-3 px-4">
                      {(p.isRetro === "true" || p.isRetro === true || p.is_retro) ? (
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">R</span>
                      ) : (
                        <span className="text-white/15 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Divisional Chart Data Tables */}
      {divKeys.length > 0 && (
        <GlassCard className="p-8">
          <SectionHeader icon={Hash} title="Divisional Chart Data" subtitle="House and zodiac placements across divisional charts" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {divKeys.map((chartKey) => {
              const chartData = divCharts[chartKey]?.response || divCharts[chartKey];
              if (!chartData) return null;
              const houseNo = chartData.house_no || {};
              const zodiacNo = chartData.zodiac_no || {};
              const houses = Object.keys(houseNo);

              if (houses.length === 0) return null;

              return (
                <div key={chartKey} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF94]/60 mb-3">
                    {chartKey} — {CHART_LABELS[chartKey] || "Divisional"}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="py-1.5 px-2 text-[8px] font-black uppercase tracking-wider text-white/25">House</th>
                          <th className="py-1.5 px-2 text-[8px] font-black uppercase tracking-wider text-white/25">Planets</th>
                          <th className="py-1.5 px-2 text-[8px] font-black uppercase tracking-wider text-white/25">Sign</th>
                        </tr>
                      </thead>
                      <tbody>
                        {houses.map((h) => (
                          <tr key={h} className="border-b border-white/[0.03]">
                            <td className="py-1.5 px-2 text-white/40 font-mono">{h}</td>
                            <td className="py-1.5 px-2 text-white/60 font-medium">
                              {Array.isArray(houseNo[h]) ? houseNo[h].join(", ") : houseNo[h] || "—"}
                            </td>
                            <td className="py-1.5 px-2 text-white/40 font-medium">{zodiacNo[h] || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* KP Astrology */}
      {kp.planetDetails && (
        <GlassCard className="p-8">
          <SectionHeader icon={Compass} title="KP Astrology" subtitle="Krishnamurti Paddhati planetary analysis" />
          <KPDataView data={kp} />
        </GlassCard>
      )}

      {/* Friendship Table */}
      {extendedHoro.friendshipTable && (
        <GlassCard className="p-8">
          <SectionHeader icon={User} title="Friendship Table" subtitle="Planetary relationships and affinities" />
          <FriendshipView data={extendedHoro.friendshipTable?.response || extendedHoro.friendshipTable} />
        </GlassCard>
      )}

      {planets.length === 0 && !ascendant && divKeys.length === 0 && (
        <EmptyState message="No horoscope data available for this plan." />
      )}
    </div>
  );
}

/* ─── KP DATA SUB-VIEW ─── */
function KPDataView({ data }: { data: any }) {
  const planets = data.planetDetails?.response || data.planetDetails;
  const kpArray: any[] = Array.isArray(planets) ? planets : [];

  if (kpArray.length === 0) return <EmptyState message="KP data not available." />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.08]">
            {["Planet", "Sign", "Star Lord", "Sub Lord", "Star-Sub Lord"].map((h) => (
              <th key={h} className="py-3 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kpArray.map((p: any, i: number) => (
            <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-4 text-sm font-bold text-[#00FF94]/80">{p.name || p.planet}</td>
              <td className="py-3 px-4 text-sm text-white/60">{p.sign || "—"}</td>
              <td className="py-3 px-4 text-sm text-white/50">{p.starLord || p.star_lord || "—"}</td>
              <td className="py-3 px-4 text-sm text-white/50">{p.subLord || p.sub_lord || "—"}</td>
              <td className="py-3 px-4 text-sm text-white/40">{p.starSubLord || p.star_sub_lord || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── FRIENDSHIP SUB-VIEW ─── */
function FriendshipView({ data }: { data: any }) {
  if (!data || typeof data !== "object") return <EmptyState message="Friendship data not available." />;

  const entries = Array.isArray(data) ? data : Object.entries(data);

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              {Object.keys(data[0]).map((k) => (
                <th key={k} className="py-3 px-3 text-[9px] font-black uppercase tracking-[0.15em] text-white/30">
                  {k.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                {Object.values(row).map((val: any, j: number) => (
                  <td key={j} className={`py-2.5 px-3 ${j === 0 ? "text-[#00FF94]/70 font-bold" : "text-white/50"}`}>
                    {typeof val === "object" ? JSON.stringify(val) : String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <pre className="text-xs text-white/40 overflow-auto max-h-96 p-4 rounded-lg bg-white/[0.02]">{JSON.stringify(data, null, 2)}</pre>;
}

/* ─────────────────────────────────────────────
   DASHA TAB
───────────────────────────────────────────── */
function DashaTab({ coreData }: { coreData: any }) {
  const dasha = coreData?.dasha || {};
  const vimshottari = dasha.currentMahadashaFull?.response || dasha.currentMahadashaFull;
  const yogini = dasha.yoginiDasha?.response || dasha.yoginiDasha;

  if (!vimshottari && !yogini) {
    return <EmptyState message="No Dasha data available for this plan." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Vimshottari Dasha */}
      {vimshottari && (
        <GlassCard className="p-8">
          <SectionHeader icon={TrendingUp} title="Vimshottari Dasha" subtitle="Main planetary period timeline" />
          <DashaTableView data={vimshottari} />
        </GlassCard>
      )}

      {/* Yogini Dasha */}
      {yogini && (
        <GlassCard className="p-8">
          <SectionHeader icon={Moon} title="Yogini Dasha" subtitle="Yogini period analysis" />
          <DashaTableView data={yogini} />
        </GlassCard>
      )}
    </div>
  );
}

/* ─── DASHA TABLE SUB-VIEW ─── */
function DashaTableView({ data }: { data: any }) {
  if (!data) return null;

  // Handle array of dasha periods
  const periods: any[] = Array.isArray(data)
    ? data
    : data.major_dasha || data.dashas || data.periods || [];

  if (periods.length === 0) {
    // Try rendering as object table
    if (typeof data === "object") {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(data).map(([key, val]: [string, any]) => {
            if (typeof val === "object" && !Array.isArray(val)) return null;
            return (
              <div key={key} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/25 font-bold mb-1">{key.replace(/_/g, " ")}</p>
                <p className="text-sm font-bold text-white/70">{Array.isArray(val) ? val.join(", ") : String(val)}</p>
              </div>
            );
          })}
        </div>
      );
    }
    return <pre className="text-xs text-white/40 overflow-auto">{JSON.stringify(data, null, 2)}</pre>;
  }

  // Render as table
  const cols = Object.keys(periods[0] || {});

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.08]">
            {cols.map((c) => (
              <th key={c} className="py-3 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                {c.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((row: any, i: number) => (
            <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              {cols.map((c, j) => (
                <td key={c} className={`py-3 px-4 text-sm ${j === 0 ? "text-[#00FF94]/80 font-bold" : "text-white/50"} font-medium`}>
                  {typeof row[c] === "object" ? JSON.stringify(row[c]) : String(row[c] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN REPORT CLIENT
───────────────────────────────────────────── */
export default function ReportClient({ meta, coreData, predictions }: ReportClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const tabsRef = useRef<HTMLDivElement>(null);

  const birth = meta?.birthdetails || {};

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    if (!tabsRef.current) return;
    const activeEl = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#050A0A] text-white selection:bg-[#00FF94]/20">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00FF94]/[0.02] rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.015] rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        {/* Top Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 text-white/50 hover:text-[#00FF94] hover:bg-[#00FF94]/5 rounded-xl transition-all border border-transparent hover:border-[#00FF94]/20 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-black">Report</span>
            <span className="text-[9px] text-white/10 font-mono">{meta?.id?.substring(0, 8) || "..."}</span>
          </div>
        </div>

        {/* Hero Card */}
        <GlassCard className="p-8 md:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#00FF94]/[0.03] blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FF94]/20 to-[#00FF94]/5 border border-[#00FF94]/20 flex items-center justify-center shrink-0 shadow-lg shadow-[#00FF94]/5">
              <User size={36} className="text-[#00FF94]" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase text-white">
                {birth.name || "Kundli Report"}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-bold text-white/35">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {birth.dob || "—"} · {birth.tob || "—"}
                </div>
                <div className="w-1 h-1 rounded-full bg-white/15" />
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  {birth.locationName || "—"}
                </div>
                {birth.gender && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-white/15" />
                    <span className="capitalize">{birth.gender}</span>
                  </>
                )}
              </div>
            </div>

            {/* Plan Badge */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-[8px] uppercase tracking-[0.3em] text-[#00FF94]/50 font-black mb-1">Plan</span>
              <div className="px-5 py-2.5 bg-[#00FF94]/5 border border-[#00FF94]/15 rounded-xl">
                <span className="text-lg font-black text-[#00FF94]">Tier {meta?.plan_id || "—"}</span>
              </div>
              <span className={`mt-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                meta?.status === "completed"
                  ? "text-[#00FF94] bg-[#00FF94]/10 border-[#00FF94]/20"
                  : "text-amber-400 bg-amber-400/10 border-amber-400/20"
              }`}>
                {meta?.status || "unknown"}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Tab Navigation */}
        <div ref={tabsRef} className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all whitespace-nowrap border shrink-0 ${
                  isActive
                    ? "bg-[#00FF94]/10 border-[#00FF94]/25 text-[#00FF94] shadow-lg shadow-[#00FF94]/5"
                    : "bg-white/[0.02] border-white/[0.05] text-white/35 hover:text-white/60 hover:border-white/[0.1] hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && <OverviewTab meta={meta} coreData={coreData} />}
          {activeTab === "charts" && <ChartsTab coreData={coreData} />}
          {activeTab === "predictions" && <PredictionsTab predictions={predictions} />}
          {activeTab === "horoscope" && <HoroscopeTab coreData={coreData} />}
          {activeTab === "dasha" && <DashaTab coreData={coreData} />}
        </div>

        {/* Footer */}
        <div className="mt-20 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-white/10">
            <div className="w-8 h-px bg-white/10" />
            <Sparkles size={12} />
            <div className="w-8 h-px bg-white/10" />
          </div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/15 font-bold">
            Urekha Vedic Intelligence · Generated Report
          </p>
        </div>
      </div>
    </div>
  );
}
