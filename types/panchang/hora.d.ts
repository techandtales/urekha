export interface HoraResponse {
  status: number;
  response: {
    horas: HoraSlot[];
    day_of_week: string;
  };
  callsRemaining: number;
}

export interface HoraSlot {
  start: string;
  end: string;
  hora: string;
  benefits: string;
  lucky_gem: string;
}