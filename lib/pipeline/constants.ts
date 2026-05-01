import type { JyotishamData } from "@/lib/store/jyotisham-slice";
import type { PipelineMessage, PipelineError } from "@/lib/pipeline/pipeline-slice";

export type BaseArgs = {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  tz: number;
  lang: "en" | "hi";
  planId?: number | string;
  agentId?: string;
  socketRoom?: string;
  delayOnMissMs?: number;
  paymentMode?: "token" | "online" | null;
  transactionId?: string | null;
  paidAmount?: number | null;
  tokenUsed?: number | null;
  reportId?: string;
  planTokenCost?: number;
};

export interface PipelineActions {
  setJyotishamData: <K extends keyof JyotishamData>(
    category: K,
    data: Partial<JyotishamData[K]>,
  ) => void;
  pushMessage: (msg: PipelineMessage) => void;
  updateMessage: (id: string, updates: Partial<PipelineMessage>) => void;
  pushError: (err: PipelineError) => void;
  removeError: (id: string) => void;
  incrementCompleted: () => void;
  setProgress: (p: { total: number; completed: number }) => void;
  setPipelineRunning: (running: boolean) => void;
  setPrediction: (
    slug: string,
    update: { status: string; data: string; structured?: any },
  ) => void;
  resetPipeline: () => void;
}

export const JYOTISHAM_MAPPINGS: Array<{
  slug: string;
  category: keyof JyotishamData;
  field: string;
  subField?: string;
  label: string;
  extraPayload?: any;
}> = [
  {
    slug: "planet_details",
    category: "horoscope",
    field: "planetDetails",
    label: "Planet Details",
  },
  {
    slug: "ascendant_report",
    category: "horoscope",
    field: "ascendantReport",
    label: "Ascendant Report",
  },
  {
    slug: "ashtakvarga",
    category: "horoscope",
    field: "ashtakvarga",
    label: "Ashtakvarga",
  },
  {
    slug: "binnashtakvarga",
    category: "horoscope",
    field: "binnashtakvarga",
    label: "Binnashtakvarga",
  },
  {
    slug: "kp_planet_details",
    category: "kpAstrology",
    field: "planetDetails",
    label: "KP Planet Details",
  },
  {
    slug: "kp_cusp_details",
    category: "kpAstrology",
    field: "cuspDetails",
    label: "KP Cusp Details",
  },
  {
    slug: "kp_significators",
    category: "kpAstrology",
    field: "significators",
    label: "KP Significators",
  },
  {
    slug: "kp_house_significators",
    category: "kpAstrology",
    field: "houseSignificators",
    label: "KP House Significators",
  },
  {
    slug: "dasha_current_maha",
    category: "dasha",
    field: "currentMahadasha",
    label: "Current Mahadasha",
  },
  {
    slug: "dasha_current_maha_full",
    category: "dasha",
    field: "currentMahadashaFull",
    label: "Current Mahadasha (Full)",
  },
  {
    slug: "dasha_maha",
    category: "dasha",
    field: "mahadasha",
    label: "Mahadasha Periods",
  },
  {
    slug: "dasha_yogini_main",
    category: "dasha",
    field: "yoginiDasha",
    label: "Yogini Dasha",
  },
  {
    slug: "dasha_yogini_sub",
    category: "dasha",
    field: "yoginiSubDasha",
    label: "Yogini Sub-Dasha",
  },
  {
    slug: "dosha_mangal",
    category: "dosha",
    field: "mangal",
    label: "Mangal Dosha",
  },
  {
    slug: "dosha_kaalsarp",
    category: "dosha",
    field: "kaalsarp",
    label: "Kaal Sarp Dosha",
  },
  {
    slug: "dosha_manglik",
    category: "dosha",
    field: "manglik",
    label: "Manglik Analysis",
  },
  {
    slug: "dosha_pitra",
    category: "dosha",
    field: "pitra",
    label: "Pitra Dosha",
  },
  {
    slug: "panchang_details",
    category: "panchang",
    field: "panchangDetails",
    label: "Panchang Details",
  },
  {
    slug: "panchang_choghadiya",
    category: "panchang",
    field: "choghadiya",
    label: "Choghadiya Muhurta",
  },
  {
    slug: "panchang_hora",
    category: "panchang",
    field: "hora",
    label: "Hora Muhurta",
  },
  {
    slug: "extended_kundli",
    category: "extendedHoro",
    field: "extendedKundli",
    label: "Extended Kundli",
  },
  {
    slug: "extended_current_sadesati",
    category: "extendedHoro",
    field: "currentSadeSati",
    label: "Sade Sati Analysis",
  },
  {
    slug: "extended_friendship_table",
    category: "extendedHoro",
    field: "friendshipTable",
    label: "Friendship Table",
  },
  {
    slug: "extended_planets_kp",
    category: "extendedHoro",
    field: "planetKp",
    label: "Planet KP Details",
  },
  {
    slug: "transit_chart",
    category: "charts",
    field: "transitChartSvg",
    label: "Transit Chart",
  },
];

export const DIVISIONAL_CHART_IDS = [
  "D1", "D9", "moon", "D3", "D4", "D7", "D10", "D12", "D16", "D20", "D24", "D30", "D60", "sun", "chalit", "D6", "D8", "D27",
];

export const SVG_CHART_ID_TO_API_PARAM: Record<string, string> = {
  D1: "d1",
  D3: "d3",
  D4: "d4",
  D6: "d6",
  D7: "d7",
  D8: "d8",
  D9: "d9",
  D10: "d10",
  D12: "d12",
  D16: "d16",
  D20: "d20",
  D24: "d24",
  D27: "d27",
  D30: "d30",
  D60: "d60",
  moon: "moon",
  sun: "sun",
  chalit: "bhav_chalit_chart",
};

export const SVG_CHART_IDS = Object.keys(SVG_CHART_ID_TO_API_PARAM);

// Push divisional chart mappings
DIVISIONAL_CHART_IDS.forEach((div) => {
  JYOTISHAM_MAPPINGS.push({
    slug: `divisional_chart_${div}`,
    category: "horoscope",
    field: "divisionalCharts",
    subField: div,
    label: `${div} Chart`,
  });
});

// Push SVG chart mappings
SVG_CHART_IDS.forEach((id) => {
  JYOTISHAM_MAPPINGS.push({
    slug: `chart_image_${SVG_CHART_ID_TO_API_PARAM[id]}`,
    category: "charts",
    field: "divisionalChartSvgs",
    subField: id,
    label: `${id} SVG`,
  });
});

// Push Bhinnashtakvarga planet-specific mappings
["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"].forEach((planet) => {
  JYOTISHAM_MAPPINGS.push({
    slug: `binnashtakvarga_${planet}`,
    category: "horoscope",
    field: "binnashtakvarga", // Note: This might overwrite or needs subfield handling if UI expects it
    label: `Bhinnashtakvarga ${planet}`,
  });
});
