import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, TrendingUp, FileText, History, 
  User, CalendarDays, Clock, Bot, Eye,
  Calendar, Settings, Plus, X, Check, Loader2, TriangleAlert, RefreshCw 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

interface ReportsOverviewTabProps {
  agentData: any;
  recentReports: any[];
  branchData: any;
  tokenRequests: any[];
  setActiveTab: (tab: "generate" | "reports" | "history" | "view_report", reportId?: string | number) => void;
  formatDeterministicTime: (date: Date | string | number) => string;
  formatDeterministicDate: (date: Date | string | number) => string;
  setIsEditProfileModalOpen: (open: boolean) => void;
  isAddTokensModalOpen: boolean;
  setIsAddTokensModalOpen: (val: boolean) => void;
  selectedTokenAmount: number | null;
  setSelectedTokenAmount: (val: number | null) => void;
  isRequestingTokens: boolean;
  tokenRequestSuccess: boolean;
  handleRequestTokens: () => void;
  closeTokenModal: () => void;
  pendingTokenRequest: number | null;
  isCancelModalOpen: boolean;
  setIsCancelModalOpen: (val: boolean) => void;
  handleCancelRequest: () => void;
  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen: (val: boolean) => void;
  setSelectedReportId: (id: string) => void;
}

export function ReportsOverviewTab({
  agentData,
  recentReports,
  branchData,
  tokenRequests,
  setActiveTab,
  formatDeterministicTime,
  formatDeterministicDate,
  setIsEditProfileModalOpen,
  isAddTokensModalOpen,
  setIsAddTokensModalOpen,
  selectedTokenAmount,
  setSelectedTokenAmount,
  isRequestingTokens,
  tokenRequestSuccess,
  handleRequestTokens,
  closeTokenModal,
  pendingTokenRequest,
  isCancelModalOpen,
  setIsCancelModalOpen,
  handleCancelRequest,
  isHistoryModalOpen,
  setIsHistoryModalOpen,
  setSelectedReportId
}: ReportsOverviewTabProps) {

  // --- Chart Data Computation ---
  const last15DaysData = useMemo(() => {
    if (!recentReports) return [];
    const data = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = recentReports.filter(
        (r: any) => new Date(r.created_at).toDateString() === dateStr
      ).length;
      data.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        reports: count,
      });
    }
    return data;
  }, [recentReports]);

  const premiumVsRegularData = useMemo(() => {
    if (!recentReports || recentReports.length === 0) return [];
    let premium = 0;
    let regular = 0;
    recentReports.forEach((r: any) => {
      if (r.paper_quality === "premium") {
        premium++;
      } else {
        regular++;
      }
    });
    return [
      { name: "Premium", value: premium },
      { name: "Regular", value: regular },
    ];
  }, [recentReports]);

  const CHART_COLORS = ["#d4af37", "#00FF94"];

  const todayReports = useMemo(() => {
    if (!recentReports) return [];
    return recentReports.filter(
      (r: any) =>
        new Date(r.created_at).toDateString() === new Date().toDateString()
    );
  }, [recentReports]);

  return (
    <div className="max-w-5xl fade-in zoom-in duration-300 animate-in pb-20">
      <header className="mb-10 flex w-full justify-center">
        <div className="flex flex-col items-center text-center w-full">
          <h1 className="text-5xl md:text-6xl text-center font-serif font-black text-slate-900 dark:text-white flex flex-wrap justify-center items-center gap-3">
            <span>AGENT</span>
            <span className="text-primary italic font-serif">DASHBOARD</span>
            <button 
              onClick={() => window.location.reload()}
              className="ml-4 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 hover:text-primary transition-all group shadow-sm hover:shadow-md"
              title="Refresh Dashboard"
            >
              <RefreshCw size={24} className="group-active:rotate-180 transition-transform duration-500" />
            </button>
          </h1>
        </div>
      </header>

      {/* Revenue & Credits HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-6 rounded-[2rem] relative overflow-hidden group hover:border-primary/50 dark:hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-white/[0.04] shadow-sm dark:shadow-none transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h4 className="text-slate-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-widest transition-colors">
              Available Credits
            </h4>
            <div className="p-2 bg-[#00FF94]/10 rounded-lg text-[#00FF94] shadow-[0_0_10px_rgba(0,255,148,0.2)]">
              <Wallet size={18} />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10 font-mono tracking-tighter">
            {((agentData?.tokens_total || 0) - (agentData?.tokens_used || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className="mt-3 relative z-10 flex items-center gap-2">
            <div className="flex-1 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (((agentData?.tokens_total || 0) - (agentData?.tokens_used || 0)) / (agentData?.tokens_total || 1)) * 100)}%` }}
                className="h-full bg-gradient-to-r from-[#00FF94] to-[#00FF94]/50 shadow-[0_0_10px_#00FF94]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-6 rounded-[2rem] relative overflow-hidden group hover:border-primary/50 dark:hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-white/[0.04] shadow-sm dark:shadow-none transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h4 className="text-slate-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-widest transition-colors">
              Total Revenue
            </h4>
            <div className="p-2 bg-primary/10 rounded-lg text-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10 font-mono tracking-tighter">
            ₹{(() => {
              const total = recentReports?.reduce((acc: number, r: any) => {
                const planName = r.pricing_plans?.name || r.plan || "";
                let basePrice = 0;
                
                if (planName.includes("Basic") || planName === "basic") basePrice = 1200;
                else if (planName.includes("Standard") || planName === "pro" || planName === "plus") basePrice = 1500;
                else if (planName.includes("Premium") || planName === "premium") basePrice = 2000;
                else basePrice = r.paid_amount || 0;

                const paperSurcharge = r.paper_quality === "premium" ? 300 : 0;
                return acc + basePrice + paperSurcharge;
              }, 0) || 0;
              return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            })()}
          </div>
          <p className="text-primary/60 text-[10px] mt-2 font-bold uppercase tracking-widest relative z-10">
             Active Earnings
          </p>
        </div>

        <div className="bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-6 rounded-[2rem] relative overflow-hidden group hover:border-primary/50 dark:hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-white/[0.04] shadow-sm dark:shadow-none transition-all duration-500 lg:col-span-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h4 className="text-slate-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-widest transition-colors">
              Reports Generated
            </h4>
            <div className="p-2 bg-[#FF8C00]/10 rounded-lg text-[#FF8C00] shadow-[0_0_10px_rgba(255,140,0,0.2)]">
              <FileText size={18} />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10 font-mono tracking-tighter">
            {recentReports?.length || 0}
          </div>
          <p className="text-[#FF8C00]/60 text-[10px] mt-2 font-bold uppercase tracking-widest relative z-10">
            Total Operations
          </p>
        </div>

        {/* Today's Operations Card */}
        <div className="bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-6 rounded-[2rem] relative overflow-hidden group hover:border-primary/50 dark:hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-white/[0.04] shadow-sm dark:shadow-none transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h4 className="text-slate-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-widest transition-colors">
              Today's Activity
            </h4>
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <History size={18} />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10 truncate font-mono tracking-tighter">
            {todayReports?.length || 0}
          </div>
          <p className="text-indigo-400/60 text-[10px] mt-2 font-bold uppercase tracking-widest relative z-10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            Live Generations
          </p>
        </div>
      </div>

      {/* Credit Management Section */}
      <section className="mb-12 bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-6 md:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF94]/10 border border-[#00FF94]/20 flex items-center justify-center text-[#00FF94] shadow-[0_0_15px_rgba(0,255,148,0.15)]">
              <Wallet size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Credit <span className="text-[#00FF94] italic">Manager</span>
              </h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Token Management & Requests</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddTokensModalOpen(true)}
              disabled={pendingTokenRequest !== null}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-all border shadow-sm ${
                pendingTokenRequest !== null
                  ? "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 border-slate-200 dark:border-white/10 cursor-not-allowed"
                  : "bg-[#00FF94]/10 hover:bg-[#00FF94]/20 text-[#00FF94] border-[#00FF94]/20 hover:shadow-[0_0_15px_rgba(0,255,148,0.2)]"
              }`}
            >
              <Plus size={14} strokeWidth={3} /> Request Credits
            </button>
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="bg-amber-50 dark:bg-primary/10 hover:bg-amber-100 dark:hover:bg-primary/20 text-amber-700 dark:text-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-all border border-amber-200 dark:border-brand-gold/20 shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <History size={14} strokeWidth={3} /> Credit History
            </button>
          </div>
        </div>

        {pendingTokenRequest !== null && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 relative z-10 bg-[#FF8C00]/5 border border-[#FF8C00]/15 rounded-xl p-4">
            <p className="text-sm text-[#FF8C00] tracking-wide flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#FF8C00] animate-pulse shadow-[0_0_8px_#FF8C00] shrink-0" />
              <span>
                <span className="font-bold">{pendingTokenRequest.toLocaleString()}</span> tokens pending admin approval
              </span>
            </p>
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            >
              Cancel Request
            </button>
          </div>
        )}
      </section>

      {/* Predictive Intelligence Analytics (Charts) */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200 dark:border-white/10">
          <TrendingUp size={20} className="text-amber-600 dark:text-primary" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Performance Analytics
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 15 Day Line/Bar Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <h4 className="text-sm font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-6 relative z-10">Last 15 Days Trajectory</h4>
            <div className="h-[250px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last15DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                    contentStyle={{ backgroundColor: '#050A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#888', marginBottom: '4px' }}
                    itemStyle={{ color: '#d4af37', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="reports" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Premium vs Regular Pie Chart */}
          <div className="bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 to-transparent pointer-events-none" />
            <h4 className="text-sm font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-2 relative z-10">Report Distribution</h4>
            <div className="flex-1 min-h-[200px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={premiumVsRegularData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {premiumVsRegularData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#050A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 relative z-10">
              {premiumVsRegularData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                  <span className="text-xs font-semibold text-slate-300">{entry.name}</span>
                  <span className="text-xs font-bold text-white">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Profile Information */}
      <section className="mb-12 bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Personal <span className="text-primary italic">Intelligence</span>
              </h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Identity & Credentials</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditProfileModalOpen(true)}
            className="bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:border-primary/50 text-slate-900 dark:text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:bg-primary/5 flex items-center gap-2 shadow-sm"
          >
            <Settings size={14} className="text-primary" /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-white/30">Full Name</p>
            <p className="text-lg text-slate-900 dark:text-white font-bold tracking-tight">
              {agentData?.name || "Pending Account Activation"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-white/30">System Identifier</p>
            <p className="text-lg text-slate-900 dark:text-white font-mono font-bold">
              {agentData?.agent_uuid?.split("-")[0]?.toUpperCase() || "AGT-CORE-000"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-white/30">Auth Email</p>
            <p className="text-lg text-slate-900 dark:text-white font-bold">{agentData?.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-white/30">Primary Contact</p>
            <p className="text-lg text-slate-900 dark:text-white font-bold tracking-widest">
              {agentData?.phone || "No Mobile Linked"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-white/30">Branch Node</p>
            <p className="text-lg text-slate-900 dark:text-white font-bold">
              {branchData?.name || "Independent Terminal"}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Generations List */}
      <div className="space-y-12">
        {/* Today */}
        {todayReports.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200 dark:border-white/10">
              <Clock size={20} className="text-amber-600 dark:text-primary" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Today's Generated Reports
              </h3>
            </div>
            <div className="grid gap-4">
              {todayReports.map((report: any) => {
                const dob = report.user_details?.dob || "Unknown";
                const name = report.user_details?.name || "Unknown";
                const planName = (report.pricing_plans?.name || report.plan)?.replace(" Astrology Report", "") || "BASIC";

                return (
                  <div
                    key={report.id}
                    className="bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 hover:border-primary/40 dark:hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-white/[0.04] p-5 rounded-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-sm dark:shadow-lg"
                  >
                    {/* Left Column: User Info */}
                    <div className="flex items-center gap-4 min-w-[240px]">
                      <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5 shrink-0">
                        <User size={18} className="text-slate-400 dark:text-white/30 group-hover:text-amber-600 dark:group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                          {name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-white/40 mt-0.5 flex items-center gap-2">
                          DOB: <span className="text-slate-700 dark:text-white/60 font-medium">{dob}</span>
                          <span className="text-slate-300 dark:text-white/20">•</span> 
                          <span className="font-mono text-slate-400 dark:text-white/40">
                            ID: {report.id}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Middle Column: Time (Dedicated Visibility) */}
                    <div className="flex flex-col items-start sm:items-center justify-center px-4 border-l border-r border-slate-100 dark:border-white/5 h-10 md:flex">
                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-white/20 mb-0.5">Generated At</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-primary/90 flex items-center gap-2">
                           <Clock size={14} className="text-slate-400" />
                           {formatDeterministicTime(report.created_at)}
                        </p>
                    </div>

                    {/* Right Column: Plan & Actions */}
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right flex flex-col sm:items-end gap-1.5 min-w-[100px]">
                        <div className="flex gap-2">
                          <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border shadow-sm transition-all duration-300 ${
                             planName === "Premium"
                              ? "bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(126,86,218,0.1)]"
                              : planName === "Pro" || planName === "Standard"
                                ? "bg-[#00FF94]/20 text-[#00FF94] border-[#00FF94]/30 shadow-[0_0_10px_rgba(0,255,148,0.1)]"
                                : "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white border-slate-300 dark:border-white/20"
                          }`}>
                            {planName}
                          </span>
                          {report.paper_quality === "premium" && (
                            <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-amber-500/10 text-amber-500/70 border border-amber-500/20">
                              Premium Paper
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-white/20 font-mono sm:hidden flex items-center gap-1">
                          <Clock size={10} /> {formatDeterministicTime(report.created_at)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setActiveTab("view_report", report.report_id || report.id);
                          }}
                          className="group/btn p-3 bg-slate-100 dark:bg-white/5 hover:bg-primary/20 dark:hover:bg-primary/20 rounded-xl text-slate-500 dark:text-white/50 hover:text-primary dark:hover:text-primary transition-all duration-300 border border-slate-200 dark:border-white/10 hover:border-primary/40 flex items-center gap-2"
                          title="View Full Report"
                        >
                          <span className="text-xs font-bold uppercase tracking-widest hidden lg:block ml-1">View</span>
                          <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Previous */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200 dark:border-white/10">
            <CalendarDays size={20} className="text-amber-600 dark:text-primary" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-white/70">
              Previous Reports
            </h3>
          </div>
          <div className="grid gap-4">
            {recentReports
              ?.filter(
                (r: any) =>
                  new Date(r.created_at).toDateString() !==
                  new Date().toDateString(),
              )
              .map((report: any) => {
                const dob = report.user_details?.dob || "Unknown";
                const name = report.user_details?.name || "Unknown";
                const planName = (report.pricing_plans?.name || report.plan)?.replace(" Astrology Report", "") || "BASIC";
                
                return (
                  <div
                    key={report.id}
                    className="bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 hover:border-primary/40 dark:hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-white/[0.04] p-5 rounded-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-sm dark:shadow-lg"
                  >
                    {/* Left Column: User Info */}
                    <div className="flex items-center gap-4 min-w-[240px]">
                      <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5 shrink-0">
                        <User size={18} className="text-slate-400 dark:text-white/30" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                          {name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-white/40 mt-0.5 flex items-center gap-2">
                          DOB: <span className="text-slate-700 dark:text-white/60 font-medium">{dob}</span>
                          <span className="text-slate-300 dark:text-white/20">•</span> 
                          <span className="font-mono text-slate-400 dark:text-white/40">
                            ID: {report.id}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Middle Column: Date (Dedicated Visibility) */}
                    <div className="flex flex-col items-start sm:items-center justify-center px-4 border-l border-r border-slate-100 dark:border-white/5 h-10 md:flex">
                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-white/20 mb-0.5">Generated On</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-primary/90 flex items-center gap-2">
                           <Calendar size={14} className="text-slate-400" />
                           {formatDeterministicDate(report.created_at)}
                        </p>
                    </div>

                    {/* Right Column: Plan & Actions */}
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right flex flex-col sm:items-end gap-1.5 min-w-[100px]">
                        <div className="flex gap-2">
                          <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border shadow-sm transition-all duration-300 ${
                             planName === "Premium"
                              ? "bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(126,86,218,0.1)]"
                              : planName === "Pro" || planName === "Standard"
                                ? "bg-[#00FF94]/20 text-[#00FF94] border-[#00FF94]/30 shadow-[0_0_10px_rgba(0,255,148,0.1)]"
                                : "bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white border-slate-300 dark:border-white/20"
                          }`}>
                            {planName}
                          </span>
                          {report.paper_quality === "premium" && (
                            <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-amber-500/10 text-amber-500/70 border border-amber-500/20">
                              Premium Paper
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-white/20 font-mono sm:hidden flex items-center gap-1">
                          <Calendar size={10} /> {formatDeterministicDate(report.created_at)}
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setActiveTab("view_report", report.report_id || report.id);
                        }}
                        className="group/btn p-3 bg-slate-100 dark:bg-white/5 hover:bg-primary/20 dark:hover:bg-primary/20 rounded-xl text-slate-500 dark:text-white/50 hover:text-primary dark:hover:text-primary transition-all duration-300 border border-slate-200 dark:border-white/10 hover:border-primary/40 flex items-center gap-2"
                        title="View Full Report"
                      >
                        <span className="text-xs font-bold uppercase tracking-widest hidden lg:block ml-1">View</span>
                        <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="mt-6 text-center">
            <button 
              onClick={() => setActiveTab("history")}
              className="text-sm text-amber-600/80 dark:text-primary/70 hover:text-amber-700 dark:hover:text-primary border-b border-amber-600/30 dark:border-brand-gold/30 pb-0.5 transition-all">
              Load More History
            </button>
          </div>
        </section>
      </div>

      {/* Add Credits Modal */}
      {isAddTokensModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300 transition-colors">
          <div className="bg-white dark:bg-[#050A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl dark:shadow-[0_0_50px_rgba(0,255,148,0.15)] relative overflow-hidden flex flex-col items-center justify-center text-center transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 to-transparent pointer-events-none" />

            {!tokenRequestSuccess && (
              <button
                onClick={closeTokenModal}
                className="absolute top-4 right-4 text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}

            {tokenRequestSuccess ? (
              <div className="py-8 animate-in zoom-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#00FF94]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
                  <Check size={40} className="text-[#00FF94]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
                  Request Successful
                </h3>
                <p className="text-slate-500 dark:text-white/50 mb-8 max-w-[280px] transition-colors">
                  Your request for{" "}
                  <span className="text-[#00FF94] font-bold">
                    {selectedTokenAmount?.toLocaleString()}
                  </span>{" "}
                  tokens has been submitted to the admin for approval.
                </p>
                <button
                  onClick={closeTokenModal}
                  className="w-full py-3 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white font-medium transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="w-full relative z-10 flex flex-col">
                <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2 transition-colors">
                  Get More Tokens
                </h3>
                <p className="text-slate-500 dark:text-white/50 text-sm mb-8 transition-colors">
                  Select a token package to request from the central
                  administration hub.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[1000, 2000, 3000, 5000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setSelectedTokenAmount(amount)}
                      className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                        selectedTokenAmount === amount
                          ? "border-[#00FF94] bg-[#00FF94]/10 shadow-[0_0_15px_rgba(0,255,148,0.2)] scale-105"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] hover:border-[#00FF94]/40 dark:hover:border-[#00FF94]/40 hover:bg-green-50 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#00FF94] transition-colors">
                        {amount}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest mt-1 transition-colors">
                        Tokens
                      </div>
                      {selectedTokenAmount === amount && (
                        <div className="absolute top-2 right-2 flex w-2 h-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF94] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF94]"></span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleRequestTokens}
                  disabled={!selectedTokenAmount || isRequestingTokens}
                  className="w-full py-4 rounded-xl bg-[#00FF94] text-black font-bold uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,148,0.2)] hover:shadow-[0_0_30px_rgba(0,255,148,0.4)]"
                >
                  {isRequestingTokens ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Request{" "}
                      {selectedTokenAmount
                        ? selectedTokenAmount.toLocaleString()
                        : ""}{" "}
                      Tokens
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancel Request Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300 transition-colors">
          <div className="bg-white dark:bg-[#050A0A] border border-red-200 dark:border-red-500/20 rounded-2xl p-8 max-w-sm w-full shadow-2xl dark:shadow-[0_0_50px_rgba(239,68,68,0.15)] relative overflow-hidden flex flex-col items-center justify-center text-center transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />

            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <TriangleAlert size={32} className="text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
              Cancel Request?
            </h3>
            <p className="text-slate-500 dark:text-white/50 mb-8 text-sm transition-colors">
              Are you sure you want to cancel your pending request for{" "}
              <span className="text-red-400 font-bold">
                {pendingTokenRequest?.toLocaleString()}
              </span>{" "}
              tokens? This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row w-full gap-4 relative z-10">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white font-medium transition-colors"
              >
                Keep Pending
              </button>
              <button
                onClick={handleCancelRequest}
                className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300 transition-colors">
          <div className="bg-white dark:bg-[#050A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl dark:shadow-[0_0_50px_rgba(212,175,55,0.1)] relative overflow-hidden flex flex-col max-h-[90vh] transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            <button
              onClick={() => setIsHistoryModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 mb-6 flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-6 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <History size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white leading-tight transition-colors">
                  Credit Ledger
                </h3>
                <p className="text-slate-500 dark:text-white/50 text-xs uppercase tracking-widest font-mono mt-0.5 transition-colors">
                  Transaction History
                </p>
              </div>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {[
                ...(recentReports || []).map((r: any) => ({
                  ...r,
                  txType: "deduction",
                  date: new Date(r.created_at),
                })),
                ...(tokenRequests || []).map((t: any) => ({
                  ...t,
                  txType: "addition",
                  date: new Date(t.created_at),
                })),
              ]
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((tx: any) => {
                  if (tx.txType === "deduction") {
                    const txName = tx.user_details?.name || "Unknown";
                    return (
                      <div
                        key={`deduct-${tx.id}`}
                        className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 p-4 rounded-xl flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-red-500/10 border-red-500/20 text-red-400">
                            <span className="font-bold text-lg">-</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-white/90 transition-colors">
                              {tx.pricing_plans?.name || tx.plan} Report
                              Generated ({txName})
                            </p>
                            <p className="text-[#FF8C00]/70 text-[10px] font-mono mt-1 flex items-center gap-2">
                              <span>
                                {formatDeterministicDate(tx.date)} •{" "}
                                {formatDeterministicTime(tx.date)}
                              </span>
                              <span className="text-slate-300 dark:text-white/20 mx-1">|</span>
                              <span className="text-slate-400 dark:text-white/40">
                                ID: {tx.transaction_id || tx.id}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="text-xl font-bold font-mono text-red-400">
                          -{tx.paid_amount || 0}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={`add-${tx.id}`}
                        className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 p-4 rounded-xl flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${tx.status === "approved" ? "bg-[#00FF94]/10 border-[#00FF94]/20 text-[#00FF94]" : tx.status === "rejected" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-[#FF8C00]/10 border-[#FF8C00]/20 text-[#FF8C00]"}`}
                          >
                            <span className="font-bold text-lg">+</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-white/90 transition-colors">
                              Token Request
                              <span
                                className={`ml-2 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${tx.status === "approved" ? "bg-[#00FF94]/10 text-[#00FF94]" : tx.status === "rejected" ? "bg-red-500/10 text-red-400" : "bg-[#FF8C00]/10 text-[#FF8C00]"}`}
                              >
                                {tx.status}
                              </span>
                            </p>
                            <p className="text-slate-500 dark:text-white/50 text-[10px] font-mono mt-1 flex items-center gap-2 transition-colors">
                              <span>
                                {formatDeterministicDate(tx.date)} •{" "}
                                {formatDeterministicTime(tx.date)}
                              </span>
                              <span className="text-slate-300 dark:text-white/20 mx-1">|</span>
                              <span className="text-slate-400 dark:text-white/40">
                                ID: TX-{tx.id}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div
                          className={`text-xl font-bold font-mono ${tx.status === "approved" ? "text-[#00FF94]" : "text-slate-400 dark:text-zinc-500 transition-colors"}`}
                        >
                          +{tx.amount || 0}
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
