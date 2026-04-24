import { User, CalendarDays, Clock, Bot, FileText, Eye } from "lucide-react";

interface HistoryTabProps {
  recentReports: any[];
  setActiveTab: (tab: "generate" | "reports" | "history" | "view_report", reportId?: string | number) => void;
  setSelectedReportId: (id: number | string | null) => void;
  formatDeterministicDate: (date: Date | string | number) => string;
}

export function HistoryTab({
  recentReports,
  setActiveTab,
  setSelectedReportId,
  formatDeterministicDate,
}: HistoryTabProps) {
  return (
    <div className="max-w-5xl fade-in zoom-in duration-300 animate-in pb-20">
      <header className="mb-10 flex w-full justify-center">
        <div className="flex flex-col items-center text-center w-full">
          <h1 className="text-5xl md:text-6xl text-center font-serif font-black tracking-tight text-slate-900 dark:text-white flex flex-wrap justify-center items-center gap-3">
            <span>REPORT</span>
            <span className="text-primary italic font-serif">HISTORY</span>
          </h1>
        </div>
      </header>
      
      <div className="overflow-x-auto bg-white dark:bg-[#050A0A]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-xl relative z-10 w-full mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 uppercase tracking-widest text-[10px] text-slate-500 dark:text-white/50 bg-slate-50/50 dark:bg-white/[0.02]">
              <th className="p-6 font-bold w-[25%]">Client Info</th>
              <th className="p-6 font-bold hidden sm:table-cell w-[15%]">Package</th>
              <th className="p-6 font-bold hidden lg:table-cell w-[15%]">Paper</th>
              <th className="p-6 font-bold hidden md:table-cell w-[20%]">Txn ID</th>
              <th className="p-6 font-bold hidden md:table-cell w-[15%]">Date</th>
              <th className="p-6 font-bold text-center w-[10%]">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {recentReports?.length > 0 ? (
              recentReports.map((report: any) => {
                const dob = report.user_details?.dob || "Unknown";
                const name = report.user_details?.name || "Unknown";
                return (
                  <tr key={report.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors duration-300">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/50 group-hover:text-primary transition-colors flex-shrink-0">
                          <User size={18} />
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-full">
                            {name}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-white/40 mt-1 flex items-center gap-1.5 flex-wrap">
                            <CalendarDays size={10} className="shrink-0" /> {dob}
                            <span className="opacity-30 dark:opacity-20 mx-1">•</span>
                            <span className="font-mono opacity-80 dark:opacity-60">ID: {report.id}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 hidden sm:table-cell">
                       <div className="flex flex-col items-start">
                         <span
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border ${
                            (report.pricing_plans?.name || report.plan) === "Premium"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : (report.pricing_plans?.name || report.plan) === "Pro" || (report.pricing_plans?.name || report.plan) === "Standard Astrology Report"
                                ? "bg-[#00FF94]/10 text-[#00FF94] border-[#00FF94]/20"
                                : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/80 border-slate-200 dark:border-white/10"
                          }`}
                        >
                          {report.pricing_plans?.name?.replace(" Astrology Report", "") || report.plan}
                        </span>
                       </div>
                    </td>
                    <td className="p-6 hidden lg:table-cell">
                       <div className="flex items-center gap-2">
                         {report.paper_quality === "premium" ? (
                            <span className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-amber-500/10 text-amber-500/90 border border-amber-500/20 flex items-center gap-1.5 w-max shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                              <Bot size={14} /> Premium
                            </span>
                         ): (
                            <span className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 w-max">
                              <FileText size={14} /> {report.paper_quality === "regular" ? "Regular" : (report.paper_quality || "Regular")}
                            </span>
                         )}
                       </div>
                    </td>
                    <td className="p-6 hidden md:table-cell">
                       <div className="text-xs font-mono font-bold text-slate-700 dark:text-white/80 truncate max-w-[150px]" title={report.transaction_id || report.payment_id || "N/A"}>
                         {report.transaction_id || report.payment_id || "N/A"}
                       </div>
                    </td>
                    <td className="p-6 hidden md:table-cell">
                      <div className="text-sm text-slate-800 dark:text-white/90 font-medium font-mono flex items-center gap-2">
                        <Clock size={16} className="text-slate-400 dark:text-white/40 shrink-0" />
                        {formatDeterministicDate(report.created_at)}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setActiveTab("view_report", report.report_id || report.id);
                          }}
                          className="p-3 mx-auto rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 hover:bg-primary/20 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all group-hover:scale-105"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6}>
                   <div className="text-center py-20 border border-transparent border-t-slate-200 dark:border-t-white/10">
                     <p className="text-sm font-medium text-slate-500 dark:text-white/40">No historical reports available yet.</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
