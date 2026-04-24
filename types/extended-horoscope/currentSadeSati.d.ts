export interface SadeSatiResponse {
  status: number;
  response: SadeSatiData;
  callsRemaining: number;
}

export interface SadeSatiData {
  date_considered: string;
  is_sade_sati_period: boolean;
  shani_period_type: string;
  bot_response: string;
  description: string;
  saturn_retrograde: boolean;
  age: number;
  remedies: string[]; // Typed as string array based on common API patterns
}