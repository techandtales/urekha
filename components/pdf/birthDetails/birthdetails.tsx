"use client";
import { Language } from "@/types/languages";
import PdfPageLayout from "@/components/pdf/pageLayout";
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Compass,
  Activity,
} from "lucide-react";
import PanchangSection from "./birthPanchang";
import FloralHeader from "../floralHeader";
import PdfDataRow from "../ui/PdfDataRow";
import { useStore } from "@/lib/store";
import { resolveTranslations, birthDetailsTranslations } from "@/lib/i18n";
import { BirthDetails } from "@/types/birthDetails";
import { ExtendedKundliData } from "@/types/extended-horoscope/extendedKundli";

import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

// main function
export default function Birthdetails({
  lang,
  data: extendedPanchang,
  loading,
  error,
}: {
  lang: Language;
  data: ExtendedKundliData | null | undefined;
  loading?: boolean;
  error?: string | null;
}) {
  const { birthDetails } = useStore();

  const data: BirthDetails = {
    username: birthDetails.username || "-",
    dob: birthDetails.dob || "-",
    tob: birthDetails.tob || "-",
    timezone: birthDetails.timezone,
    latitude: birthDetails.latitude,
    longitude: birthDetails.longitude,
    pob: birthDetails.pob || "-",
    language: lang,
  };

  return (
    <PdfPageLayout lang={lang}>
      {/* 1. Floral Header (Serif Font Title) */}
      <FloralHeader titleEn="Birth Details" titleHi="जन्म विवरण" lang={lang} />

      {/* 2. Main Data Grid */}
      {data && <BirthDataSection data={data} />}

      {/* 3. Disclaimer */}
      <DataDisclaimer isHindi={lang === "hi"} />

      {/* 4. Panchang Table */}
      {loading ? (
        <div className="w-full max-w-5xl mx-auto mt-4 space-y-2 p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : error ? (
        <div className="w-full max-w-5xl mx-auto mt-4 p-4 border border-red-200 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : extendedPanchang ? (
        <PanchangSection data={extendedPanchang} isHindi={lang === "hi"} />
      ) : null}
    </PdfPageLayout>
  );
}

// --- SUB-COMPONENT: BIRTH DATA SECTION ---
const BirthDataSection = ({ data }: { data: BirthDetails }) => {
  const isHindi = data.language === "hi";
  const lang = isHindi ? "hi" : "en";
  const labels = resolveTranslations(
    birthDetailsTranslations,
    lang as Language,
  );

  const t = {
    title: labels.title,
    username: labels.username,
    labels: {
      date: labels.date,
      time: labels.time,
      place: labels.place,
      lat: labels.lat,
      long: labels.long,
      tz: labels.tz,
    },
    dateFormat: (dateStr: string) => {
      if (isHindi) return dateStr;
      return new Date(dateStr).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
  };

  return (
    <section className="w-full mb-1 px-4">
      <div className="w-full">
        <div className="grid grid-cols-2 justify-around">
          <h3 className="pdf-header text-zinc-800 mb-2 flex items-center gap-2">
            <Calendar size={14} className="text-orange-600" />
            {t.title}
          </h3>
          <h3 className="justify-self-end">
            {t.username && (
              <span className="pdf-body font-bold text-zinc-900 ml-auto">
                {data.username}
              </span>
            )}
          </h3>
        </div>
        <div className="h-px w-full bg-gray-200 mb-4"></div>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-y-4 gap-x-6">
          {/* Note: PdfDataRow now uses default typography standards internally. */}
          <PdfDataRow
            label={t.labels.date}
            value={t.dateFormat(
              data.dob instanceof Date ? data.dob.toISOString() : data.dob,
            )}
            icon={Calendar}
            className="border-b border-gray-100 pb-1"
          />
          <PdfDataRow
            label={t.labels.time}
            value={data.tob}
            icon={Clock}
            className="border-b border-gray-100 pb-1"
          />
          <PdfDataRow
            label={t.labels.place}
            value={data.pob || "-"}
            icon={MapPin}
            className="border-b border-gray-100 pb-1"
          />
          <PdfDataRow
            label={t.labels.lat}
            value={`${data.latitude.toFixed(4)}° N`}
            icon={Compass}
            className="border-b border-gray-100 pb-1"
          />
          <PdfDataRow
            label={t.labels.long}
            value={`${data.longitude.toFixed(4)}° E`}
            icon={Globe}
            className="border-b border-gray-100 pb-1"
          />
          <PdfDataRow
            label={t.labels.tz}
            value={data.timezone}
            icon={Activity}
            className="border-b border-gray-100 pb-1"
          />
        </div>
      </div>
    </section>
  );
};

// --- SUB-COMPONENT: DISCLAIMER ---
const DataDisclaimer = ({ isHindi = false }: { isHindi?: boolean }) => {
  const text = isHindi
    ? "इस दस्तावेज़ में सभी ज्योतिषीय गणनाएँ और विश्लेषण ऊपर दिए गए जन्म विवरण पर ही आधारित हैं। कृपया डेटा की सटीकता सुनिश्चित करें।"
    : "All astrological calculations and analyses in this document are strictly based on the birth details provided above. Please ensure the accuracy of this data.";

  return (
    <div className="w-full max-w-3xl mx-auto mt-2 mb-2 px-2">
      <div className="flex flex-col items-center text-center p-6 border border-zinc-200 bg-amber-50">
        {/* Disclaimer looks good in Serif (Formal/Legal look) */}
        <p
          className={`pdf-caption italic text-zinc-600`}
          style={{ letterSpacing: "0.02em" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
