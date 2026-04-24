export interface YoginiDashaResponse {
  status: number;
  response: YoginiDashaData;
  callsRemaining: number;
}

export interface YoginiDashaData {
  /** The sequence of Yoginis (e.g., "Bhadrika", "Ulka") */
  dasha_list: string[];

  /** * Parallel array of end dates for each Yogini period.
   * Format: "Day, Mon DD, YYYY, HH:mm:ss AM/PM"
   */
  dasha_end_dates: string[];

  /** Parallel array indicating the planetary lord associated with each Yogini */
  dasha_lord_list: string[];

  /** The initial starting parameter or reference for the dasha calculation */
  start_date: number;
}