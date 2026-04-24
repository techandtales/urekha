"use client";
import React from "react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import PdfTable from "../ui/PdfTable";
import PdfSectionHeader from "../ui/PdfSectionHeader";
import { Users, RotateCw, Handshake, Loader2 } from "lucide-react";
import { FriendshipTables as PlanetaryFriendshipReport } from "@/types/extended-horoscope/friendshipTable";
import { resolveTranslations, friendshipTranslations } from "@/lib/i18n";
import type { Language } from "@/types/languages";

// --- COMPONENT ---
interface FriendshipPageProps {
  lang: string;
  friendshipData: PlanetaryFriendshipReport | null;
  loading: boolean;
}

const FriendshipPage: React.FC<FriendshipPageProps> = ({
  lang,
  friendshipData,
  loading,
}) => {
  // Use props directly
  const data = friendshipData;

  const isHindi = lang === "hi";

  const t = resolveTranslations(friendshipTranslations, lang as Language);

  const formatList = (list?: string[]) => {
    if (!list || list.length === 0) return "-";
    return list.join(", ");
  };

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

  if (!data) return null;

  const planets = Object.keys(data.permanent_table || {});

  return (
    <>
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={t.titleEn}
          titleHi={t.titleHi}
          lang={lang as "en" | "hi"}
          className="mb-8 mt-4"
        />

        <div className="w-full h-full px-0 pt-2 pb-8 flex flex-col gap-4">
          {/* 1. PERMANENT FRIENDSHIP */}
          <div className="w-full flex flex-col">
            <PdfSectionHeader
              title={t.permanent}
              icon={Users}
              className="mb-1"
            />
            <PdfTable className="w-full border border-zinc-200">
              <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
                <tr>
                  <th className="px-4 py-2 text-left w-1/6 border-r border-red-100 bg-[#ffe4e6]">
                    {t.planet}
                  </th>
                  <th className="px-4 py-2 text-left w-1/3">{t.friend}</th>
                  <th className="px-4 py-2 text-left w-1/4">{t.neutral}</th>
                  <th className="px-4 py-2 text-left w-1/4">{t.enemy}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {planets.map((p, i) => (
                  <tr
                    key={`perm-${i}`}
                    className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}
                  >
                    <td className="px-4 py-2 font-bold text-zinc-800 text-sm">
                      {p}
                    </td>
                    <td className="px-4 py-2 text-xs text-zinc-600 leading-snug">
                      {formatList(data.permanent_table[p]?.Friends)}
                    </td>
                    <td className="px-4 py-2 text-xs text-zinc-600 leading-snug">
                      {formatList(data.permanent_table[p]?.Neutral)}
                    </td>
                    <td className="px-4 py-2 text-xs text-zinc-600 leading-snug">
                      {formatList(data.permanent_table[p]?.Enemies)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </PdfTable>
          </div>

          {/* 2. TEMPORARY FRIENDSHIP */}
          <div className="w-full flex flex-col">
            <PdfSectionHeader
              title={t.temporary}
              icon={RotateCw}
              className="mb-1"
            />
            <PdfTable className="w-full border border-zinc-200">
              <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
                <tr>
                  <th className="px-4 py-2 text-left w-1/6 border-r border-red-100 bg-[#ffe4e6]">
                    {t.planet}
                  </th>
                  <th className="px-4 py-2 text-left w-2/5">{t.friend}</th>
                  <th className="px-4 py-2 text-left w-2/5">{t.enemy}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {planets.map((p, i) => (
                  <tr
                    key={`temp-${i}`}
                    className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}
                  >
                    <td className="px-4 py-2 font-bold text-zinc-800 text-sm">
                      {p}
                    </td>
                    <td className="px-4 py-2 text-xs text-zinc-600 leading-snug">
                      {formatList(data.temporary_friendship[p]?.Friends)}
                    </td>
                    <td className="px-4 py-2 text-xs text-zinc-600 leading-snug">
                      {formatList(data.temporary_friendship[p]?.Enemies)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </PdfTable>
          </div>
        </div>
      </PdfPageLayout>

      {/* PAGE 2: FIVE FOLD FRIENDSHIP */}
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <FloralHeader
          titleEn={t.fiveFold}
          titleHi={t.titleHi}
          lang={lang as "en" | "hi"}
          className="mb-8 mt-4"
        />

        <div className="w-full h-full px-0 pt-2 pb-8 flex flex-col gap-4">
          {/* 3. FIVE-FOLD FRIENDSHIP */}
          <div className="w-full flex flex-col">
            <PdfSectionHeader
              title={t.fiveFold}
              icon={Handshake}
              className="mb-1"
            />
            <PdfTable className="w-full border border-zinc-200">
              <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
                <tr>
                  <th className="px-2 py-2 text-left border-r border-red-100 bg-[#ffe4e6]">
                    {t.planet}
                  </th>
                  <th className="px-2 py-2 text-left">{t.intimate}</th>
                  <th className="px-2 py-2 text-left">{t.friend}</th>
                  <th className="px-2 py-2 text-left">{t.neutral}</th>
                  <th className="px-2 py-2 text-left">{t.enemy}</th>
                  <th className="px-2 py-2 text-left">{t.bitter}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {planets.map((p, i) => {
                  const f = data.five_fold_friendship[p];
                  return (
                    <tr
                      key={`five-${i}`}
                      className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}
                    >
                      <td className="px-2 py-2 font-bold text-zinc-800 text-sm">
                        {p}
                      </td>
                      <td className="px-2 py-2 text-[10px] font-medium text-emerald-800">
                        {formatList(f?.IntimateFriend)}
                      </td>
                      <td className="px-2 py-2 text-[10px] text-zinc-600">
                        {formatList(f?.Friends)}
                      </td>
                      <td className="px-2 py-2 text-[10px] text-zinc-400">
                        {formatList(f?.Neutral)}
                      </td>
                      <td className="px-2 py-2 text-[10px] text-zinc-600">
                        {formatList(f?.Enemies)}
                      </td>
                      <td className="px-2 py-2 text-[10px] font-medium text-red-800">
                        {formatList(f?.BitterEnemy)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </PdfTable>
          </div>
        </div>
      </PdfPageLayout>
    </>
  );
};

export default FriendshipPage;
