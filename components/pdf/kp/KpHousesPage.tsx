"use client";
import React, { useEffect, useState } from "react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import PdfTable from "../ui/PdfTable";
import PdfSectionHeader from "../ui/PdfSectionHeader";
import { Home, Compass, GitMerge } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  KPCuspsResponse as KpCuspsDetails,
  KPCuspDetail as KpCusp,
} from "@/types/kpAstrology/kpCuspsDetails";
import {
  resolveTranslations,
  kpHousesTranslations,
  PLANET_NAMES_KP_HI,
  SIGN_NAMES_HI,
  translateName,
} from "@/lib/i18n";
import type { Language } from "@/types/languages";
export interface KpHousesResponse {
  houses: KpCusp[];
}

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

// --- COMPONENT ---
interface KpHousesPageProps {
  lang: string;
  houses?: KpCusp[];
}

const KpHousesPage: React.FC<KpHousesPageProps> = ({ lang, houses = [] }) => {
  const isHindi = lang === "hi";

  // Helper to translate content
  const tr = (text: string) =>
    translateName(text, lang, PLANET_NAMES_KP_HI, SIGN_NAMES_HI);

  const t = resolveTranslations(kpHousesTranslations, lang as Language);

  if (!houses || houses.length === 0) {
    return (
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <div className="flex flex-col items-center justify-center min-h-[600px] text-zinc-400 gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-serif italic text-lg">{t.loading}</p>
        </div>
      </PdfPageLayout>
    );
  }
  return (
    <>
      {/* PAGE 1: POSITIONS */}
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          lang={lang as "en" | "hi"}
          className="mb-3 mt-1"
        />

        <div className="w-full h-full px-0 pt-0 pb-3 flex flex-col gap-6">
          {/* Heading Section */}
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <Compass className="text-[#bf0202ff] w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-800 leading-none">
                {t.posTitle}
              </h2>
              <p className="pdf-body text-[#4B5563] mt-1">{t.posSubtitle}</p>
            </div>
          </div>

          {/* TABLE 1: POSITIONS */}
          <div className="w-full bg-white border border-zinc-200 overflow-hidden">
            <PdfTable className="border-0">
              <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
                <tr>
                  <th className="px-2 py-3 text-left w-[15%] border-r border-red-100 bg-[#ffe4e6]">
                    {t.house}
                  </th>
                  <th className="px-2 py-3 text-left w-[20%]">{t.sign}</th>
                  <th className="px-2 py-3 text-left w-[25%]">{t.degree}</th>
                  <th className="px-2 py-3 text-left w-[20%]">{t.nakshatra}</th>
                  <th className="px-2 py-3 text-left w-[20%]">{t.nakLord}</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {houses.map((row, i) => (
                  <tr
                    key={`house-pos-${i}`}
                    className={`border-b border-gray-100 last:border-0 ${
                      i % 2 !== 0 ? "bg-zinc-50" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-3 font-bold text-[#111827] pdf-caption border-r border-gray-100">
                      {isHindi
                        ? `${t.housePrefix} ${row.house}`
                        : `House ${row.house}`}
                    </td>
                    <td className="px-2 py-3 text-[#4B5563] font-medium pdf-caption">
                      {tr(row.sign)}
                    </td>
                    <td className="px-2 py-3 text-[#4B5563] font-mono tracking-wide pdf-caption">
                      {decimalToDMS(row.degree)}
                    </td>
                    <td className="px-2 py-3 text-[#111827] font-medium pdf-caption">
                      {row.nakshatra}
                    </td>
                    <td className="px-2 py-3 text-[#bc0b0bde] font-semibold pdf-caption">
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
          className="mb-4 mt-1"
        />

        <div className="w-full h-full px-0 pt-0 pb-1 flex flex-col gap-6">
          {/* Heading Section */}
          <div className="flex flex-col">
            <PdfSectionHeader
              title={t.rulingTitle}
              icon={GitMerge}
              className="mb-2"
            />
            <p className="text-[#4B5563] text-xs ml-8 -mt-2 mb-4">
              {isHindi
                ? "भाव स्वामियों का विवरण (Sub-Lord Hierarchy)"
                : "Detailed Rulership of House Cusps (Sub-Lord Hierarchy)"}
            </p>
          </div>

          {/* TABLE 2: RULING LORDS (KP) */}
          <div className="w-full bg-white border border-zinc-200 overflow-hidden">
            <PdfTable className="border-0">
              <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
                <tr>
                  <th className="px-2 py-3 text-left w-[15%] border-r border-red-100 bg-[#ffe4e6]">
                    {t.house}
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
                {houses.map((row, i) => (
                  <tr
                    key={`house-rul-${i}`}
                    className={`border-b border-gray-100 last:border-0 ${
                      i % 2 !== 0 ? "bg-zinc-50" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-3 font-bold text-[#111827] pdf-caption border-r border-gray-100">
                      {isHindi
                        ? `${t.housePrefix} ${row.house}`
                        : `House ${row.house}`}
                    </td>
                    <td className="px-2 py-3 text-[#4B5563] font-medium pdf-caption">
                      {tr(row.signLord)}
                    </td>
                    <td className="px-2 py-3 text-[#4B5563] font-medium pdf-caption">
                      {tr(row.nakshatraLord)}
                    </td>
                    <td className="px-2 py-3 text-[#9F1239] font-bold pdf-caption">
                      {tr(row.subLord)}
                    </td>
                    <td className="px-2 py-3 text-[#4B5563] font-medium pdf-caption">
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

export default KpHousesPage;
