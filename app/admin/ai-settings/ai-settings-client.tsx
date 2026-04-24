"use client";
import { useState } from "react";
import { Bot, Save, Plus, X, Loader2, KeyRound, Cpu } from "lucide-react";
import { toast } from "sonner";
import { AISettings, updateAISettings } from "./actions";

interface AISettingsClientProps {
  initialSettings: AISettings;
}

export default function AISettingsClient({ initialSettings }: AISettingsClientProps) {
  const [settings, setSettings] = useState<AISettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ field: keyof Omit<AISettings, "id">, index: number, value: string } | null>(null);

  // Input states for each array field
  const [geminiKeyInput, setGeminiKeyInput] = useState("");
  const [geminiModelInput, setGeminiModelInput] = useState("");
  const [openaiKeyInput, setOpenaiKeyInput] = useState("");
  const [openaiModelInput, setOpenaiModelInput] = useState("");

  const handleAddField = (field: keyof Omit<AISettings, "id">, value: string, setter: (val: string) => void) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    
    if (settings[field].includes(trimmed)) {
      toast.error(`${trimmed} is already in the list.`);
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [field]: [...prev[field], trimmed],
    }));
    setter("");
  };

  const triggerRemoveField = (field: keyof Omit<AISettings, "id">, index: number, value: string) => {
    setDeleteTarget({ field, index, value });
  };

  const confirmRemoveField = () => {
    if (!deleteTarget) return;
    const { field, index } = deleteTarget;
    setSettings((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray.splice(index, 1);
      return { ...prev, [field]: updatedArray };
    });
    setDeleteTarget(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { id, ...dataToSave } = settings;
    
    const { success, error } = await updateAISettings(dataToSave);
    
    if (success) {
      toast.success("AI Settings saved successfully.");
    } else {
      toast.error("Failed to save settings", { description: error });
    }
    setIsSaving(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof Omit<AISettings, "id">,
    value: string,
    setter: (val: string) => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddField(field, value, setter);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 fade-in zoom-in duration-300 animate-in">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-1">
            <Bot size={14} /> AI Intelligence Core
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif uppercase leading-none">
            Neural <span className="text-primary italic">Settings</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
            Configuring the multi-model fallback logic for astrological deterministic synthesis.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Synchronize Core
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gemini Settings */}
        <section className="space-y-6 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-3xl relative overflow-hidden group shadow-sm dark:shadow-none transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a73e8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-5">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                <Bot className="text-primary w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Google Gemini</h3>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-0.5">High-Token Performance</p>
             </div>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Gemini API Keys */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 flex items-center gap-2 transition-colors">
                <KeyRound size={14} className="text-[#1a73e8]" /> API Keys
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "gemini_api_keys", geminiKeyInput, setGeminiKeyInput)}
                  placeholder="Paste Gemini API Key..."
                  className="flex-1 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8]/50 focus:bg-white dark:focus:bg-white/[0.05] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddField("gemini_api_keys", geminiKeyInput, setGeminiKeyInput)}
                  className="px-4 py-2 bg-[#1a73e8]/10 text-[#1a73e8] border border-[#1a73e8]/20 rounded-xl hover:bg-[#1a73e8]/20 transition-all flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {settings.gemini_api_keys.map((key, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#1a73e8]/10 border border-[#1a73e8]/20 px-3 py-1.5 rounded-lg text-sm text-slate-700 dark:text-white/80 font-mono transition-colors">
                    <span>{key.substring(0, 6)}...{key.substring(key.length - 4)}</span>
                    <button onClick={() => triggerRemoveField("gemini_api_keys", idx, key)} className="text-white/40 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {settings.gemini_api_keys.length === 0 && (
                  <span className="text-sm text-slate-400 dark:text-white/30 italic transition-colors">No keys added.</span>
                )}
              </div>
            </div>

            {/* Gemini Models */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-2">
                <Cpu size={14} className="text-[#1a73e8]" /> Default Models (Fallback Order)
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={geminiModelInput}
                  onChange={(e) => setGeminiModelInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "gemini_models", geminiModelInput, setGeminiModelInput)}
                  placeholder="e.g. gemini-1.5-pro, gemini-1.5-flash"
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#1a73e8]/50 focus:bg-white/[0.05] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddField("gemini_models", geminiModelInput, setGeminiModelInput)}
                  className="px-4 py-2 bg-[#1a73e8]/10 text-[#1a73e8] border border-[#1a73e8]/20 rounded-xl hover:bg-[#1a73e8]/20 transition-all flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {settings.gemini_models.map((model, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-white/80 font-mono transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30 w-4">{idx + 1}.</span>
                      <span>{model}</span>
                    </div>
                    <button onClick={() => triggerRemoveField("gemini_models", idx, model)} className="text-white/40 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {settings.gemini_models.length === 0 && (
                  <span className="text-sm text-slate-400 dark:text-white/30 italic transition-colors">No models added.</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* OpenAI Settings */}
        <section className="space-y-6 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-3xl relative overflow-hidden group shadow-sm dark:shadow-none transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10a37f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-5">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <Bot className="text-emerald-500 w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">OpenAI Suite</h3>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-0.5">GPT-4 Logic Core</p>
             </div>
          </div>

          <div className="relative z-10 space-y-6">
            {/* OpenAI API Keys */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 flex items-center gap-2 transition-colors">
                <KeyRound size={14} className="text-[#10a37f]" /> API Keys
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={openaiKeyInput}
                  onChange={(e) => setOpenaiKeyInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "openai_api_keys", openaiKeyInput, setOpenaiKeyInput)}
                  placeholder="Paste OpenAI API Key (sk-...)"
                  className="flex-1 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#10a37f]/50 focus:bg-white dark:focus:bg-white/[0.05] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddField("openai_api_keys", openaiKeyInput, setOpenaiKeyInput)}
                  className="px-4 py-2 bg-[#10a37f]/10 text-[#10a37f] border border-[#10a37f]/20 rounded-xl hover:bg-[#10a37f]/20 transition-all flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {settings.openai_api_keys.map((key, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#10a37f]/10 border border-[#10a37f]/20 px-3 py-1.5 rounded-lg text-sm text-slate-700 dark:text-white/80 font-mono transition-colors">
                    <span>{key.substring(0, 6)}...{key.substring(key.length - 4)}</span>
                    <button onClick={() => triggerRemoveField("openai_api_keys", idx, key)} className="text-white/40 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {settings.openai_api_keys.length === 0 && (
                  <span className="text-sm text-slate-400 dark:text-white/30 italic transition-colors">No keys added.</span>
                )}
              </div>
            </div>

            {/* OpenAI Models */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-white/50 flex items-center gap-2">
                <Cpu size={14} className="text-[#10a37f]" /> Default Models (Fallback Order)
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={openaiModelInput}
                  onChange={(e) => setOpenaiModelInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "openai_models", openaiModelInput, setOpenaiModelInput)}
                  placeholder="e.g. gpt-4o, gpt-4o-mini"
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#10a37f]/50 focus:bg-white/[0.05] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddField("openai_models", openaiModelInput, setOpenaiModelInput)}
                  className="px-4 py-2 bg-[#10a37f]/10 text-[#10a37f] border border-[#10a37f]/20 rounded-xl hover:bg-[#10a37f]/20 transition-all flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {settings.openai_models.map((model, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-white/80 font-mono transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30 w-4">{idx + 1}.</span>
                      <span>{model}</span>
                    </div>
                    <button onClick={() => triggerRemoveField("openai_models", idx, model)} className="text-white/40 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {settings.openai_models.length === 0 && (
                  <span className="text-sm text-slate-400 dark:text-white/30 italic transition-colors">No models added.</span>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200 transition-colors">
          <div className="bg-white dark:bg-[#0A0F0F] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors">Confirm Removal</h3>
            <p className="text-slate-500 dark:text-white/60 text-sm mb-6 leading-relaxed transition-colors">
              Are you sure you want to remove <strong className="text-slate-900 dark:text-white break-all bg-slate-100 dark:bg-white/5 px-1 py-0.5 rounded transition-colors">{deleteTarget.value}</strong> from your configuration?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveField}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.2)]"
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
