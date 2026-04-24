export interface PitraDoshaResponse {
  status: number;
  response: PitraDoshaData;
  callsRemaining: number;
}

export interface PitraDoshaData {
  /** True if the specific conjunctions or aspects for Pitra Dosha are found */
  is_dosha_present: boolean;
  
  /** A direct summary explaining why the Dosha is present */
  bot_response: string;
  
  /** A list of potential life challenges associated with this Dosha */
  effects: string[];
  
  /** A collection of traditional activities and rituals to mitigate the Dosha */
  remedies: string[];
}