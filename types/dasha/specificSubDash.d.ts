export interface SpecificSubDashaResponse {
  status: number;
  response: SpecificSubDasha;
  callsRemaining: number;
}

export interface DashaTimeSlot {
  key: string;
  name: string;
  /** ISO format: "YYYY-MM-DD HH:mm:ss" */
  start: string;
  end: string;
}

export interface SpecificSubDasha {
  /** Array of detailed time slots for the lowest level dasha */
  pranadasha: DashaTimeSlot[];
  
  /** The parent dasha levels for context */
  mahadasha: string;
  antardasha: string;
  paryantardasha: string;
  shookshamadasha: string;
}