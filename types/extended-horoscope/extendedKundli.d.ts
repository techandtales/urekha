export interface ExtendedKundliResponse {
  status: number;
  response: ExtendedKundliData;
  callsRemaining: number;
}

export interface ExtendedKundliData {
  gana: string;
  yoni: string;
  vasya: string;
  nadi: string;
  varna: string;
  paya: string;
  tatva: string;
  life_stone: string;
  lucky_stone: string;
  fortune_stone: string;
  /** Suggested starting letters for the name in Devanagari script */
  name_start: string;
  ascendant_sign: string;
  ascendant_nakshatra: string;
  rasi: string;
  rasi_lord: string;
  nakshatra: string;
  nakshatra_lord: string;
  nakshatra_pada: number;
  sun_sign: string;
  tithi: string;
  karana: string;
  yoga: string;
}