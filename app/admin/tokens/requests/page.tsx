import { getPendingTokenRequests } from "@/app/actions/token-actions";
import TokenRequestAction from "./TokenRequestAction";
import { Coins } from "lucide-react";

export default async function AdminTokenRequestsPage() {
  const { data: requests, success, error } = await getPendingTokenRequests();

  if (!success) {
    return <div className="text-red-500">Failed to load token requests: {error}</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header Section - Matching Dashboard Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-1">
            <Coins size={14} /> Financial Operations
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif uppercase leading-none">
            Token <span className="text-primary italic">Requests</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
            Authorization gateway for agent liquidity replenishment.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/20 shadow-xl">
          <div className="px-4 py-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Coins size={14} /> {requests?.length || 0} PENDING REQUISITIONS
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests?.map((tx) => (
          <div key={tx.id} className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between group hover:border-primary/40 transition-all duration-500 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">{tx.agent?.name || "ANONYMOUS_AGENT"}</h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{tx.agent?.email}</p>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-primary border border-slate-200 dark:border-white/10 px-4 py-3 rounded-2xl text-center shadow-inner transition-colors">
                  <div className="text-[9px] uppercase font-black tracking-[0.2em] mb-1 opacity-60">Requisition</div>
                  <div className="text-3xl font-black font-mono leading-none">+{tx.amount}</div>
                </div>
              </div>
              
              <div className="space-y-3 mb-8 text-xs font-medium">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 dark:text-zinc-500 w-24 uppercase tracking-widest text-[9px] font-black">Timestamp:</span>
                  <span className="text-slate-700 dark:text-zinc-300 font-mono">{new Date(tx.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-400 dark:text-zinc-500 w-24 uppercase tracking-widest text-[9px] font-black mt-1">Directives:</span>
                  <span className="text-slate-700 dark:text-zinc-300 italic flex-1 leading-relaxed">"{tx.remarks || "NO_SPECIFIC_JUSTIFICATION"}"</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <TokenRequestAction tx={tx} />
            </div>
          </div>
        ))}

        {!requests?.length && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[3rem] shadow-xl">
            <div className="flex flex-col items-center gap-4 opacity-30">
              <div className="p-5 rounded-full bg-primary/10 text-primary">
                <Coins size={48} strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Equilibrium Achieved</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">All liquidity requests have been synchronized.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
