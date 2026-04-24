export interface ChoghadiyaResponse {
  status: number;
  response: {
    day: ChoghadiyaSlot[];
    night: ChoghadiyaSlot[];
    day_of_week: string;
  };
  callsRemaining: number;
}

export interface ChoghadiyaSlot {
  start: string;
  end: string;
  muhurat: string;
  type: string;
}