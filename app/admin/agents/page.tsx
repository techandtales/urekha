import { getAllAgents } from "@/app/actions/token-actions";
import { Users } from "lucide-react";

export default async function AdminAgentsPage() {
  const { data: agents, success } = await getAllAgents();

  if (!success) {
    return <div className="text-red-500">Failed to load agents.</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header Section - Matching Dashboard Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-1">
            <Users size={14} /> Agent Network
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif uppercase leading-none">
            All <span className="text-primary italic">Agents</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
            Real-time management of distributed Vedic intelligence providers.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/20 shadow-xl">
          <div className="px-4 py-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Users size={14} /> {agents?.length || 0} ACTIVE NODES
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-primary uppercase text-[10px] font-black tracking-[0.1em] transition-colors duration-300 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-5">Agent Identity</th>
                <th className="px-6 py-5">Network Contact</th>
                <th className="px-6 py-5 text-right">Liquidity Available</th>
                <th className="px-6 py-5 text-right">Consumption</th>
                <th className="px-6 py-5 text-right">Economic Value</th>
                <th className="px-6 py-5">Registry Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors duration-300">
              {agents?.map((agent) => (
                <tr key={agent.id} className="hover:bg-primary/[0.02] dark:hover:bg-primary/5 transition-all duration-300 group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{agent.name || "UNNAMED_ENTITY"}</div>
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1 tracking-tight">{agent.agent_uuid}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-slate-700 dark:text-zinc-300 font-medium">{agent.email}</div>
                    <div className="text-xs text-slate-400 dark:text-zinc-500">{agent.phone || "NO_CONTACT_LINK"}</div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono font-bold text-primary">
                    {((agent.tokens_total || 0) - (agent.tokens_used || 0)).toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-slate-600 dark:text-zinc-400">
                    {agent.tokens_used?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-5 text-right font-mono font-black text-slate-900 dark:text-white">
                    ₹{agent.revenue?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 dark:text-zinc-500 font-medium">
                    {new Date(agent.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
              {!agents?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Users size={32} />
                      <span className="text-xs font-black uppercase tracking-widest">No Active Nodes Detected</span>
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
