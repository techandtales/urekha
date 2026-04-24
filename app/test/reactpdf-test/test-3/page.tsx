"use client";
import React from "react";
import PdfTestShell, { type TestCase } from "@/components/test/PdfTestShell";
import ReactPdfFriendshipPage from "@/components/ReactPdfRendererPages/ReactPdfFriendshipPage";
import ReactPdfDoshaReportPage from "@/components/ReactPdfRendererPages/ReactPdfDoshaReportPage";
import ReactPdfSarvashtakavargaPage from "@/components/ReactPdfRendererPages/ReactPdfSarvashtakavargaPage";
import ReactPdfVimshottariDashaPage from "@/components/ReactPdfRendererPages/ReactPdfVimshottariDashaPage";
import ReactPdfYoginiDashaPage from "@/components/ReactPdfRendererPages/ReactPdfYoginiDashaPage";
import { useStore } from "@/lib/store";
import type { Language } from "@/types/languages";

const TEST_CASES: TestCase[] = [
  {
    id: "case-1",
    label: "Friendship Table",
    slugs: ["extended_friendship_table"],
    render: ({ lang }: { lang: Language }) => {
      const data = useStore.getState().jyotishamData.extendedHoro.friendshipTable?.response;
      return <ReactPdfFriendshipPage lang={lang} data={data as any} />;
    }
  },
  {
    id: "case-2",
    label: "Dosha Report",
    slugs: ["dosha_mangal", "dosha_kaalsarp", "dosha_manglik", "dosha_pitra"],
    render: ({ lang }: { lang: Language }) => {
      const d = useStore.getState().jyotishamData.dosha;
      const flatDosha = {
        mangal: d.mangal?.response,
        kaalsarp: d.kaalsarp?.response,
        pitra: d.pitra?.response,
        manglik_analysis: d.manglik?.response,
      };
      return (
        <ReactPdfDoshaReportPage 
          lang={lang} 
          data={flatDosha as any}
        />
      );
    }
  },
  {
    id: "case-3",
    label: "Sarvashtakvarga",
    slugs: ["ashtakvarga"],
    render: ({ lang }: { lang: Language }) => {
      const data = useStore.getState().jyotishamData.horoscope.ashtakvarga?.response;
      return <ReactPdfSarvashtakavargaPage lang={lang} data={data as any} />;
    }
  },
  {
    id: "case-4",
    label: "Vimshottari Dasha",
    slugs: ["dasha_current_maha_full"],
    render: ({ lang }: { lang: Language }) => {
      const data = useStore.getState().jyotishamData.dasha.currentMahadashaFull?.response;
      return <ReactPdfVimshottariDashaPage lang={lang} data={data as any} />;
    }
  },
  {
    id: "case-5",
    label: "Yogini Dasha",
    slugs: ["dasha_yogini_main"],
    render: ({ lang }: { lang: Language }) => {
      const data = useStore.getState().jyotishamData.dasha.yoginiDasha?.response;
      return <ReactPdfYoginiDashaPage lang={lang} data={data as any} />;
    }
  }
];

export default function Test3Page() {
  return (
    <PdfTestShell 
      title="Test 3: Strength & Dashas" 
      testCases={TEST_CASES} 
    />
  );
}
