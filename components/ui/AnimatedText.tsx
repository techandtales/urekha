"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const AnimatedText = ({
  text,
  className = "",
  textClassName = "",
}: {
  text: string;
  className?: string;
  textClassName?: string;
}) => {
  return (
    <span
      className={`relative overflow-hidden inline-block leading-[1.4] ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          className={`inline-block ${textClassName}`}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
