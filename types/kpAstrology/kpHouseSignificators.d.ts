export interface KPHouseSignificatorsResponse {
  status: number;
  response: KPHouseSignificators;
  callsRemaining: number;
}

/**
 * Maps each house number (1-12) to an array of planets that signify it.
 */
export interface KPHouseSignificators {
  "1": string[];
  "2": string[];
  "3": string[];
  "4": string[];
  "5": string[];
  "6": string[];
  "7": string[];
  "8": string[];
  "9": string[];
  "10": string[];
  "11": string[];
  "12": string[];
}