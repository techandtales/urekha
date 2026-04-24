export interface BhinnashtakavargaResponse {
  status: number;
  response: BhinnashtakavargaData;
  callsRemaining: number;
}

/** * Strict type for the 12 houses of the zodiac 
 */
type HousePoints = [
  number, number, number, number, 
  number, number, number, number, 
  number, number, number, number
];

export interface BhinnashtakavargaData {
  sun: HousePoints;
  moon: HousePoints;
  mars: HousePoints;
  mercury: HousePoints;
  jupiter: HousePoints;
  venus: HousePoints;
  saturn: HousePoints;
  ascendant: HousePoints;
  
  /** The horizontal sum of all contributors per house */
  Total: HousePoints;
}