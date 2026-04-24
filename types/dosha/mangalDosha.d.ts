export interface MangalDoshaResponse {
  status: number;
  response: MangalDoshaData;
  callsRemaining: number;
}

export interface MangalDoshaData {
  factors: {
    /** A description of how Mars creates the dosha in the chart */
    mars: string;
  };
  /** Indicates if Dosha is present when calculated from the Ascendant */
  is_dosha_present_mars_from_lagna: boolean;
  /** Indicates if Dosha is present when calculated from the Natal Moon */
  is_dosha_present_mars_from_moon: boolean;
  /** True if the Dosha is partial (Anshik) */
  is_anshik: boolean;
  /** A human-readable summary of the finding */
  bot_response: string;
  /** Numerical severity of the Dosha (0 to 100) */
  score: number;
  cancellation: {
    /** Points deducted from the score due to neutralising factors */
    cancellationScore: number;
    /** List of specific astrological rules that cancelled the Dosha */
    cancellationReason: string[];
  };
  /** Overall conclusion if any form of Mangal Dosha exists */
  is_dosha_present: boolean;
}