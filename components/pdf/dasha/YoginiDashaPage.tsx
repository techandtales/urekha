"use client";
import React from "react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import PdfTable from "../ui/PdfTable";
import { Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  resolveTranslations,
  yoginiTranslations,
  YOGINI_NAMES_HI,
  PLANET_NAMES_HI,
  translateName,
} from "@/lib/i18n";
import type { Language } from "@/types/languages";

// --- TYPES ---
export interface YoginiDashaResponse {
  dasha_list: string[];
  dasha_end_dates: string[];
  dasha_lord_list: string[];
  start_date?: number; // Not clear how to use, ignoring for now or using as index offset
}

//     "Ulka",
//     "Siddha",
//     "Sankata",
//     "Mangala",
//     "Pingala",
//     "Dhanya",
//     "Bhramari",
//     "Bhadrika",
//     "Ulka",
//     "Siddha",
//     "Sankata",
//     "Mangala",
//     "Pingala",
//     "Dhanya",
//     "Bhramari",
//     "Bhadrika",
//     "Ulka",
//     "Siddha",
//     "Sankata",
//     "Mangala",
//     "Pingala",
//     "Dhanya",
//     "Bhramari",
//   ],
//   dasha_end_dates: [
//     "Sat, Dec 14, 2024, 12:00:00 AM",
//     "Sat, Dec 14, 2030, 12:00:00 AM",
//     "Mon, Dec 14, 2037, 12:00:00 AM",
//     "Thu, Dec 14, 2045, 12:00:00 AM",
//     "Fri, Dec 14, 2046, 12:00:00 AM",
//     "Mon, Dec 14, 2048, 12:00:00 AM",
//     "Thu, Dec 14, 2051, 12:00:00 AM",
//     "Tue, Dec 14, 2055, 12:00:00 AM",
//     "Tue, Dec 14, 2060, 12:00:00 AM",
//     "Tue, Dec 14, 2066, 12:00:00 AM",
//     "Thu, Dec 14, 2073, 12:00:00 AM",
//     "Sun, Dec 14, 2081, 12:00:00 AM",
//     "Mon, Dec 14, 2082, 12:00:00 AM",
//     "Thu, Dec 14, 2084, 12:00:00 AM",
//     "Sun, Dec 14, 2087, 12:00:00 AM",
//     "Fri, Dec 14, 2091, 12:00:00 AM",
//     "Fri, Dec 14, 2096, 12:00:00 AM",
//     "Thu, Dec 14, 2102, 12:00:00 AM",
//     "Sat, Dec 14, 2109, 12:00:00 AM",
//     "Tue, Dec 14, 2117, 12:00:00 AM",
//     "Wed, Dec 14, 2118, 12:00:00 AM",
//     "Sat, Dec 14, 2120, 12:00:00 AM",
//     "Tue, Dec 14, 2123, 12:00:00 AM",
//     "Sun, Dec 14, 2127, 12:00:00 AM",
//   ],
//   dasha_lord_list: [
//     "Mercury",
//     "Saturn",
//     "Venus",
//     "Rahu/Ketu",
//     "Moon",
//     "Sun",
//     "Jupiter",
//     "Mars",
//     "Mercury",
//     "Saturn",
//     "Venus",
//     "Rahu/Ketu",
//     "Moon",
//     "Sun",
//     "Jupiter",
//     "Mars",
//     "Mercury",
//     "Saturn",
//     "Venus",
//     "Rahu/Ketu",
//     "Moon",
//     "Sun",
//     "Jupiter",
//     "Mars",
//     "Mercury",
//     "Saturn",
//     "Venus",
//     "Rahu/Ketu",
//     "Moon",
//     "Sun",
//     "Jupiter",
//     "Mars",
//   ],
// };

// --- COMPONENT ---
interface YoginiDashaPageProps {
  lang: string;
  data?: YoginiDashaResponse;
}

const YoginiDashaPage: React.FC<YoginiDashaPageProps> = ({ lang, data }) => {
  const { birthDetails } = useStore();
  const isHindi = lang === "hi";
  const t = resolveTranslations(yoginiTranslations, lang as Language);

  const trYogini = (text: string) => translateName(text, lang, YOGINI_NAMES_HI);
  const trLord = (text: string) => translateName(text, lang, PLANET_NAMES_HI);

  // Process data into rows
  const rows = data?.dasha_list.map((dasha, i) => {
    const lord = data?.dasha_lord_list[i];
    const endRaw = data?.dasha_end_dates[i] || "";
    let endDate = String(endRaw);
    const parsedEnd = new Date(endRaw);
    if (!isNaN(parsedEnd.getTime())) {
      endDate = parsedEnd.toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      // Fallback: clean up the raw string (e.g., remove time part)
      endDate = endDate.split(",").slice(0, 2).join(",").trim() || endDate;
    }

    // Calculate start date (previous end date)
    // For the first one, we don't have a start date from this list.
    // We'll leave it blank or labeled "-"
    let startDate = "-";
    if (i > 0) {
      const prevEnd = data?.dasha_end_dates[i - 1] || "";
      startDate = String(prevEnd);
      const parsedStart = new Date(prevEnd);
      if (!isNaN(parsedStart.getTime())) {
        startDate = parsedStart.toLocaleDateString(
          isHindi ? "hi-IN" : "en-IN",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        );
      } else {
        startDate =
          startDate.split(",").slice(0, 2).join(",").trim() || startDate;
      }
    }

    return { dasha, lord, startDate, endDate };
  });

  return (
    <PdfPageLayout lang={lang as "en" | "hi"}>
      <FloralHeader
        titleEn={t.titleEn}
        titleHi={t.titleHi}
        lang={lang as "en" | "hi"}
        className="mb-4 mt-4"
      />

      <div className="w-full h-full px-8 pt-2 pb-4 flex flex-col gap-2">
        {/* Table */}
        <div className="w-full bg-white border border-zinc-200 overflow-hidden">
          <PdfTable className="border-0">
            <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
              <tr>
                <th className="px-5 py-2 text-left w-[22%] border-r border-red-100 bg-[#ffe4e6]">
                  {t.dasha}
                </th>
                <th className="px-5 py-2 text-left w-[18%]">{t.lord}</th>
                <th className="px-5 py-2 text-left w-[30%]">{t.start}</th>
                <th className="px-5 py-2 text-left w-[30%]">{t.end}</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows?.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 last:border-0 ${
                    i % 2 !== 0 ? "bg-zinc-50" : "bg-white"
                  }`}
                >
                  <td className="px-5 py-1.5 font-bold text-[#111827] pdf-caption border-r border-gray-100 capitalize">
                    {trYogini(row.dasha)}
                  </td>
                  <td className="px-5 py-1.5 font-bold text-gray-900 bg-green-50/50 pdf-caption">
                    {trLord(row.lord)}
                  </td>
                  <td className="px-3 py-1.5 text-gray-600 font-mono pdf-caption text-[10px]">
                    {row.startDate}
                  </td>
                  <td className="px-3 py-1.5 text-gray-600 font-mono pdf-caption text-[10px]">
                    {row.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </PdfTable>
        </div>
      </div>
    </PdfPageLayout>
  );
};

export default YoginiDashaPage;
