"use client";

import React, { useState, useMemo } from "react";
import { 
  Document, 
  PDFViewer, 
} from "@react-pdf/renderer";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { Language } from "@/types/languages";
import type { PredictionJSONResponse } from "@/types/prediction-response";
import { JYOTISHAM_MAPPINGS } from "@/lib/pipeline/constants";

// ── Types ──

export interface TestCase {
  id: string;
  label: string;
  slugs: string[]; // Standard Jyotisham slugs
  predictionSlugs?: string[]; // AI Prediction slugs
  render: (data: { 
    lang: Language; 
    mockStructured?: PredictionJSONResponse;
  }) => React.ReactElement;
}

interface PdfTestShellProps {
  title: string;
  testCases: TestCase[];
}

// ── Mock Structured Data ──

export const MOCK_STRUCTURED_DATA: PredictionJSONResponse = {
  keywords: ["astrology", "cosmos", "karma"],
  blocks: [
    { type: "summary", text: "Comprehensive Analysis of the cosmic blueprint." },
    { type: "heading", text: "1. The Karmic Foundation" },
    { type: "paragraph", text: "Your birth chart indicates a **profound alignment** between your intellectual aspirations and practical reality. The influence of **Jupiter** in the 9th house suggests a soul inclined towards higher wisdom." },
    { 
      type: "bullet_list", 
      items: [
        "Strong focus on **analytical precision**.",
        "Natural leadership in **communicative roles**.",
        "Potential for **spiritual transformation** during the Mahadasha."
      ] 
    },
    { type: "separator" },
    { type: "subheading", text: "Planetary Strengths" },
    { type: "paragraph", text: "The following matrix details the specific dignities of your core planets:" },
    { 
      type: "table", 
      headers: ["Planet", "Status", "Strength", "Impact"], 
      caption: "Table 1.1: Core Planetary Dignities",
      rows: [
        ["Sun", "Exalted", "85%", "Vitality"],
        ["Moon", "Friendly", "72%", "Emotions"],
        ["Mars", "Neutral", "54%", "Drive"],
        ["Venus", "Own Sign", "90%", "Harmony"]
      ] 
    },
    { 
      type: "highlight_box", 
      title: "Golden Period Observation", 
      text: "From **January 2025 to June 2027**, a rare conjunction suggests a peak period for career expansion and wealth accumulation. Maintain focus on horizontal scaling." 
    },
    { 
      type: "verse", 
      text: "ॐ पूर्णमदः पूर्णमिदं पूर्णात् पूर्णमुदच्यते | पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ||", 
      source: "Isha Upanishad" 
    },
    { 
      type: "remark", 
      label: "Architect's Note", 
      text: "This specific combination suggests that while the base is stable, the service management layer requires periodic updates." 
    },
    { type: "closing", text: "May the celestial alignment bring deterministic success to your scalable endeavors." }
  ]
};

// ── Main Component ──

export default function PdfTestShell({ title, testCases }: PdfTestShellProps) {
  const { setBirthDetails, setJyotishamData, setPrediction, resetJyotishamData } = useStore();
  const [activeCase, setActiveCase] = useState<TestCase | null>(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4040";

  // Standard Test Args (Patna, Jan 15 1995)
  const testArgs = {
    date: "15/01/1995",
    time: "10:30",
    latitude: 25.5941,
    longitude: 85.1376,
    tz: 5.5,
    lang: "en", // default to en
  };

  const mapSlugToStore = (slug: string, data: any) => {
    const mapping = (JYOTISHAM_MAPPINGS as any[]).find(m => m.slug === slug);
    if (!mapping) return;

    if (mapping.field === "divisionalCharts" && mapping.subField) {
      const current = useStore.getState().jyotishamData.horoscope.divisionalCharts || {};
      setJyotishamData(mapping.category, { 
        divisionalCharts: { ...current, [mapping.subField]: data } 
      });
    } else if (mapping.field === "divisionalChartSvgs" && mapping.subField) {
      const current = useStore.getState().jyotishamData.charts.divisionalChartSvgs || {};
      setJyotishamData("charts", { 
        divisionalChartSvgs: { ...current, [mapping.subField]: data } 
      });
    } else {
      setJyotishamData(mapping.category, { [mapping.field]: data } as any);
    }
  };

  const handleRunTestCase = async (tc: TestCase) => {
    setActiveCase(null); // Reset viewer
    setLoading(true);
    resetJyotishamData(); // ── Ensure store isolation ──
    
    try {
      // 1. Set Birth Details in store
      toast.info("Initializing Birth Details...");
      setBirthDetails({
        username: "Roshan Kumar",
        dob: new Date("1995-01-15T10:30:00Z"),
        tob: "10:30",
        pob: "Patna, Bihar",
        latitude: 25.5941,
        longitude: 85.1376,
        timezone: 5.5,
        language: "en",
      });

      // 2. Fetch Jyotisham Data
      if (tc.slugs.length > 0) {
        toast.info(`Fetching ${tc.slugs.length} parameters...`);

        // Construct SVG payload for charts
        const today = new Date();
        const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
        const todayTime = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
        
        const svgPayload = {
          ...testArgs,
          style: "north",
          colored_planets: true,
          color: "#00FF94",
          transit_date: todayStr,
          transit_time: todayTime,
        };

        await Promise.all(tc.slugs.map(async (slug: string) => {
          try {
            const isSvg = slug.startsWith("chart_image_") || slug.startsWith("transit_chart");
            const payload = isSvg ? svgPayload : testArgs;

            const sRes = await fetch(`${backendUrl}/jyotisham/test/${slug}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ payload, room: "test_room" }),
            });
            const sJson = await sRes.json();
            if (sJson.success && sJson.data) {
              mapSlugToStore(slug, sJson.data);
            }
          } catch (e) {
            // fail silently
          }
        }));
      }

      // 3. Fetch Prediction Data
      if (tc.predictionSlugs && tc.predictionSlugs.length > 0) {
        toast.info(`Fetching predictions...`);
        await Promise.all(tc.predictionSlugs.map(async (slug: string) => {
          try {
            const pRes = await fetch(`${backendUrl}/predict/test/${slug}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ payload: testArgs, room: "test_room" }),
            });
            const pJson = await pRes.json();
            if (pJson.success) {
              let structured = null;
              try {
                 const raw = pJson.data;
                 let cleanStr = raw.trim();
                 if (cleanStr.startsWith("```json")) cleanStr = cleanStr.substring(7);
                 if (cleanStr.endsWith("```")) cleanStr = cleanStr.substring(0, cleanStr.length - 3);
                 structured = JSON.parse(cleanStr.trim());
              } catch (e) {}
              
              setPrediction(slug, {
                status: "success",
                data: pJson.data, 
                structured
              });
            }
          } catch (e) {
            // fail silently
          }
        }));
      }

      setActiveCase(tc);
      toast.success("Ready to render!");
    } catch (err: any) {
      toast.error("Test Case Failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const pdfDocument = useMemo(() => {
    if (!activeCase) return null;
    return (
      <Document title={activeCase.label} author="Urekha Test Shell">
        {activeCase.render({ 
          lang: "en", // test-shell internal lang
          mockStructured: MOCK_STRUCTURED_DATA
        })}
      </Document>
    );
  }, [activeCase]);

  return (
    <div className="flex flex-col gap-8 p-8 min-h-screen bg-[#050A0A] text-white">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-[#00FF94] uppercase italic">
          {title}
        </h1>
        <p className="text-white/40 font-mono text-sm">
          React-PDF Page Component Verification Utility v2.1 (Zustand Sync)
        </p>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-5 gap-4">
        {testCases.map((tc) => (
          <button
            key={tc.id}
            onClick={() => handleRunTestCase(tc)}
            disabled={loading}
            className={`
              p-4 rounded-xl border transition-all flex flex-col items-center gap-2 group
              ${activeCase?.id === tc.id 
                ? "bg-[#00FF94]/20 border-[#00FF94] text-[#00FF94]" 
                : "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"}
              ${loading ? "opacity-50 cursor-wait" : ""}
            `}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold
              ${activeCase?.id === tc.id ? "bg-[#00FF94] text-black" : "bg-white/10 group-hover:bg-white/20"}
            `}>
              {tc.id.replace("case-", "")}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-center">
              {tc.label}
            </span>
          </button>
        ))}
      </div>

      {/* PDF Viewport */}
      <div className="flex-1 w-full flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden min-h-[800px] relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="w-12 h-12 border-4 border-[#00FF94] border-t-transparent rounded-full animate-spin mb-4" />
            <span className="text-xl font-bold tracking-widest uppercase">Syncing Universe to Store...</span>
          </div>
        )}

        {pdfDocument && !loading ? (
          <PDFViewer 
             style={{ width: "100%", height: "100%", minHeight: "800px" }}
             className="border-none"
             showToolbar={true}
          >
            {pdfDocument}
          </PDFViewer>
        ) : (
          !loading && (
            <div className="flex flex-col items-center gap-4 text-white/20">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-xl font-bold uppercase tracking-widest italic">Choose a case to render PDF</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
