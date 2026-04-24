"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import {
  Layers,
  Star,
  Shield,
  Anchor,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import PdfPageLayout from "../pageLayout";
import { resolveTranslations, lagnaArchTranslations } from "@/lib/i18n";
import type { Language } from "@/types/languages";

interface LagnaArchitecturePageProps {
  lang: string;
  planetaryPositions?: any[];
  lagnaLordInfo?: any;
  insights?: string[];
}

const LagnaArchitecturePage: React.FC<LagnaArchitecturePageProps> = ({
  lang,
  planetaryPositions = [],
  lagnaLordInfo = { name: "-", location: "-", sign: "-", status: "-" },
  insights = [],
}) => {
  const isHindi = lang === "hi";

  const t = resolveTranslations(lagnaArchTranslations, lang as Language);

  // --- SUB-COMPONENT: HOUSE CARD ---
  const HouseCard = ({ house, sign, planets }: any) => {
    const hasPlanets = planets && planets.length > 0;
    const isLagna = house === 1;

    return (
      <div
        className={`flex flex-col p-4 rounded-xl border transition-all ${
          isLagna
            ? "bg-[#FFFDF5] border-[#A07825] shadow-sm"
            : hasPlanets
              ? "bg-white border-gray-200"
              : "bg-zinc-50 border-gray-100 opacity-60"
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${isLagna ? "text-[#A07825]" : "text-gray-400"}`}
            >
              {t.house} {house}
            </span>
            <span
              className={`text-sm font-bold uppercase ${isLagna ? "text-black" : "text-gray-600"}`}
            >
              {sign}
            </span>
          </div>
          {isLagna && <Anchor size={16} className="text-[#A07825]" />}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {hasPlanets ? (
            planets.map((p: any, i: number) => (
              <div
                key={i}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-bold border ${
                  p.name === "Ascendant"
                    ? "bg-[#A07825] text-white border-[#8a661f]"
                    : "bg-white text-gray-800 border-gray-300 shadow-sm"
                }`}
              >
                {p.name === "Ascendant" ? t.ascendant : p.name.slice(0, 2)}
                {p.isRetro && (
                  <span className="ml-1 text-[8px] bg-red-50 text-red-700 px-1 rounded-sm border border-red-100 flex items-center">
                    <RefreshCcw size={8} className="mr-0.5" /> {t.retro}
                  </span>
                )}
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-300 italic font-medium">
              {t.empty}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <PdfPageLayout lang={lang as "en" | "hi"}>
      <div className="w-full h-full flex flex-col">
        <div className="text-center mb-10 pt-4">
          <h1
            className="text-4xl font-black uppercase tracking-[0.15em] mb-2 font-serif"
            style={{ color: UREKHA_COLORS.inkPrimary }}
          >
            {t.title}
          </h1>
          <div
            className="flex items-center justify-center gap-2 opacity-60"
            style={{ color: UREKHA_COLORS.goldPrimary }}
          >
            <Layers size={14} />
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              {t.subtitle}
            </p>
            <Layers size={14} />
          </div>
        </div>

        <div className="w-full mb-10">
          <div
            className="relative overflow-hidden rounded-xl border border-dashed p-6 bg-white/50"
            style={{ borderColor: UREKHA_COLORS.goldPrimary }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 bg-zinc-50 rounded-full border border-gray-200"
                  style={{ color: UREKHA_COLORS.goldPrimary }}
                >
                  <Star size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-black">
                    {t.lordTitle}
                  </h3>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">
                    {t.lordDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <span className="text-xs font-bold uppercase text-gray-400 block mb-1">
                    {t.planet}
                  </span>
                  <span className="text-2xl font-black text-black font-serif">
                    {lagnaLordInfo.name}
                  </span>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase text-gray-400 block mb-1">
                    {t.placement}
                  </span>
                  <span
                    className="text-2xl font-black"
                    style={{ color: UREKHA_COLORS.goldPrimary }}
                  >
                    {lagnaLordInfo.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 mb-8">
          <div className="flex items-center gap-3 mb-5 opacity-50">
            <Shield size={18} />
            <h3 className="text-sm font-bold uppercase tracking-widest">
              {t.title} (D1)
            </h3>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 h-full">
            {planetaryPositions.length > 0 ? (
              planetaryPositions.map((pos) => (
                <HouseCard key={pos.house} {...pos} />
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-zinc-300 italic">
                Loading Planetary Architecture...
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto mb-2">
          {insights.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-4 opacity-60">
                <Sparkles
                  size={18}
                  style={{ color: UREKHA_COLORS.goldPrimary }}
                />
                <h3 className="text-sm font-bold uppercase tracking-widest text-black">
                  {t.insightsTitle}
                </h3>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>

              <div className="p-6 bg-zinc-50 border border-gray-100 rounded-xl">
                <ul className="space-y-3">
                  {insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 min-w-[6px] h-[6px] rounded-full"
                        style={{ backgroundColor: UREKHA_COLORS.goldPrimary }}
                      ></span>
                      <p
                        className={`text-sm leading-relaxed text-gray-700 ${isHindi ? "font-serif" : ""}`}
                      >
                        {insight}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </PdfPageLayout>
  );
};

export default LagnaArchitecturePage;
