"use client";
import React from "react";
import PdfTable from "../ui/PdfTable";
import { Star } from "lucide-react";

// --- TYPES ---
export interface BavTableData {
  sun: number[];
  moon: number[];
  mars: number[];
  mercury: number[];
  jupiter: number[];
  venus: number[];
  saturn: number[];
  ascendant: number[];
  Total: number[];
}

interface BavTableProps {
  planetName: string; // The main planet for whom this BAV is calculated
  data?: BavTableData;
  lang: "en" | "hi";
  className?: string; // To add spacing
}

// --- TRANSLATION MAPS ---
const LABEL_HI: Record<string, string> = {
  sun: "सूर्य",
  moon: "चंद्र",
  mars: "मंगल",
  mercury: "बुध",
  jupiter: "गुरु",
  venus: "शुक्र",
  saturn: "शनि",
  ascendant: "लग्न",
  Total: "कुल (Total)",
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

const BavTable: React.FC<BavTableProps> = ({
  planetName,
  data,
  lang,
  className,
}) => {
  const isHindi = lang === "hi";
  const signs = isHindi ? SIGNS_HI : SIGNS_EN;

  // Ordered list of rows to render
  const rowKeys: (keyof BavTableData)[] = [
    "sun",
    "moon",
    "mars",
    "mercury",
    "jupiter",
    "venus",
    "saturn",
    "ascendant",
  ];

  // Helper to translate labels
  const getLabel = (key: string) => {
    if (!isHindi) return key.charAt(0).toUpperCase() + key.slice(1);
    return LABEL_HI[key] || key;
  };

  // Helper to translate planet name
  const getPlanetName = (name: string) => {
    if (!isHindi) return name;
    return LABEL_HI[name.toLowerCase()] || name;
  };

  return (
    <div
      className={`w-full bg-white border border-zinc-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-zinc-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
        <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
        <h3 className="pdf-header text-[#111827] uppercase tracking-wider">
          {isHindi
            ? `${getPlanetName(planetName)} का भिन्नाष्टक वर्ग`
            : `Binnashtakavarga of ${planetName}`}
        </h3>
      </div>

      {/* Table */}
      <PdfTable className="w-full">
        <thead className="bg-[#FFF1F2] text-[#9F1239] pdf-label border-b border-red-100">
          <tr>
            <th className="px-4 py-3 text-left w-[12%] border-r border-red-100 bg-[#ffe4e6]">
              {isHindi ? "ग्रह" : "Planet"}
            </th>
            {signs.map((sign, i) => (
              <th key={i} className="px-2 py-3 text-center w-[7%]">
                {sign}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Contribution Rows */}
          {rowKeys.map((key, i) => (
            <tr
              key={key}
              className={`border-b border-gray-100 last:border-0 ${
                i % 2 !== 0 ? "bg-zinc-50" : "bg-white"
              }`}
            >
              <td className="px-4 py-3 font-semibold text-[#111827] pdf-caption border-r border-gray-100 capitalize">
                {getLabel(key)}
              </td>
              {data?.[key]?.map((val, j) => (
                <td
                  key={j}
                  className={`px-2 py-3 text-center pdf-body font-medium ${
                    val === 1
                      ? "text-gray-900 font-bold bg-green-50/50"
                      : "text-gray-300"
                  }`}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
          {/* Total Row */}
          <tr className="bg-[#FFF1F2] border-t-2 border-red-100 font-bold">
            <td className="px-4 py-3 text-[#9F1239] pdf-caption uppercase border-r border-red-200">
              {isHindi ? "कुल" : "Total"}
            </td>
            {data?.Total?.map((val, j) => (
              <td
                key={j}
                className="px-2 py-3 text-center pdf-body text-[#9F1239]"
              >
                {val}
              </td>
            ))}
          </tr>
        </tbody>
      </PdfTable>
    </div>
  );
};

export default BavTable;
