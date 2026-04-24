"use client";
import React from "react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import PdfSectionHeader from "../ui/PdfSectionHeader";
import { Sparkles, Star, Home, Layers } from "lucide-react";
import { KPPlanetSignifications as PlanetSignificators } from "@/types/kpAstrology/kpPlanetSignifications";
import { KPHouseSignificators as HouseSignificators } from "@/types/kpAstrology/kpHouseSignificators";
import {
  resolveTranslations,
  kpSignificatorsTranslations,
  PLANET_NAMES_KP_HI,
  translateName,
} from "@/lib/i18n";
import type { Language } from "@/types/languages";

// --- COMPONENT ---
interface KpSignificatorsPageProps {
  lang: string;
  planets: PlanetSignificators | undefined | null;
  houses: HouseSignificators | undefined | null;
  loading: boolean;
}

const KpSignificatorsPage: React.FC<KpSignificatorsPageProps> = ({
  lang,
  planets,
  houses,
  loading,
}) => {
  const isHindi = lang === "hi";
  const tr = (text: string) => translateName(text, lang, PLANET_NAMES_KP_HI);
  const t = resolveTranslations(kpSignificatorsTranslations, lang as Language);

  // Show loader if loading is true OR if data is missing
  if (loading || !planets || !houses) {
    return (
      <PdfPageLayout lang={lang as "en" | "hi"}>
        <div className="flex flex-col items-center justify-center min-h-[600px] text-zinc-400 gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-serif italic text-lg">{t.loading}</p>
        </div>
      </PdfPageLayout>
    );
  }

  const planetRows = Object.entries(planets || {});
  const houseRows = Object.entries(houses || {});
  return (
    <PdfPageLayout lang={lang as "en" | "hi"}>
      <FloralHeader
        titleEn={t.titleEn}
        titleHi={t.titleHi}
        lang={lang as "en" | "hi"}
        className="mb-8 mt-4"
      />

      <div className="w-full h-full px-0 pt-2 pb-8 flex flex-col gap-6">
        {/* SECTION 1: PLANET VIEW */}
        <div className="w-full">
          <PdfSectionHeader
            title={t.planetSection}
            icon={Sparkles}
            className="mb-3"
          />
          <div className="grid grid-cols-3 gap-3">
            {planetRows.map(([planet, houses]) => (
              <div
                key={planet}
                className="bg-white border border-zinc-200 p-3 flex flex-col gap-2"
              >
                {/* Header: Planet Name */}
                <div className="flex items-center gap-2 border-b border-red-100 pb-2 mb-1">
                  <Star className="w-4 h-4 text-[#9F1239]" />
                  <span className="font-bold text-[#9F1239] leading-none pdf-body uppercase tracking-wider">
                    {tr(planet)}
                  </span>
                </div>
                {/* Body: House Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {houses.map((house: number) => (
                    <span
                      key={house}
                      className="inline-flex items-center justify-center px-2 py-0.5 bg-zinc-50 border border-zinc-200 text-zinc-800 pdf-caption font-bold"
                    >
                      {house}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: HOUSE VIEW */}
        <div className="w-full mt-2">
          <PdfSectionHeader
            title={t.houseSection}
            icon={Home}
            className="mb-3"
          />
          <div className="grid grid-cols-4 gap-3">
            {houseRows.map(([house, planets]) => (
              <div
                key={`h-${house}`}
                className="bg-white border border-zinc-200 p-3 flex flex-col gap-2"
              >
                {/* Header: House Number */}
                <div className="flex items-center gap-2 border-b border-red-100 pb-2 mb-1">
                  <Layers className="w-4 h-4 text-[#9F1239]" />
                  <span className="font-bold text-[#9F1239] leading-none pdf-body uppercase tracking-wider">
                    {isHindi ? `${t.housePrefix} ${house}` : `House ${house}`}
                  </span>
                </div>
                {/* Body: Planet List */}
                <div className="flex flex-wrap gap-1">
                  {planets.map((p: string) => (
                    <span
                      key={p}
                      className="inline-block px-2 py-0.5 pdf-caption uppercase tracking-wide font-bold bg-zinc-50 text-zinc-800 border border-zinc-200"
                    >
                      {isHindi ? tr(p) : p.substring(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PdfPageLayout>
  );
};

export default KpSignificatorsPage;
