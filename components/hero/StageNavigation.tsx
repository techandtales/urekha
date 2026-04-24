"use client";

import { useStageStore } from "@/store/stage-store";
import { STAGES } from "@/lib/constants";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function StageNavigation() {
    const { currentStageIndex, nextStage, prevStage, setStage } = useStageStore();

    return (
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-6">
            <div className="text-6xl font-serif font-bold text-white/20 select-none">
                0{currentStageIndex + 1}
            </div>

            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={prevStage}
                    className="group flex flex-col items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
                >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-[10px]">Prev</span>
                    <ArrowUp className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent" />

                <button
                    onClick={nextStage}
                    className="group flex flex-col items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
                >
                    <ArrowDown className="w-4 h-4" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-[10px]">Next</span>
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex flex-col gap-2 mt-4">
                {STAGES.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setStage(i)}
                        className={`w-1 transition-all duration-300 ${i === currentStageIndex ? 'h-8 bg-brand-gold' : 'h-1 bg-white/20 hover:bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
}
