export interface ManglikAnalysisResponse {
  status: number;
  response: ManglikAnalysisData;
  callsRemaining: number;
}

export interface ManglikAnalysisData {
  /** Indicates if Mars specifically creates a Dosha */
  manglik_by_mars: boolean;

  /** Description of the specific placements creating the Dosha */
  factors: string[];

  /** Conversational summary including the calculated percentage */
  bot_response: string;

  /** Indicates if Saturn is placed in houses that cause a secondary Manglik effect */
  manglik_by_saturn: boolean;

  /** Indicates if Rahu or Ketu are contributing to the Dosha */
  manglik_by_rahuketu: boolean;

  /** Detailed list of planetary aspects (Drishti) affecting relevant houses */
  aspects: string[];

  /** The final calculated percentage of the Dosha (0 to 100) */
  score: number;
}