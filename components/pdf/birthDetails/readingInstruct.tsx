"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { BookOpen, Clock, User, Feather, Info } from "lucide-react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import { useStore } from "@/lib/store";
import {
  resolveTranslations,
  reportGuideTranslations,
  GLOSSARY_TERMS,
} from "@/lib/i18n";
import type { Language } from "@/types/languages";

// Data is imported from centralized i18n
const TERMS = GLOSSARY_TERMS;

const ReportGuidePage = ({ lang }: { lang: string }) => {
  const { birthDetails } = useStore();
  const isHindi = lang === "hi";

  const t = resolveTranslations(reportGuideTranslations, lang as Language);

  // --- SUB-COMPONENT: TERM CARD (Fixed Logic) ---
  const TermCard = ({ item }: { item: any }) => (
    <div className="flex flex-col p-2 border border-zinc-200 h-full">
      {/* Title: Only show based on Language */}
      <div className="mb-1">
        <span className="text-pdf-body font-bold uppercase tracking-wider text-zinc-800">
          {isHindi ? item.hi : item.en}
        </span>
      </div>

      {/* Description: Only show based on Language */}
      <div>
        <p
          className={`text-[9.5pt] text-zinc-600 leading-relaxed ${isHindi ? "font-serif" : "font-sans"}`}
        >
          {isHindi ? item.descHi : item.descEn}
        </p>
      </div>
    </div>
  );

  // --- SUB-COMPONENT: SECTION ---
  const SectionBlock = ({ title, icon: Icon, items }: any) => (
    <div className="mb-2 break-inside-avoid">
      <div className="flex items-center gap-2 mb-1 pb-1 border-b border-red-100">
        <div className="text-[#9F1239]">
          <Icon size={14} />
        </div>
        <h3
          className={`pdf-header text-[#9F1239] ${isHindi ? "font-serif" : "font-serif"}`}
        >
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item: any, i: number) => (
          <TermCard key={i} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <PdfPageLayout lang={isHindi ? "hi" : "en"}>
      <div className="w-full h-full flex flex-col">
        {/* 1. Header (Integrated directly for better spacing control) */}
        <div className="flex flex-col items-center justify-center mb-2 pt-2">
          <h1
            className={`pdf-title uppercase tracking-wider ${isHindi ? "font-serif" : "font-serif"}`}
            style={{ color: UREKHA_COLORS.inkPrimary }}
          >
            {/* {isHindi ? t.headerHi : t.headerEn} */}
          </h1>
          <div className="w-24 h-0.5 bg-orange-300 mt-1 mb-1 opacity-50"></div>
        </div>

        {/* 2. Intro Box */}
        <div className="flex items-start gap-3 p-3 mb-3 border border-zinc-200 bg-zinc-50">
          <Info className="text-[#9F1239] shrink-0 mt-0.5" size={16} />
          <p
            className={`pdf-body text-sm font-medium text-zinc-700 leading-relaxed ${isHindi ? "font-serif" : "font-sans"}`}
          >
            {t.intro}
          </p>
        </div>

        {/* 3. Sections */}
        <div className="space-y-4">
          {/* A. Panchang */}
          <SectionBlock
            title={t.secPanchang}
            icon={Clock}
            items={TERMS.panchang}
          />

          {/* B. Identity */}
          <SectionBlock
            title={t.secIdentity}
            icon={User}
            items={TERMS.identity}
          />

          {/* C. Attributes */}
          <SectionBlock
            title={t.secAttr}
            icon={Feather}
            items={TERMS.attributes}
          />
        </div>

        {/* Footer Decor */}
        <div className="mt-auto mb-2 flex justify-center opacity-20">
          <BookOpen size={20} />
        </div>
      </div>
    </PdfPageLayout>
  );
};

export default ReportGuidePage;
