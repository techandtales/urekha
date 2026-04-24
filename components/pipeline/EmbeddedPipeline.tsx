"use client";

import React from "react";
import { useStore } from "@/lib/store";
import ModularPipelineUI from "@/components/pipeline/ModularPipelineUI";
import type { BaseArgs } from "@/lib/pipeline/constants";
import type { Language } from "@/types/languages";
import { ArrowLeft } from "lucide-react";

interface EmbeddedPipelineProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function EmbeddedPipeline({ onComplete, onCancel }: EmbeddedPipelineProps) {
  const {
    birthDetails,
    jyotishamData,
  } = useStore();
  
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
      planId: jyotishamData.planId || undefined,
      socketRoom: jyotishamData.socketRoom || undefined,
    };
  }, [birthDetails, lang]);

  if (!args) {
    return (
       <div className="flex flex-col items-center justify-center p-12 text-center bg-white/[0.02] border border-white/5 rounded-[2rem]">
        <h2 className="text-xl font-bold text-white mb-2">Insufficient Birth Options</h2>
        <p className="text-white/50 mb-6">Unable to boot pipeline.</p>
        <button onClick={onCancel} className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Go Back</button>
      </div>
    );
  }

  return (
    <ModularPipelineUI
        args={args}
        onComplete={onComplete}
        onCancel={onCancel}
    />
  );
}
