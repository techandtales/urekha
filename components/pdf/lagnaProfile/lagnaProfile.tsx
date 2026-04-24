"use client";
import React from "react";
import {
  Crown,
  Shield,
  Gem,
  Sparkles,
  Layers,
  Calendar,
  Activity,
  Star,
  Quote,
  Scale,
  Loader2, // Added for loading state
} from "lucide-react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import PdfSectionHeader from "../ui/PdfSectionHeader";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { AscendantData as AscendantApiInterface } from "@/types/horoscope/ascendantReport";
import { useStore } from "@/lib/store";
import { resolveTranslations } from "@/lib/i18n";
import { lagnaTranslations } from "@/lib/i18n/lagna";
import type { Language } from "@/types/languages";

interface LagnaProfilePageProps {
  lang: string;
  ascendantData: AscendantApiInterface | null | undefined;
  loading: boolean;
  error: string | null;
}

const LagnaProfilePage: React.FC<LagnaProfilePageProps> = ({
  lang = "en",
  ascendantData,
  loading,
  error,
}) => {
  const isHindi = lang === "hi";
  const { jyotishamData } = useStore();

  // Read the D1 SVG from the Zustand store (fetched by pipeline)
  const d1Svg = jyotishamData.charts.divisionalChartSvgs?.D1 ?? null;

  // Ensure we have a single object if an array was passed
  const prediction = Array.isArray(ascendantData)
    ? ascendantData[0]
    : ascendantData;

  // Resolve translations for the current language
  const t = resolveTranslations(lagnaTranslations, lang as Language);

  // --- Loader State ---
  if (loading) {
    return (
      <PdfPageLayout lang={isHindi ? "hi" : "en"}>
        <div className="flex flex-col items-center justify-center min-h-[600px] text-zinc-400 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          <p className="font-serif italic text-lg">{t.loadingText}</p>
        </div>
      </PdfPageLayout>
    );
  }

  // --- Error State ---
  if (error || !prediction) {
    return (
      <PdfPageLayout lang={isHindi ? "hi" : "en"}>
        <div className="p-20 text-center text-red-500 font-serif">
          {error || "No data available."}
        </div>
      </PdfPageLayout>
    );
  }

  // --- Identity Section ---
  if (!prediction) return null;

  const goodQualities =
    typeof prediction.good_qualities === "string"
      ? prediction.good_qualities.split(",").filter((q: string) => q.trim())
      : [];

  const badQualities =
    typeof prediction.bad_qualities === "string"
      ? prediction.bad_qualities.split(",").filter((q: string) => q.trim())
      : [];

  return (
    <PdfPageLayout lang={isHindi ? "hi" : "en"}>
      <FloralHeader
        titleEn={t.titleEn}
        titleHi={t.titleHi}
        lang={isHindi ? "hi" : "en"}
      />

      <div className="flex-1 flex flex-col px-8 gap-4 overflow-hidden">
        {/* SECTION 1: IDENTITY & CHART */}
        <div className="grid grid-cols-12 gap-6 items-start border-b border-zinc-100 pb-4">
          {/* Chart Section: The visual anchor */}
          <div className="col-span-5 relative group">
            {/* Decorative corner accent for a "Premium Document" feel */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t border-l border-zinc-300" />

            <div className="w-[200px] h-[220px] shrink-0 p-3 border border-zinc-200 bg-white flex flex-col items-center">
              <div className="flex flex-col items-center gap-1 mb-3">
                <span className="pdf-label text-[9px] uppercase tracking-[0.3em] text-[#9F1239] font-bold">
                  {t.chartTitle}
                </span>
                <div className="w-12 h-px bg-red-100" />
              </div>

              <div className="w-full h-full relative flex items-center justify-center">
                {d1Svg ? (
                  <div
                    className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: d1Svg }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section: Editorial Typography */}
          <div className="col-span-7 flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-px w-6 bg-orange-200" />
              <span className="pdf-label font-bold uppercase tracking-[0.25em] text-orange-600 text-[10px]">
                {t.ascLabel}
              </span>
            </div>

            <h1 className="font-serif text-[24px] text-zinc-900 leading-tight mb-2">
              {prediction.ascendant}
            </h1>

            <div className="flex gap-3 mb-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 border border-zinc-100 rounded-sm">
                <span className="pdf-caption text-zinc-500 uppercase tracking-tighter">
                  Symbol
                </span>
                <span className="pdf-caption text-zinc-900 font-bold">
                  {prediction.symbol}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-orange-100 rounded-sm">
                <span className="pdf-caption text-orange-400 uppercase tracking-tighter">
                  Nature
                </span>
                <span className="pdf-caption text-orange-700 font-bold italic">
                  {prediction.zodiac_characteristics}
                </span>
              </div>
            </div>

            {/* Blockquote with refined indentation and color */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-orange-100 via-orange-200 to-transparent rounded-full" />
              <p className="pdf-body text-zinc-600 italic leading-relaxed pl-6 text-[11pt] max-w-[450px]">
                "{prediction.flagship_qualities}"
              </p>
            </div>
          </div>

          <div className="col-span-12">
            {/* Key Strengths Pills (Optional addition for UX) */}
            <div className="flex flex-wrap gap-2 mt-2">
              {goodQualities.map((quality: string, i: number) => (
                <span
                  key={i}
                  className="text-[9px] uppercase tracking-widest text-zinc-400 border border-zinc-200 px-2 py-0.5 rounded-full"
                >
                  {quality}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: PLANETARY MATRIX */}
        <div className="space-y-2">
          <PdfSectionHeader title="Planetary Matrix" icon={Star} />
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-zinc-200 p-2 flex flex-col min-h-[70px]">
              <span className="pdf-label font-bold uppercase text-zinc-500 mb-1">
                {t.lordLabel}
              </span>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className="text-[#9F1239]" />
                <span className="pdf-body font-bold text-zinc-800">
                  {prediction.ascendant_lord}
                </span>
              </div>
              <span className="pdf-caption mt-auto font-bold uppercase text-zinc-500">
                {prediction.ascendant_lord_strength} {t.strengthLabel}
              </span>
            </div>

            <div className="bg-white border border-zinc-200 p-2 flex flex-col min-h-[70px]">
              <span className="pdf-label font-bold uppercase text-zinc-500 mb-1">
                {t.placementLabel}
              </span>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-[#9F1239]" />
                <span className="pdf-body font-bold text-zinc-800">
                  {prediction.ascendant_lord_house_location}
                  {t.house}
                </span>
              </div>
              <span className="pdf-caption mt-auto text-zinc-700 truncate italic">
                {prediction.ascendant_lord_location}
              </span>
            </div>

            <div className="bg-white border border-zinc-200 p-2 flex flex-col min-h-[70px]">
              <span className="pdf-label font-bold uppercase text-zinc-500 mb-1">
                {t.gemLabel}
              </span>
              <div className="flex items-center gap-2">
                <Gem size={14} className="text-[#9F1239]" />
                <span className="pdf-body font-bold text-zinc-800">
                  {prediction.lucky_gem}
                </span>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 p-2 flex flex-col min-h-[70px]">
              <span className="pdf-label font-bold uppercase text-zinc-500 mb-1">
                {t.fastingLabel}
              </span>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#9F1239]" />
                <span className="pdf-body font-bold text-zinc-800">
                  {prediction.day_for_fasting}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: MANTRA */}
        <div className="border border-zinc-200 bg-zinc-50 py-2 px-8 text-center relative mt-1">
          <Quote className="absolute top-2 left-4 text-zinc-300 w-5 h-5 rotate-180" />
          <span className="pdf-label font-bold uppercase tracking-[0.25em] text-[#9F1239] mb-1 block">
            {t.mantraTitle}
          </span>
          <p className="text-pdf-body italic text-zinc-800 leading-relaxed font-medium">
            {prediction.gayatri_mantra}
          </p>
          <Quote className="absolute bottom-2 right-4 text-zinc-300 w-5 h-5" />
        </div>

        {/* SECTION 4: PREDICTIONS */}
        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <h3
              className={`pdf-header font-bold text-zinc-800 border-b border-zinc-100 pb-2 flex items-center gap-2`}
            >
              <Scale size={18} className="text-zinc-400" /> {t.generalPred}
            </h3>
            <p
              className={`pdf-body text-zinc-700 leading-relaxed text-justify`}
            >
              {prediction.general_prediction}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3
              className={`pdf-header font-bold text-zinc-800 border-b border-zinc-100 pb-2 flex items-center gap-2`}
            >
              <Activity size={18} className="text-zinc-400" /> {t.personalPred}
            </h3>
            <p
              className={`pdf-body text-zinc-700 leading-relaxed text-justify`}
            >
              {prediction.personalised_prediction}
            </p>
          </div>
        </div>
      </div>
    </PdfPageLayout>
  );
};

export default LagnaProfilePage;
