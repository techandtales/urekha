"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const WHITE_CARDS = [
  {
    quote: "I was highly skeptical of an AI-generated reading, but this 120-page compendium blew my mind. It’s far more comprehensive and insightful than any human astrologer I've met.",
    name: "Ashu Sharma",
    location: "New Delhi, IN",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    quote: "The remedial measures alone are worth the price. It didn't just give vague advice; it gave exact gemstone recommendations backed by heavy planetary logic. My career is finally on track.",
    name: "Raushan Singh",
    location: "Bangalore, IN",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    quote: "Having consulted Vedic experts for years, I can confidently say Urekha's synthesis is unmatched. The way it translates complex cosmic geometry into real-world actionable steps is genius.",
    name: "Om Katariya",
    location: "Pune, IN",
    avatar: "https://i.pravatar.cc/150?img=12",
  }
];

export default function Testimonials() {
  return (
    <section className="pb-12 pt-12 md:pb-16 md:pt-16 overflow-hidden bg-white dark:bg-background transform-gpu relative z-0 -mt-[1px]">
      <div className="w-[95%] mx-auto max-w-[1800px]">
        
        <div
           className="bg-[#F8F4E6] dark:bg-zinc-900 rounded-[2.5rem] p-6 md:p-10 w-full shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:border dark:border-zinc-800"
        >
           {/* Flex column for the two main rows */}
           <div className="flex flex-col gap-6 md:gap-6">
              
              {/* Top Row */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-6 items-stretch min-h-[340px]">
                 
                 {/* Green Feature Card */}
                 <div className="bg-[#71BFA7] rounded-[2rem] p-6 md:p-10 flex flex-col justify-between flex-[1.4] shadow-[0_8px_30px_rgba(113,191,167,0.2)]">
                     <div>
                        {/* 5 Stars */}
                        <div className="flex gap-1.5 mb-8">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className="w-4 h-4 fill-[#F5DE50] text-[#F5DE50]" />
                           ))}
                        </div>
                        <h3 className="text-white text-[20px] md:text-[22px] font-serif leading-[1.4] tracking-wide pr-4">
                           "I cannot overstate how highly accurate my cosmic blueprint was. The predictive Dasha timeline mapped out my entire upcoming year with stunning precision!"
                        </h3>
                     </div>
                     <div className="flex items-center gap-3.5 mt-8">
                        <img src="https://i.pravatar.cc/150?img=32" alt="Reviewer" className="w-11 h-11 rounded-full object-cover border-2 border-white/20" />
                        <div>
                           <p className="text-white font-semibold text-[15px] tracking-wide">Kanchi Desai</p>
                           <p className="text-white/80 text-[12.5px] tracking-wider mt-0.5">Mumbai, IN</p>
                        </div>
                     </div>
                 </div>
                 
                 {/* Big Image (Now a click-to-play Video) */}
                 <div className="flex-[2.1] relative rounded-[2rem] overflow-hidden min-h-[250px] lg:min-h-0 bg-gray-200">
                    <video 
                      loop 
                      muted 
                      playsInline 
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-95" 
                      onClick={(e) => {
                        const v = e.currentTarget;
                        v.paused ? v.play() : v.pause();
                      }}
                    >
                      <source src="https://www.pexels.com/download/video/33499308/" type="video/mp4" />
                    </video>
                 </div>
                 
                 {/* Portrait Image (Now a click-to-play Video, hidden on smaller screens to match proportion exactly) */}
                 <div className="flex-[0.8] relative rounded-[2rem] overflow-hidden hidden xl:block bg-gray-200">
                    <video 
                      loop 
                      muted 
                      playsInline 
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-95" 
                      onClick={(e) => {
                        const v = e.currentTarget;
                        v.paused ? v.play() : v.pause();
                      }}
                    >
                      <source src="https://www.pexels.com/download/video/7264633/" type="video/mp4" />
                    </video>
                 </div>
              </div>

              {/* Bottom Row */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-6 items-stretch mt-2">
                 
                 {/* Stats Column */}
                 <div className="flex flex-col justify-center gap-10 flex-[1.0] pl-0 lg:pl-6 py-6 lg:py-8 items-center lg:items-start text-center lg:text-left">
                     <div>
                         <h2 className="text-[#2D2D2D] dark:text-white text-[2.75rem] font-bold font-serif leading-none tracking-tight">500K</h2>
                         <p className="text-[#2D2D2D]/90 dark:text-gray-300 text-[13px] font-bold mt-2.5 tracking-wide">Copies Sold</p>
                     </div>
                     <div>
                         <h2 className="text-[#2D2D2D] dark:text-white text-[2.75rem] font-bold font-serif leading-none tracking-tight">300K</h2>
                         <p className="text-[#2D2D2D]/90 dark:text-gray-300 text-[13px] font-bold mt-2.5 tracking-wide">Happy Customers</p>
                     </div>
                 </div>

                 {/* 3 White Cards */}
                 {WHITE_CARDS.map((card, idx) => (
                     <div key={idx} className="bg-white dark:bg-zinc-800 rounded-[2rem] p-6 md:p-10 flex flex-col justify-between flex-1 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <p className="text-[#2D2D2D]/80 dark:text-gray-300 text-[14.5px] leading-[1.8] font-medium pr-2">
                           {card.quote}
                        </p>
                        <div className="flex items-center gap-3 mt-10">
                           <img src={card.avatar} alt={card.name} className="w-[38px] h-[38px] rounded-full object-cover bg-gray-100" />
                           <div>
                              <p className="text-[#2D2D2D] dark:text-white font-bold text-[14px]">{card.name}</p>
                              <p className="text-[#2D2D2D]/60 dark:text-gray-400 text-[12px] mt-0.5">{card.location}</p>
                           </div>
                        </div>
                     </div>
                 ))}
                 
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
