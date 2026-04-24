export interface KaalSarpResponse {
  status: number;
  response: KaalSarpData;
  callsRemaining: number;
}

export interface KaalSarpData {
  /** Indicates if all planets are hemmed between Rahu and Ketu */
  is_dosha_present: boolean;
  
  /** A direct text summary of the result */
  bot_response: string;
  
  /** A collection of traditional Vedic remedies, mantras, and rituals */
  remedies: string[];
}