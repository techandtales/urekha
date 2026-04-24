"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useStore } from "@/lib/store";
import { ModularOrchestrator } from "@/lib/pipeline/modularOrchestrator";
import { type BaseArgs } from "@/lib/pipeline/constants";
import { 
    Clock, 
    Bot, 
    CheckCircle2, 
    AlertCircle, 
    RefreshCcw, 
    ArrowRight, 
    Zap,
    ShieldAlert,
    ThermometerSnowflake
} from "lucide-react";

interface ModularPipelineUIProps {
  args: BaseArgs;
  onComplete: () => void;
  onCancel: () => void;
}

export default function ModularPipelineUI({ args, onComplete, onCancel }: ModularPipelineUIProps) {
  const store = useStore();
  const orchestratorRef = useRef<ModularOrchestrator | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasStartedRef = useRef(false);

  // Initialize Orchestrator
  useEffect(() => {
    if (!orchestratorRef.current) {
        const actions = {
            setJyotishamData: store.setJyotishamData,
            pushMessage: store.pushMessage,
            updateMessage: store.updateMessage,
            pushError: store.pushError,
            removeError: store.removeError,
            incrementCompleted: store.incrementCompleted,
            setProgress: store.setProgress,
            setPipelineRunning: store.setPipelineRunning,
            setPrediction: store.setPrediction,
            resetPipeline: store.resetPipeline,
        };
        orchestratorRef.current = new ModularOrchestrator(args, actions);
    }

    if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        // Auto-start Phase 1
        store.resetPipeline();
        store.resetModularPipeline();
        orchestratorRef.current.runPhase1();
    }
  }, [args]);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
        });
    }
  }, [store.pipelineMessages.length, store.modularPhase]);

  const customScrollbarStyles = `
    .cool-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .cool-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .cool-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(59, 130, 246, 0.2);
      border-radius: 10px;
    }
    .cool-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(59, 130, 246, 0.4);
    }
  `;

  const handleStartPhase2 = () => {
    if (orchestratorRef.current) {
        const prompts = (window as any).__plannedPrompts || [];
        orchestratorRef.current.runPhase2(prompts);
    }
  };

  const handleRetryPrediction = (slug: string) => {
    if (orchestratorRef.current) {
        const prompts = (window as any).__plannedPrompts || [];
        const prompt = prompts.find((p: any) => p.slug === slug);
        if (prompt) {
            const roomId = store.jyotishamData.socketRoom;
            store.removeError(`err-${slug}`);
            orchestratorRef.current.executePrediction(prompt, roomId!);
        }
    }
  };

  const jyotishamMessages = store.pipelineMessages.filter(m => m.group?.startsWith('jyotisham'));
  const predictMessages = store.pipelineMessages.filter(m => m.group?.startsWith('predict'));

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#050A0A] text-slate-900 dark:text-white font-sans overflow-hidden transition-colors duration-500">
      <style>{customScrollbarStyles}</style>
      
      {/* ── Technical Progress Header ── */}
      <header className="p-6 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#020408]/80 backdrop-blur-xl flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center font-mono">
            <svg className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeWidth="4" />
                <circle 
                    cx="32" cy="32" r="28" fill="none" stroke="#3B82F6" strokeWidth="4" 
                    strokeDasharray={176} 
                    strokeDashoffset={176 - (176 * (store.pipelineProgress.completed / (store.pipelineProgress.total || 1)))}
                    className="transition-all duration-1000 ease-in-out"
                />
            </svg>
            <span className="absolute text-xs font-black text-blue-600 dark:text-blue-400">
                {Math.round((store.pipelineProgress.completed / (store.pipelineProgress.total || 1)) * 100)}%
            </span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
                Celestial Pipeline <span className="text-blue-600 dark:text-blue-400 font-mono italic">v2.0</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-mono font-bold text-slate-400 dark:text-white/30 mt-1">
                PHASE_{store.isPhase1Complete ? '02' : '01'} // {store.modularPhase.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 dark:text-white/20 tracking-[0.2em]">System_Load</span>
                <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 w-4 rounded-full transition-all duration-500 ${i <= 3 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'bg-slate-200 dark:bg-white/5'}`} />
                    ))}
                </div>
            </div>
            <button onClick={onCancel} className="p-2 text-white/20 hover:text-white/60 transition-colors">
                <ShieldAlert size={20} />
            </button>
        </div>
      </header>

      {/* ── Main Scroll View ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 cool-scrollbar relative z-10" ref={scrollRef}>
        
        {/* Phase 1: Jyotisham */}
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-black tracking-[0.3em] text-slate-400 dark:text-white/20">Data Collection Layer</h3>
                {store.isPhase1Complete && <CheckCircle2 size={16} className="text-blue-500" />}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jyotishamMessages.map(msg => (
                    <div key={msg.id} className={`p-5 rounded-3xl border transition-all duration-500 group relative backdrop-blur-md ${
                        msg.status === 'success' ? 'bg-blue-500/5 dark:bg-blue-500/[0.03] border-blue-500/20 shadow-sm' :
                        msg.status === 'error' ? 'bg-red-500/5 border-red-500/20' :
                        'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 shadow-sm'
                    }`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-[10px] font-bold tracking-wider ${
                                msg.status === 'success' ? 'text-blue-600 dark:text-blue-400' : 
                                msg.status === 'error' ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-white/40'
                            }`}>
                                {msg.status.toUpperCase()}
                            </span>
                            {msg.status === 'pending' && <RefreshCcw size={12} className="animate-spin text-blue-500/40" />}
                        </div>
                        <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{msg.label}</div>
                        
                        {msg.status === 'error' && (
                            <button 
                                onClick={() => orchestratorRef.current?.retryJyotishamTask(msg.step)}
                                className="mt-4 w-full py-2.5 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-[10px] font-bold uppercase text-red-500 transition-all flex items-center justify-center gap-2 active:scale-95 active:bg-red-500/20 shadow-sm"
                            >
                                <RefreshCcw size={10} strokeWidth={3} /> Retry Node
                            </button>
                        )}
                    </div>
                ))}

                {/* ── Integrated Cooling Block ── */}
                {store.modularPhase === 'cooling' && (
                    <div className="md:col-span-2 lg:col-span-3 p-8 rounded-3xl bg-blue-500/5 dark:bg-white/[0.02] border border-blue-500/20 dark:border-white/5 backdrop-blur-xl animate-in zoom-in-95 duration-700 shadow-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" className="text-blue-500/10" strokeWidth="6" />
                                    <circle 
                                        cx="48" cy="48" r="44" fill="none" stroke="#3B82F6" strokeWidth="6" 
                                        strokeDasharray={276} 
                                        strokeDashoffset={276 - (276 * (store.coolingTimer / 45))}
                                        className="transition-all duration-1000 linear"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                                    {store.coolingTimer}
                                </div>
                            </div>
                            
                            <div className="text-center md:text-left space-y-3">
                                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center justify-center md:justify-start gap-4">
                                    <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/10">
                                        <ThermometerSnowflake className="text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    Cooling Layer Active
                                </h2>
                                <p className="text-slate-500 dark:text-white/40 text-sm max-w-sm font-medium leading-relaxed">
                                    Mitigating server load to ensure high-precision data retrieval. The pipeline will automatically resume shortly.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* Phase 2: Predictions (Sequential) */}
        {store.isPhase1Complete && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase font-black tracking-[0.3em] text-slate-400 dark:text-white/20">AI Interpretation Layer</h3>
                    {store.isPhase2Started ? (
                        <Bot size={16} className="text-indigo-500 animate-pulse" />
                    ) : (
                        <div className="text-[10px] font-black text-indigo-500 tracking-[0.2em] animate-pulse">AWAITING TRIGGER</div>
                    )}
                </div>

                {!store.isPhase2Started && (
                    <div className="p-10 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-center space-y-6 shadow-sm backdrop-blur-xl group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-indigo-500/5">
                            <Bot className="text-indigo-600 dark:text-indigo-400" size={32} />
                        </div>
                        <div className="space-y-3 relative z-10">
                             <div className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Core Harvest Complete ✓</div>
                             <p className="text-sm text-slate-500 dark:text-white/40 max-w-xs mx-auto font-medium">All celestial data has been harvested successfully. Ready to trigger AI processing layers.</p>
                        </div>
                        <button 
                            onClick={handleStartPhase2}
                            className="bg-indigo-600 dark:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
                        >
                            Trigger AI Logic
                        </button>
                    </div>
                )}

                <div className="space-y-3">
                    {predictMessages.map(msg => (
                        <div key={msg.id} className="flex items-center justify-between p-5 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                             <div className="flex items-center gap-4">
                                {msg.status === 'success' ? <CheckCircle2 size={16} className="text-blue-500" /> :
                                 msg.status === 'error' ? <AlertCircle size={16} className="text-red-500" /> :
                                 <RefreshCcw size={16} className="animate-spin text-indigo-500/40" />}
                                <span className={`text-sm font-bold ${msg.status === 'error' ? 'text-red-500' : 'text-slate-700 dark:text-white'}`}>{msg.label}</span>
                             </div>
                             {msg.status === 'error' && (
                                <button 
                                    onClick={() => handleRetryPrediction(msg.step)}
                                    className="px-4 py-1.5 rounded-lg border border-red-500/30 text-[10px] font-bold text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest active:scale-95"
                                >
                                    Manual Retry
                                </button>
                             )}
                        </div>
                    ))}
                </div>
            </section>
        )}
      </div>

      {/* ── Footer Actions ── */}
      <footer className="p-6 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-[#020408]/80 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-blue-500" />
                Secured Node
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="italic">Lucknow Central Bridge</span>
          </div>

          {(store.modularPhase === 'complete' || store.modularPhase === 'total_fail') && (
            <button 
                onClick={onComplete}
                className="bg-blue-600 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group shadow-xl shadow-blue-500/20"
            >
                View Final Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
      </footer>
    </div>
  );
}
