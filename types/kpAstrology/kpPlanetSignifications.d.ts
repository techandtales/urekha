export interface KPPlanetSignificationsResponse {
  status: number;
  response: KPPlanetSignifications;
  callsRemaining: number;
}

/**
 * Maps each planet to an array of house numbers (1-12) it signifies.
 */
export interface KPPlanetSignifications {
  Sun: number[];
  Moon: number[];
  Mercury: number[];
  Venus: number[];
  Mars: number[];
  Jupiter: number[];
  Saturn: number[];
  Rahu: number[];
  Ketu: number[];
}