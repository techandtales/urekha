"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ButtonState = "idle" | "downloading" | "done";

export default function AnimatedDownloadButton({ 
  className,
}: { 
  className?: string;
}) {
  const [state, setState] = useState<ButtonState>("idle");
  const [progress, setProgress] = useState(0);

  const handleDownload = useCallback(async () => {
    if (state !== "idle") return;

    setState("downloading");
    setProgress(0);

    // 1. Simulate progress for UX
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2;
      if (currentProgress >= 90) {
        clearInterval(interval);
        setProgress(90);
      } else {
        setProgress(Math.floor(currentProgress));
      }
    }, 150);

    try {
      // 2. Real API Call
      const res = await fetch("/api/download/demo");

      if (res.status === 429) {
        clearInterval(interval);
        const data = await res.json();
        toast.error("System Cooling Enabled", {
            description: data.message || "You have reached the hourly download limit.",
            duration: 5000,
            icon: <Loader2 className="w-4 h-4 text-red-500" />
        });
        setState("idle");
        setProgress(0);
        return;
      }

      if (!res.ok) throw new Error("Manifest download failed.");

      // 3. Finalize Progress & Trigger Download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "urekha-sample-report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setState("done");
        setTimeout(() => {
          setState("idle");
          setProgress(0);
        }, 2000);
      }, 400);

    } catch (error) {
      clearInterval(interval);
      toast.error("Transmission Error", {
        description: "The cosmic pipeline is temporarily unstable. Please try again."
      });
      setState("idle");
      setProgress(0);
    }
  }, [state]);

  return (
    <button
      onClick={handleDownload}
      disabled={state !== "idle"}
      className={cn(
        "relative h-14 min-w-[240px] px-8 rounded-full font-semibold text-[15px] transition-all duration-500 overflow-hidden flex items-center justify-center gap-3 shadow-md",
        state === "idle" && "bg-[#00A859] hover:bg-[#008f4c] text-white hover:scale-[1.02] active:scale-[0.98]",
        state === "downloading" && "bg-slate-100 dark:bg-zinc-800 text-slate-400 cursor-default",
        state === "done" && "bg-[#8bc34a] text-white cursor-default",
        className
      )}
    >
      {/* Background Progress Bar (only while downloading) */}
      {state === "downloading" && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="absolute inset-0 bg-[#00A859]/10 z-0 h-full"
        />
      )}

      {/* Ripple/Flash effect on done */}
      <AnimatePresence>
        {state === "done" && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            className="absolute inset-0 bg-white rounded-full z-0"
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-center justify-center gap-3">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle-icon"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="flex items-center gap-3"
            >
              <Download className="w-5 h-5" strokeWidth={2.5} />
              <span>Download Demo Product</span>
            </motion.div>
          )}

          {state === "downloading" && (
            <motion.div
              key="download-icon"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="flex items-center gap-3"
            >
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
              <span className="font-mono">{progress}%</span>
            </motion.div>
          )}

          {state === "done" && (
            <motion.div
              key="done-icon"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center gap-3"
            >
              <Check className="w-5 h-5" strokeWidth={3} />
              <span>Success</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
