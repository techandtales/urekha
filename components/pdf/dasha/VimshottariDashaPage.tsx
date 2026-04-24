"use client";
import React from "react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import DashaTable, { DashaPeriod } from "./DashaTable";
import { Clock, Layers, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import PdfSectionHeader from "../ui/PdfSectionHeader";
import {
  resolveTranslations,
  vimshottariTranslations,
  DASHA_CHAIN_ROWS,
  PLANET_NAMES_HI,
} from "@/lib/i18n";
import type { Language } from "@/types/languages";

// --- TYPES ---
export interface DashaResponse {
  mahadasha: DashaPeriod[];
  antardasha: DashaPeriod[];
  paryantardasha: DashaPeriod[];
  Shookshamadasha: DashaPeriod[];
  Pranadasha: DashaPeriod[];
  order_names: string[];
  order_of_dashas: {
    major: DashaPeriod;
    minor: DashaPeriod;
    sub_minor: DashaPeriod;
    sub_sub_minor: DashaPeriod;
    sub_sub_sub_minor: DashaPeriod;
  };
}

// --- COMPONENT ---
interface VimshottariDashaPageProps {
  lang: string;
  data?: DashaResponse;
}

const VimshottariDashaPage: React.FC<VimshottariDashaPageProps> = ({
  lang,
  data,
}) => {
  const { birthDetails } = useStore();
  const isHindi = lang === "hi";
  const t = resolveTranslations(vimshottariTranslations, lang as Language);

  // Extract highlight names from active dasha order
  const activeMajor = data?.order_of_dashas?.major?.name;
  const activeMinor = data?.order_of_dashas?.minor?.name;
  const activeSubMinor = data?.order_of_dashas?.sub_minor?.name;
  const activeSubSubMinor = data?.order_of_dashas?.sub_sub_minor?.name;
  const activePrana = data?.order_of_dashas?.sub_sub_sub_minor?.name;

  return (
    <>
      {/* PAGE 1: Mahadasha, Antardasha */}
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          lang={lang as "en" | "hi"}
          className="mb-6 mt-4"
        />

        <div className="w-full h-full px-0 pt-0 pb-8 flex flex-col gap-4">
          <div className="flex flex-col">
            <PdfSectionHeader title={t.heading} icon={Clock} className="mb-2" />
            <p className="text-zinc-500 text-xs ml-8 -mt-2 mb-4">
              {t.subHeading}
            </p>
          </div>

          {!data && (
            <div className="p-20 text-center text-zinc-400 italic">
              {t.calculatingDasha}
            </div>
          )}

          {data && (
            <div className="flex flex-col gap-4">
              <DashaTable
                title={t.mahadasha}
                data={data.mahadasha}
                highlightName={activeMajor}
                lang={lang as "en" | "hi"}
                icon={Layers}
              />
              <DashaTable
                title={t.antardasha}
                data={data.antardasha}
                highlightName={activeMinor}
                lang={lang as "en" | "hi"}
                icon={Layers}
              />
            </div>
          )}
        </div>
      </PdfPageLayout>

      {/* PAGE 2: Paryantardasha & Sookshma */}
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          lang={lang as "en" | "hi"}
          className="mb-6 mt-4"
        />

        <div className="w-full h-full px-0 pt-2 pb-8 flex flex-col gap-4">
          <div className="flex flex-col">
            <PdfSectionHeader
              title={t.page2Heading}
              icon={Zap}
              className="mb-2"
            />
            <p className="text-zinc-500 text-xs ml-8 -mt-2 mb-4">
              {t.page2SubHeading}
            </p>
          </div>

          {!data && (
            <div className="p-20 text-center text-zinc-400 italic">
              {t.calculatingSubPeriods}
            </div>
          )}

          {data && (
            <div className="flex flex-col gap-4">
              <DashaTable
                title={t.paryantardasha}
                data={data.paryantardasha}
                highlightName={activeSubMinor}
                lang={lang as "en" | "hi"}
                icon={Layers}
              />
              <DashaTable
                title={t.sookshma}
                data={data.Shookshamadasha}
                highlightName={activeSubSubMinor}
                lang={lang as "en" | "hi"}
                icon={Clock}
              />
            </div>
          )}
        </div>
      </PdfPageLayout>

      {/* PAGE 3: Pranadasha */}
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          lang={lang as "en" | "hi"}
          className="mb-6 mt-4"
        />

        <div className="w-full h-full px-0 pt-2 pb-8 flex flex-col gap-4">
          <div className="flex flex-col">
            <PdfSectionHeader title={t.prana} icon={Clock} className="mb-2" />
            <p className="text-zinc-500 text-xs ml-8 -mt-2 mb-4">
              {t.page3SubHeading}
            </p>
          </div>

          {!data && (
            <div className="p-20 text-center text-zinc-400 italic">
              {t.calculatingNano}
            </div>
          )}

          {data && (
            <div className="flex flex-col gap-4">
              <DashaTable
                title={t.prana}
                data={data.Pranadasha}
                highlightName={activePrana}
                lang={lang as "en" | "hi"}
                icon={Clock}
              />
              {/* Current Dasha Summary Table */}
              <div className="mt-4">
                <PdfSectionHeader
                  title={t.currentDashaChain}
                  icon={Zap}
                  className="mb-3"
                />

                <div className="w-full bg-white border border-zinc-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
                      <tr>
                        <th className="px-4 py-3 text-left w-[25%] border-r border-red-100 bg-[#ffe4e6]">
                          {t.level}
                        </th>
                        <th className="px-4 py-3 text-left w-[25%]">
                          {t.planet}
                        </th>
                        <th className="px-4 py-3 text-left w-[25%]">
                          {t.start}
                        </th>
                        <th className="px-4 py-3 text-left w-[25%]">{t.end}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {DASHA_CHAIN_ROWS.map((row, i) => {
                        const val =
                          data.order_of_dashas?.[
                            row.key as keyof typeof data.order_of_dashas
                          ];
                        return (
                          <tr
                            key={i}
                            className={i % 2 !== 0 ? "bg-zinc-50" : "bg-white"}
                          >
                            <td className="px-4 py-3 font-semibold text-gray-700 pdf-body">
                              {isHindi ? row.hi : row.en}
                            </td>
                            <td className="px-4 py-3 font-bold text-[#111827] pdf-body">
                              {val
                                ? isHindi
                                  ? PLANET_NAMES_HI[val.name] || val.name
                                  : val.name
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-600 font-mono pdf-caption">
                              {val?.start || "-"}
                            </td>
                            <td className="px-4 py-3 text-gray-600 font-mono pdf-caption">
                              {val?.end || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </PdfPageLayout>
    </>
  );
};

export default VimshottariDashaPage;
