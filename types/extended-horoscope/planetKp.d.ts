export interface PlanetKpResponse {
  status: number;
  response: Record<string, PlanetKpDetail>;
  callsRemaining: number;
}

export interface PlanetKpDetail {
  name: string;
  full_name: string;
  local_degree: number;
  global_degree: number;
  rasi_no: number;
  zodiac: string;
  house: number;
  pseudo_nakshatra: string;
  pseudo_nakshatra_lord: string;
  pseudo_nakshatra_pada: number;
  pseudo_nakshatra_no: number;
  pseudo_rasi: string;
  pseudo_rasi_no: number;
  pseudo_rasi_lord: string;
  sub_lord: string;
  sub_sub_lord: string;
}