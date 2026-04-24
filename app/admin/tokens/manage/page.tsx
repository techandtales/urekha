import { getTokenHistory } from "@/app/actions/token-actions";
import { CheckCircle2, Clock, XCircle, History } from "lucide-react";

export default async function AdminTokenManagementPage() {
  const { data: history, success, error } = await getTokenHistory();

  if (!success) {
    return <div className="text-red-500">Failed to load token history: {error}</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'rejected': return <XCircle className="text-red-500" size={16} />;
      case 'pending': return <Clock className="text-yellow-500" size={16} />;
      default: return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'rejected': return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'pending': return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header Section - Matching Dashboard Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-1">
            <History size={14} /> Transaction Ledger
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif uppercase leading-none">
            Token <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
            Immutable audit log of all agent liquidity movements and authorizations.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/20 shadow-xl">
          <div className="px-4 py-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <History size={14} /> {history?.length || 0} LOG ENTRIES
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-primary uppercase text-[10px] font-black tracking-[0.1em] transition-colors duration-300 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-5">Temporal Stamp</th>
                <th className="px-6 py-5">Agent Node</th>
                <th className="px-6 py-5 text-right">Liquidity Delta</th>
                <th className="px-6 py-5">Current Status</th>
                <th className="px-6 py-5">Remarks</th>
                <th className="px-6 py-5 text-right">Auth Node</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors duration-300">
              {history?.map((tx) => (
                <tr key={tx.id} className="hover:bg-primary/[0.02] dark:hover:bg-primary/5 transition-all duration-300 group">
                  <td className="px-6 py-5 text-[10px] font-mono text-slate-500 dark:text-zinc-500">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{tx.agent?.name || "UNNAMED_ENTITY"}</div>
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono tracking-tight">{tx.agent?.email}</div>
                  </td>
                  <td className="px-6 py-5 font-source-code font-black text-primary text-right text-lg">
                    +{tx.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(tx.status)}`}>
                      {getStatusIcon(tx.status)}
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 max-w-xs" title={tx.remarks}>
                    <p className="truncate text-xs text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
                      {tx.remarks || <span className="opacity-30 italic font-normal">NULL_REMARKS</span>}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase">{tx.approved_by || "-"}</div>
                    <div className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
                      {tx.approved_at ? new Date(tx.approved_at).toLocaleDateString() : "PENDING_AUTH"}
                    </div>
                  </td>
                </tr>
              ))}
              {!history?.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <History size={32} />
                      <span className="text-xs font-black uppercase tracking-widest">No Transaction History Detected</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
