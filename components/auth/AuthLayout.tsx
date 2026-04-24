"use client";

import Image from "next/image";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Scroll, Sparkles, Stars } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  backgroundImage?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const pathname = usePathname();
  const isAgent = pathname?.includes("/agent");
  const isForgotPassword = pathname?.includes("forgot-password");
  const isOtp = pathname?.includes("verify-otp");

  const shouldHideSwitcher = isForgotPassword || isOtp;

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-[#050A0A] overflow-hidden relative">
      {/* The Architect's Void Background */}
      <div className="fixed inset-0 z-0 bg-[#050A0A]">
        {/* High-Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,148,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,148,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Animated Gradient Orbs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00FF94]/10 blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#FF8C00]/10 blur-[150px] animate-pulse"
          style={{ animationDuration: "10s" }}
        />

        {/* Golden Wheel Hand Image (Slow rotation, left side) */}
        <div className="absolute left-[10%] top-1/2 -translate-y-1/2 opacity-[0.15] pointer-events-none hidden lg:block mix-blend-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <Image
              src="/golden-wheel-hand.png"
              alt="Cosmic Wheel"
              width={900}
              height={900}
              priority
              className="object-contain drop-shadow-[0_0_60px_rgba(255,140,0,0.4)]"
            />
          </motion.div>
        </div>

        {/* Global Gradient Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A0A] via-[#050A0A]/40 to-transparent" />
      </div>

      {/* Left Side - Content (Desktop Only) */}
      <div className="relative hidden lg:flex h-full w-full flex-col overflow-hidden">
        {/* Local Gradient for readability on Left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0" />

        {/* Top: Logo (Absolute Positioning) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-12 left-12 xl:top-20 xl:left-20 z-20"
        >
          <Link href="/" className="inline-block">
            <span className="text-xl font-serif font-bold tracking-[0.2em] text-white/90 hover:text-white transition-colors">
              UREKHA
            </span>
          </Link>
        </motion.div>

        {/* Main Content: Headline + Features Grouped & Centered */}
        <div className="relative z-10 flex h-full flex-col justify-center px-12 xl:px-20">
          <div className="space-y-16">
            {/* Headline */}
            <div className="max-w-2xl text-left pl-2">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl xl:text-7xl font-serif font-bold leading-[1.05] text-white tracking-tighter"
              >
                Unlock Your <br />
                <span className="text-brand-gold drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                  Cosmic Destiny
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8 text-xl text-white/70 font-light leading-relaxed max-w-lg border-l-2 border-brand-gold/30 pl-6"
              >
                Where ancient Vedic wisdom meets advanced computational
                precision.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-3xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  {
                    Icon: Scroll,
                    title: "Premium Reports",
                    desc: "Hand-crafted & bound.",
                  },
                  {
                    Icon: Stars,
                    title: "Deep Analysis",
                    desc: "Cosmic intelligence.",
                  },
                  {
                    Icon: Sparkles,
                    title: "Daily Guidance",
                    desc: "Personalized path.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 py-2"
                  >
                    <div className="p-2 rounded-lg bg-white/5 text-brand-gold/80 border border-white/5 group-hover:text-brand-gold group-hover:border-brand-gold/30 transition-all duration-300">
                      <item.Icon size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-serif font-medium text-white group-hover:text-brand-gold transition-colors">
                        {item.title}
                      </span>
                      <span className="text-xs text-white/40">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Container with Glass Effect */}
      <div className="relative flex h-full w-full flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Glass Card Wrapper */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            {/* Mobile Logo */}
            <div className="flex justify-center lg:hidden mb-8">
              <Link href="/">
                <span className="text-2xl font-serif font-bold tracking-[0.2em] text-white">
                  UREKHA
                </span>
              </Link>
            </div>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-serif font-bold text-white tracking-wide">
                {title}
              </h2>
              <p className="text-sm text-zinc-400">{description}</p>
            </div>

            {/* Mobile Role Switcher */}
            {!shouldHideSwitcher && (
              <div className="lg:hidden mb-6 w-full">
                {isAgent ? (
                  <Link
                    href="/auth/user/login"
                    className="flex items-center justify-center w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all"
                  >
                    Not an Agent? Login as User
                  </Link>
                ) : (
                  <Link
                    href="/auth/agent/login"
                    className="flex items-center justify-center w-full px-4 py-2 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium hover:bg-brand-gold/20 transition-all"
                  >
                    Are you an Agent? Login here
                  </Link>
                )}
              </div>
            )}

            {/* Form Content */}
            {children}

            <div className="mt-8 pt-8 border-t border-white/10 text-center text-xs text-white/40">
              <p>
                &copy; {new Date().getFullYear()} Urekha. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
