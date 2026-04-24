"use client";

import Image from "next/image";
import { Instagram, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const socialImages = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
  "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800&q=80",
  "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80",
  "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&q=80",
];

export default function SocialMediaGallery() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden bg-[#060A0E]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080C10] via-[#060A0E] to-[#080C10]" />

      {/* Subtle radial accent */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-[#A78BFA]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Top/bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => ({
          x: (i * 41 + 7) % 100,
          y: (i * 59 + 13) % 100,
          size: 1 + ((i * 13) % 2.5),
          dur: 18 + ((i * 29) % 15),
          delay: (i * 17) % 8,
          color:
            i % 4 === 0
              ? "rgba(167,139,250,0.3)"
              : i % 3 === 0
                ? "rgba(212,175,55,0.3)"
                : "rgba(255,255,255,0.15)",
        })).map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: p.color,
              animation: `floatParticle ${p.dur}s ease-in-out infinite, twinkle ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 mb-14 text-center space-y-5"
        >
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <Instagram className="w-3.5 h-3.5 text-[#A78BFA]/70" />
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">
                @urekhaofficial
              </span>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Follow Our Journey
          </h2>

          <p className="text-sm md:text-base text-white/40 max-w-lg mx-auto leading-relaxed font-light">
            Connect with us on social media for daily cosmic insights and
            astrology wisdom.
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#A78BFA]/30" />
            <div className="w-2 h-2 rounded-full bg-[#A78BFA]/40" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#A78BFA]/30" />
          </div>
        </motion.div>

        {/* Gallery */}
        <div className="relative w-full">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#060A0E] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#060A0E] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-5 overflow-x-auto pb-6 px-6 w-full snap-x snap-mandatory scrollbar-hide">
            {socialImages.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative w-[260px] h-[340px] md:w-[300px] md:h-[380px] shrink-0 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 ease-out border border-white/[0.08] hover:border-[#D4AF37]/30 group/item snap-center shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                <Image
                  src={src}
                  alt={`Social media post ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                  sizes="(max-width: 768px) 260px, 300px"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                    <Instagram className="w-4 h-4 text-white" />
                    <span className="text-xs text-white/80 font-mono">
                      View Post
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
