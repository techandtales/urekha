export interface PlanetaryDetailsResponse {
  status: number;
  response: {
    // Numeric keys for Ascendant and Planets (0-9)
    [key: string]: PlanetData | any;

    // Recommendation & Lucky Factor Arrays
    lucky_gem: string[];
    lucky_num: number[];
    lucky_colors: string[];
    lucky_letters: string[];
    lucky_name_start: string[];

    // General Birth Info
    rasi: string;
    nakshatra: string;
    nakshatra_pada: number;

    // Panchang Details
    panchang: {
      ayanamsa: number;
      ayanamsa_name: string;
      day_of_birth: string;
      day_lord: string;
      hora_lord: string;
      sunrise_at_birth: string;
      sunset_at_birth: string;
      karana: string;
      yoga: string;
      tithi: string;
    };

    // Ghatka Chakra (Cautionary details)
    ghatka_chakra: {
      rasi: string;
      tithi: string[];
      day: string;
      nakshatra: string;
      tatva: string;
      lord: string;
      same_sex_lagna: string;
      opposite_sex_lagna: string;
    };

    // Dasa Timings
    birth_dasa: string;
    current_dasa: string;
    birth_dasa_time: string;
    current_dasa_time: string;
  };
  callsRemaining: number;
}

export interface PlanetData {
  name: string;
  full_name: string;
  local_degree: number;
  global_degree: number;
  progress_in_percentage: number;
  rasi_no: number;
  zodiac: string;
  house: number;
  nakshatra: string;
  nakshatra_lord: string;
  nakshatra_pada: number;
  nakshatra_no: number;
  zodiac_lord: string;
  is_planet_set: boolean;
  basic_avastha: string;
  lord_status: string;
  is_combust: boolean | string;
}