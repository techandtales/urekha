import { StateCreator } from "zustand";

export type PipelinePhase = 'idle' | 'jyotisham' | 'cooling' | 'predicting' | 'complete' | 'total_fail';

export interface ModularPipelineSlice {
  modularPhase: PipelinePhase;
  coolingTimer: number;
  isPhase1Complete: boolean;
  isPhase2Started: boolean;
  
  setModularPhase: (phase: PipelinePhase) => void;
  setCoolingTimer: (time: number) => void;
  setPhase1Complete: (complete: boolean) => void;
  setPhase2Started: (started: boolean) => void;
  resetModularPipeline: () => void;
}

export const createModularPipelineSlice: StateCreator<ModularPipelineSlice> = (set) => ({
  modularPhase: 'idle',
  coolingTimer: 0,
  isPhase1Complete: false,
  isPhase2Started: false,

  setModularPhase: (phase) => set({ modularPhase: phase }),
  setCoolingTimer: (time) => set({ coolingTimer: time }),
  setPhase1Complete: (complete) => set({ isPhase1Complete: complete }),
  setPhase2Started: (started) => set({ isPhase2Started: started }),
  
  resetModularPipeline: () => set({
    modularPhase: 'idle',
    coolingTimer: 0,
    isPhase1Complete: false,
    isPhase2Started: false,
  }),
});
