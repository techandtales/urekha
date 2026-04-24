export interface ChartResponse {
  status: number;
  response: ChartData;
  callsRemaining: number;
}

export interface ChartData {
  house_no: ChartMap;
  zodiac_no: ChartMap;
}

/** * Represents the 1-12 mapping for houses or zodiac signs
 */
export interface ChartMap {
  [key: string]: CelestialBody[];
}

export interface CelestialBody {
  full_name?: string; // Optional because "Asc" doesn't have a full_name in your data
  name: string;
  zodiac: string;
  retro: boolean;
}