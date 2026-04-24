"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Activity, 
  Download,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- MOCK DATA (Derived from PDF Templates) ---
const lagnaData = {
  ascendant: "Scorpio (Vrishchika)",
  symbol: "The Scorpion",
  zodiac_characteristics: "Fixed, Watery, Secretive",
  flagship_qualities: "Intense, passionate, fiercely loyal, deeply intuitive, and capable of profound transformation.",
  good_qualities: ["Determined", "Brave", "Loyal", "Intuitive"],
  ascendant_lord: "Mars (Mangal)",
  strength: "Strong",
  house: "10th",
  location: "Leo (Simha)",
  gem: "Red Coral",
  fasting: "Tuesday",
  mantra: "Om Angarakaya Vidmahe, Shakti Hastaya Dhimahi, Tanno Bhaumah Prachodayat.",
};

const planetaryData = [
  { name: "Ascendant", sign: "Sco", house: "1", nak: "Jyeshtha", pada: 1, deg: 15.50, lord: "Mars", status: "Active" },
  { name: "Sun", sign: "Leo", house: "10", nak: "Magha", pada: 2, deg: 5.20, lord: "Sun", status: "Active" },
  { name: "Moon", sign: "Ari", house: "6", nak: "Ashwini", pada: 3, deg: 12.80, lord: "Mars", status: "Active" },
  { name: "Mars", sign: "Leo", house: "10", nak: "Magha", pada: 4, deg: 8.90, lord: "Sun", status: "Active" },
  { name: "Mercury", sign: "Can", house: "9", nak: "Pushya", pada: 1, deg: 28.10, lord: "Moon", status: "Combust" },
  { name: "Jupiter", sign: "Cap", house: "3", nak: "Shravan", pada: 2, deg: 16.40, lord: "Saturn", status: "Debilitated" },
  { name: "Venus", sign: "Vir", house: "11", nak: "Chitra", pada: 3, deg: 4.50, lord: "Mercury", status: "Active" },
  { name: "Saturn", sign: "Aqu", house: "4", nak: "Shatabhisha", pada: 4, deg: 22.20, lord: "Saturn", status: "Active" },
];

const healthPrediction = [
  { type: "heading", text: "Physical Constitution & Vitality" },
  { type: "paragraph", text: "Your Lagna Lord Mars sits in the 10th house, bestowing you with **exceptional resilience** and a strong physical frame. You possess an innate ability to recover quickly from ailments, though you must guard against inflammation and overheating." },
  { type: "highlight_box", title: "Wellness Focus", text: "Regular physical activity is not just for fitness—it is a mandatory psychological release for your intense energy. Focus on core strength and cardiovascular health." },
  { type: "bullet_list", items: [
    "Vulnerable areas: Respiratory system and lower back.",
    "Recommended: Cooling foods (Sattvic diet) to balance internal heat.",
    "Critical Phase: Mid-2026 requires extra attention to rest cycles."
  ]}
];

const lovePrediction = [
  { type: "heading", text: "Romantic Alignment & Soul Bonds" },
  { type: "paragraph", text: "With Scorpio on the ascendant, you seek a **profound, transformative connection**. You do not do things halfway in love; for you, a relationship is a merger of souls. Currently, Venus influences your 11th house, suggesting growth through shared social circles or through a partner who shares your long-term ambitions." },
  { type: "remark", label: "Karmic Note", text: "A significant meeting or deepening of an existing bond is indicated near November. Ensure communication remains transparent to avoid 'Scorpio secrecy' which can cause unnecessary friction." },
  { type: "verse", text: "Dharme cha Arthe cha Kame cha Mokshe cha... (In duty, in wealth, in desire, and in liberation, I shall be your partner.)", source: "Vedic Nuptial Hymn" }
];

// --- ORNATE DIVIDER COMPONENT ---
const OrnateDivider = () => (
  <div className="flex items-center justify-center py-6">
    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
    <div className="mx-4 flex items-center gap-1">
      <div className="w-1 h-1 rounded-full bg-[#C5A059]" />
      <div className="w-2 h-2 rotate-45 border border-[#C5A059] bg-[#7B1818]" />
      <div className="w-1 h-1 rounded-full bg-[#C5A059]" />
    </div>
    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
  </div>
);

// --- MAIN PAGE ---
export default function SamplesPage() {
  return (
    <div className="min-h-screen bg-[#050A0A] pt-32 pb-20 px-4">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00FF94]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Page Header */}
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/20 bg-brand-gold/5 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Star size={14} className="fill-brand-gold" />
            Vedic Excellence
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 uppercase tracking-wider">
            Report <span className="text-brand-gold italic">Samples</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Experience the fusion of high-precision statistics and ancient Vedic insights. 
            Below is a literal representation of our algorithmically generated premium reports.
          </p>
        </header>

        {/* The Digital Report Container */}
        <div className="flex flex-col gap-12 lg:gap-20">
          
          {/* Section 1: Lagna Profile */}
          <section className="group animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-serif">I. Lagna Profile</h2>
                <p className="text-white/40 text-sm">Your primary cosmic identity and fundamental nature.</p>
              </div>
            </div>

            {/* Report Paper - Mimics PDF Page */}
            <div className="bg-[#FFFDF5] text-zinc-900 rounded-2xl p-6 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-[12px] border-[#7B1818] relative overflow-hidden">
              {/* Inner Decorative Border */}
              <div className="absolute inset-2 border border-[#C5A059] rounded-lg pointer-events-none opacity-40" />
              
              <div className="relative z-10">
                <header className="text-center mb-10">
                  <h3 className="text-3xl font-serif font-bold text-[#7B1818] uppercase tracking-[0.2em]">Ascendant Analysis</h3>
                  <OrnateDivider />
                </header>

                <div className="grid md:grid-cols-2 gap-12 mb-12">
                  {/* Left: Chart/Image Placeholder */}
                  <div className="aspect-square bg-[#FCFAF5] border border-[#C5A059] rounded-xl flex items-center justify-center flex-col p-4 shadow-sm">
                    <div className="w-full h-full border-2 border-dashed border-[#C5A059]/30 rounded-lg flex flex-col items-center justify-center text-center p-6 bg-white/50">
                      <div className="text-[#7B1818] mb-4">
                        <Zap size={40} strokeWidth={1.5} />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#7B1818]">Dynamic Planetary Mandala</p>
                      <p className="text-[10px] text-zinc-400 mt-2 font-mono">[ ALGORITHMIC SVG INJECTION ]</p>
                    </div>
                  </div>

                  {/* Right: Identity Details */}
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">Ascendant Profile</span>
                      <h4 className="text-4xl font-serif font-bold text-[#7B1818] mt-1">{lagnaData.ascendant}</h4>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white border border-zinc-200 rounded text-[10px] font-bold uppercase tracking-widest">Symbol: {lagnaData.symbol}</span>
                      <span className="px-3 py-1 bg-white border border-zinc-200 rounded text-[10px] font-bold uppercase tracking-widest">Nature: {lagnaData.zodiac_characteristics}</span>
                    </div>

                    <div className="pl-4 border-l-2 border-[#C5A059] py-2">
                      <p className="italic text-zinc-600 leading-relaxed">"{lagnaData.flagship_qualities}"</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {lagnaData.good_qualities.map(q => (
                        <span key={q} className="px-3 py-1 bg-[#FCFAF5] border border-[#C5A059] rounded-full text-[10px] font-bold text-[#7B1818] tracking-widest">{q}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Ascendant Lord", value: lagnaData.ascendant_lord, sub: `${lagnaData.strength} Strength` },
                    { label: "Primary Placement", value: lagnaData.house, sub: `In ${lagnaData.location}` },
                    { label: "Lucky Gemstone", value: lagnaData.gem, sub: "Vedic Recommendation" },
                    { label: "Vedic Discipline", value: `${lagnaData.fasting} Fast`, sub: "Spiritual Practice" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#C5A059] transition-colors shadow-sm">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
                      <p className="text-sm font-bold text-[#7B1818] mt-2">{stat.value}</p>
                      <span className="text-[9px] italic text-[#C5A059] mt-1">{stat.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Planetary Details */}
          <section className="group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#00FF94]/10 border border-[#00FF94]/20 flex items-center justify-center text-[#00FF94]">
                <Activity size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-serif">II. Planetary Grid</h2>
                <p className="text-white/40 text-sm">Deterministic positions and astronomical strengths.</p>
              </div>
            </div>

            <div className="bg-[#FFFDF5] text-zinc-900 rounded-2xl p-6 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-[12px] border-[#7B1818] relative">
              <div className="absolute inset-2 border border-[#C5A059] rounded-lg pointer-events-none opacity-40" />
              
              <div className="relative z-10">
                <header className="text-center mb-8">
                  <h3 className="text-3xl font-serif font-bold text-[#7B1818] uppercase tracking-[0.2em]">Astronomical Data</h3>
                  <OrnateDivider />
                </header>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse rounded-xl overflow-hidden border border-[#C5A059]">
                    <thead className="bg-[#FCFAF5] border-b-2 border-[#C5A059]">
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-[#7B1818]">
                        <th className="p-4 text-left">Planet</th>
                        <th className="p-4">Sign</th>
                        <th className="p-4">House</th>
                        <th className="p-4">Nakshatra (Pada)</th>
                        <th className="p-4">Degree</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planetaryData.map((p, i) => (
                        <tr key={i} className={cn(
                          "text-xs border-b border-zinc-100 transition-colors hover:bg-[#FCFAF5]",
                          i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"
                        )}>
                          <td className="p-4 font-bold text-[#7B1818]">{p.name}</td>
                          <td className="p-4 text-center">{p.sign}</td>
                          <td className="p-4 text-center font-bold text-brand-gold">{p.house}</td>
                          <td className="p-4 text-center">{p.nak} <span className="text-zinc-400 font-mono">({p.pada})</span></td>
                          <td className="p-4 text-center font-mono text-zinc-500">{p.deg.toFixed(2)}°</td>
                          <td className="p-4 text-center">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter",
                              p.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                              p.status === "Combust" ? "bg-red-50 text-red-600 border border-red-100" :
                              "bg-amber-50 text-amber-600 border border-amber-100"
                            )}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Predictions */}
          <section className="group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Heart size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-serif">III. Intelligence Blocks</h2>
                <p className="text-white/40 text-sm">AI-synthesized predictions for specific life segments.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Health Sample */}
              <div className="bg-[#FFFDF5] text-zinc-900 rounded-2xl p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-[8px] border-[#7B1818] relative">
                <div className="absolute inset-2 border border-[#C5A059] rounded-lg pointer-events-none opacity-40" />
                <div className="relative z-10">
                  {healthPrediction.map((block, i) => (
                    <div key={i} className="mb-6">
                      {block.type === "heading" && (
                        <h4 className="text-[#9F1239] font-serif font-bold text-lg border-b border-[#F9D5DC] pb-2 mb-4 uppercase tracking-widest">{block.text || ""}</h4>
                      )}
                      {block.type === "paragraph" && (
                        <p className="text-sm leading-relaxed text-zinc-800 text-justify">
                          {(block.text || "").split("**").map((part, idx) => 
                             idx % 2 === 1 ? <strong key={idx} className="text-[#9F1239]">{part}</strong> : part
                          )}
                        </p>
                      )}
                      {block.type === "highlight_box" && (
                        <div className="bg-amber-50 border border-[#B8963E] p-4 rounded-lg my-4">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#B8963E] mb-1">{block.title}</h5>
                          <p className="text-xs text-[#7C2D12] leading-relaxed">{block.text || ""}</p>
                        </div>
                      )}
                      {block.type === "bullet_list" && (
                        <ul className="space-y-3 mt-4">
                          {block.items?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs text-zinc-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B8963E] mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Love Sample */}
              <div className="bg-[#FFFDF5] text-zinc-900 rounded-2xl p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-[8px] border-[#7B1818] relative">
                <div className="absolute inset-2 border border-[#C5A059] rounded-lg pointer-events-none opacity-40" />
                <div className="relative z-10">
                  {lovePrediction.map((block, i) => (
                    <div key={i} className="mb-6">
                      {block.type === "heading" && (
                        <h4 className="text-[#9F1239] font-serif font-bold text-lg border-b border-[#F9D5DC] pb-2 mb-4 uppercase tracking-widest">{block.text || ""}</h4>
                      )}
                      {block.type === "paragraph" && (
                        <p className="text-sm leading-relaxed text-zinc-800 text-justify">
                          {(block.text || "").split("**").map((part, idx) => 
                            idx % 2 === 1 ? <strong key={idx} className="text-[#9F1239]">{part}</strong> : part
                          )}
                        </p>
                      )}
                      {block.type === "remark" && (
                        <div className="pl-4 border-l-2 border-[#B8963E] py-1 my-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8963E] block mb-1">{block.label}</span>
                            <p className="text-xs italic text-zinc-600">{block.text || ""}</p>
                        </div>
                      )}
                      {block.type === "verse" && (
                        <div className="py-6 flex flex-col items-center text-center italic">
                          <p className="text-[#9F1239] text-sm leading-relaxed max-w-xs">"{block.text || ""}"</p>
                          <span className="text-[10px] text-zinc-400 mt-2">— {block.source}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <footer className="text-center pt-10">
            <p className="text-white/40 text-sm mb-8 italic font-light">
              This is only a 3-page glimpse of our 50-100 page holistic life architecture reports.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="px-10 py-5 bg-brand-gold text-black font-bold uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                Generate Your Own Report
              </button>
              <button className="group flex items-center gap-3 px-8 py-5 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                <Download size={18} className="text-brand-gold group-hover:animate-bounce" />
                Download Full Sample PDF
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
