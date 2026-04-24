"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 group overflow-hidden"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ y: 20, rotate: 45, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -20, rotate: -45, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: 20, rotate: 45, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -20, rotate: -45, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Moon className="w-5 h-5 text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
