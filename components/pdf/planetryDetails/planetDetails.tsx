import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import {
  Sun,
  Star,
  Crown,
  Calendar,
  Zap,
  RefreshCcw,
  Flame,
  ArrowRight,
  Loader2,
} from "lucide-react";
import FloralHeader from "../floralHeader";
import PdfPageLayout from "../pageLayout";
import PdfTable from "../ui/PdfTable";
import PdfInfoCard from "../ui/PdfInfoCard";
import PdfSectionHeader from "../ui/PdfSectionHeader";
import PdfDataRow from "../ui/PdfDataRow";
import { resolveTranslations, planetaryTranslations } from "@/lib/i18n";
import type { Language } from "@/types/languages";
import {
  PlanetaryDetailsResponse,
  PlanetData as PlanetPosition,
} from "@/types/horoscope/palnetDetails";
type BirthPlanetaryReport = PlanetaryDetailsResponse["response"];

interface PlanetaryDetailsPageProps {
  lang: string;
  planetData: BirthPlanetaryReport | null | undefined;
  loading: boolean;
}

const PlanetaryDetailsPage: React.FC<PlanetaryDetailsPageProps> = ({
  lang,
  planetData,
  loading,
}) => {
  const isHindi = lang === "hi";

  // Use props directly
  const data = planetData;

  // --- TRANSLATIONS ---
  const t = resolveTranslations(planetaryTranslations, lang as Language);

  // Extract Top 10 Planets (0-9)
  const planets: PlanetPosition[] = [];
  if (data) {
    for (let i = 0; i <= 9; i++) {
      // Access data by string key "0", "1", etc.
      if (data[i.toString()]) {
        planets.push(data[i.toString()] as PlanetPosition);
      }
    }
  }

  if (loading) {
    return (
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <div className="flex flex-col items-center justify-center min-h-[600px] text-zinc-400 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          <p className="font-serif italic text-lg">{t.loadingPlanets}</p>
        </div>
      </PdfPageLayout>
    );
  }

  if (!data) return null;

  // Additional check to ensure we have the nested objects if they are optional
  const panchang = data.panchang || {};
  const ghatka = data.ghatka_chakra || {};

  return (
    <PdfPageLayout lang={lang as "en" | "hi"}>
      <div className="w-full h-full flex flex-col gap-4 px-0">
        {/* HEADER */}
        <div className="text-center border-b border-gray-200 pb-1">
          <FloralHeader
            titleEn="Planetary Table"
            titleHi="विस्तृत ग्रह तालिका"
            lang={lang as "en" | "hi"}
            className="mb-0 mt-0"
          />
          <p className="pdf-label text-orange-600 opacity-80 mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* TOP ROW: LUCKY & DASHA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LUCKY INFO CARD */}
          <PdfInfoCard title={t.lucky} icon={Star} variant="highlight">
            <div className="grid grid-cols-2 gap-y-1 gap-x-4">
              <PdfDataRow
                label={t.gem}
                value={data.lucky_gem?.join(", ") || "-"}
                valueClassName="text-sm font-serif"
              />
              <PdfDataRow
                label={t.color}
                value={data.lucky_colors?.join(", ") || "-"}
                valueClassName="text-sm font-serif"
              />
              <PdfDataRow
                label={t.num}
                value={data.lucky_num?.join(", ") || "-"}
                valueClassName="text-sm font-serif"
              />
              <PdfDataRow
                label={t.letters}
                value={data.lucky_letters?.join(", ") || "-"}
                valueClassName="text-sm font-serif"
              />
            </div>
          </PdfInfoCard>

          {/* DASHA & PANCHANG CARD */}
          <PdfInfoCard title={t.panchang} icon={Calendar} variant="default">
            <div className="grid grid-cols-2 gap-y-1 gap-x-4">
              <PdfDataRow
                label={t.tithi}
                value={panchang.tithi || "-"}
                valueClassName="text-sm font-serif"
              />
              <PdfDataRow
                label={t.yoga}
                value={panchang.yoga || "-"}
                valueClassName="text-sm font-serif"
              />
              <PdfDataRow
                label={t.karana}
                value={panchang.karana || "-"}
                valueClassName="text-sm font-serif"
              />
              <PdfDataRow
                label={t.day}
                value={panchang.day_of_birth || "-"}
                valueClassName="text-sm font-serif"
              />
            </div>
          </PdfInfoCard>
        </div>

        {/* CURRENT DASHA STRIP */}
        <div className="bg-zinc-50 border border-zinc-200 p-3 flex justify-between items-center px-6">
          <div>
            <span className="pdf-label text-zinc-600 block mb-1">
              {t.dasha} (Current)
            </span>
            <span className="pdf-title text-lg text-zinc-800">
              {data.current_dasa || "-"}
            </span>
          </div>
          <ArrowRight className="text-zinc-300" />
          <div className="text-right">
            <span className="pdf-label text-zinc-600 block mb-1">Ends On</span>
            <span className="pdf-title text-lg text-zinc-800">
              {data.current_dasa_time ? data.current_dasa_time.trim() : "-"}
            </span>
          </div>
        </div>

        {/* MAIN TABLE */}
        <div className="w-full bg-white border border-zinc-200 overflow-hidden">
          <PdfTable className="border-0">
            <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
              <tr>
                <th className="px-2 py-1.5 text-left border-r border-red-100 bg-[#ffe4e6]">
                  {t.pName}
                </th>
                <th className="px-2 py-1.5 text-left">{t.sign}</th>
                <th className="px-2 py-1.5 text-center">{t.house}</th>
                <th className="px-2 py-1.5 text-left w-[25%]">{t.nakshatra}</th>
                <th className="px-2 py-1.5 text-right">{t.degree}</th>
                <th className="px-2 py-1.5 text-left pl-4">{t.lord}</th>
                <th className="px-2 py-1.5 text-left">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {planets.map((p, i) => {
                const isLagna = p.name === "As";
                return (
                  <tr
                    key={i}
                    className={`hover:bg-gray-50 ${isLagna ? "bg-orange-50/30" : ""}`}
                  >
                    {/* Name */}
                    <td className="px-2 py-1.5 align-middle font-bold text-zinc-900 pdf-body">
                      <div className="flex items-center gap-2">
                        {isLagna && (
                          <Crown size={12} className="text-orange-500" />
                        )}
                        {p.full_name}
                      </div>
                    </td>
                    {/* Zodiac */}
                    <td className="px-2 py-1.5 align-middle font-medium text-zinc-600 pdf-caption">
                      {p.zodiac}
                    </td>
                    {/* House */}
                    <td className="px-2 py-1.5 align-middle text-center font-bold text-zinc-800 pdf-body">
                      {p.house}
                    </td>
                    {/* Nakshatra (Pada) */}
                    <td className="px-2 py-1.5 align-middle pdf-caption text-zinc-600">
                      {p.nakshatra}{" "}
                      <span className="text-zinc-400 text-[9px]">
                        ({p.nakshatra_pada})
                      </span>
                    </td>
                    {/* Degree */}
                    <td className="px-2 py-1.5 align-middle text-right font-mono text-zinc-500 pdf-caption">
                      {p.local_degree.toFixed(2)}°
                    </td>
                    {/* Lord */}
                    <td className="px-2 py-1.5 align-middle pl-4 font-medium text-zinc-600 pdf-caption">
                      {p.zodiac_lord}
                    </td>
                    {/* Status / Avastha */}
                    <td className="px-2 py-1.5 align-middle pdf-caption font-medium">
                      <div className="flex items-center gap-1 flex-wrap">
                        {/* Basic Avastha - Standard Gray Badge */}
                        <span className="px-1.5 py-0.5 rounded border bg-gray-50 text-zinc-600 border-gray-200 text-[10px]">
                          {p.basic_avastha !== " - "
                            ? p.basic_avastha
                            : "Active"}
                        </span>

                        {/* Combust - Compact Tag */}
                        {p.is_combust !== "-" && p.is_combust !== false && (
                          <span className="text-[10px] text-zinc-500 font-serif italic">
                            (Combust)
                          </span>
                        )}

                        {/* Retrograde - Compact Tag */}
                        {(p.name === "Ra" || p.name === "Ke") && (
                          <span className="text-[10px] text-zinc-500 font-serif italic">
                            (Retro)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </PdfTable>
        </div>
      </div>
    </PdfPageLayout>
  );
};

export default PlanetaryDetailsPage;
