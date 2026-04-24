import { StateCreator } from "zustand";
import { BirthDetails } from "@/types/birthDetails";

export interface BirthDetailsSlice {
  birthDetails: BirthDetails;
  setBirthDetails: (details: Partial<BirthDetails>) => void;
}

const DEFAULT_BIRTH_DETAILS: BirthDetails = {
  username: null,
  dob: new Date("2000-01-01T00:00:00Z"), // Fixed date to prevent hydration errors
  tob: "",
  pob: "",
  latitude: 0,
  longitude: 0,
  language: "en",
  timezone: 5.5,
};

export const createBirthDetailsSlice: StateCreator<BirthDetailsSlice> = (
  set,
) => ({
  birthDetails: DEFAULT_BIRTH_DETAILS,
  setBirthDetails: (details) =>
    set((state) => ({
      birthDetails: { ...state.birthDetails, ...details },
    })),
});
