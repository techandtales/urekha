import { StateCreator } from "zustand";
import { JYOTISHAM_MAPPINGS } from "../pipeline/constants";

// --- Imports from newtypes ---

// Dasha
import { CurrentMahadashaResponse } from "@/types/dasha/currentMahadasha";
import { CurrentMahadashaFullResponse } from "@/types/dasha/currentMahadashaFull";
import { MahadashaResponse } from "@/types/dasha/mahaDasha";
import { SpecificSubDashaResponse } from "@/types/dasha/specificSubDash";
import { YoginiDashaResponse } from "@/types/dasha/yoginiDasha";
import { YoginiSubDashaResponse } from "@/types/dasha/yoginiSubDasha";

// Dosha
import { MangalDoshaResponse } from "@/types/dosha/mangalDosha";
import { KaalSarpResponse } from "@/types/dosha/kaalsarpDosha";
import { ManglikAnalysisResponse } from "@/types/dosha/manglikDosha";
import { PitraDoshaResponse } from "@/types/dosha/pitraDosha";

// Extended Horoscope
import { ExtendedKundliResponse } from "@/types/extended-horoscope/extendedKundli";
import { SadeSatiResponse } from "@/types/extended-horoscope/currentSadeSati";
import { FriendshipTableResponse } from "@/types/extended-horoscope/friendshipTable";
import { PlanetKpResponse } from "@/types/extended-horoscope/planetKp";

// Horoscope
import { AscendantResponse } from "@/types/horoscope/ascendantReport";
import { AshtakvargaResponse } from "@/types/horoscope/asthakVarga";
import { BhinnashtakavargaResponse } from "@/types/horoscope/binnashthakVarga";
import { ChartResponse as DivisionalChartResponse } from "@/types/horoscope/divisionalChart";
import { PlanetaryDetailsResponse } from "@/types/horoscope/palnetDetails";

// KP Astrology
import { KPPlanetDetailsResponse } from "@/types/kpAstrology/kpPlanetDetails";
import { KPCuspsResponse } from "@/types/kpAstrology/kpCuspsDetails";
import { KPPlanetSignificationsResponse } from "@/types/kpAstrology/kpPlanetSignifications";
import { KPHouseSignificatorsResponse } from "@/types/kpAstrology/kpHouseSignificators";

// Panchang
import { ChoghadiyaResponse } from "@/types/panchang/choghadiya";
import { HoraResponse } from "@/types/panchang/hora";
import { PanchangResponse } from "@/types/panchang/panchang";

// Charts
import { ChartResponse } from "@/types/charts/chart";

// --- Slice State Interface ---
// All types now represent the FULL API response (status + response + callsRemaining)
export interface JyotishamData {
  dasha: {
    currentMahadasha: CurrentMahadashaResponse | null;
    currentMahadashaFull: CurrentMahadashaFullResponse | null;
    mahadasha: MahadashaResponse | null;
    specificSubDasha: SpecificSubDashaResponse | null;
    yoginiDasha: YoginiDashaResponse | null;
    yoginiSubDasha: YoginiSubDashaResponse | null;
  };
  dosha: {
    mangal: MangalDoshaResponse | null;
    kaalsarp: KaalSarpResponse | null;
    manglik: ManglikAnalysisResponse | null;
    pitra: PitraDoshaResponse | null;
  };
  extendedHoro: {
    extendedKundli: ExtendedKundliResponse | null;
    currentSadeSati: SadeSatiResponse | null;
    friendshipTable: FriendshipTableResponse | null;
    planetKp: PlanetKpResponse | null;
  };
  horoscope: {
    ascendantReport: AscendantResponse | null;
    ashtakvarga: AshtakvargaResponse | null;
    binnashtakvarga: BhinnashtakavargaResponse | null;
    divisionalChart: DivisionalChartResponse | null;
    divisionalCharts: Record<string, DivisionalChartResponse> | null;
    planetDetails: PlanetaryDetailsResponse | null;
  };
  kpAstrology: {
    planetDetails: KPPlanetDetailsResponse | null;
    cuspDetails: KPCuspsResponse | null;
    significators: KPPlanetSignificationsResponse | null;
    houseSignificators: KPHouseSignificatorsResponse | null;
  };
  panchang: {
    choghadiya: ChoghadiyaResponse | null;
    hora: HoraResponse | null;
    panchangDetails: PanchangResponse | null;
  };
  charts: {
    divisionalChartSvgs: Record<string, string | null>;
    transitChartSvg: string | null;
  };
  predictions: Record<string, { status: string; data: string; structured?: any } | null>;
  socketRoom: string | null;
  planId: string | null;
}

export interface JyotishamSlice {
  jyotishamData: JyotishamData;
  setJyotishamData: <K extends keyof JyotishamData>(
    category: K,
    data: Partial<JyotishamData[K]>,
  ) => void;
  setPrediction: (slug: string, update: { status: string; data: string; structured?: any }) => void;
  injectSavedReportData: (astrology: any, predictions: any) => void;
  resetJyotishamData: () => void;
}

// --- Initial State ---
const INITIAL_JYOTISHAM_DATA: JyotishamData = {
  dasha: {
    currentMahadasha: null,
    currentMahadashaFull: null,
    mahadasha: null,
    specificSubDasha: null,
    yoginiDasha: null,
    yoginiSubDasha: null,
  },
  dosha: {
    mangal: null,
    kaalsarp: null,
    manglik: null,
    pitra: null,
  },
  extendedHoro: {
    extendedKundli: null,
    currentSadeSati: null,
    friendshipTable: null,
    planetKp: null,
  },
  horoscope: {
    ascendantReport: null,
    ashtakvarga: null,
    binnashtakvarga: null,
    divisionalChart: null,
    divisionalCharts: null,
    planetDetails: null,
  },
  kpAstrology: {
    planetDetails: null,
    cuspDetails: null,
    significators: null,
    houseSignificators: null,
  },
  panchang: {
    choghadiya: null,
    hora: null,
    panchangDetails: null,
  },
  charts: {
    divisionalChartSvgs: {},
    transitChartSvg: null,
  },
  predictions: {},
  socketRoom: null,
  planId: null,
};

// --- Slice Creator ---
export const createJyotishamSlice: StateCreator<JyotishamSlice> = (set) => ({
  jyotishamData: INITIAL_JYOTISHAM_DATA,
  setJyotishamData: (category, data) =>
    set((state) => {
      const currentCategoryData = state.jyotishamData[category];
      return {
        jyotishamData: {
          ...state.jyotishamData,
          [category]:
            typeof currentCategoryData === "object" &&
            currentCategoryData !== null
              ? {
                  ...(currentCategoryData as any),
                  ...data,
                }
              : data,
        },
      };
    }),
  setPrediction: (slug, update) =>
    set((state) => ({
      jyotishamData: {
        ...state.jyotishamData,
        predictions: {
          ...state.jyotishamData.predictions,
          [slug]: update,
        },
      },
    })),
  injectSavedReportData: (astrology, predictions) =>
    set((state) => {
      const nextJyotisham = JSON.parse(JSON.stringify(INITIAL_JYOTISHAM_DATA));

      // 1. Map Astrology Data
      JYOTISHAM_MAPPINGS.forEach((m) => {
        const rawValue = astrology[m.slug];
        if (!rawValue) return;

        if (m.slug === "binnashtakvarga" && m.extraPayload?.planet) {
          // Handled elsewhere or as a batch but let's be robust
        } else if (m.field === "divisionalCharts" && m.subField) {
          if (!nextJyotisham.horoscope.divisionalCharts) nextJyotisham.horoscope.divisionalCharts = {};
          nextJyotisham.horoscope.divisionalCharts[m.subField] = rawValue;
        } else if (m.field === "divisionalChartSvgs" && m.subField) {
          nextJyotisham.charts.divisionalChartSvgs[m.subField] = rawValue;
        } else {
          nextJyotisham[m.category][m.field] = rawValue;
        }
      });

      // 2. Map Predictions
      Object.entries(predictions || {}).forEach(([slug, val]: [string, any]) => {
        nextJyotisham.predictions[slug] = {
          status: "success",
          data: typeof val === "string" ? val : (val.raw || JSON.stringify(val)),
          structured: val.structured || null
        };
      });

      // 3. Aggregate separate Bhinnashtakavarga entries if they exist
      const planets = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
      let aggregatedBav: any = null;
      
      planets.forEach(p => {
        const key = `binnashtakvarga_${p}`;
        if (astrology[key]) {
          if (!aggregatedBav) aggregatedBav = {};
          // Capitalize first letter for PDF component
          const capitalized = p.charAt(0).toUpperCase() + p.slice(1);
          aggregatedBav[capitalized] = astrology[key].response || astrology[key];
        }
      });

      if (aggregatedBav) {
        nextJyotisham.horoscope.binnashtakvarga = {
          status: "success",
          response: aggregatedBav
        };
      } else if (astrology.binnashtakvarga) {
        nextJyotisham.horoscope.binnashtakvarga = astrology.binnashtakvarga;
      }

      return { jyotishamData: nextJyotisham };
    }),
  resetJyotishamData: () => set({ jyotishamData: INITIAL_JYOTISHAM_DATA }),
});
