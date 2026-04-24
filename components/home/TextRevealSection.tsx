"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./TextRevealSection.module.css";
import Link from "next/link"; // If needed for links inside span
import { motion } from "framer-motion";

const TEXT_ITEMS = [
  { text: "UREKHA", hoverText: "THE FUTURE" },
  { text: "INTELLIGENCE", hoverText: "AI POWERED" },
  { text: "COSMIC", hoverText: "LIMITLESS" },
  { text: "WISDOM", hoverText: "ANCIENT" },
  { text: "YOUR DESTINY", hoverText: "UNLOCKED" },
];

export default function TextRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 100); // 100ms debounce
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={cn(styles.section, isScrolling && styles.isScrolling)}
    >
      <div className="w-full">
        {TEXT_ITEMS.map((item, index) => (
          <div key={index} className={cn(styles.textContainer, "font-sans")}>
            {/* Base Text (Dark Grey) */}
            <div className={styles.bgText}>{item.text}</div>

            {/* Foreground Text (Gold Gradient) - Animated via Framer Motion */}
            <motion.div
              initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: false, margin: "-10%" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(styles.fgText)}
            >
              {item.text}
            </motion.div>

            {/* Hover Overlay Layer */}
            <span className={styles.hoverSpan}>
              {item.hoverText || item.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-12 w-full flex justify-end">
        <Link
          href="/reports"
          className="text-brand-gold text-lg font-bold tracking-widest uppercase hover:underline"
        >
          Explore Reports &rarr;
        </Link>
      </div>
    </section>
  );
}
