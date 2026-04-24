"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ─── Glowing Particles ─── */
const GlowingParticles = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate true random particles on the client side to avoid hydration mismatches
    // and guarantee they are spread across the entire section.
    const generated = Array.from({ length: 40 }, () => {
      const size = 1.5 + Math.random() * 2.5; // Random size between 1.5 and 4
      const colorRand = Math.random();
      const glowColor =
        colorRand > 0.66
          ? "rgba(255, 140, 0, 1)" // Electric Amber
          : colorRand > 0.33
            ? "rgba(0, 255, 148, 1)" // Neon Teal
            : "rgba(255, 255, 255, 0.9)"; // Bright White

      return {
        x: Math.random() * 100, // True random up to 100% width
        y: Math.random() * 100, // True random up to 100% height
        size,
        duration: 15 + Math.random() * 25, // 15s to 40s duration
        glowColor,
        // Move randomly across a broad area, ranging from -300px to +300px
        moveX: (Math.random() - 0.5) * 600,
        moveY: (Math.random() - 0.5) * 600,
      };
    });
    setParticles(generated);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            // High contrast glow: Extremely tight inner shadow + intense outer drop shadow
            // Eliminates "blur" feeling and looks luminous.
            boxShadow: `0 0 ${p.size * 2}px ${p.size * 0.5}px ${p.glowColor}, 0 0 ${p.size * 6}px ${p.size * 1.5}px ${p.glowColor}`,
          }}
          animate={{
            x: [0, p.moveX, p.moveX * 0.5, -p.moveX * 0.5, 0],
            y: [0, p.moveY, -p.moveY * 0.5, p.moveY * 0.5, 0],
            opacity: [0.6, 1, 0.4, 1, 0.6],
            scale: [1, 1.4, 0.8, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function Newsletter() {
  return (
    <section className="py-24 md:py-32 bg-[radial-gradient(circle_at_center,_#12121A_0%,_#050508_100%)] text-white relative overflow-hidden">
      {/* Illuminating Cosmic Particles */}
      <GlowingParticles />

      {/* SVG Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="dots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Background Accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent" />

      {/* Cosmic Glows */}
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/[0.07] rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif mb-4 text-brand-gold drop-shadow-[0_0_15px_rgba(191,144,4,0.3)]">
              Join the Inner Circle
            </h2>
            <p className="text-white/60 text-lg leading-relaxed font-light">
              Receive exclusive astrological insights, system updates, and early
              access to our premium reports. No noise, just wisdom.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white/[0.05] transition-all font-sans"
            />
            <button
              type="submit"
              className="bg-brand-gold text-black font-bold px-8 py-3 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-gold flex items-center justify-center gap-2 group"
            >
              Subscribe
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[10px] text-white/30 tracking-[0.3em] uppercase font-sans"
          >
            We respect your privacy. Unsubscribe anytime.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
