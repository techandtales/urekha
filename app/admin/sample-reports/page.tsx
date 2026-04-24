import { FileText } from "lucide-react";
import { SampleReportsClient } from "./SampleReportsClient";

export default function SampleReportsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Top: Header Section matching Dashboard Style */}
      <div className="space-y-1 relative overflow-hidden">
        <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-1">
          <FileText size={14} /> Sample Engine
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif uppercase leading-none">
          Generate <span className="text-primary italic">Sample Kundli</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide mt-2">
          Architecting high-fidelity astrological profiles for system verification and client demonstrations.
        </p>
      </div>

      <SampleReportsClient />
    </div>
  );
}
