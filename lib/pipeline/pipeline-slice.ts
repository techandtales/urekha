import { StateCreator } from "zustand";

// --- Types ---

export interface PipelineMessage {
  id: string;
  step: string;
  label: string;
  status: "pending" | "running" | "success" | "error" | "retrying";
  timestamp: number;
  /** Group identifier for batch container display (e.g. "jyotisham/batch_0", "predict/batch_pred_0") */
  group?: string;
}

export interface PipelineError {
  id: string;
  step: string;
  label: string;
  error: string;
  retryCount: number;
  canRetry: boolean;
}

export interface PipelineProgress {
  total: number;
  completed: number;
}

// --- Slice Interface ---

export interface PipelineSlice {
  pipelineMessages: PipelineMessage[];
  pipelineErrors: PipelineError[];
  pipelineProgress: PipelineProgress;
  pipelineRunning: boolean;

  pushMessage: (msg: PipelineMessage) => void;
  updateMessage: (id: string, updates: Partial<PipelineMessage>) => void;
  pushError: (err: PipelineError) => void;
  removeError: (id: string) => void;
  setProgress: (progress: Partial<PipelineProgress>) => void;
  incrementCompleted: () => void;
  setPipelineRunning: (running: boolean) => void;
  resetPipeline: () => void;
}

// --- Initial State ---

const INITIAL_PROGRESS: PipelineProgress = { total: 0, completed: 0 };

// --- Slice Creator ---

export const createPipelineSlice: StateCreator<PipelineSlice> = (set) => ({
  pipelineMessages: [],
  pipelineErrors: [],
  pipelineProgress: INITIAL_PROGRESS,
  pipelineRunning: false,

  pushMessage: (msg) =>
    set((state) => ({
      pipelineMessages: [...state.pipelineMessages, msg],
    })),

  updateMessage: (id, updates) =>
    set((state) => ({
      pipelineMessages: state.pipelineMessages.map((m) =>
        m.id === id ? { ...m, ...updates } : m,
      ),
    })),

  pushError: (err) =>
    set((state) => ({
      pipelineErrors: [...state.pipelineErrors, err],
    })),

  removeError: (idOrStep) =>
    set((state) => ({
      pipelineErrors: state.pipelineErrors.filter(
        (e) => e.id !== idOrStep && e.step !== idOrStep,
      ),
    })),

  setProgress: (progress) =>
    set((state) => ({
      pipelineProgress: { ...state.pipelineProgress, ...progress },
    })),

  incrementCompleted: () =>
    set((state) => ({
      pipelineProgress: {
        ...state.pipelineProgress,
        completed: state.pipelineProgress.completed + 1,
      },
    })),

  setPipelineRunning: (running) => set({ pipelineRunning: running }),

  resetPipeline: () =>
    set({
      pipelineMessages: [],
      pipelineErrors: [],
      pipelineProgress: INITIAL_PROGRESS,
      pipelineRunning: false,
    }),
});
