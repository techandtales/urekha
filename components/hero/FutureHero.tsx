"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import AnimatedDownloadButton from "@/components/ui/AnimatedDownloadButton";

export default function FutureHero() {
  return (
    <section className="relative w-full bg-white dark:bg-background flex flex-col justify-center overflow-hidden pt-28 pb-4 md:pb-8 font-sans transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 relative z-10 w-full max-w-[1400px]">
        {/* Left Column: Text & CTA */}
        <div className="flex-[0.95] w-full flex flex-col items-start mt-4">
          <div className="mb-4">
            <span className="text-[13px] uppercase tracking-[0.2em] font-semibold text-slate-500 dark:text-zinc-400">
              AI ASTROLOGY
            </span>
          </div>

          <h1 className="leading-[1.05] mb-6 text-slate-900 dark:text-white w-full">
            <span className="block text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-[#111111] dark:text-white">
              Guiding You <br /> Through{" "}
              <span style={{ color: "#00A859" }}>Cosmic</span> <br /> Complexity
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-[480px] leading-relaxed mb-8 font-medium">
            We simplify your life's blueprint with tailored astrological
            strategies, decoding karmic blocks and ensuring alignment for your
            ultimate life path.
          </p>

          <AnimatedDownloadButton className="mt-4" />
        </div>

        {/* Right Column: AI Person & Styled Container */}
        <div className="relative flex-[1.05] w-full flex justify-center items-center mt-12 lg:mt-0 min-h-[400px] lg:min-h-[600px] pointer-events-none">
          <div className="relative w-full max-w-[500px] aspect-[4/4.8] mx-auto flex items-end">
            {/* SOLID WHITE BACKDROP */}
            {/* Oversized by 2px to guarantee absolutely zero transparent intersection with the image edges */}
            <div className="absolute inset-[-2px] bg-white dark:bg-background z-0 pointer-events-none rounded-[2.6rem] transition-colors duration-300" />

            {/* COMPOSITE SHAPE WITH ROUNDED EDGES */}
            <div className="absolute inset-0 z-10 drop-shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-[60%] bg-[#1F4E3D] rounded-t-[2.5rem]" />

              {/* Slanted Bottom Segment with 3D Depth Shadow */}
              <div
                className="absolute bottom-0 left-0 w-full h-[60%] rounded-b-[2.5rem] origin-bottom-left overflow-hidden"
                style={{ transform: "skewY(-8deg)" }}
              >
                <div className="absolute inset-0 bg-[#1F4E3D]" />
                <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            </div>

            {/* DECORATIVE LINES */}
            <div className="absolute inset-0 z-10 flex pointer-events-none opacity-[0.10]">
              <div className="w-1/4 h-full border-r-[24px] border-white" />
              <div className="w-1/4 h-full border-r-[24px] border-white" />
              <div className="w-1/4 h-full border-r-[24px] border-white" />
            </div>

            {/* THE IMAGE */}
            {/* Inset by 1px to decouple the hardware rendering boundaries, completely bypassing browser sub-pixel edge artifacts */}
            <div className="absolute inset-[1px] z-20 mix-blend-screen pointer-events-none">
              <div className="absolute inset-0 overflow-hidden rounded-[2.4rem]">
                <Image
                  src="/ai_astrologer_mystic.png"
                  alt="AI Astrologer"
                  fill
                  className="object-cover object-top scale-[1.07]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Glitch & Sandy Reveal Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes glitch-fx {
          0%, 90% { clip-path: inset(0 0 0 0); transform: translate(0); color: #64748b; }
          91% { clip-path: inset(10% 0 60% 0); transform: translate(-2px, 1px); color: #00A859; text-shadow: -2px 0 #EAC94D; }
          93% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -1px); color: #EAC94D; text-shadow: 2px 0 #00A859; }
          95% { clip-path: inset(0 0 0 0); transform: translate(0); color: #64748b; }
          100% { clip-path: inset(0 0 0 0); transform: translate(0); color: #64748b; }
        }
        @keyframes sand-sweep {
          0%, 35% { opacity: 0; background-position: -200% center; filter: blur(0px); }
          40% { opacity: 1; filter: blur(1px) contrast(150%); }
          45% { background-position: 200% center; opacity: 1; filter: blur(0px); }
          50%, 100% { opacity: 0; background-position: 200% center; }
        }
        .glitch-text {
          position: relative;
          display: inline-block;
          animation: glitch-fx 4.5s infinite;
        }
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, #EAC94D, #F1ecd0, transparent);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          opacity: 0;
          z-index: 2;
          animation: sand-sweep 7s infinite backwards;
        }
      `,
        }}
      />
    </section>
  );
}
