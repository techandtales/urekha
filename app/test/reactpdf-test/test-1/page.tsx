"use client";

import React from "react";
import PdfTestShell, { type TestCase } from "@/components/test/PdfTestShell";
import ReactPdfCoverPage from "@/components/ReactPdfRendererPages/ReactPdfCoverPage";
import ReactPdfIntroPage from "@/components/ReactPdfRendererPages/ReactPdfIntroPage";
import ReactPdfIndexPage from "@/components/ReactPdfRendererPages/ReactPdfIndexPage";
import ReactPdfReportGuidePage from "@/components/ReactPdfRendererPages/ReactPdfReportGuidePage";
import ReactPdfHowToReadKundliPage from "@/components/ReactPdfRendererPages/ReactPdfHowToReadKundliPage";

import type { Language } from "@/types/languages";

const TEST_CASES: TestCase[] = [
  {
    id: "case-1",
    label: "Cover Page",
    slugs: [], // Minimal store requirement
    render: ({ lang }: { lang: Language }) => (
      <ReactPdfCoverPage 
        lang={lang} 
      />
    )
  },
  {
    id: "case-2",
    label: "Introduction",
    slugs: [],
    render: ({ lang }: { lang: Language }) => <ReactPdfIntroPage lang={lang} />
  },
  {
    id: "case-3",
    label: "Index / TOC",
    slugs: [],
    render: ({ lang }: { lang: Language }) => (
      <ReactPdfIndexPage 
        lang={lang} 
      />
    )
  },
  {
    id: "case-4",
    label: "Report Guide",
    slugs: [],
    render: ({ lang }: { lang: Language }) => <ReactPdfReportGuidePage lang={lang} />
  },
  {
    id: "case-5",
    label: "How to Read",
    slugs: [],
    render: ({ lang }: { lang: Language }) => <ReactPdfHowToReadKundliPage lang={lang} />
  }
];

export default function Test1Page() {
  return (
    <PdfTestShell 
      title="Test 1: Fundamentals & Intro" 
      testCases={TEST_CASES} 
    />
  );
}
