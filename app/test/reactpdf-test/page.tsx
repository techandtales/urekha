import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Layers, 
  BarChart3, 
  Sparkles, 
  ArrowRight
} from "lucide-react";

const TEST_CATEGORIES = [
  {
    href: "/test/reactpdf-test/test-1",
    title: "Test 1: Fundamentals",
    description: "Cover, Intro, Index, Report Guide, and How to Read pages.",
    icon: <FileText className="w-6 h-6" />,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/20",
  },
  {
    href: "/test/reactpdf-test/test-2",
    title: "Test 2: Core Horoscope",
    description: "Birth Details, Lagna Profile, Planetary Details, and Divisional Charts.",
    icon: <Layers className="w-6 h-6" />,
    color: "from-[#00FF94]/20 to-teal-500/20",
    borderColor: "border-[#00FF94]/20",
  },
  {
    href: "/test/reactpdf-test/test-3",
    title: "Test 3: Strength & Dashas",
    description: "Friendship, Doshas, Ashtakavarga, and Dasha sequence pages.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "from-orange-500/20 to-amber-500/20",
    borderColor: "border-orange-500/20",
  },
  {
    href: "/test/reactpdf-test/test-4",
    title: "Test 4: KP & Predictions",
    description: "KP Astrology, Live Predictions, and Structured JSON Verification.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/20",
  },
];

export default function ReactPdfTestIndex() {
  return (
    <div className="min-h-screen bg-[#050A0A] text-white p-8 md:p-16 flex flex-col items-center">
      {/* Header */}
      <div className="max-w-4xl w-full flex flex-col gap-6 mb-16 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit mx-auto md:mx-0">
          <span className="w-2 h-2 bg-[#00FF94] rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Regression Suite</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-tight">
          React-PDF <span className="text-[#00FF94]">Renderer</span><br />
          Verification Lab
        </h1>
        <p className="text-xl text-white/40 max-w-2xl font-medium">
          A systematic testing environment to validate rendering accuracy, data mapping, 
          and layout consistency for the URekha PDF Report components.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEST_CATEGORIES.map((cat) => (
          <Link 
            key={cat.href} 
            href={cat.href}
            className={`
              relative overflow-hidden group p-8 rounded-[2.5rem] border bg-gradient-to-br transition-all duration-500
              ${cat.color} ${cat.borderColor} hover:border-[#00FF94]/50 hover:scale-[1.02]
            `}
          >
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#00FF94] border border-white/5 group-hover:bg-[#00FF94] group-hover:text-black transition-colors duration-500">
                {cat.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-[#00FF94] transition-colors">{cat.title}</h2>
                <p className="text-white/40 text-sm leading-relaxed">{cat.description}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00FF94]/60 mt-4">
                Enter Lab <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF94]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#00FF94]/20 transition-all duration-500" />
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/5 pt-8 w-full max-w-4xl flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
        <span>© 2026 Urekha Intelligence</span>
        <span>Environment: Stable Production</span>
      </footer>
    </div>
  );
}
