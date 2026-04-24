export interface AshtakvargaResponse {
  status: number;
  response: AshtakvargaData;
  callsRemaining: number;
}

export interface AshtakvargaData {
  /** The sequence of planets corresponding to the rows in ashtakvarga_points */
  ashtakvarga_order: string[];
  
  /** * A 2D array where each inner array represents the 12 house points 
   * for the planet at the same index in ashtakvarga_order.
   */
  ashtakvarga_points: number[][];
  
  /** The Sarvashtakavarga (total) points for each of the 12 houses */
  ashtakvarga_total: number[];
}