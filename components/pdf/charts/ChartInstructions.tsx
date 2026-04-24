"use client";
import React from "react";
import { UREKHA_COLORS } from "@/lib/font/colors";
import { Layers, Moon, Sun, Info, Compass, Map } from "lucide-react";
import PdfPageLayout from "../pageLayout";
import FloralHeader from "../floralHeader";
import PdfInfoCard from "../ui/PdfInfoCard";
import { useStore } from "@/lib/store";

interface ChartInstructionsProps {
  lang: string;
}

const ChartInstructions: React.FC<ChartInstructionsProps> = ({ lang }) => {
  const { birthDetails } = useStore();
  const isHindi = lang === "hi";

  const t = {
    titleEn: "Understanding Your Charts",
    titleHi: "आपकी कुंडलियों का विश्लेषण",
    intro: isHindi
      ? "वैदिक ज्योतिष में जीवन के विभिन्न पहलुओं को समझने के लिए अलग-अलग कुंडलियों का उपयोग किया जाता है। यहाँ तीन प्रमुख चार्ट दिए गए हैं:"
      : "In Vedic Astrology, multiple charts are used to decode different dimensions of life. Here is a guide to the three most critical charts used in this report:",

    d1Title: isHindi
      ? "1. लग्न कुंडली (D1 Chart)"
      : "1. Lagna Chart (D1) - The Physical Body",
    d1Desc: isHindi
      ? "यह आपकी मुख्य कुंडली है। यह आपके शरीर, व्यक्तित्व, स्वास्थ्य और जीवन की सामान्य दिशा को दर्शाती है। सभी भविष्यवाणियों का आधार यही चार्ट है।"
      : "This is your primary Birth Chart. It represents your physical self, personality, health, and the general roadmap of your destiny. It is the foundation of all predictions.",

    moonTitle: isHindi
      ? "2. चंद्र कुंडली (Moon Chart)"
      : "2. Moon Chart (Chandra) - The Mind",
    moonDesc: isHindi
      ? "यह चार्ट आपके मन, भावनाओं और मानसिक शांति का प्रतिनिधित्व करता है। यह बताता है कि आप दुनिया को कैसे महसूस करते हैं और भावनात्मक रूप से कैसे प्रतिक्रिया देते हैं।"
      : "Calculated from the position of the Moon, this chart governs your mind, emotions, and perceptions. It reveals how you react emotionally to life's events.",

    d9Title: isHindi
      ? "3. नवमांश कुंडली (D9 Chart)"
      : "3. Navamsa Chart (D9) - The Inner Strength",
    d9Desc: isHindi
      ? "यह ग्रहों की वास्तविक शक्ति को मापता है। यह विशेष रूप से विवाह, धर्म और जीवन के उत्तरार्ध (35 वर्ष के बाद) के लिए महत्वपूर्ण है। इसे 'भाग्य चक्र' भी कहा जाता है।"
      : "The D9 chart acts as a microscope for the D1 chart. It reveals the true strength of planets, marital happiness, and spiritual growth. It is crucial for analyzing life after 35.",
  };

  return (
    <PdfPageLayout lang={lang as "en" | "hi"}>
      <FloralHeader
        titleEn="Chart Guide"
        titleHi="चार्ट गाइड"
        lang={lang as "en" | "hi"}
      />

      <div className="w-full px-12 pt-4 flex flex-col gap-8">
        {/* Intro Section */}
        <div className="text-center mb-4">
          <h2
            className={`text-2xl font-bold text-zinc-800 mb-2 ${isHindi ? "font-serif" : "font-serif"}`}
          >
            {t.titleEn}
          </h2>
          <p className="text-zinc-600 italic text-lg leading-relaxed max-w-2xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* 1. D1 - Lagna */}
        <div className="flex gap-6 items-start">
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 shrink-0">
            <Sun size={32} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-zinc-900 mb-2">
              {t.d1Title}
            </h3>
            <p className="text-zinc-700 leading-relaxed text-justify border-l-2 border-orange-200 pl-4 py-1">
              {t.d1Desc}
            </p>
          </div>
        </div>

        {/* 2. Moon - Chandra */}
        <div className="flex gap-6 items-start">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 shrink-0">
            <Moon size={32} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-zinc-900 mb-2">
              {t.moonTitle}
            </h3>
            <p className="text-zinc-700 leading-relaxed text-justify border-l-2 border-blue-200 pl-4 py-1">
              {t.moonDesc}
            </p>
          </div>
        </div>

        {/* 3. D9 - Navamsa */}
        <div className="flex gap-6 items-start">
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 shrink-0">
            <Compass size={32} className="text-purple-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-zinc-900 mb-2">
              {t.d9Title}
            </h3>
            <p className="text-zinc-700 leading-relaxed text-justify border-l-2 border-purple-200 pl-4 py-1">
              {t.d9Desc}
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center gap-4">
          <Info className="text-zinc-400 shrink-0" />
          <p className="text-sm text-zinc-500 italic">
            {isHindi
              ? "नोट: सटीक भविष्यवाणी के लिए ज्योतिषी इन तीनों चार्टों का एक साथ विश्लेषण करते हैं।"
              : "Note: Astrologers synthesize all three charts to provide an accurate and holistic prediction."}
          </p>
        </div>
      </div>
    </PdfPageLayout>
  );
};

export default ChartInstructions;
