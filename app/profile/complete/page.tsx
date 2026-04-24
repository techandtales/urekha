"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Sparkles,
  Loader2,
  AlertTriangle,
  Search,
  Info,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { completeUserProfile } from "@/app/auth/actions";
import { motion, AnimatePresence } from "framer-motion";

function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState(""); // UI: Birth Place
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [timezone, setTimezone] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchLocation = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await r.json();
      setSuggestions(data);
    } catch {
      // ignore
    } finally {
      setIsSearching(false);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCity(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => searchLocation(val), 800);
  };

  const handleSelectLocation = async (s: any) => {
    setLatitude(s.lat || "");
    setLongitude(s.lon || "");
    
    const a = s.address || {};
    if (a.country) setCountry(a.country);
    if (a.state) setState(a.state);
    
    // Attempt best extraction for city/town
    const birthPlace = a.city || a.town || a.village || s.display_name.split(",")[0];
    setCity(birthPlace);

    // Auto-detect Timezone
    try {
      const tzRes = await fetch(`https://timeapi.io/api/TimeZone/coordinate?latitude=${s.lat}&longitude=${s.lon}`);
      if (tzRes.ok) {
        const tzData = await tzRes.json();
        const offsetHours = tzData.currentUtcOffset.seconds / 3600;
        setTimezone(offsetHours.toString());
      } else {
        throw new Error("API not ok");
      }
    } catch (error) {
      if (a.country === "India" || (s.display_name && s.display_name.includes("India"))) {
        setTimezone("5.5");
      }
    }

    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !dob || !gender || !country || !state || !city) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    const result = await completeUserProfile({
      name,
      date_of_birth: dob,
      time_of_birth: tob || "",
      gender,
      country,
      state,
      city, // Preserves backward compat within schema
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      timezone,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push(redirect || "/profile");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#050A0A] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.03] text-slate-900 dark:text-white">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="dash-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dash-grid)" />
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/[0.1] dark:bg-brand-gold/[0.05] rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />

      <div className="w-full max-w-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-8 md:p-12 relative z-10 shadow-xl dark:shadow-2xl backdrop-blur-xl group hover:border-brand-gold/30 dark:hover:border-brand-gold/20 transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/50 dark:via-brand-gold/30 to-transparent" />

        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group relative">
            <Image
              src="/logo.svg"
              alt="Urekha Logo"
              width={140}
              height={40}
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              priority
            />
            <span className="text-xl font-bold tracking-tight text-[#111111] dark:text-white uppercase mt-0.5 select-none transition-colors duration-300">
              UREKHA
            </span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">
            Complete Your Profile
          </h1>
          <p className="text-slate-500 dark:text-white/40 text-sm font-light max-w-md mx-auto transition-colors duration-300">
            We need a few more details to generate accurate astrological reports
            for you. All fields marked with * are required.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 flex items-start gap-3 transition-colors duration-300">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-600 dark:text-red-400 text-sm leading-relaxed transition-colors duration-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Details */}
          <section className="space-y-5">
            <h2 className="text-sm uppercase tracking-widest font-bold text-brand-gold flex items-center gap-2">
              <User size={16} />
              Personal Details
            </h2>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300">
                  Date of Birth *
                </label>
                <div className="relative group/input">
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hide-picker-indicator uppercase"
                  />
                  <Calendar
                    className="absolute right-4 top-3.5 text-slate-400 dark:text-white/30 group-focus-within/input:text-brand-gold transition-colors pointer-events-none"
                    size={18}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300">
                  Time of Birth{" "}
                  <span className="opacity-50 lowercase">(optional)</span>
                </label>
                <div className="relative group/input">
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hide-picker-indicator"
                  />
                  <Clock
                    className="absolute right-4 top-3.5 text-slate-400 dark:text-white/30 group-focus-within/input:text-brand-gold transition-colors pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300">
                Gender *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g as "male" | "female")}
                    className={`px-4 py-3 rounded-xl border capitalize transition-all duration-300 ${
                      gender === g
                        ? "bg-brand-gold text-black border-brand-gold font-bold shadow-[0_4px_15px_rgba(212,175,55,0.3)] scale-[1.02]"
                        : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="space-y-5">
            <h2 className="text-sm uppercase tracking-widest font-bold text-brand-gold flex items-center gap-2">
              <MapPin size={16} />
              Geographic Anchors
            </h2>

            {/* Birth Place (Search Autocomplete) */}
            <div className="space-y-2 relative">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300">
                Birth Place *
              </label>
              <div className="relative group/input">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={handleCityChange}
                  placeholder="e.g. Varanasi, India"
                  className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pr-11 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300"
                />
                
                {isSearching ? (
                  <div className="absolute right-4 top-3.5 flex items-center justify-center">
                    <Loader2 className="text-brand-gold animate-spin pointer-events-none" size={18} />
                  </div>
                ) : (
                  <Search className="absolute right-4 top-3.5 text-slate-400 dark:text-white/30 group-focus-within/input:text-brand-gold transition-colors pointer-events-none" size={18} />
                )}
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectLocation(s)}
                        className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0 transition-colors"
                      >
                        {s.display_name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Bihar"
                  className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300">
                  Country *
                </label>
                <div className="relative group/input">
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300"
                  />
                  <Globe
                    className="absolute right-4 top-3.5 text-slate-400 dark:text-white/30 group-focus-within/input:text-brand-gold transition-colors pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
            </div>

            {/* Latitude and Longitude Coordinates Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300 flex items-center gap-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 25.5941"
                  className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 transition-all duration-300 font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300 flex items-center gap-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 85.1376"
                  className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 transition-all duration-300 font-mono text-sm"
                />
              </div>
            </div>

            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-white/40 italic pl-1 flex items-center gap-1.5 pt-1 transition-colors duration-300">
               <Info className="w-3.5 h-3.5 shrink-0" />
               Auto-detected from Birth Place selection. If you believe these coordinates are slightly off, you may manually modify them.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-white/50 ml-1 transition-colors duration-300 flex items-center gap-1">
                Timezone *
              </label>
              <div className="relative group/input">
                <input
                  type="text"
                  required
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g. 5.5 for IST or Asia/Kolkata"
                  className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 font-mono text-sm"
                />
                <Clock className="absolute right-4 top-3.5 text-slate-400 dark:text-white/30 group-focus-within/input:text-brand-gold transition-colors pointer-events-none" size={18} />
              </div>
            </div>

          </section>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-gold text-slate-900 dark:text-black rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.4)] relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/40 dark:via-white/50 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Complete Profile & Continue
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/50">Loading Profile...</div>}>
      <CompleteProfileContent />
    </Suspense>
  );
}
