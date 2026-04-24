"use client";
import React from "react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import BavTable, { BavTableData } from "./BavTable";
import { Grid } from "lucide-react";
import { useStore } from "@/lib/store";

// --- TYPES ---
export interface BavResponse {
  [planetName: string]: BavTableData;
}

// --- COMPONENT ---
interface AshtakavargaPageProps {
  lang: string;
  data?: BavResponse;
}

const AshtakavargaPage: React.FC<AshtakavargaPageProps> = ({ lang, data }) => {
  const { birthDetails } = useStore();
  const isHindi = lang === "hi";

  const t = {
    titleEn: "Binnashtakavarga Tables",
    titleHi: "भिन्नाष्टक वर्ग सारणी",
    heading: isHindi
      ? "सातों ग्रहों का भिन्नाष्टक वर्ग"
      : "Binnashtakavarga of 7 Planets",
    subHeading: isHindi
      ? "प्रत्येक ग्रह का अपनी अष्टकवर्ग सारणी में योगदान"
      : "Detailed contribution matrices for each planet",
  };

  // Planets order
  const planetOrder = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
  ];

  // Group into pages of 2 tables max (and increase internal sizing) to fill A3
  const ITEMS_PER_PAGE = 1;
  const pages = [];
  for (let i = 0; i < planetOrder.length; i += ITEMS_PER_PAGE) {
    pages.push(planetOrder.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <>
      {pages.map((planetGroup, pageIndex) => (
        <PdfPageLayout key={pageIndex} lang={lang as "en" | "hi"}>
          <FloralHeader
            titleEn={t.titleEn}
            titleHi={t.titleHi}
            lang={lang as "en" | "hi"}
            className="mb-6 mt-4"
          />

          <div className="w-full h-full px-8 pt-2 pb-8 flex flex-col gap-6">
            {/* Header Section only on first page if desired, or small header on each */}
            {pageIndex === 0 && (
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Grid className="text-[#bf0202ff] w-6 h-6" />
                </div>
                <div>
                  <h2 className="pdf-header text-[#bc0b0bde] uppercase tracking-wide">
                    {t.heading}
                  </h2>
                  <p className="pdf-caption text-[#4B5563] mt-1">
                    {t.subHeading}
                  </p>
                </div>
              </div>
            )}
            {/* Tables: Single Table per page for A4 */}
            <div className="flex flex-col">
              {planetGroup.map((planet) => (
                <BavTable
                  key={planet}
                  planetName={planet}
                  data={data ? data[planet] : undefined}
                  lang={lang as "en" | "hi"}
                />
              ))}
            </div>
          </div>
        </PdfPageLayout>
      ))}
    </>
  );
};

export default AshtakavargaPage;
