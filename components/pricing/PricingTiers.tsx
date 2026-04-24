"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

const FEATURES_LIST = [
  "Precision planetary positions",
  "Core time-bound dashas",
  "Strengths & weakness profiling",
  "Digital PDF delivery",
  "DYNAMIC_PRINT",
  "Career & vocational trajectory",
  "Relationship compatibility matrix",
  "Entire life granular transits",
  "Remedial measures & gemstones"
];

const VIP_PLANS = [
  {
    name: "The Blueprint",
    price: "1,200",
    oldPrice: null,
    period: "one-time",
    description: "Get started with the essential tools to map your cosmic architecture. Ideal for core cosmic fundamentals.",
    includedCount: 5,
    tabText: "Active",
    tabDot: "bg-[#E6CA4F]", // Yellow dot
    isDark: false,
    btnText: "Buy Now",
  },
  {
    name: "The Pathway",
    price: "1,500",
    oldPrice: "2,000",
    period: "one-time",
    description: "A comprehensive solution for personal growth, offering enhanced synastry features to streamline your life path.",
    includedCount: 7,
    tabText: "Save 25%",
    tabDot: "bg-[#2D2D2D]", // Black dot
    isDark: true,
    btnText: "Buy Now",
  },
  {
    name: "The Destiny",
    price: "2,000",
    oldPrice: null,
    period: "one-time",
    description: "Maximize your performance with premium transits and full physical bindings, perfect for lifelong guidance.",
    includedCount: 9,
    tabText: "Popular",
    tabDot: "bg-[#8BC34A]", // Green dot
    isDark: false,
    btnText: "Buy Now",
  }
];

export default function PricingTiers({
  userPlans,
  agentPlans,
}: {
  userPlans?: any[];
  agentPlans?: any[];
}) {
  const [isPremium, setIsPremium] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const mobileInView = useInView(mobileRef, { once: true, margin: "-50px" });

  // Shared card renderer — identical design for desktop & mobile
  const renderCard = (plan: typeof VIP_PLANS[0], i: number, isMobile: boolean) => {
    const isMiddle = i === 1;
    const cardBg = plan.isDark ? "bg-[#2A2B2D] dark:bg-zinc-800" : "bg-[#fdfbf6] dark:bg-zinc-900";
    const textColor = plan.isDark ? "text-white" : "text-[#2D2D2D] dark:text-white";
    const priceColor = plan.isDark ? "text-[#EAC94D]" : "text-[#2D2D2D] dark:text-[#EAC94D]";
    const tabBg = plan.isDark ? "bg-[#EAC94D]" : cardBg;
    const tabTextColor = plan.isDark ? "text-[#2D2D2D]" : "text-gray-500 dark:text-gray-300";

    // Desktop: fade up on scroll | Mobile: slide from right with cascade delay
    const motionProps = isMobile
      ? {
          initial: { opacity: 0, x: 100, scale: 0.92 },
          animate: mobileInView ? { opacity: 1, x: 0, scale: 1 } : {},
          transition: { duration: 0.55, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] as const },
        }
      : {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6, delay: i * 0.15 },
        };

    const wrapperClass = isMobile
      ? "snap-center shrink-0 w-[85vw] max-w-[360px] relative"
      : `relative h-full ${isMiddle ? 'z-10 md:mt-[-10px]' : 'z-0'}`;

    return (
      <motion.div key={plan.name} {...motionProps} className={wrapperClass}>
        {/* Yellow Background Hashed Shadow for Middle Card */}
        {isMiddle && (
          <div className="absolute inset-x-0 bottom-[-16px] top-[14px] translate-x-[16px] rounded-[2.5rem] bg-[#EAC94D] dark:bg-[#EAC94D]/20 -z-10 overflow-hidden transform">
            <div className="absolute inset-0 opacity-[0.25]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)' }} />
          </div>
        )}

        {/* The Main Container */}
        <div className={`relative h-full ${cardBg} ${textColor} rounded-[2.5rem] rounded-tr-none px-8 py-10 flex flex-col ${!plan.isDark && 'border border-black/[0.04] dark:border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'}`}>
          
          {/* The Tab */}
          <div className={`absolute top-[-44px] right-0 h-[44px] px-6 min-w-[130px] ${tabBg} rounded-t-[1.5rem] flex items-center justify-center`}>
            <svg className="absolute bottom-0 -left-[24px] w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none">
              <path d="M24 0V24H0A24 24 0 0 0 24 0Z" className={plan.isDark ? "fill-[#EAC94D]" : "fill-[#fdfbf6] dark:fill-zinc-900"} />
            </svg>
            {!plan.isDark && (
              <svg className="absolute bottom-0 -left-[24px] w-[24px] h-[24px] pointer-events-none stroke-black/[0.04] dark:stroke-zinc-800" viewBox="0 0 24 24" fill="none">
                <path d="M24 0C10.7452 0 0 10.7452 0 24" strokeWidth="1" />
              </svg>
            )}
            <span className={`text-[12px] font-semibold flex items-center gap-2 ${tabTextColor}`}>
              {plan.tabText}
              <span className={`w-1.5 h-1.5 rounded-full ${plan.tabDot}`} />
            </span>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h3 className="text-[20px] font-medium mb-6">{plan.name}</h3>
            <div className="flex items-center justify-center gap-3">
              {plan.oldPrice && <div className="text-3xl text-gray-500 font-medium decoration-1 line-through mt-1">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={isPremium ? `p-old-${i}` : `r-old-${i}`}
                    initial={{ opacity: 0, y: -5, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                    transition={{ duration: 0.15 }}
                    className="inline-block"
                  >
                    ₹{isPremium ? (parseInt(plan.oldPrice.replace(/,/g, ''), 10) + 300).toLocaleString('en-IN') : plan.oldPrice}
                  </motion.span>
                </AnimatePresence>
              </div>}
              <div className={`text-[3.5rem] tracking-tight font-medium flex items-baseline ${priceColor}`}>
                <span className="text-4xl pr-1">₹</span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={isPremium ? `p-new-${i}` : `r-new-${i}`}
                    initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {isPremium ? (parseInt(plan.price.replace(/,/g, ''), 10) + 300).toLocaleString('en-IN') : plan.price}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-left text-[11px] leading-tight text-gray-500 ml-1">
                / volume <br/> billed {plan.period}
              </div>
            </div>
            
            <p className={`mt-6 text-[13px] ${plan.isDark ? 'text-gray-400' : 'text-gray-500/90 dark:text-gray-400'} max-w-[260px] mx-auto leading-[1.6] h-[60px]`}>
              {plan.description}
            </p>
          </div>

          {/* Features List */}
          <ul className="space-y-4 mb-12 flex-1 px-1">
            {FEATURES_LIST.map((f, idx) => {
              const isIncluded = idx < plan.includedCount;
              const featureText = f === "DYNAMIC_PRINT" 
                ? (isPremium ? "Premium physical hardcover" : "Regular physical print")
                : f;

              if (isIncluded) {
                return (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-[18px] h-[18px] rounded-full bg-[#8bc34a] flex items-center justify-center shrink-0">
                      <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={featureText}
                        initial={{ opacity: 0, filter: "blur(2px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(2px)" }}
                        transition={{ duration: 0.15 }}
                        className={`text-[13.5px] tracking-wide ${plan.isDark ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} font-medium`}
                      >
                        {featureText}
                      </motion.span>
                    </AnimatePresence>
                  </li>
                );
              } else {
                return (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                      <X className={`w-4 h-4 ${plan.isDark ? 'text-gray-500' : 'text-gray-400 dark:text-gray-600'}`} strokeWidth={1.5} />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={featureText}
                        initial={{ opacity: 0, filter: "blur(2px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(2px)" }}
                        transition={{ duration: 0.15 }}
                        className={`text-[13.5px] tracking-wide ${plan.isDark ? 'text-gray-500' : 'text-gray-400/80 dark:text-gray-500'} font-medium`}
                      >
                        {featureText}
                      </motion.span>
                    </AnimatePresence>
                  </li>
                );
              }
            })}
          </ul>

          {/* Button */}
          <button className={`w-full py-3.5 rounded-full text-[13.5px] font-medium transition-all tracking-wide ${
            plan.isDark 
              ? "bg-white text-[#2D2D2D] hover:bg-gray-100" 
              : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
          }`}>
            {plan.btnText}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="pricing" className="pt-8 pb-16 md:pt-12 md:pb-20 bg-gradient-to-br from-[#EEF0F2] to-[#F1ecd0] dark:from-background dark:to-background relative z-10 overflow-hidden font-sans transform-gpu">
      
      <div className="relative z-10 w-[95%] mx-auto max-w-[1800px]">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-12 relative px-4 lg:px-8">
          <h2 className="text-[2.75rem] font-medium text-[#2D2D2D] dark:text-white w-full md:w-auto text-center md:text-left tracking-tight">Pricing</h2>
          
          <div className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 rounded-full p-[6px] flex items-center shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-transparent dark:border-zinc-800 top-[70px] md:top-1 w-max scale-[0.85] md:scale-100 origin-top">
            <button 
              onClick={() => setIsPremium(false)}
              className={`text-[13px] font-medium px-6 py-2.5 rounded-full tracking-wide transition-all ${
                !isPremium ? "bg-[#2A2B2D] text-white dark:bg-[#EAC94D] dark:text-[#2D2D2D]" : "text-gray-500 hover:text-gray-800 dark:hover:text-white bg-transparent"
              }`}>
              Regular Paper Print
            </button>
            <button 
              onClick={() => setIsPremium(true)}
              className={`text-[13px] font-medium px-6 py-2.5 rounded-full tracking-wide transition-all ${
                isPremium ? "bg-[#2A2B2D] text-white dark:bg-[#EAC94D] dark:text-[#2D2D2D]" : "text-gray-500 hover:text-gray-800 dark:hover:text-white bg-transparent"
              }`}>
              Premium Paper Print
            </button>
          </div>
        </div>

        {/* Desktop: 3-col grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-y-8 gap-x-8 items-stretch pt-6 pb-0 lg:px-0 px-4">
          {VIP_PLANS.map((plan, i) => renderCard(plan, i, false))}
        </div>

        {/* Mobile: horizontal snap-scroll with cascade animation */}
        <div ref={mobileRef} className="md:hidden pt-16 pb-4">
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 px-4 scrollbar-hide">
            {VIP_PLANS.map((plan, i) => renderCard(plan, i, true))}
          </div>
        </div>

      </div>
    </section>
  );
}
