"use client";

import "@/components/pipeline/pipeline-progress.css";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import PremiumPipelineUI from "@/components/pipeline/PremiumPipelineUI";
import type { BaseArgs } from "@/lib/pipeline/constants";
import type { Language } from "@/types/languages";


// ── Pipeline Content ──

const PipelinePageContent = () => {
  const router = useRouter();
  const { birthDetails } = useStore();
  const lang: Language = birthDetails.language;

  // Derive args from birth details
  const args: BaseArgs | null = React.useMemo(() => {
    if (!birthDetails.username || !birthDetails.dob || !birthDetails.tob) {
      return null;
    }

    // Backend expects DD/MM/YYYY format
    let dateStr: string;
    if (birthDetails.dob instanceof Date) {
      const d = birthDetails.dob;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      dateStr = `${dd}/${mm}/${yyyy}`;
    } else {
      dateStr = String(birthDetails.dob);
    }

    return {
      date: dateStr,
      time: birthDetails.tob as string,
      latitude: birthDetails.latitude,
      longitude: birthDetails.longitude,
      tz: birthDetails.timezone,
      lang,
    };
  }, [birthDetails, lang]);

  // ── No birth details ──
  if (!args) {
    return (
      <div className="pipeline-page">
        <div className="pipeline-page-header">
          <h1 className="pipeline-page-title">Data Pipeline</h1>
          <p className="pipeline-page-subtitle">
            No birth details found. Please go back and submit the form.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-2 bg-[#00ff94] text-black rounded-lg font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Pipeline Progress View ──
  return (
    <div className="pipeline-page">
      <PremiumPipelineUI
        args={args}
        onComplete={() => router.push("/pdfreport")}
        onCancel={() => router.push("/")}
      />
    </div>
  );
};

export default function PipelinePage() {
  return (
    <Suspense
      fallback={
        <div className="pipeline-page">
          <div className="pipeline-page-header">
            <h1 className="pipeline-page-title">Loading Pipeline...</h1>
          </div>
        </div>
      }
    >
      <PipelinePageContent />
    </Suspense>
  );
}
