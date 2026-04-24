"use client";
import React from "react";
import PdfTable from "../ui/PdfTable";
import { Calendar, ChevronRight } from "lucide-react";
import {
  resolveTranslations,
  dashaTableTranslations,
  PLANET_NAMES_HI,
  translateName,
} from "@/lib/i18n";
import type { Language } from "@/types/languages";

// --- TYPES ---
export interface DashaPeriod {
  name: string;
  start: string;
  end: string;
}

interface DashaTableProps {
  title: string;
  data: DashaPeriod[];
  highlightName?: string; // If matches row.name, highlight it
  lang: "en" | "hi";
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

const DashaTable: React.FC<DashaTableProps> = ({
  title,
  data,
  highlightName,
  lang,
  icon: Icon = Calendar,
  className,
}) => {
  const t = resolveTranslations(dashaTableTranslations, lang as Language);
  const tr = (text: string) => translateName(text, lang, PLANET_NAMES_HI);

  // Format date helper (optional - assuming string comes formatted, or we pars it)
  // The provided data formats are "Sat Aug 22 2015". We might want to clean this up or keep as is.
  // I will just display as is for now, or maybe make it cleaner if needed.

  return (
    <div
      className={`w-full bg-white border border-zinc-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-zinc-50 px-3 py-1.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 rounded-md">
            <Icon className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="pdf-header text-base text-[#111827]">{title}</h3>
        </div>
      </div>

      {/* Table */}
      <PdfTable className="w-full">
        <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
          <tr>
            <th className="px-3 py-2 text-left w-[33%] border-r border-red-100 bg-[#ffe4e6]">
              {t.planet}
            </th>
            <th className="px-3 py-2 text-left w-[33%]">{t.startDate}</th>
            <th className="px-3 py-2 text-left w-[33%]">{t.endDate}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isHighlighted = highlightName && row.name === highlightName;
            return (
              <tr
                key={i}
                className={`border-b border-gray-100 last:border-0 ${
                  isHighlighted
                    ? "bg-orange-50"
                    : i % 2 !== 0
                      ? "bg-zinc-50"
                      : "bg-white"
                }`}
              >
                <td className="px-3 py-1.5 border-r border-gray-100">
                  <div className="flex items-center gap-2">
                    {isHighlighted && (
                      <ChevronRight className="w-3 h-3 text-orange-600 font-bold" />
                    )}
                    <span
                      className={`text-xs ${isHighlighted ? "pdf-body font-bold text-[#9F1239]" : "pdf-caption font-bold text-[#111827]"}`}
                    >
                      {tr(row.name)}
                    </span>
                  </div>
                </td>
                <td
                  className={`px-3 py-1.5 text-xs ${isHighlighted ? "pdf-caption text-orange-900 font-semibold" : "pdf-caption text-gray-600"}`}
                >
                  {row.start}
                </td>
                <td
                  className={`px-3 py-1.5 text-xs ${isHighlighted ? "pdf-caption text-orange-900 font-semibold" : "pdf-caption text-gray-600"}`}
                >
                  {row.end}
                </td>
              </tr>
            );
          })}
        </tbody>
      </PdfTable>
    </div>
  );
};

export default DashaTable;
