"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  CheckCircle2,
  Globe,
  MapPin,
  Navigation,
  Sparkles,
} from "lucide-react";

export default function SimpleBirthForm() {
  const { setBirthDetails, resetPipeline } = useStore();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  // Refs for input values
  const usernameRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const tobRef = useRef<HTMLInputElement>(null);
  const pobRef = useRef<HTMLInputElement>(null);
  const latRef = useRef<HTMLInputElement>(null);
  const lonRef = useRef<HTMLInputElement>(null);
  const tzRef = useRef<HTMLInputElement>(null);
  const langRef = useRef<HTMLSelectElement>(null);

  const handleGenerateClick = () => {
    const details = {
      username: usernameRef.current?.value || "Ravikant",
      dob: new Date(dobRef.current?.value || "03-03-2002"),
      tob: tobRef.current?.value || "05:30",
      pob: pobRef.current?.value || "Hajipur ",
      latitude: Number(latRef.current?.value || 25.5941),
      longitude: Number(lonRef.current?.value || 85.1376),
      timezone: Number(tzRef.current?.value || 5.5),
      language: (langRef.current?.value as "en" | "hi") || "en",
    };

    setBirthDetails(details);
    resetPipeline();
    setIsSaved(true);

    // Navigate to pipeline page after a brief visual confirmation
    setTimeout(() => router.push("/pipeline"), 600);
  };

  // Luxury UI Design Tokens
  const inputBase =
    "w-full border border-zinc-200 rounded-xl p-3 bg-white text-zinc-900 text-pdf-body font-serif focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-zinc-300 shadow-sm";
  const labelBase =
    "text-pdf-label font-bold uppercase tracking-[0.12em] text-zinc-400 flex items-center gap-2 mb-2";

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] p-6">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      <div className="relative bg-white p-10 md:p-14 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-xl border border-zinc-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 mb-4">
            <Sparkles className="text-orange-500" size={24} />
          </div>
          <h1 className="text-pdf-title text-zinc-900 mb-2 tracking-tight">
            Celestial Profile
          </h1>
          <p className="text-pdf-caption text-zinc-400 font-sans tracking-[0.2em] uppercase">
            Vedic Astrology Engine • AI Driven
          </p>
        </div>

        <div className="space-y-7">
          {/* User Section */}
          <div className="flex flex-col">
            <label className={labelBase}>Full Name</label>
            <input
              ref={usernameRef}
              type="text"
              defaultValue="Ravikant"
              className={inputBase}
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className={labelBase}>Date of Birth</label>
              <input
                ref={dobRef}
                type="date"
                defaultValue="2002-03-03"
                className={inputBase}
              />
            </div>
            <div className="flex flex-col">
              <label className={labelBase}>Time of Birth</label>
              <input
                ref={tobRef}
                type="time"
                defaultValue="14:30"
                className={inputBase}
              />
            </div>
          </div>

          {/* Location Section */}
          <div className="flex flex-col">
            <label className={labelBase}>
              <MapPin size={14} className="text-orange-500" /> Place of Birth
            </label>
            <input
              ref={pobRef}
              type="text"
              defaultValue="Hajipur , Bihar"
              className={inputBase}
            />
          </div>

          {/* Precision Coordinates Card */}
          <div className="bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100 grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-[7pt] font-black uppercase tracking-widest text-zinc-400 mb-1">
                Latitude
              </label>
              <input
                ref={latRef}
                type="number"
                step="any"
                defaultValue="25.5941"
                className="bg-transparent border-none p-0 text-pdf-body font-serif text-zinc-800 outline-none"
              />
            </div>
            <div className="flex flex-col border-x border-zinc-200 px-4">
              <label className="text-[7pt] font-black uppercase tracking-widest text-zinc-400 mb-1">
                Longitude
              </label>
              <input
                ref={lonRef}
                type="number"
                step="any"
                defaultValue="85.1376"
                className="bg-transparent border-none p-0 text-pdf-body font-serif text-zinc-800 outline-none"
              />
            </div>
            <div className="flex flex-col pl-2">
              <label className="text-[7pt] font-black uppercase tracking-widest text-zinc-400 mb-1">
                Timezone
              </label>
              <input
                ref={tzRef}
                type="number"
                step="0.5"
                defaultValue="5.5"
                className="bg-transparent border-none p-0 text-pdf-body font-serif text-zinc-800 outline-none"
              />
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex flex-col">
            <label className={labelBase}>
              <Globe size={14} className="text-zinc-400" /> Report Language
            </label>
            <div className="relative">
              <select
                ref={langRef}
                defaultValue="en"
                className={`${inputBase} appearance-none cursor-pointer pr-10`}
              >
                <option value="en">English (International Standard)</option>
                <option value="hi">Hindi (हिन्दी - वैदिक शब्दावली)</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-400">
                <Navigation size={14} className="rotate-180" />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleGenerateClick}
            className={`mt-4 flex items-center justify-center gap-3 text-white font-bold py-4 rounded-2xl transition-all w-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] transform active:scale-[0.98] ${
              isSaved
                ? "bg-emerald-600 shadow-emerald-200"
                : "bg-zinc-900 hover:bg-black"
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={20} /> Identity Confirmed
              </>
            ) : (
              <>
                <Navigation size={18} className="fill-current" />
                <span>Generate Detailed Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
