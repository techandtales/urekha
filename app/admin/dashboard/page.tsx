import { getAdminDashboardInsights } from "@/app/actions/token-actions";
import {
  Users,
  UserSquare2,
  Coins,
  ReceiptIndianRupee,
  TrendingUp,
  Globe,
  PieChart as PieIcon,
  LayoutDashboard,
  Calendar,
  Zap,
} from "lucide-react";
import {
  RevenueActivityChart,
  LocationBarChart,
  PricingComparisonChart,
} from "@/components/admin/dashboard/InsightCharts";
import { AgentLeaderboard } from "@/components/admin/dashboard/AgentLeaderboard";
import { SystemHealthBars } from "@/components/admin/dashboard/SystemHealthBars";

export default async function AdminDashboard() {
  const { data, success } = await getAdminDashboardInsights();

  if (!success || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
            <Zap size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tight">
              System Interrupted
            </h3>
            <p className="text-sm opacity-80 mt-1 font-medium">
              Unable to extract architectural insights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, trends, topLocations, pricingComparison, topAgents } = data;

  const statCards = [
    {
      title: "Network Agents",
      value: stats.totalAgents,
      icon: Users,
      accent: "primary",
      trend: "+5%",
    },
    {
      title: "Direct Users",
      value: stats.totalUsers,
      icon: UserSquare2,
      accent: "accent",
      trend: "+12%",
    },
    {
      title: "System Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: ReceiptIndianRupee,
      accent: "primary",
      trend: "Steady",
    },
    {
      title: "Pending Liquidity",
      value: stats.pendingTokens.toLocaleString(),
      icon: Coins,
      accent: "accent",
      trend: "-2%",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-[0.2em] uppercase mb-1">
            <LayoutDashboard size={14} /> Neural Dashboard
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-serif uppercase leading-none">
            Architect <span className="text-primary italic">Pulse</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium tracking-wide">
            Real-time synchronization of users, agents, and report ecosystems.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/70 dark:bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/20 shadow-xl">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Last Synced
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="w-[2px] h-8 bg-slate-200 dark:bg-white/10 hidden sm:block" />
          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-primary/20 animate-pulse">
            <Zap size={14} fill="currentColor" /> LIVE FEED
          </div>
        </div>
      </div>

      {/* High-Impact Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="group relative bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-6 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 shadow-xl"
          >
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <stat.icon size={22} strokeWidth={2} />
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                    stat.trend.startsWith("+")
                      ? "bg-emerald-500/10 text-emerald-500"
                      : stat.trend.startsWith("-")
                        ? "bg-red-500/10 text-red-500"
                        : "bg-slate-500/10 text-slate-500"
                  }`}
                >
                  {stat.trend}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-black text-slate-900 dark:text-white font-source-code tracking-tighter">
                  {stat.value}
                </p>
              </div>
            </div>

            {/* Dynamic Interactive Background */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700 group-hover:scale-150" />
          </div>
        ))}
      </div>

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 rounded-[2.5rem] bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-8 shadow-xl relative overflow-hidden flex flex-col group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" /> Growth Pulse
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">
                Revenue vs Generation Volume (30 Days)
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-1 rounded-xl">
              <button className="px-3 py-1.5 rounded-lg text-[9px] font-black bg-white dark:bg-white/10 shadow-sm">
                REVENUE
              </button>
              <button className="px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-400 hover:text-primary transition-colors">
                VOLUME
              </button>
            </div>
          </div>
          <div className="flex-1 mt-4">
            <RevenueActivityChart data={trends} />
          </div>
        </div>

        {/* Top Agents Leaderboard */}
        <div className="rounded-[2.5rem] bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-8 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Elite Agents
            </h3>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AgentLeaderboard agents={topAgents} />
          </div>
        </div>
      </div>

      {/* Secondary Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Geographic Trends */}
        <div className="rounded-[2.5rem] bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-8 shadow-xl group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-md font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Globe size={18} className="text-primary" /> Location Trends
            </h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg italic">
              HOTSPOTS
            </span>
          </div>
          <LocationBarChart data={topLocations} />
        </div>

        {/* Pricing Plan Popularity */}
        <div className="rounded-[2.5rem] bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-8 shadow-xl group text-center">
          <div className="flex items-center justify-between mb-6 text-left">
            <h3 className="text-md font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <PieIcon size={18} className="text-primary" /> Pricing Pulse
            </h3>
          </div>
          <div className="relative">
            <PricingComparisonChart data={pricingComparison} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Trending
              </span>
              <span className="text-sm font-black text-primary">STANDARD</span>
            </div>
          </div>
        </div>

        {/* Rapid Overview */}
        <div className="rounded-[2.5rem] bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-8 shadow-xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <h3 className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-tight mb-2">
              Systems Healthy
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-xs font-medium leading-relaxed">
              Predictive intelligence services are operational. Token liquidity
              is within optimal architectural boundaries.
            </p>
          </div>

          <SystemHealthBars />
        </div>
      </div>
    </div>
  );
}
