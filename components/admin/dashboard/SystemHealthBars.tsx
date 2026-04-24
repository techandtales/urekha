"use client";

import { motion } from "framer-motion";

export const SystemHealthBars = () => {
  return (
    <div className="space-y-5 relative z-10 pt-8 w-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
          <span className="text-[10px] uppercase tracking-widest opacity-60">Uptime</span>
          <span className="text-xs tracking-tighter">99.99%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "99.99%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
          <span className="text-[10px] uppercase tracking-widest opacity-60">Network Latency</span>
          <span className="text-xs tracking-tighter">24ms</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "15%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]" 
          />
        </div>
      </div>
    </div>
  );
};
