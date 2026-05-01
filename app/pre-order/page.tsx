"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Zap, 
  Loader2, 
  Search, 
  Cpu, 
  Fingerprint, 
  Crown,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Info,
  Check,
  Mail,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PLAN_THEMES = [
  {
    id: "standard",
    name: "Standard",
    icon: Cpu,
    gradient: "from-cyan-500 to-teal-500",
    activeColor: "emerald",
    description: "Basic birth charts and simple analysis."
  },
  {
    id: "premium",
    name: "Premium",
    icon: Fingerprint,
    gradient: "from-amber-500 to-orange-600",
    activeColor: "amber",
    description: "Detailed predictions and complete life reports."
  },
  {
    id: "elite",
    name: "Elite",
    icon: Crown,
    gradient: "from-purple-500 to-indigo-600",
    activeColor: "purple",
    description: "Advanced AI analysis with deep future insights."
  },
];

function WanderingParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-emerald-500/20 blur-xl"
          style={{
            width: Math.random() * 200 + 100 + "px",
            height: Math.random() * 200 + 100 + "px",
          }}
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0.1,
          }}
          animate={{
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

const InputField = ({ label, icon: Icon, error, ...props }: any) => (
  <div className="space-y-2 w-full">
    <div className="flex items-center justify-between">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 ml-1">
        {label}
      </label>
      {error && <span className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{error}</span>}
    </div>
    <div className="relative group">
      <input 
        {...props}
        className={cn(
          "w-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 dark:focus:bg-white/[0.05] placeholder:text-slate-400 dark:placeholder:text-white/10 font-medium text-slate-900 dark:text-white shadow-sm",
          error && "border-red-500/50 focus:ring-red-500/10 focus:border-red-500"
        )}
      />
      {Icon && (
        <Icon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20 group-focus-within:text-emerald-500 transition-colors" />
      )}
    </div>
  </div>
);

export default function PreOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    tob: "",
    pob: "",
    latitude: "",
    longitude: "",
    plan: "premium"
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchLocation = async (query: string) => {
    if (!query.trim() || query.length < 3) { setSuggestions([]); return; }
    setIsSearching(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`, { headers: { "Accept-Language": "en" } });
      setSuggestions(await r.json());
    } catch { /* ignore */ } finally { setIsSearching(false); }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => searchLocation(e.target.value), 800);
  };

  const handleSelectLocation = (s: any) => {
    const a = s.address || {};
    const parts = [a.city || a.town || a.village, a.state, a.country].filter(Boolean);
    const locationName = parts.length > 0 ? parts.join(", ") : s.display_name;
    
    setFormData(prev => ({
      ...prev,
      pob: locationName,
      latitude: s.lat,
      longitude: s.lon
    }));
    setSearchQuery(s.display_name.split(",")[0]);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.pob || !formData.latitude) {
      toast.error("Please fill in your name, email, and birth place.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/pre-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Registration successful!");
        setTimeout(() => router.push("/"), 2000);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050A0A] text-slate-900 dark:text-white selection:bg-emerald-500/30 font-sans relative overflow-x-hidden pt-32 pb-24 px-4 md:px-6">
      
      <WanderingParticles />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* MINIMAL HEADER */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            Early Access
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Pre-Register
          </h1>
        </div>

        {/* MAIN FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0B1221]/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="divide-y divide-slate-100 dark:divide-white/5">
            
            {/* SECTION 1: PERSONAL DETAILS */}
            <div className="p-8 md:p-12 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center">
                  <User size={20} className="text-white dark:text-black" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Personal Details</h2>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Provide your birth information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField 
                  label="Full Name" 
                  icon={User} 
                  placeholder="Your Name"
                  value={formData.fullName}
                  onChange={(e: any) => setFormData({...formData, fullName: e.target.value})}
                  required
                />

                <InputField 
                  label="Email Address" 
                  type="email"
                  icon={Mail}
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e: any) => setFormData({...formData, email: e.target.value})}
                  required
                />

                <InputField 
                  label="Phone Number" 
                  type="tel"
                  icon={Phone}
                  placeholder="+91 00000 00000"
                  value={formData.phone}
                  onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
                />
                
                <InputField 
                  label="Date of Birth" 
                  type="date"
                  value={formData.dob}
                  onChange={(e: any) => setFormData({...formData, dob: e.target.value})}
                  required
                />
                
                <InputField 
                  label="Time of Birth (24h)" 
                  type="text"
                  placeholder="HH:MM"
                  value={formData.tob}
                  onChange={(e: any) => {
                    let val = e.target.value.replace(/[^0-9:]/g, "");
                    if (val.length === 2 && !val.includes(":")) val += ":";
                    if (val.length > 5) val = val.substring(0, 5);
                    setFormData({...formData, tob: val});
                  }}
                  onBlur={(e: any) => {
                    const val = e.target.value;
                    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                    if (val && !regex.test(val)) {
                      setFormData({...formData, tob: ""});
                      toast.error("Invalid time format", { description: "Use HH:MM (00:00 - 23:59)" });
                    }
                  }}
                  required
                />

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 ml-1">
                    Birth Place
                  </label>
                  <div className="relative group">
                    <input 
                      type="text"
                      placeholder="Search city..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      required
                      className="w-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 dark:focus:bg-white/[0.05] placeholder:text-slate-400 dark:placeholder:text-white/10 font-medium text-slate-900 dark:text-white shadow-sm"
                    />
                    {isSearching ? (
                      <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" />
                    ) : (
                      <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20 group-focus-within:text-emerald-500" />
                    )}
                  </div>

                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 left-0 right-0 top-[calc(100%+8px)] bg-white dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-emerald-500/10"
                      >
                        {suggestions.map((s, i) => (
                          <button 
                            key={i} 
                            type="button" 
                            onClick={() => handleSelectLocation(s)}
                            className="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-emerald-500/5 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0 flex items-center gap-3 group"
                          >
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-xs text-slate-700 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-white truncate font-bold">{s.display_name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* COORDINATES DISPLAY */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-600">Latitude</span>
                      <span className="text-sm font-mono font-bold text-emerald-600/80 dark:text-emerald-400/80 tracking-tight">
                        {formData.latitude || "---.----"}
                      </span>
                   </div>
                   <div className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-600">Longitude</span>
                      <span className="text-sm font-mono font-bold text-emerald-600/80 dark:text-emerald-400/80 tracking-tight">
                        {formData.longitude || "---.----"}
                      </span>
                   </div>
                </div>

                <div className="md:col-span-2 flex items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <Info size={14} className="text-blue-500 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-500/80 uppercase tracking-tight">Coordinates are found automatically when you select a place.</p>
                </div>
              </div>
            </div>

            {/* SECTION 2: CHOOSE PLAN */}
            <div className="p-8 md:p-12 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 dark:bg-amber-400 flex items-center justify-center">
                  <Zap size={20} className="text-white dark:text-black" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Choose Your Plan</h2>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Select the best option for you</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLAN_THEMES.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = formData.plan === plan.id;
                  
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setFormData({...formData, plan: plan.id})}
                      className={cn(
                        "relative p-6 rounded-3xl border text-left transition-all duration-300 group",
                        isSelected 
                          ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white shadow-xl shadow-slate-900/10 dark:shadow-white/10 scale-[1.02]" 
                          : "bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-colors",
                        isSelected ? "bg-white/10 dark:bg-black/10" : "bg-slate-50 dark:bg-white/5"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          isSelected ? "text-white dark:text-black" : "text-slate-400 dark:text-zinc-500"
                        )} />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-sm font-black uppercase tracking-widest",
                            isSelected ? "text-white dark:text-black" : "text-slate-900 dark:text-white"
                          )}>
                            {plan.name}
                          </span>
                          {isSelected && <Check size={14} className={isSelected ? "text-white dark:text-black" : ""} />}
                        </div>
                        <p className={cn(
                          "text-[10px] font-bold leading-relaxed",
                          isSelected ? "text-white/60 dark:text-black/50" : "text-slate-500 dark:text-zinc-500"
                        )}>
                          {plan.description}
                        </p>
                      </div>

                      {isSelected && (
                        <motion.div 
                          layoutId="plan-glow"
                          className={cn(
                            "absolute inset-0 -z-10 rounded-3xl blur-2xl opacity-20 transition-colors",
                            plan.id === 'standard' ? "bg-cyan-500" : plan.id === 'premium' ? "bg-amber-500" : "bg-purple-500"
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-8 md:p-12 bg-slate-50/50 dark:bg-black/20 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full md:w-auto px-16 py-6 rounded-2xl text-[14px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl",
                  loading 
                    ? "bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-zinc-600 cursor-wait" 
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 active:scale-95"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight size={16} className="translate-y-px" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
