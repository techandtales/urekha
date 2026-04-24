"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, MouseEvent, useRef } from "react";
import { cn } from "@/lib/utils";

interface CrystalCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  variant?: "teal" | "amber" | "neutral";
}

export default function CrystalCard({
  children,
  className,
  glowColor,
  variant = "teal",
}: CrystalCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const defaultGlow = variant === "amber"
    ? "rgba(255, 140, 0, 0.25)"
    : variant === "neutral"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 255, 148, 0.25)";

  const glow = glowColor || defaultGlow;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);

    ref.current.style.setProperty("--mx", `${mouseX}px`);
    ref.current.style.setProperty("--my", `${mouseY}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-3xl overflow-hidden transition-shadow duration-500 group cursor-default",
        // LIGHT MODE: Frosted white glass
        "bg-white/60 backdrop-blur-2xl",
        "border border-white/60",
        "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]",
        // DARK MODE: Deep obsidian glass
        "dark:bg-[rgba(15,15,20,0.6)] dark:backdrop-blur-2xl",
        "dark:border-white/[0.08]",
        "dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]",
        // Hover
        "hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]",
        "dark:hover:shadow-[0_20px_60px_-12px_rgba(0,255,148,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]",
        className
      )}
    >
      {/* Top Highlight — simulates crystal edge catching light */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 dark:via-white/20 to-transparent pointer-events-none" />

      {/* Left Edge Highlight */}
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/50 dark:from-white/10 via-transparent to-transparent pointer-events-none" />

      {/* Mouse-Following Glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 60%)`,
        }}
      />

      {/* Prismatic Rainbow Edge (visible on hover) */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "conic-gradient(from 180deg at 50% 50%, rgba(0,255,148,0.3), rgba(255,140,0,0.3), rgba(120,119,198,0.3), rgba(0,255,148,0.3))",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Inner Noise Texture for depth */}
      <div
        className="absolute inset-0 rounded-3xl opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
