"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Coins, 
  BellDot, 
  LogOut,
  Bot,
  FileText,
  Mail,
  Clock
} from "lucide-react";
import { SignOutButton } from "./SignOutButton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AdminSidebar({ 
  user, 
  pendingTokenCount = 0 
}: { 
  user?: any;
  pendingTokenCount?: number;
}) {
  const pathname = usePathname();
  
  const lastLogin = user?.last_sign_in_at 
    ? new Date(user.last_sign_in_at).toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }) 
    : "";

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Sample Reports", href: "/admin/sample-reports", icon: FileText },
    { name: "All Agents", href: "/admin/agents", icon: Users },
    { name: "Users Data", href: "/admin/users", icon: UserSquare2 },
    { name: "Token Management", href: "/admin/tokens/manage", icon: Coins },
    { name: "Token Requests", href: "/admin/tokens/requests", icon: BellDot },
    { name: "Contact Messages", href: "/admin/messages", icon: Mail },
    { name: "AI Settings", href: "/admin/ai-settings", icon: Bot },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/80 dark:bg-[#050A0A]/50 border-r border-slate-200 dark:border-white/10 pt-24 pb-8 px-4 hidden md:flex flex-col gap-8 z-[40] backdrop-blur-xl transition-colors duration-500">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <nav className="flex flex-col gap-1.5">
            <span className="px-4 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">Main Menu</span>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group border ${
                    isActive 
                      ? "border-primary text-primary dark:text-primary bg-primary/5 shadow-[0_0_15px_rgba(124,58,237,0.1)]" 
                      : "border-transparent text-slate-600 dark:text-zinc-400 hover:text-primary dark:hover:text-white hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-primary" : "text-slate-400 dark:text-zinc-500 group-hover:text-primary transition-colors"} />
                  <span className={cn(
                    "text-sm font-medium tracking-wide transition-colors",
                    isActive ? "text-primary font-bold" : ""
                  )}>{item.name}</span>

                  {item.name === "Token Requests" && pendingTokenCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto flex items-center justify-center bg-primary text-white text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-white/20"
                    >
                      {pendingTokenCount}
                    </motion.div>
                  )}

                  {isActive && !(item.name === "Token Requests" && pendingTokenCount > 0) && (
                    <motion.div 
                      layoutId="active-pill"
                      className="ml-auto w-1 h-4 rounded-full bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Last Login in Sidebar Row */}
          {lastLogin && (
            <div className="mt-6 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  <Clock size={12} className="text-primary" />
                  <span>Last Login</span>
                </div>
                <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-300">
                  {lastLogin}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/5">
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border border-slate-200 dark:border-white/10 flex items-center justify-around p-3 z-50 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all relative border",
                isActive 
                  ? "text-primary border-primary bg-primary/5 font-bold scale-105" 
                  : "text-slate-500 dark:text-zinc-500 border-transparent"
              )}
            >
              <item.icon size={20} className={isActive ? "stroke-[2.5px]" : ""} />
              <span className="text-[9px] font-bold uppercase tracking-tight truncate max-w-[45px]">
                {item.name.split(' ')[0]}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="mobile-active-glow"
                  className="absolute -inset-1 rounded-2xl bg-primary/20 blur-sm -z-10"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* spacer for mobile layout to prevent content overlapping */}
      <div className="md:hidden h-24 w-full" />
    </>
  );
}
