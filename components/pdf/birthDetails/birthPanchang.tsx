"use client";
import { useEffect } from "react";
import { Star, Zap, Feather, Compass, Gem } from "lucide-react";
import { ExtendedKundliData as BirthExtendedKundali } from "@/types/extended-horoscope/extendedKundli";
import { resolveTranslations, panchangTranslations } from "@/lib/i18n";
import type { Language } from "@/types/languages";
// --- INTERFACES ---
export interface ExtendedPanchangData {
  // Basic Panchang
  tithi: string;
  yoga: string;
  karana: string;
  nakshatra: string;
  nakshatra_lord: string;
  nakshatra_pada: number | string;

  // Avakahada / Vedic Attributes
  gana: string;
  yoni: string;
  nadi: string;
  varna: string;
  vasya: string;
  paya: string;
  tatva: string;
  name_start: string;

  // Signs
  ascendant_sign: string;
  rasi: string; // Moon Sign
  rasi_lord: string;
  sun_sign: string;

  // Gems
  life_stone: string;
  lucky_stone: string;
  fortune_stone: string;
}

const PanchangSection = ({
  data,
  isHindi,
}: {
  data: BirthExtendedKundali;
  isHindi?: boolean;
}) => {
  // --- TRANSLATIONS ---
  const lang = isHindi ? "hi" : "en";
  const labels = resolveTranslations(panchangTranslations, lang as Language);
  const t = {
    titles: {
      panchang: labels.panchang,
      attributes: labels.attributes,
      signs: labels.signs,
      gems: labels.gems,
    },
    labels,
  };

  const DataRow = ({
    label,
    value,
    isEven,
  }: {
    label: string;
    value: string | number;
    isEven: boolean;
  }) => (
    <div
      className={`flex items-center justify-between px-3 py-2 border-b border-gray-100 ${isEven ? "bg-zinc-50" : "bg-white"}`}
    >
      <span className="pdf-label text-zinc-600 font-sans">{label}</span>
      <span
        className={`pdf-body font-bold text-zinc-900 ${isHindi ? "font-serif" : "font-serif"}`}
      >
        {value}
      </span>
    </div>
  );

  // --- REUSABLE: TABLE CONTAINER ---
  const TableBox = ({ title, icon: Icon, children }: any) => (
    <div className="flex flex-col border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center gap-2 px-3 py-2.5 bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100`}
      >
        <Icon size={16} />
        <span className="leading-none">{title}</span>
      </div>
      {/* Content */}
      <div className="flex flex-col bg-white">{children}</div>
    </div>
  );

  return (
    <section className="w-full py-4 px-0 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-2 gap-4">
          <TableBox title={t.titles.panchang} icon={Star}>
            <DataRow label={t.labels.tithi} value={data.tithi} isEven={false} />
            <DataRow label={t.labels.yoga} value={data.yoga} isEven={true} />
            <DataRow
              label={t.labels.karana}
              value={data.karana}
              isEven={false}
            />
            <DataRow
              label={t.labels.nakshatra}
              value={`${data.nakshatra} (${t.labels.lord}: ${data.nakshatra_lord})`}
              isEven={true}
            />
            <DataRow
              label={t.labels.pada}
              value={data.nakshatra_pada}
              isEven={false}
            />
          </TableBox>

          <TableBox title={t.titles.attributes} icon={Feather}>
            <div className="grid grid-cols-1 divide-y divide-orange-100">
              <DataRow label={t.labels.gana} value={data.gana} isEven={false} />
              <DataRow label={t.labels.yoni} value={data.yoni} isEven={true} />
              <DataRow label={t.labels.nadi} value={data.nadi} isEven={false} />
              <DataRow
                label={t.labels.varna}
                value={data.varna}
                isEven={true}
              />
              <DataRow
                label={t.labels.vasya}
                value={data.vasya}
                isEven={false}
              />
              <DataRow
                label={t.labels.tatva}
                value={data.tatva}
                isEven={true}
              />
              <DataRow label={t.labels.paya} value={data.paya} isEven={false} />
              <DataRow
                label={t.labels.name}
                value={data.name_start}
                isEven={true}
              />
            </div>
          </TableBox>

          <TableBox title={t.titles.signs} icon={Compass}>
            <DataRow
              label={t.labels.asc}
              value={data.ascendant_sign}
              isEven={false}
            />
            <DataRow
              label={t.labels.moon}
              value={`${data.rasi} (${t.labels.lord}: ${data.rasi_lord})`}
              isEven={true}
            />
            <DataRow
              label={t.labels.sun}
              value={data.sun_sign}
              isEven={false}
            />
          </TableBox>

          <TableBox title={t.titles.gems} icon={Gem}>
            <div className="flex flex-col h-full bg-zinc-50">
              {/* Custom Row for Gems to make them pop */}
              <div className="flex-1 flex items-center justify-between px-3 py-2 border-b border-gray-200">
                <span className="pdf-label text-gray-500">
                  {t.labels.lStone}
                </span>
                <span className="pdf-body font-bold text-red-700">
                  {data.life_stone}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-between px-3 py-2 border-b border-gray-200">
                <span className="pdf-label text-gray-500">
                  {t.labels.lkStone}
                </span>
                <span className="pdf-body font-bold text-green-700">
                  {data.lucky_stone}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-between px-3 py-2">
                <span className="pdf-label text-gray-500">
                  {t.labels.fStone}
                </span>
                <span className="pdf-body font-bold text-blue-800">
                  {data.fortune_stone}
                </span>
              </div>
            </div>
          </TableBox>
        </div>

        <div className="flex justify-center mt-6 opacity-30">
          <div className="h-1 w-24 bg-linear-to-r from-red-500 via-orange-500 to-green-500"></div>
        </div>
      </div>
    </section>
  );
};

export default PanchangSection;
