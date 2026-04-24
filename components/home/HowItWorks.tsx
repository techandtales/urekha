"use client";

import { motion } from "framer-motion";
import { Database, Cpu, FileBox } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Database,
    title: "Input Your Data",
    desc: "Enter your precise birth details — date, time, and location. Accuracy down to the minute unlocks deeper planetary calculations.",
    position: "top", 
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI Intelligence",
    desc: "Our engine processes 10,000+ planetary data points across 12 classical astrological systems simultaneously.",
    position: "bottom", 
  },
  {
    num: "03",
    icon: FileBox,
    title: "Receive Your Report",
    desc: "A comprehensive 100+ page intelligence report is generated — covering career, health, relationships, and finance for the next 25 years.",
    position: "top",
  },
];

export default function HowItWorks() {
  return (
    <section className="pt-16 pb-4 md:pt-20 md:pb-8 overflow-hidden bg-transparent relative font-sans">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[800px] bg-[#EAC94D]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-[95%] mx-auto max-w-[1400px] relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-10 space-y-5"
        >
          <span className="text-[13px] font-bold tracking-[0.25em] text-[#00A859] uppercase">
            The Process
          </span>
          <h2 className="text-[2.75rem] md:text-5xl font-medium text-[#2D2D2D] dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-500 text-[15px] font-medium max-w-xl mx-auto">
            From precise birth data to a comprehensive life blueprint — in three steps.
          </p>
        </motion.div>

        {/* --- DESKTOP NEURAL NETWORK LAYOUT --- */}
        {/* Rendered strictly on ONE LINE horizontally */}
        <div className="hidden lg:block relative w-full mt-6">
           
           {/* Main Horizontal Neural Pipeline */}
           <div className="absolute top-[40px] left-[15%] right-[15%] h-[2px] border-t-[2px] border-dashed border-[#00A859]/30 z-0" />
           
           {/* Animated Signal Pulse */}
           <div className="absolute top-[40px] left-[5%] right-[5%] h-[4px] -translate-y-1/2 overflow-hidden pointer-events-none z-0">
               <div className="w-[250px] h-[2px] bg-gradient-to-r from-transparent via-[#EAC94D] to-transparent relative opacity-80 blur-[1px] animate-[moveRight_5s_ease-in-out_infinite]" />
           </div>

           <div className="w-full relative z-10 flex justify-between px-4 items-start gap-8">
             {STEPS.map((step, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.7, delay: i * 0.2 }}
                   className="flex-1 flex flex-col items-center relative"
                 >
                    {/* The Central Node Bubble pinned to the line */}
                    <div className="w-[80px] h-[80px] rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center border border-[#00A859]/20 shadow-[0_10px_30px_rgba(0,168,89,0.15)] relative z-20 transition-transform duration-500 hover:scale-110 mb-10 group">
                       <div className="absolute inset-[-14px] rounded-full border border-[#00A859]/40 border-dashed animate-[spin_8s_linear_infinite]" />
                       <step.icon className="w-8 h-8 text-[#00A859]" />
                    </div>

                    {/* Connecting Short Vertical Line */}
                    <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[2px] h-[40px] bg-gradient-to-b from-[#00A859]/40 to-transparent z-10" />

                    {/* The Content Card horizontally aligned */}
                    <div className="w-full max-w-[360px] bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100/80 dark:border-zinc-800 text-center transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,168,89,0.08)] z-30">
                       <div className="inline-block bg-gradient-to-br from-[#EAC94D]/20 to-[#F1ecd0]/60 dark:from-[#EAC94D]/10 dark:to-transparent border border-[#EAC94D]/30 text-[#2D2D2D] dark:text-[#EAC94D] text-[11px] font-bold tracking-[0.2em] px-5 py-2 rounded-full mb-6">
                          STEP {step.num}
                       </div>
                       <h3 className="text-[20px] font-bold text-[#2D2D2D] dark:text-white mb-4">
                         {step.title}
                       </h3>
                       <p className="text-[14.5px] text-gray-500 dark:text-gray-400 leading-[1.8]">
                         {step.desc}
                       </p>
                    </div>
                    
                 </motion.div>
               )
             )}
           </div>
        </div>

        {/* --- MOBILE STACK LAYOUT --- */}
        <div className="flex flex-col lg:hidden gap-6 relative z-10 mt-6">
           {STEPS.map((step, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800 relative flex flex-col items-center text-center overflow-hidden"
             >
                {/* Floating background glow */}
                <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-[#EAC94D]/10 rounded-full blur-[40px] pointer-events-none" />

                <div className="w-[72px] h-[72px] rounded-full bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center border border-[#00A859]/20 mb-8 relative">
                   <div className="absolute inset-0 rounded-full bg-[#00A859]/5 animate-ping opacity-60" />
                   <step.icon className="w-7 h-7 text-[#00A859] relative z-10" />
                </div>
                
                <div className="bg-gradient-to-br from-[#EAC94D]/20 to-[#F1ecd0]/60 dark:from-[#EAC94D]/10 dark:to-transparent border border-[#EAC94D]/30 text-[#2D2D2D] dark:text-[#EAC94D] text-[11px] font-bold tracking-[0.2em] px-5 py-2 rounded-full mb-5">
                   STEP {step.num}
                </div>
                <h3 className="text-[20px] font-bold text-[#2D2D2D] dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-[14.5px] text-gray-500 dark:text-gray-400 leading-[1.8] max-w-[90%]">
                  {step.desc}
                </p>
             </motion.div>
           ))}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes moveRight {
          0% { left: -100px; opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { left: calc(100% + 100px); opacity: 0; }
        }
      `}} />
    </section>
  );
}
