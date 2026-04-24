export interface KPPlanetDetailsResponse {
  status: number;
  response: KPPlanetData;
  callsRemaining: number;
}

export interface KPPlanetData {
  /** Array of planets including outer planets and lunar nodes */
  planets: KPPlanet[];
  /** Detailed calculation for the Ascendant (Lagna) */
  ascendant: KPAscendant;
}

export interface KPPlanet {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  siderealLongitude: number;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  subLord: string;
  subSubLord: string;
}

/** * Ascendant uses a slightly subset of planet fields 
 * but follows the same KP hierarchical logic.
 */
export interface KPAscendant {
  name: "Ascendant";
  longitude: number;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  subLord: string;
  subSubLord: string;
}