"use client";
import React from "react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import PdfInfoCard from "../ui/PdfInfoCard";
import PdfBulletList from "../ui/PdfBulletList";
import {
  Flame,
  ShieldAlert,
  BadgeCheck,
  Skull,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { resolveTranslations, doshaTranslations } from "@/lib/i18n";
import type { Language } from "@/types/languages";

// --- TYPES (Mocked based on User Input) ---
interface DoshaData {
  mangal: {
    is_dosha_present: boolean;
    is_anshik: boolean;
    score: number;
    bot_response: string;
    factors: Record<string, string>;
  };
  kaalsarp: {
    is_dosha_present: boolean;
    bot_response: string;
    remedies: string[];
  };
  pitra: {
    is_dosha_present: boolean;
    bot_response: string;
    effects: string[];
    remedies: string[];
  };
  manglik_analysis: {
    manglik_by_mars: boolean;
    manglik_by_rahuketu: boolean;
    manglik_by_saturn: boolean;
    score: number;
    bot_response: string;
    aspects: string[];
  };
}

interface DoshaReportPageProps {
  lang: "en" | "hi";
  data?: DoshaData;
}

const DoshaReportPage: React.FC<DoshaReportPageProps> = ({ lang, data }) => {
  const { birthDetails } = useStore();
  const isHindi = lang === "hi";
  const t = resolveTranslations(doshaTranslations, lang as Language);

  const StatusBadge = ({
    present,
    label,
  }: {
    present: boolean;
    label?: string;
  }) => (
    <div
      className={`px-3 py-1 rounded-full text-xs font-bold border ${present ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}
    >
      {label || (present ? t.present : t.absent)}
    </div>
  );

  return (
    <PdfPageLayout lang={lang}>
      <FloralHeader
        titleEn={t.titleEn}
        titleHi={t.titleHi}
        lang={lang}
        className="mb-6 mt-4"
      />

      {!data && (
        <div className="flex flex-col items-center justify-center p-20 text-zinc-400 italic">
          {t.calculatingDoshas}
        </div>
      )}

      {data && (
        <div className="px-0 flex flex-col gap-4">
          {/* --- DASHBOARD --- */}
          <div className="grid grid-cols-3 gap-3">
            {/* Mangal */}
            <PdfInfoCard
              title={t.mangalDosha}
              icon={Flame}
              className={
                data.mangal.is_dosha_present
                  ? "border-red-200"
                  : "border-green-200"
              }
            >
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{t.status}</span>
                  <StatusBadge
                    present={data.mangal.is_dosha_present}
                    label={data.mangal.is_anshik ? t.low : undefined}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{t.intensity}</span>
                  <span className="font-bold text-gray-800">
                    {data.mangal.score}%
                  </span>
                </div>
              </div>
            </PdfInfoCard>

            {/* Pitra */}
            <PdfInfoCard
              title={t.pitraDosha}
              icon={Skull}
              className={
                data.pitra.is_dosha_present
                  ? "border-red-200"
                  : "border-green-200"
              }
            >
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{t.status}</span>
                  <StatusBadge present={data.pitra.is_dosha_present} />
                </div>
              </div>
            </PdfInfoCard>

            {/* Kaal Sarp */}
            <PdfInfoCard
              title={t.kaalSarpDosha}
              icon={Activity}
              className={
                data.kaalsarp.is_dosha_present
                  ? "border-red-200"
                  : "border-green-200"
              }
            >
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{t.status}</span>
                  <StatusBadge present={data.kaalsarp.is_dosha_present} />
                </div>
              </div>
            </PdfInfoCard>
          </div>

          {/* --- DETAILED ANALYSIS --- */}

          {/* Mangal Detail */}
          {data.mangal.is_dosha_present && (
            <div className="bg-red-50/30 border border-red-100 rounded-xl p-4 break-inside-avoid">
              <div className="flex items-center gap-2 mb-3 border-b border-red-100 pb-2">
                <Flame className="w-5 h-5 text-red-600" />
                <h3 className="font-serif font-bold text-red-800 text-lg">
                  {t.manglikAnalysis}
                </h3>
              </div>
              <p className="text-sm text-gray-700 mb-4 italic">
                "{data.mangal.bot_response}"
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-red-100">
                  <h4 className="text-xs font-bold text-red-600 uppercase mb-2">
                    {t.factors}
                  </h4>
                  <ul className="text-sm space-y-1">
                    {Object.values(data.mangal.factors).map((f, i) => (
                      <li key={i} className="text-gray-700">
                        • {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">
                    {t.otherContributors}
                  </h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    {data.manglik_analysis.aspects.slice(0, 3).map((a, i) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Pitra Detail */}
          {data.pitra.is_dosha_present && (
            <div className="flex flex-col gap-3 break-inside-avoid">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <Skull className="w-5 h-5 text-gray-700" />
                <h3 className="font-serif font-bold text-gray-800 text-lg">
                  {t.pitraDetail}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{data.pitra.bot_response}</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-red-700 mb-2">
                    <ShieldAlert className="w-4 h-4" /> {t.effects}
                  </h4>
                  <PdfBulletList
                    items={data.pitra.effects.slice(0, 5)}
                    className="text-sm"
                    icon="cross"
                  />
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-green-700 mb-2">
                    <ShieldCheck className="w-4 h-4" /> {t.remedies}
                  </h4>
                  <PdfBulletList
                    items={data.pitra.remedies.slice(0, 5)}
                    className="text-sm"
                    icon="check"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Kaal Sarp Remedies (If present, or if user wants to see generic advice) */}
          {data.kaalsarp.is_dosha_present && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">{t.kaalSarpRemedies}</h3>
              <PdfBulletList items={data.kaalsarp.remedies.slice(0, 3)} />
            </div>
          )}

          {!data.kaalsarp.is_dosha_present && (
            <div className="bg-green-50/50 border border-green-100 rounded-lg p-4 flex items-center justify-center text-green-800 font-medium">
              <BadgeCheck className="w-5 h-5 mr-2" />
              {t.kaalSarpAbsent}
            </div>
          )}
        </div>
      )}
    </PdfPageLayout>
  );
};

export default DoshaReportPage;
