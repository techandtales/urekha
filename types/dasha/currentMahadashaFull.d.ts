export interface CurrentMahadashaFullResponse {
  status: number;
  response: CurrentMahadashaFull;
  callsRemaining: number;
}

export interface DashaSlot {
  name: string;
  /** Date format: "Day Mon DD YYYY" (e.g., "Sat Aug 22 2015") */
  start: string;
  end: string;
}

export interface CurrentMahadashaFull {
  /** The 9 major life cycles */
  mahadasha: DashaSlot[];
  
  /** The 9 sub-periods within the current Mahadasha */
  antardasha: DashaSlot[];
  
  /** The 9 sub-sub periods within the current Antardasha */
  paryantardasha: DashaSlot[];
  
  /** The 9 sub-sub-sub periods within the current Paryantardasha */
  Shookshamadasha: DashaSlot[]; // Note: PascalCase in JSON
  
  /** The 9 sub-sub-sub-sub periods within the current Shookshamadasha */
  Pranadasha: DashaSlot[];       // Note: PascalCase in JSON

  /** Hierarchical list of dasha level keys */
  order_names: string[];

  /** Summary of the specific periods currently active for the user */
  order_of_dashas: {
    major: DashaSlot;
    minor: DashaSlot;
    sub_minor: DashaSlot;
    sub_sub_minor: DashaSlot;
    sub_sub_sub_minor: DashaSlot;
  };
}