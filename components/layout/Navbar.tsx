"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  User,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Sparkles,
  BookOpen,
  Globe,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import NotificationButton from "./NotificationButton";

interface NavbarProps {
  initialRole?: string;
  initialIsAuthenticated?: boolean;
}

export default function Navbar({
  initialRole,
  initialIsAuthenticated,
}: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [glitchPhase, setGlitchPhase] = useState<
    "idle" | "glitching" | "revealed"
  >("idle");
  const glitchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const handleTextEnter = useCallback(() => {
    setIsTextHovered(true);
    setGlitchPhase("glitching");
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    glitchTimerRef.current = setTimeout(() => {
      setGlitchPhase("revealed");
    }, 600);
  }, []);

  const handleTextLeave = useCallback(() => {
    setIsTextHovered(false);
    setGlitchPhase("glitching");
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    glitchTimerRef.current = setTimeout(() => {
      setGlitchPhase("idle");
    }, 400);
  }, []);

  const isExcludedPage =
    pathname?.includes("/forgot-password") ||
    pathname?.includes("/verify-otp") ||
    pathname?.includes("/phone") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/agent") ||
    pathname?.startsWith("/pipeline") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/kundli");

  if (isExcludedPage) return null;

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <>
      <header className="fixed z-[999] top-0 left-0 w-full pt-6 pb-4">
        <div className="container mx-auto px-4 md:px-12 flex items-center justify-between pointer-events-none">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2 group pointer-events-auto"
          >
            <motion.div
              onHoverStart={() => setIsLogoHovered(true)}
              onHoverEnd={() => setIsLogoHovered(false)}
              animate={
                isLogoHovered ? { scale: 1.15, y: -3 } : { scale: 1, y: 0 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative"
            >
              <Image
                src="/logo.svg"
                alt="Urekha Logo"
                width={140}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
              <AnimatePresence>
                {isLogoHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#111] dark:bg-white text-white dark:text-[#111] text-[10px] font-medium px-2.5 py-1 rounded-md shadow-lg"
                  >
                    <span>Urekha AI</span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111] dark:bg-white rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <span
              onMouseEnter={handleTextEnter}
              onMouseLeave={handleTextLeave}
              className="relative text-xl font-bold tracking-tight text-[#111111] dark:text-white uppercase mt-0.5 cursor-pointer select-none"
            >
              <span
                className={cn(
                  "inline-block transition-opacity duration-150",
                  glitchPhase === "glitching" && "navbar-glitch-text",
                  glitchPhase === "revealed" && "opacity-0 absolute",
                )}
                data-text="UREKHA"
              >
                {glitchPhase === "revealed" ? "" : "UREKHA"}
              </span>
              <span
                className={cn(
                  "inline-block transition-opacity duration-150",
                  glitchPhase === "revealed"
                    ? "opacity-100"
                    : "opacity-0 absolute",
                  glitchPhase === "glitching" && "navbar-glitch-text",
                )}
                data-text="Ai Astrology"
                style={{ fontSize: "0.85em", letterSpacing: "0.05em" }}
              >
                {glitchPhase === "revealed" ? "Ai Astrology" : ""}
              </span>
            </span>
          </Link>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-[13px] text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-8 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/40 dark:border-zinc-700/40 pointer-events-auto font-sans tracking-wide">
            <Link
              href="/about"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/readings"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Readings
            </Link>
            <Link
              href="/user/kundli"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Your Kundli
            </Link>
            <Link
              href="/rates"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Rates & Fees
            </Link>
            <Link
              href="/contact"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3 bg-white dark:bg-zinc-900 pl-4 pr-2 py-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/40 dark:border-zinc-700/40 text-gray-500 dark:text-zinc-400 pointer-events-auto">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors text-[13px] font-medium px-1"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4 stroke-[1.5]" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4 stroke-[1.5]" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {isDark ? "Light" : "Dark"}
              </button>
            )}

            <div className="w-[1px] h-4 bg-gray-200 dark:bg-zinc-700 mx-1" />

            {/* Notification System */}
            <NotificationButton />

            {/* Profile */}
            <Link
              href="/profile"
              className="w-9 h-9 rounded-full bg-[#f4f4f5] dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors ml-1"
            >
              <User className="w-[18px] h-[18px] stroke-[1.5]" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="lg:hidden pointer-events-auto bg-white dark:bg-zinc-900 p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-gray-800 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Premium Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[998] lg:hidden bg-white dark:bg-[#0a0a0a] will-change-[opacity]"
          >
            {/* Subtle dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col px-7 pt-7 pb-8">
              {/* Top Bar — Logo + Close */}
              <div className="flex items-center justify-between mb-10">
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.3 }}
                  className="will-change-transform"
                >
                  <Image
                    src="/logo.svg"
                    alt="Urekha"
                    width={100}
                    height={30}
                    className="h-6 w-auto opacity-30 dark:opacity-40"
                  />
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.25 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-11 h-11 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-white/60 hover:text-gray-800 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/30 transition-colors will-change-transform"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Navigation — Large Bold Links */}
              <nav className="flex-1 flex flex-col justify-center -mt-8">
                {[
                  { href: "/about", label: "About" },
                  { href: "/readings", label: "Readings" },
                  { href: "/user/kundli", label: "Your Kundli" },
                  { href: "/rates", label: "Rates & Fees" },
                  { href: "/contact", label: "Contact" },
                ].map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.05,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="will-change-transform"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center py-[14px] border-b border-gray-100 dark:border-white/[0.06]"
                    >
                      {/* Label */}
                      <span className="text-[28px] font-semibold text-gray-800 dark:text-white/90 tracking-tight group-hover:text-gray-950 dark:group-hover:text-white transition-colors duration-200">
                        {item.label}
                      </span>

                      {/* Arrow */}
                      <ArrowRight className="w-5 h-5 ml-auto text-transparent group-hover:text-amber-500 dark:group-hover:text-amber-400 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom Dock */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.55,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-3"
              >
                {/* Theme Toggle Pill */}
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm dark:shadow-none">
                      {isDark ? (
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      )}
                    </div>
                    <span className="text-[12px] font-medium text-gray-500 dark:text-white/60">
                      {isDark ? "Light" : "Dark"}
                    </span>
                  </button>
                )}

                {/* Notifications */}
                <NotificationButton />

                {/* Profile CTA */}
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-[#0f0f0f] hover:bg-gray-800 dark:hover:bg-white/90 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-[12px] font-semibold">Profile</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
