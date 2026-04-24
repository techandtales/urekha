export interface KPCuspsResponse {
  status: number;
  response: KPCuspDetail[];
  callsRemaining: number;
}

export interface KPCuspDetail {
  /** House number (1 to 12) */
  house: number;
  
  /** Absolute sidereal degree of the cusp in the 360° circle */
  degree: number;
  
  /** The zodiac sign where the cusp begins */
  sign: string;
  
  /** Ruler of the zodiac sign (Sign Lord) */
  signLord: string;
  
  /** The Nakshatra (Star) the cusp falls in */
  nakshatra: string;
  
  /** Ruler of the Nakshatra (Star Lord) */
  nakshatraLord: string;
  
  /** Ruler of the specific sub-division (The most important factor in KP) */
  subLord: string;
  
  /** Ruler of the sub-sub-division */
  subSubLord: string;
}