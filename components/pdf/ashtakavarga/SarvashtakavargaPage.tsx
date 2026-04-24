"use client";
import React from "react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import PdfTable from "../ui/PdfTable";
import { Grid, Star } from "lucide-react";
import { useStore } from "@/lib/store";

// --- TYPES ---
export interface SarvashtakavargaResponse {
  ashtakvarga_order: string[]; // ["Sun", "Moon", ...]
  ashtakvarga_points: number[][]; // 7 arrays of 12 numbers
  ashtakvarga_total: number[]; // 1 array of 12 numbers
}

// --- TRANSLATION MAPS ---
const PLANET_HI: Record<string, string> = {
  Sun: "सूर्य",
  Moon: "चंद्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
  Ascendant: "लग्न",
};

const SIGNS_EN = [
  "Ar",
  "Ta",
  "Ge",
  "Cn",
  "Le",
  "Vi",
  "Li",
  "Sc",
  "Sa",
  "Cp",
  "Aq",
  "Pi",
];
const SIGNS_HI = [
  "मेष",
  "वृष",
  "मि",
  "कर्क",
  "सिंह",
  "कन्या",
  "तुला",
  "वृश्व",
  "धनु",
  "मकर",
  "कुंभ",
  "मीन",
];

// --- COMPONENT ---
interface SarvashtakavargaPageProps {
  lang: string;
  data?: SarvashtakavargaResponse;
}

const SarvashtakavargaPage: React.FC<SarvashtakavargaPageProps> = ({
  lang,
  data,
}) => {
  const { birthDetails } = useStore();
  const isHindi = lang === "hi";
  const signs = isHindi ? SIGNS_HI : SIGNS_EN;

  const t = {
    titleEn: "Sarvashtakavarga Summary",
    titleHi: "सर्वाष्टक वर्ग (Summary)",
    heading: isHindi ? "सर्वाष्टक वर्ग सारणी" : "Sarvashtakavarga Table",
    subHeading: isHindi
      ? "सभी ग्रहों का संयुक्त अष्टकवर्ग योग"
      : "Consolidated Ashtakavarga Points for all Planets",
    planet: isHindi ? "ग्रह" : "Planet",
    total: isHindi ? "कुल योग" : "Total (SAV)",
  };

  // Helper to translate planet name
  const tr = (name: string) => {
    if (!isHindi) return name;
    return PLANET_HI[name] || name;
  };

  return (
    <PdfPageLayout lang={lang as "en" | "hi"}>
      <FloralHeader
        titleEn={t.titleEn}
        titleHi={t.titleHi}
        lang={lang as "en" | "hi"}
        className="mb-8 mt-4"
      />

      <div className="w-full h-full px-0 pt-6 pb-8 flex flex-col gap-6">
        {/* Heading Section */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <div className="p-2 bg-red-50 rounded-lg">
            <Grid className="text-[#bf0202ff] w-6 h-6" />
          </div>
          <div>
            <h2 className="pdf-header text-[#bc0b0bde] uppercase tracking-wide">
              {t.heading}
            </h2>
            <p className="pdf-caption text-[#4B5563] mt-1">{t.subHeading}</p>
          </div>
        </div>

        {/* SAV TABLE */}
        <div className="w-full bg-white border border-zinc-200 overflow-hidden mt-4">
          <PdfTable className="w-full">
            <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
              <tr>
                <th className="px-4 py-4 text-left w-[15%] border-r border-red-100 bg-[#ffe4e6]">
                  {t.planet}
                </th>
                {signs.map((sign, i) => (
                  <th key={i} className="px-2 py-4 text-center w-[7%]">
                    {sign}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Planet Rows */}
              {data?.ashtakvarga_order.map((planet, i) => (
                <tr
                  key={planet}
                  className={`border-b border-gray-100 last:border-0 ${
                    i % 2 !== 0 ? "bg-zinc-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-4 font-bold text-[#111827] pdf-body border-r border-gray-100 flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-600" />
                    {tr(planet)}
                  </td>
                  {data?.ashtakvarga_points[i]?.map((val, j) => (
                    <td
                      key={j}
                      className={`px-2 py-4 text-center pdf-body font-medium ${
                        val >= 5
                          ? "text-emerald-700 bg-emerald-50/50 font-bold"
                          : val <= 3
                            ? "text-red-700 bg-red-50/30"
                            : "text-gray-600"
                      }`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Total Row (SAV) */}
              <tr className="bg-yellow-50 border-t-2 border-yellow-200 font-bold">
                <td className="px-4 py-5 text-yellow-900 pdf-label uppercase border-r border-yellow-200">
                  {t.total}
                </td>
                {data?.ashtakvarga_total.map((val, j) => (
                  <td
                    key={j}
                    className="px-2 py-5 text-center text-lg text-yellow-900 pdf-body"
                  >
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </PdfTable>
        </div>

        {/* Interpretation Note */}
        <div className="mt-6 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-600 italic">
          <p className="pdf-caption">
            {isHindi
              ? "नोट: २८ या उससे अधिक बिंदु शुभ माने जाते हैं। ३०+ बिंदु उत्कृष्ट परिणाम दर्शाते हैं।"
              : "Note: Points 28 or above are considered distinct data. Points 30+ indicate excellent results for that House."}
          </p>
        </div>
      </div>
    </PdfPageLayout>
  );
};

export default SarvashtakavargaPage;
