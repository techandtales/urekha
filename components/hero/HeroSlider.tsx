"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./HeroSlider.module.css";
import { STAGES } from "@/lib/constants";

// --- Data Preparation ---
const REFERENCE_DATA = [
  {
    place: "RELATIONSHIP",
    title: "SYNASTRY",
    title2: "& HARMONY",
    description:
      "Deep compatibility analysis using composite charts and planetary overlays to understand relationship dynamics. Discover the cosmic connection between you and your partner.",
    image: "/slide4.png",
  },
  {
    place: "CAREER",
    title: "VOCATIONAL",
    title2: "PATH",
    description:
      "Align your career choices with your astrological strengths. Identify periods of growth, professional opportunities, and your true calling through planetary positions.",
    image: "/slide5.png",
  },
  {
    place: "TIMING",
    title: "PREDICTIVE",
    title2: "TRANSITS",
    description:
      "Navigate life's cycles with precision. Understand planetary transits to act at the most opportune moments and prepare for future challenges.",
    image: "/slide6.png",
  },
];

const UREKHA_MAPPED = STAGES.map((stage) => {
  const parts = stage.name.split(" ");
  const t1 = parts[0] || "";
  const t2 = parts.slice(1).join(" ") || "";

  return {
    place: stage.subtitle,
    title: t1,
    title2: t2,
    description: stage.description,
    image: stage.imageUrl,
  };
});

const DATA = [...UREKHA_MAPPED, ...REFERENCE_DATA];

export default function HeroSlider() {
  const [order, setOrder] = useState([0, 1, 2, 3, 4, 5]);
  const [isPaused, setIsPaused] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const isPausedRef = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeIndex = order[0];
  const activeData = DATA[activeIndex];

  // --- Responsive Config ---
  const isMobile = windowSize.width < 769;

  const layoutConfig = isMobile
    ? {
        cardWidth: 160,
        cardHeight: 220,
        gap: 30,
        numberSize: 30,
        progressWidth: 60,
        offsetTop: windowSize.height - 280,
        offsetLeft: 20,
      }
    : {
        cardWidth: 200,
        cardHeight: 300,
        gap: 40,
        numberSize: 50,
        progressWidth: 500,
        offsetTop: windowSize.height - 430,
        offsetLeft: windowSize.width - 830,
      };

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Handlers ---
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOrder((prev) => {
      const next = [...prev];
      next.push(next.shift()!);
      return next;
    });
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOrder((prev) => {
      const next = [...prev];
      next.unshift(next.pop()!);
      return next;
    });
  };

  const togglePause = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  };

  const scrollToContent = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  // --- Auto Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current && !isAnimating) {
        handleNext();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  // --- Variants ---
  const slideVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeInOut" as any },
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: { duration: 0.8, ease: "easeInOut" as any },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 100 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.4 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as any },
    },
  };

  // --- Swipe Logic ---
  const touchStartRef = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const distance = touchStartRef.current - e.changedTouches[0].clientX;
    if (distance > 50) handleNext();
    else if (distance < -50) handlePrev();
    touchStartRef.current = null;
  };

  return (
    <div
      className={styles.container}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Active Background Slide */}
      <AnimatePresence
        mode="popLayout"
        onExitComplete={() => setIsAnimating(false)}
      >
        <motion.div
          key={activeIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={styles.card}
          style={{
            backgroundImage: `url(${activeData.image})`,
            width: "100%",
            height: "100%",
            zIndex: 10,
          }}
        />
      </AnimatePresence>

      {/* Thumbnails */}
      {DATA.map((item, i) => {
        const posIndex = order.indexOf(i);
        if (posIndex === 0) return null; // Active is the background

        const x =
          layoutConfig.offsetLeft +
          (posIndex - 1) * (layoutConfig.cardWidth + layoutConfig.gap);
        const y = layoutConfig.offsetTop;

        return (
          <motion.div
            key={i}
            className={styles.card}
            initial={false}
            animate={{
              x,
              y,
              width: layoutConfig.cardWidth,
              height: layoutConfig.cardHeight,
              zIndex: 30,
              borderRadius: 10,
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] as any,
            }}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            {/* Thumbnail Content Overlay */}
            <motion.div
              className={styles.cardContent}
              animate={{ opacity: 1, y: layoutConfig.cardHeight - 100 }}
            >
              <div className={styles.contentStart}></div>
              <div className={styles.contentPlace}>{item.place}</div>
              <div className={styles.contentTitle1}>{item.title}</div>
              <div className={styles.contentTitle2}>{item.title2}</div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Details Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className={styles.details}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            top: isMobile ? "15%" : "240px",
            left: layoutConfig.offsetLeft < 60 ? "20px" : "60px",
            opacity: 1,
          }}
        >
          <motion.div variants={itemVariants} className={styles.placeBox}>
            <div className={`${styles.placeText} text`}>{activeData.place}</div>
          </motion.div>
          <motion.div variants={itemVariants} className={styles.titleBox1}>
            <div className={`${styles.title1} title-1`}>{activeData.title}</div>
          </motion.div>
          <motion.div variants={itemVariants} className={styles.titleBox2}>
            <div className={`${styles.title2} title-2`}>
              {activeData.title2}
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className={styles.desc}>
            {activeData.description}
          </motion.div>
          <motion.div variants={itemVariants} className={styles.cta}>
            <button className={styles.bookmark}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className={styles.discover} onClick={scrollToContent}>
              Discover More
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      <motion.div
        className={styles.pagination}
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: 1,
          y: 0,
          top: isMobile
            ? layoutConfig.offsetTop + 230
            : layoutConfig.offsetTop + 330,
          left: layoutConfig.offsetLeft,
        }}
      >
        {!isMobile && (
          <>
            <div className={`${styles.arrow} arrowLeft`} onClick={handlePrev}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </div>
            <div className={`${styles.arrow} arrowRight`} onClick={handleNext}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </>
        )}
        <div className={styles.progressSubContainer}>
          <div className={styles.progressSubBackground}>
            <motion.div
              className={styles.progressSubForeground}
              animate={{
                width:
                  layoutConfig.progressWidth *
                  (1 / order.length) *
                  (activeIndex + 1),
              }}
            />
          </div>
        </div>
        <div className={styles.slideNumbers}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={styles.slideNumberItem}
            >
              {activeIndex + 1}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Entrance Cover */}
      <motion.div
        className={styles.cover}
        initial={{ x: 0 }}
        animate={{ x: "100%", display: "none" }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" as any }}
      />
    </div>
  );
}
