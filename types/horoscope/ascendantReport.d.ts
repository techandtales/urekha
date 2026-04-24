export interface AscendantResponse {
  status: number;
  response: AscendantData[];
  callsRemaining: number;
}

export interface AscendantData {
  ascendant: string;
  ascendant_lord: string;
  ascendant_lord_location: string;
  ascendant_lord_house_location: number;
  general_prediction: string;
  personalised_prediction: string;
  verbal_location: string;
  ascendant_lord_strength: 'Exalted' | 'Debilitated' | 'Munda' | 'Neutral' | string; 
  symbol: string;
  zodiac_characteristics: string;
  lucky_gem: string;
  day_for_fasting: string;
  gayatri_mantra: string;
  flagship_qualities: string;
  good_qualities: string;
  bad_qualities: string;
}