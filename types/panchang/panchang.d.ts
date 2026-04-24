export interface PanchangResponse {
  status: number;
  response: {
    day: {
      name: string;
    };
    tithi: {
      name: string;
      diety: string;
      type: string;
      number: number;
      start: string;
      end: string;
      next_tithi: string;
      meaning: string;
      special: string;
    };
    nakshatra: {
      name: string;
      lord: string;
      diety: string;
      number: number;
      pada: number;
      start: string;
      end: string;
      next_nakshatra: string;
      meaning: string;
      special: string;
      summary: string;
      words: string;
    };
    karana: {
      name: string;
      lord: string;
      diety: string;
      type: string;
      number: number;
      start: string;
      end: string;
      special: string;
      next_karana: string;
    };
    yoga: {
      name: string;
      number: number;
      start: string;
      end: string;
      meaning: string;
      special: string;
      next_yoga: string;
    };
    ayanamsa: {
      name: string;
    };
    rasi: {
      name: string;
    };
    advanced_details: {
      sun_rise: string;
      sun_set: string;
      moon_rise: string;
      moon_set: string;
      solar_noon: string;
      next_full_moon: string;
      next_new_moon: string;
      masa: {
        amanta_name: string;
        purnimanta_name: string;
        alternate_amanta_name: string;
        adhik_maasa: boolean;
        ayana: string;
        tamil_month_num: number;
        tamil_month: string;
        tamil_day: number;
        moon_phase: string;
        paksha: string;
        ritu: string;
        ritu_tamil: string;
        rituOdia: string;
      };
      moon_yogini_nivas: string;
      ahargana: number;
      years: {
        kali: number;
        saka: number;
        vikram_samvaat: number;
        kali_samvaat_name: string;
        vikram_samvaat_name: string;
        saka_samvaat_name: string;
        kali_samvaat_number: number;
        saka_samvaat_number: number;
        vikram_samvaat_number: number;
      };
      vaara: string;
      disha_shool: string;
      abhijitMuhurta: {
        start: string;
        end: string;
      };
    };
    rahukaal: string;
    gulika: string;
    yamakanta: string;
    bhadrakaal: string;
    date: string;
  };
  callsRemaining: number;
}