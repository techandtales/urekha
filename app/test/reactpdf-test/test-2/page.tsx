"use client";

import React from "react";
import PdfTestShell, { type TestCase } from "@/components/test/PdfTestShell";
import ReactPdfBirthDetailsPage from "@/components/ReactPdfRendererPages/ReactPdfBirthDetailsPage";
import ReactPdfLagnaProfilePage from "@/components/ReactPdfRendererPages/ReactPdfLagnaProfilePage";
import ReactPdfPlanetaryDetailsPage from "@/components/ReactPdfRendererPages/ReactPdfPlanetaryDetailsPage";
import ReactPdfDivisionalChartsPage from "@/components/ReactPdfRendererPages/ReactPdfDivisionalChartsPage";
import ReactPdfAshtakavargaPage from "@/components/ReactPdfRendererPages/ReactPdfAshtakavargaPage";
import { useStore } from "@/lib/store";

import type { Language } from "@/types/languages";

const TEST_CASES: TestCase[] = [
  {
    id: "case-1",
    label: "Birth Details",
    slugs: ["extended_kundli"], 
    render: ({ lang }: { lang: Language }) => {
      const data = useStore.getState().jyotishamData.extendedHoro.extendedKundli?.response;
      return <ReactPdfBirthDetailsPage lang={lang} data={data as any} />;
    }
  },
  {
    id: "case-2",
    label: "Lagna Profile",
    slugs: ["ascendant_report"],
    render: ({ lang }: { lang: Language }) => {
      const data = useStore.getState().jyotishamData.horoscope.ascendantReport?.response;
      return <ReactPdfLagnaProfilePage lang={lang} data={data as any} />;
    }
  },
  {
    id: "case-3",
    label: "Planet Details",
    slugs: ["planet_details"],
    render: ({ lang }: { lang: Language }) => {
      const data = useStore.getState().jyotishamData.horoscope.planetDetails?.response;
      return <ReactPdfPlanetaryDetailsPage lang={lang} data={data as any} />;
    }
  },
  {
    id: "case-4",
    label: "Divisional Charts",
    slugs: [
      "divisional_chart_D1", "chart_image_D1",
      "divisional_chart_D9", "chart_image_D9",
      "transit_chart"
    ],
    render: ({ lang }: { lang: Language }) => {
      const state = useStore.getState().jyotishamData;
      return (
        <ReactPdfDivisionalChartsPage 
          lang={lang} 
          chartData={state.horoscope.divisionalCharts as any}
          chartImages={state.charts.divisionalChartSvgs as any}
          transitImage={state.charts.transitChartSvg}
        />
      );
    }
  },
  {
    id: "case-5",
    label: "Ashtakavarga",
    slugs: ["binnashtakvarga"], 
    render: ({ lang }: { lang: Language }) => {
      const data = useStore.getState().jyotishamData.horoscope.binnashtakvarga?.response;
      return <ReactPdfAshtakavargaPage lang={lang} data={data as any} />;
    }
  }
];

export default function Test2Page() {
  return (
    <PdfTestShell 
      title="Test 2: Core Horoscope & Details" 
      testCases={TEST_CASES} 
    />
  );
}
