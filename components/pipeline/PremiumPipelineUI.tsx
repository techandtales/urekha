"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useStore } from "@/lib/store";
import { UserOrchestrator } from "@/lib/pipeline/userOrchestrator";
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
    ThermometerSnowflake,
    Play
} from "lucide-react";

interface PremiumPipelineUIProps {
  args: BaseArgs;
  onComplete: () => void;
  onCancel: () => void;
}

export default function PremiumPipelineUI({ args, onComplete, onCancel }: PremiumPipelineUIProps) {
  const store = useStore();
  const orchestratorRef = useRef<UserOrchestrator | null>(null);
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
        // We know planId as tokenCost will be mapped, let's cast or adjust the params. We can construct args here.
        const planTokenCost = useStore.getState().jyotishamData.planId;
        const reportId = useStore.getState().jyotishamData.socketRoom; // Or passed via args? The user doesn't have reportId injected yet. Wait! We need reportId.
        
        orchestratorRef.current = new UserOrchestrator({ ...args, reportId: args.reportId as string, planTokenCost: args.planTokenCost as number }, actions);
    }

    if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        // Auto-start Phase 1
        store.resetPipeline();
        store.resetModularPipeline();
        orchestratorRef.current.runPhase1();
    }
  }, [args]);

  // Auto-scroll logic (Enhanced to trigger on phase changes)
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth"
        });
    }
  }, [store.pipelineMessages.length, store.modularPhase, store.isPhase1Complete, store.isPhase2Started]);

  const customScrollbarStyles = `
    .cool-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .cool-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 10px;
    }
    .cool-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(0, 255, 148, 0.1);
      border-radius: 10px;
      transition: all 0.3s;
    }
    .cool-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 255, 148, 0.4);
      box-shadow: 0 0 10px rgba(0, 255, 148, 0.2);
    }
  `;

  const handleStartPhase2 = () => {
    if (orchestratorRef.current) {
        const prompts = (window as any).__plannedPrompts || [];
        orchestratorRef.current.runPhase2(prompts);
    }
  };

  const handleHardRefresh = () => {
    window.location.reload();
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
      
      {/* ── Cinematic Progress Header ── */}
      <header className="p-6 border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-[#020408]/80 backdrop-blur-xl flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle 
                    cx="32" cy="32" r="28" fill="none" stroke="#00FF94" strokeWidth="4" 
                    strokeDasharray={176} 
                    strokeDashoffset={176 - (176 * (store.pipelineProgress.completed / (store.pipelineProgress.total || 1)))}
                    className="transition-all duration-700 ease-out"
                />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-[#00FF94]">
                {Math.round((store.pipelineProgress.completed / (store.pipelineProgress.total || 1)) * 100)}%
            </span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:to-white/40">
                Generating Your Kundli <span className="text-[#00FF94] font-mono">v2.0</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-800 dark:text-white/30 mt-1">
                Progress: {store.isPhase1Complete ? 'Analyzing Charts' : 'Calculating Planets'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 dark:text-white/20 tracking-[0.2em]">Engine_Status</span>
                <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 w-4 rounded-full transition-all duration-500 ${i <= 3 ? 'bg-[#00FF94] shadow-[0_0_8px_rgba(0,255,148,0.4)]' : 'bg-slate-200 dark:bg-white/5'}`} />
                    ))}
                </div>
            </div>
            <button onClick={onCancel} className="p-2 text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white/60 transition-colors">
                <ShieldAlert size={20} />
            </button>
        </div>
      </header>

      {/* ── Main Scroll View ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 cool-scrollbar relative z-10" ref={scrollRef}>
        
        {/* Celestial Background Overlay */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-40">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/premium_celestial_void_bg.png')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 dark:from-[#050A0A] via-transparent to-slate-50 dark:to-[#050A0A]" />
        </div>

        
        {/* Phase 1: Calculations */}
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-black tracking-[0.2em] text-slate-900 dark:text-white/20">Step 1: Calculating Positions</h3>
                {store.isPhase1Complete && <CheckCircle2 size={16} className="text-[#00FF94]" />}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jyotishamMessages.map(msg => (
                    <div key={msg.id} className={`p-5 rounded-3xl border transition-all duration-500 ${
                        msg.status === 'success' ? 'bg-[#00FF94]/10 dark:bg-[#00FF94]/5 border-[#00FF94]/20 dark:border-[#00FF94]/10' :
                        msg.status === 'error' ? 'bg-red-500/5 border-red-500/10' :
                        'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 shadow-sm'
                    }`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-[10px] font-black tracking-wider ${
                                msg.status === 'success' ? 'text-emerald-700 dark:text-[#00FF94]' : 
                                msg.status === 'error' ? 'text-red-700 dark:text-red-400' : 'text-slate-500 dark:text-white/40'
                            }`}>
                                {msg.status.toUpperCase()}
                            </span>
                            {msg.status === 'pending' && <RefreshCcw size={12} className="animate-spin text-slate-500 dark:text-white/20" />}
                        </div>
                        <div className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                            {msg.label.replace('Syncing', 'Calculating').replace('Collecting', 'Fetching').replace('Calculating', 'Analyzing')}
                        </div>
                        
                        {msg.status === 'error' && (
                            <button 
                                onClick={() => orchestratorRef.current?.retryJyotishamTask(msg.step)}
                                className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors bg-red-400/10 px-3 py-1.5 rounded-full w-fit"
                            >
                                <Zap size={10} fill="currentColor" /> Retry Analysis
                            </button>
                        )}
                    </div>
                ))}

                {/* ── Integrated Cooling Block ── */}
                {store.modularPhase === 'cooling' && (
                    <div className="md:col-span-2 lg:col-span-3 p-8 rounded-[3rem] bg-gradient-to-br from-[#00FF94]/10 via-[#00FF94]/5 to-transparent border border-[#00FF94]/20 animate-in zoom-in-95 duration-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ThermometerSnowflake size={120} className="text-[#00FF94]" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(0,255,148,0.05)" strokeWidth="6" />
                                    <circle 
                                        cx="48" cy="48" r="44" fill="none" stroke="#00FF94" strokeWidth="6" 
                                        strokeDasharray={276} 
                                        strokeDashoffset={276 - (276 * (store.coolingTimer / 45))}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 linear"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-xl font-black font-mono text-[#00FF94]">
                                    {store.coolingTimer}s
                                </div>
                            </div>

                            <div className="text-center md:text-left space-y-2">
                                <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Safety Buffer Enabled</h2>
                                <p className="text-slate-600 dark:text-white/40 text-sm max-w-md font-bold leading-relaxed">
                                    Optimizing server load to ensure maximum accuracy for your charts. Resume in a few seconds.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* Phase 2: Analysis */}
        {store.isPhase1Complete && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase font-black tracking-[0.2em] text-slate-900 dark:text-white/20">Step 2: Analysis & Predictions</h3>
                    {store.isPhase2Started ? (
                        <Bot size={16} className="text-[#FF8C00] animate-pulse" />
                    ) : (
                        <div className="text-[10px] font-bold text-[#FF8C00] tracking-widest animate-pulse">PENDING START</div>
                    )}
                </div>

                {!store.isPhase2Started && (
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#FF8C00]/10 to-transparent border border-[#FF8C00]/20 text-center space-y-6">
                        <div className="w-16 h-16 bg-[#FF8C00]/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#FF8C00]/20">
                            <Bot className="text-[#FF8C00]" size={32} />
                        </div>
                        <div className="space-y-2">
                             <div className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Planetary Positions Ready ✓</div>
                             <p className="text-sm text-slate-800 dark:text-white/40 max-sm mx-auto font-bold text-center">Charts calculated successfully. Click below to start the final analysis.</p>
                        </div>
                        <button 
                            onClick={handleStartPhase2}
                            className="bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 mx-auto"
                        >
                            <Play size={16} fill="currentColor" /> Start Final Analysis
                        </button>
                    </div>
                )}

                <div className="space-y-2">
                    {predictMessages.map(msg => (
                        <div key={msg.id} className="flex items-center justify-between p-4 bg-white shadow-sm dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl group hover:border-[#FF8C00]/30 transition-all">
                             <div className="flex items-center gap-4">
                                {msg.status === 'success' ? <CheckCircle2 size={16} className="text-[#00FF94]" /> :
                                 msg.status === 'error' ? <AlertCircle size={16} className="text-red-600 dark:text-red-400" /> :
                                 <RefreshCcw size={16} className="animate-spin text-slate-400 dark:text-white/20" />}
                                <span className={`text-sm font-bold ${msg.status === 'error' ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{msg.label}</span>
                             </div>
                        </div>
                    ))}
                </div>
            </section>
        )}
      </div>

      {/* ── Footer Actions ── */}
      <footer className="p-6 border-t border-slate-200 dark:border-white/5 bg-white/70 dark:bg-[#020408]/80 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-900 dark:text-white/30 uppercase tracking-[0.2em] font-sans">
            <span>Urekha Security</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
            <span>Encrypted Node</span>
          </div>

          {(store.modularPhase === 'complete' || store.modularPhase === 'total_fail') && (
            <button 
                onClick={onComplete}
                className="bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#00FF94] transition-all flex items-center gap-2 group"
            >
                View Final Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
      </footer>
    </div>
  );
}
