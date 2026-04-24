import { getAllUsers } from "@/app/actions/token-actions";
import { UserSquare2 } from "lucide-react";

export default async function AdminUsersPage() {
  const { data: users, success } = await getAllUsers();

  if (!success) {
    return <div className="text-red-500">Failed to load users.</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header Section - Matching Dashboard Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-1">
            <UserSquare2 size={14} /> User Ecosystem
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif uppercase leading-none">
            Direct <span className="text-primary italic">Users</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
            Real-time synchronization of individual user profiles and birth data.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/20 shadow-xl">
          <div className="px-4 py-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <UserSquare2 size={14} /> {users?.length || 0} TOTAL USERS
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 dark:text-zinc-300">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-primary uppercase text-[10px] font-black tracking-[0.1em] transition-colors duration-300 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-5">User Profile</th>
                <th className="px-6 py-5">Vedic Markers</th>
                <th className="px-6 py-5">Spatial Node</th>
                <th className="px-6 py-5">Registry Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 transition-colors duration-300">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-primary/[0.02] dark:hover:bg-primary/5 transition-all duration-300 group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{u.name || "UNNAMED_USER"}</div>
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1 tracking-tight">{u.email}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-slate-700 dark:text-zinc-300 font-medium">
                      {u.date_of_birth ? new Date(u.date_of_birth).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "NOT_SPECIFIED"}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-zinc-500">{u.time_of_birth || "UNKNOWN_TIME"}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-slate-700 dark:text-zinc-300 font-bold">{u.city ? `${u.city}, ${u.state}` : "VIRTUAL_NODE"}</div>
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{u.country}</div>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 dark:text-zinc-500 font-medium">
                    {new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
              {!users?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <UserSquare2 size={32} />
                      <span className="text-xs font-black uppercase tracking-widest">No Registered Users</span>
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
