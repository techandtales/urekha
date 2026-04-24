"use client";

import { Stage } from "@/lib/constants";
import { useStageStore } from "@/store/stage-store";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HeroSequenceProps {
    stage: Stage;
}

export default function HeroSequence({ stage }: HeroSequenceProps) {
    const { isTransitioning } = useStageStore();

    return (
        <div className="absolute inset-0 z-0 bg-brand-dark overflow-hidden">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={stage.imageUrl}
                        alt={stage.name}
                        fill
                        className="object-cover"
                        priority
                        quality={90}
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
