export interface MahadashaResponse {
  status: number;
  response: MahadashaData;
  callsRemaining: number;
}

export interface MahadashaData {
  /** The sequence of planets in the person's dasha cycle */
  mahadasha: string[];

  /** * The start dates for each planet listed in the mahadasha array. 
   * Index 0 of this array matches Index 0 of the mahadasha array.
   */
  mahadasha_order: string[];

  /** The year the very first dasha began */
  start_year: number;

  /** The full date string for the birth dasha start */
  dasha_start_date: string;

  /** Human-readable string of time left in the birth dasha */
  dasha_remaining_at_birth: string;
}