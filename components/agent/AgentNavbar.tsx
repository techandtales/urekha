"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Clock, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/admin/ThemeToggle"; // Reusing the ThemeToggle

interface AgentNavbarProps {
  agentData: any;
}

export function AgentNavbar({ agentData }: AgentNavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [lastLogin, setLastLogin] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);
    // You can set custom last login using agentData or omit if not available in agentData directly
    // Using current time as fallback or a property from agentData if you have one.
    if (agentData?.created_at) {
      const date = new Date(agentData.created_at);
      setLastLogin(date.toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }));
    } else {
      setLastLogin(new Date().toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }));
    }
  }, [agentData]);

  if (!mounted) return <div className="h-20 w-full mb-6" />;

  const agentName = agentData?.name || agentData?.email?.split('@')[0] || "Agent";

  return (
    <nav className="fixed top-0 left-0 right-0 z-[50] w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#050A0A]/80 backdrop-blur-xl px-6 py-4 transition-colors duration-500">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* Left: Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Image
              src="/logo.svg"
              alt="Urekha Logo"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-none">
              UREKHA
            </span>
            <span className="text-[10px] font-medium text-primary tracking-[0.2em] uppercase">
              Agent Portal
            </span>
          </div>
        </Link>

        {/* Right: Agent Info & Actions */}
        <div className="flex items-center gap-6">
          {/* Agent Info */}
          <div className="hidden md:flex flex-col items-end border-r border-slate-200 dark:border-white/10 pr-6">
            <span className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              {agentName}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
              <Clock size={12} className="text-primary" />
              <span>Session Active: {lastLogin}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-all group">
              <Bell size={20} className="group-active:scale-95 duration-200" />
            </button>
            <ThemeToggle />
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 p-[1px] cursor-help">
                <div className="w-full h-full rounded-[11px] bg-white dark:bg-[#050A0A] flex items-center justify-center overflow-hidden">
                  <User size={20} className="text-slate-600 dark:text-zinc-400" />
                </div>
              </div>

              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute top-full mt-3 right-0 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold shadow-xl border border-white/10 whitespace-nowrap z-[60]"
                  >
                    {agentName}
                    {/* Tooltip Arrow */}
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Gradient Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </nav>
  );
}
