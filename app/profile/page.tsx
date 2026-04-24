import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  User,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  PenLine,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  CreditCard,
  Orbit,
} from "lucide-react";
import Link from "next/link";
import ProfileLogoutButton from "@/components/profile/ProfileLogoutButton";
import ProfileDataEditor from "@/components/profile/ProfileDataEditor";
import LocationUpdateModal from "@/components/profile/LocationUpdateModal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Get auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/user/login");
  }

  // 2. Fetch full userdata profile
  const { data: userData } = await supabase
    .from("userdata")
    .select("*")
    .eq("email", user.email)
    .single();

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formattedDate = new Date(userData?.created_at || user.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const avatarUrl = userData?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-foreground relative overflow-hidden font-sans transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10 w-full sm:w-[95%]">

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm relative transition-colors duration-300">

          {/* Top Banner with Video */}
          <div className="h-48 sm:h-56 w-full relative overflow-hidden bg-slate-100">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              src="https://www.pexels.com/download/video/18431843/"
            />
            {/* Subtle overlay so the Edit button is readable */}
            <div className="absolute inset-0 bg-white/20 dark:bg-black/40" />

          </div>

          <div className="px-6 sm:px-10 pb-10 relative">

            {/* Avatar & Title Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8 -mt-20 sm:-mt-24 mb-10 relative z-10">

              {/* Avatar */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white dark:bg-zinc-900 p-2 shadow-sm relative shrink-0 transition-colors duration-300 sm:self-end">
                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden relative transition-colors duration-300">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-4xl font-serif text-slate-700 dark:text-slate-300 font-light shadow-sm">
                      {getInitials(userData?.name)}
                    </span>
                  )}
                </div>
              </div>

              {/* Name Details */}
              <div className="text-center sm:text-left flex-1 mt-4 sm:mt-0 relative flex flex-col justify-end pb-2">
                
                {/* Desktop: Username floating in video (66px above the flex-end baseline = 2px above video bottom line assuming 96px offset and 160px avatar). Mobile: Natural flow. */}
                <div className="sm:absolute sm:bottom-[66px] sm:left-0 mb-3 sm:mb-0 w-full z-20">
                  <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white sm:text-white sm:dark:text-white drop-shadow-lg tracking-tight transition-colors duration-300">
                    {userData?.name || "Astrology Explorer"}
                  </h1>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-2">
                  <div className="flex">
                    {userData?.profile_complete && !!userData?.phone ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-medium uppercase tracking-wider backdrop-blur-md shrink-0">
                        <ShieldCheck size={14} />
                        Verified Profile
                      </span>
                    ) : (
                      <Link href="/auth/user/phone" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-medium uppercase tracking-wider backdrop-blur-md hover:bg-amber-100 transition-colors shrink-0">
                        <AlertTriangle size={14} />
                        {!userData?.phone ? "Add Phone" : "Incomplete"}
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
                    <Calendar size={14} />
                    <span>System Entry: {formattedDate}</span>
                  </div>
                </div>
              </div>

              <div className="pb-2 sm:self-end">
                <ProfileLogoutButton />
              </div>

            </div>

            {/* Profile Details Data Grid (Now Interactive) */}
            <ProfileDataEditor userData={userData} userEmail={user.email || ""} />

          </div>
        </div>

        {/* Action Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pb-6">

          {/* Card 1: Get Result */}
          <Link href="/user/kundli" className="group relative bg-[#faf9ff] dark:bg-zinc-900 border border-[#7e56da]/10 dark:border-zinc-800 rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7e56da]/10 hover:border-[#7e56da]/30 dark:hover:border-[#7e56da]/50">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#7e56da]/10 rounded-full blur-3xl group-hover:bg-[#7e56da]/20 transition-all duration-500" />

            {/* Traditional Vedic Sri Yantra Watermark */}
            <div className="absolute -bottom-24 -right-20 w-80 h-80 text-[#7e56da] opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 pointer-events-none group-hover:rotate-[15deg]">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <polygon points="50,5 95,80 5,80" />
                <polygon points="50,95 5,20 95,20" />
                <polygon points="50,15 85,70 15,70" />
                <polygon points="50,85 15,30 85,30" />
                <polygon points="50,25 75,60 25,60" />
                <polygon points="50,75 25,40 75,40" />
                <circle cx="50" cy="50" r="45" />
                <circle cx="50" cy="50" r="38" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="2" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-6 border border-[#7e56da]/10 dark:border-zinc-700 transition-colors duration-300">
                <Sparkles className="text-[#7e56da]" size={22} />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2 font-medium tracking-tight transition-colors duration-300">Get Your Result</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[90%] transition-colors duration-300">
                Generate your cosmic Kundli and detailed astrological predictions using deep planetary computation.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between text-[#7e56da] font-medium transition-colors">
              <span className="text-sm font-semibold tracking-wide uppercase">Calculate Profile</span>
              <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-[#7e56da]/20 dark:border-zinc-700 flex items-center justify-center group-hover:bg-[#7e56da] group-hover:text-white transition-all duration-300 shadow-sm">
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
            </div>
          </Link>

          {/* Card 2: Your Purchases (Disabled) */}
          <div className="relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-300 opacity-50 cursor-not-allowed grayscale-[0.5]">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-slate-100 rounded-full blur-3xl" />

            {/* Traditional Lotus Mandala Watermark */}
            <div className="absolute -bottom-24 -left-20 w-80 h-80 text-slate-800 opacity-[0.015] pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <path d="M50 5 C 65 30, 65 70, 50 95 C 35 70, 35 30, 50 5 Z" />
                <path d="M5 50 C 30 65, 70 65, 95 50 C 70 35, 30 35, 5 50 Z" />
                <path d="M18 18 C 45 10, 90 45, 82 82 C 55 90, 10 55, 18 18 Z" />
                <path d="M82 18 C 90 45, 45 90, 18 82 C 10 55, 55 10, 82 18 Z" />
                <circle cx="50" cy="50" r="28" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="18" />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-zinc-800 shadow-sm flex items-center justify-center mb-6 border border-slate-100 dark:border-zinc-700 transition-colors duration-300">
                <CreditCard className="text-slate-600 dark:text-slate-300" size={22} />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-2 font-medium tracking-tight transition-colors duration-300">Your Purchases</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[90%] transition-colors duration-300">
                Review your previously generated premium reports, cosmic matchmaking grids, and transaction history.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between text-slate-400 dark:text-slate-500 font-medium transition-colors">
              <span className="text-sm font-semibold tracking-wide uppercase">Coming Soon</span>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center transition-all duration-300 shadow-sm">
                <span>&rarr;</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
