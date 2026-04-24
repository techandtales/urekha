"use client";

import React from "react";
import PdfTestShell, { TestCase } from "@/components/test/PdfTestShell";
import ReactPdfKpPlanetsPage from "@/components/ReactPdfRendererPages/ReactPdfKpPlanetsPage";
import ReactPdfKpHousesPage from "@/components/ReactPdfRendererPages/ReactPdfKpHousesPage";
import ReactPdfKpSignificatorsPage from "@/components/ReactPdfRendererPages/ReactPdfKpSignificatorsPage";
import ReactPdfPredictionsView, { ReactPdfPredictionPages } from "@/components/ReactPdfRendererPages/predictions/ReactPdfPredictionsView";
import { useStore } from "@/lib/store";

const TEST_CASES: TestCase[] = [
  {
    id: "case-1",
    label: "KP Planets",
    slugs: ["kp_planet_details"],
    render: ({ lang }) => {
      const data = useStore.getState().jyotishamData.kpAstrology.planetDetails;
      return <ReactPdfKpPlanetsPage lang={lang} data={data as any} />;
    }
  },
  {
    id: "case-2",
    label: "KP Houses",
    slugs: ["kp_cusp_details"],
    render: ({ lang }) => {
      const data = useStore.getState().jyotishamData.kpAstrology.cuspDetails;
      return <ReactPdfKpHousesPage lang={lang} houses={data as any} />;
    }
  },
  {
    id: "case-3",
    label: "KP Significators",
    slugs: ["kp_significators", "kp_house_significators"],
    render: ({ lang }) => {
      const kp = useStore.getState().jyotishamData.kpAstrology;
      return (
        <ReactPdfKpSignificatorsPage 
          lang={lang} 
          planets={kp.significators as any}
          houses={kp.houseSignificators as any}
        />
      );
    }
  },
  {
    id: "case-4",
    label: "Live Prediction",
    slugs: [],
    predictionSlugs: ["varna_check"], // Example prediction
    render: () => {
      // Pulls directly from store
      return <ReactPdfPredictionsView />;
    }
  },
  {
    id: "case-5",
    label: "Structured Verification",
    slugs: [],
    render: ({ lang, mockStructured }) => {
      // Use the named export to pass custom mock data
      const mockPredictions = {
        "verification-test": {
          status: "success",
          data: JSON.stringify(mockStructured),
          structured: mockStructured
        }
      };

      return (
        <ReactPdfPredictionPages 
          lang={lang} 
          predictions={mockPredictions}
        />
      );
    }
  }
];

export default function Test4Page() {
  return (
    <PdfTestShell 
      title="Test 4: KP Astrology & AI Core" 
      testCases={TEST_CASES} 
    />
  );
}
