import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./auth-slice";
import {
  createBirthDetailsSlice,
  BirthDetailsSlice,
} from "./birth-details-slice";
import { createJyotishamSlice, JyotishamSlice } from "./jyotisham-slice";
import { createPipelineSlice, PipelineSlice } from "../pipeline/pipeline-slice";
import { createModularPipelineSlice, ModularPipelineSlice } from "./modular-pipeline-slice";

export const useStore = create<
  AuthSlice & BirthDetailsSlice & JyotishamSlice & PipelineSlice & ModularPipelineSlice
>()((...a) => ({
  ...createAuthSlice(...a),
  ...createBirthDetailsSlice(...a),
  ...createJyotishamSlice(...a),
  ...createPipelineSlice(...a),
  ...createModularPipelineSlice(...a),
}));
