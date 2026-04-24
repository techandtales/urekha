export interface YoginiSubDashaResponse {
  status: number;
  response: YoginiSubDashaCycle[];
  callsRemaining: number;
}

export interface YoginiSubDashaCycle {
  /** The name of the major Yogini period (e.g., "Bhadrika", "Ulka") */
  main_dasha: string;
  
  /** The planetary lord ruling this major dasha */
  main_dasha_lord: string;
  
  /** The sequence of 8 sub-yoginis within this major dasha */
  sub_dasha_list: string[];
  
  /** * Parallel array of end dates for each sub-dasha.
   * Format: "Day, Mon DD, YYYY, HH:mm:ss AM/PM"
   */
  sub_dasha_end_dates: string[];
  
  /** The exact start date and time of the major dasha cycle */
  sub_dasha_start_dates: string;
}