"use client";
import React from "react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import PdfTable from "../ui/PdfTable";
import PdfSectionHeader from "../ui/PdfSectionHeader";
import { Compass, GitMerge, Loader2 } from "lucide-react";
import { Language } from "@/types/languages";
import {
  KPPlanetDetailsResponse as KpPlanetType,
  KPPlanet as Planet,
  KPAscendant as Ascendant,
} from "@/types/kpAstrology/kpPlanetDetails";
import {
  resolveTranslations,
  kpPlanetsTranslations,
  PLANET_NAMES_KP_HI,
  SIGN_NAMES_HI,
  translateName,
} from "@/lib/i18n";

// --- HELPER ---
const decimalToDMS = (deg: number | undefined): string => {
  if (deg === undefined) return "-";
  // Normalize to 0-30 for sign degree
  const signDeg = deg % 30;

  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  const s = Math.floor(((signDeg - d) * 60 - m) * 60);
  return `${d.toString().padStart(2, "0")}° ${m
    .toString()
    .padStart(2, "0")}' ${s.toString().padStart(2, "0")}"`;
};

interface KpPlanetsPageProps {
  lang: Language;
  planetData: KpPlanetType | null;
  loading: boolean;
}

const KpPlanetsPage: React.FC<KpPlanetsPageProps> = ({
  lang,
  planetData,
  loading,
}) => {
  const isHindi = lang === "hi";
  const data = planetData;

  // Helper to translate content
  const tr = (text: string) =>
    translateName(text, lang, PLANET_NAMES_KP_HI, SIGN_NAMES_HI);

  const t = resolveTranslations(kpPlanetsTranslations, lang as Language);

  if (loading) {
    return (
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <div className="flex flex-col items-center justify-center min-h-[600px] text-zinc-400 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          <p className="font-serif italic text-lg">{t.loading}</p>
        </div>
      </PdfPageLayout>
    );
  }

  if (!data?.response) return null;

  // Combine Ascendant + Planets
  // We need to type cast or ensure structure compatibility.
  // The 'Ascendant' type matches 'Planet' for the fields we need in 'allRows'.
  const ascendantAsPlanet = {
    ...data.response.ascendant,
    id: -1,
    latitude: 0,
    distance: 0,
    speed: 0,
    siderealLongitude: data.response.ascendant.longitude, // Using longitude as siderealLongitude fallback if missing, but interface has both.
  };

  const allRows: (
    | Planet
    | (Ascendant & {
        id: number;
        latitude: number;
        distance: number;
        speed: number;
        siderealLongitude: number;
      })
  )[] = [ascendantAsPlanet, ...data.response.planets];

  return (
    <>
      {/* PAGE 1: POSITIONS */}
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          lang={lang as "en" | "hi"}
          className="mb-8 mt-4"
        />

        <div className="w-full h-full px-0 pt-6 pb-8 flex flex-col gap-6">
          {/* Heading Section */}
          <div className="flex flex-col">
            <PdfSectionHeader
              title={t.posTitle}
              icon={Compass}
              className="mb-2"
            />
            <p className="text-zinc-500 text-xs ml-8 -mt-2 mb-4">
              {t.posSubtitle}
            </p>
          </div>

          {/* TABLE 1: POSITIONS */}
          <div className="w-full bg-white border border-zinc-200 overflow-hidden">
            <PdfTable className="border-0">
              <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
                <tr>
                  <th className="px-2 py-3 text-left w-[15%] border-r border-red-100 bg-[#ffe4e6]">
                    {t.planet}
                  </th>
                  <th className="px-2 py-3 text-left w-[20%]">{t.sign}</th>
                  <th className="px-2 py-3 text-left w-[25%]">{t.degree}</th>
                  <th className="px-2 py-3 text-left w-[20%]">{t.nakshatra}</th>
                  <th className="px-2 py-3 text-left w-[20%]">{t.nakLord}</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {allRows.map((row, i) => (
                  <tr
                    key={`pos-${i}`}
                    className={`border-b border-gray-100 last:border-0 ${
                      i % 2 !== 0 ? "bg-zinc-50" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-3 font-bold text-[#111827] pdf-caption border-r border-gray-100 capitalize">
                      {tr(row.name)}
                    </td>
                    <td className="px-2 py-3 font-medium text-[#4B5563] pdf-caption">
                      {tr(row.sign)}
                    </td>
                    <td className="px-2 py-3 font-mono tracking-wide text-[#4B5563] pdf-caption">
                      {decimalToDMS(row.siderealLongitude || row.longitude)}
                    </td>
                    <td className="px-2 py-3 font-medium text-[#111827] pdf-caption">
                      {row.nakshatra}
                    </td>
                    <td className="px-2 py-3 font-semibold text-[#bc0b0bde] pdf-caption">
                      {tr(row.nakshatraLord)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </PdfTable>
          </div>
        </div>
      </PdfPageLayout>

      {/* PAGE 2: KP LORDS */}
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          lang={lang as "en" | "hi"}
          className="mb-8 mt-4"
        />

        <div className="w-full h-full px-0 pt-6 pb-8 flex flex-col gap-6">
          {/* Heading Section */}
          <div className="flex flex-col">
            <PdfSectionHeader
              title={t.rulingTitle}
              icon={GitMerge}
              className="mb-2"
            />
            <p className="text-zinc-500 text-xs ml-8 -mt-2 mb-4">
              {t.rulingSubtitle}
            </p>
          </div>

          {/* TABLE 2: RULING LORDS (KP) */}
          <div className="w-full bg-white border border-zinc-200 overflow-hidden">
            <PdfTable className="border-0">
              <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
                <tr>
                  <th className="px-2 py-3 text-left w-[15%] border-r border-red-100 bg-[#ffe4e6]">
                    {t.planet}
                  </th>
                  <th className="px-2 py-3 text-left w-[20%]">{t.signLord}</th>
                  <th className="px-2 py-3 text-left w-[20%]">{t.starLord}</th>
                  <th className="px-2 py-3 text-left w-[25%]">{t.subLord}</th>
                  <th className="px-2 py-3 text-left w-[20%]">
                    {t.subSubLord}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {allRows.map((row, i) => (
                  <tr
                    key={`rul-${i}`}
                    className={`border-b border-gray-100 last:border-0 ${
                      i % 2 !== 0 ? "bg-zinc-50" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-3 font-bold text-[#111827] pdf-caption border-r border-gray-100 capitalize">
                      {tr(row.name)}
                    </td>
                    <td className="px-2 py-3 text-xs text-[#4B5563] font-medium pdf-caption">
                      {tr(row.signLord)}
                    </td>
                    <td className="px-2 py-3 text-xs text-[#4B5563] font-medium pdf-caption">
                      {tr(row.nakshatraLord)}
                    </td>
                    <td className="px-2 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-[#FFF1F2] text-[#9F1239] border border-red-200 shadow-sm">
                        {tr(row.subLord)}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-xs text-[#4B5563] font-medium pdf-caption">
                      {tr(row.subSubLord)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </PdfTable>
          </div>
        </div>
      </PdfPageLayout>
    </>
  );
};

export default KpPlanetsPage;
