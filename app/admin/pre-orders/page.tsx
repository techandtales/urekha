import { getPreOrders } from "@/app/actions/token-actions";
import { Clock, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPreOrdersPage() {
  const { data: preOrders, success } = await getPreOrders();

  if (!success) {
    return (
      <div className="text-red-500 p-8 bg-red-50 rounded-xl border border-red-200">
        Failed to load pre-orders. Please ensure MongoDB is connected.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-1">
            <Clock size={14} /> Acquisition Pipeline
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif uppercase leading-none">
            Pre-Order <span className="text-primary italic">Requests</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
            Managing early-access interest and high-performance plan
            reservations.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/20 shadow-xl">
          <div className="px-4 py-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <UserCheck size={14} /> {preOrders?.length || 0} TOTAL PRE-ORDERS
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-primary uppercase text-[10px] font-black tracking-[0.1em] transition-colors duration-300 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-5">Customer Info</th>
                <th className="px-6 py-5">Birth Details</th>
                <th className="px-6 py-5">Plan Reserved</th>
                <th className="px-6 py-5">Submission Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors duration-300">
              {preOrders?.map((order: any) => (
                <tr
                  key={order._id}
                  className="hover:bg-primary/[0.02] dark:hover:bg-primary/5 transition-all duration-300 group"
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-base tracking-tight">
                        {order.fullName || "GHOST_USER"}
                      </div>
                      <div className="flex flex-col gap-1">
                        {order.email && (
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-2 group/email">
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
                            <span className="lowercase truncate max-w-[180px]">{order.email}</span>
                          </div>
                        )}
                        {order.phone && (
                          <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-bold flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-zinc-800" />
                            <span>{order.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 w-fit">
                        {order.status || "PENDING"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-slate-700 dark:text-zinc-300 font-medium">
                      {order.dob} @ {order.tob}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-zinc-500">
                      {order.pob || "LOCATION_NOT_SET"}
                    </div>
                    {order.latitude && order.longitude && (
                      <div className="text-[10px] text-primary/70 dark:text-primary/50 font-mono mt-1 flex items-center gap-1">
                        <span className="opacity-50">COORD:</span> {order.latitude}, {order.longitude}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      order.plan === "elite" 
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" 
                        : order.plan === "premium"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
                    )}>
                      {order.plan || "STANDARD"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 dark:text-zinc-500 font-medium">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : "N/A"}
                  </td>
                </tr>
              ))}
              {!preOrders?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <Clock size={32} />
                      <span className="text-xs font-black uppercase tracking-widest">
                        No Pre-Orders Yet
                      </span>
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
