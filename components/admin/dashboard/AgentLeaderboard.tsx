import { Trophy, Mail, CreditCard } from "lucide-react";

export const AgentLeaderboard = ({ agents }: { agents: any[] }) => {
  return (
    <div className="space-y-4">
      {agents.map((agent, idx) => (
        <div 
          key={agent.email} 
          className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              idx === 0 ? "bg-amber-500/10 text-amber-500" : 
              idx === 1 ? "bg-slate-400/10 text-slate-400" :
              "bg-primary/10 text-primary"
            }`}>
              {idx === 0 ? <Trophy size={18} /> : idx + 1}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                {agent.name || "Unnamed Agent"}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-zinc-500 font-medium tracking-wide uppercase">
                <Mail size={10} /> {agent.email.split('@')[0]}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-black text-slate-900 dark:text-white">
              ₹{agent.revenue?.toLocaleString() || 0}
            </p>
            <p className="text-[10px] font-bold text-primary flex items-center justify-end gap-1">
              <CreditCard size={10} /> {agent.tokens_total || 0} TOKENS
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
