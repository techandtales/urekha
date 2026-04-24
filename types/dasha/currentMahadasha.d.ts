export interface CurrentMahadashaResponse {
  status: number;
  response: CurrentMahadasha;
  callsRemaining: number;
}

export interface DashaPeriod {
  name: string;
  /** Date format: "Day Mon DD YYYY" (e.g., "Fri Apr 20 2018") */
  start: string;
  end: string;
}

export interface CurrentMahadasha {
  // Current active levels
  mahadasha: DashaPeriod;
  antardasha: DashaPeriod;
  paryantardasha: DashaPeriod;
  Shookshamadasha: DashaPeriod; // Matches JSON PascalCase
  Pranadasha: DashaPeriod;      // Matches JSON PascalCase

  /** List of the dasha levels in hierarchical order */
  order_names: string[];

  /** Mapping levels to functional terminology */
  order_of_dashas: {
    major: DashaPeriod;             // Mahadasha
    minor: DashaPeriod;             // Antardasha
    sub_minor: DashaPeriod;         // Paryantardasha
    sub_sub_minor: DashaPeriod;     // Shookshamadasha
    sub_sub_sub_minor: DashaPeriod; // Pranadasha
  };
}