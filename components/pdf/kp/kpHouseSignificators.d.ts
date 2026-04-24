/**
 * A map of houses to the planets that signify or influence them.
 * Keys are strings "1" through "12".
 */
export interface HouseSignificators {
  [houseNumber: string]: string[];
}

/**
 * Main response wrapper for the House Significator API.
 */
export interface HouseSignificatorResponse {
  status: number;
  response: HouseSignificators;
  callsRemaining: number;
}