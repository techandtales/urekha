import { create } from "zustand";
import { STAGES, Stage } from "@/lib/constants";

interface StageState {
    currentStageIndex: number; // 0-indexed internally
    currentStage: Stage;
    isTransitioning: boolean; // Kept for interface compatibility but may be unused

    nextStage: () => void;
    prevStage: () => void;
    setStage: (index: number) => void;
    setTransitioning: (loading: boolean) => void;
}

export const useStageStore = create<StageState>((set, get) => ({
    currentStageIndex: 0,
    currentStage: STAGES[0],
    isTransitioning: false,

    nextStage: () => {
        const { currentStageIndex } = get();
        const nextIndex = (currentStageIndex + 1) % STAGES.length;
        set({
            currentStageIndex: nextIndex,
            currentStage: STAGES[nextIndex],
            isTransitioning: false, // No manual loading state needed for static images
        });
    },

    prevStage: () => {
        const { currentStageIndex } = get();
        const prevIndex = (currentStageIndex - 1 + STAGES.length) % STAGES.length;
        set({
            currentStageIndex: prevIndex,
            currentStage: STAGES[prevIndex],
            isTransitioning: false,
        });
    },

    setStage: (index) => {
        if (index >= 0 && index < STAGES.length) {
            set({
                currentStageIndex: index,
                currentStage: STAGES[index],
                isTransitioning: false,
            });
        }
    },

    setTransitioning: (loading) => set({ isTransitioning: loading }),
}));