export interface BirthDetails {
  username: string | null;
  dob: Date;
  tob: string;
  pob: string;
  latitude: number;
  longitude: number;
  timezone: number;
  language: 'en' | 'hi'
}