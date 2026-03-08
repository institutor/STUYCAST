"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroShutterTitleProps {
  line1?: string;
  line2?: string;
  line2ClassName?: string;
  className?: string;
}

function ShutterLine({
  text,
  baseDelay,
  className,
  reduceMotion,
}: {
  text: string;
  baseDelay: number;
  className?: string;
  reduceMotion: boolean;
}) {
  const characters = text.split("");

  if (reduceMotion) {
    return (
      <div className="flex flex-wrap justify-center items-center">
        <span className={`text-[clamp(56px,15vw,220px)] leading-[0.9] font-black tracking-tighter ${className}`}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center items-center">
      <AnimatePresence>
        {characters.map((char, i) => (
          <div key={i} className="relative overflow-hidden">
            <motion.span
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: baseDelay + i * 0.04 + 0.3, duration: 0.8 }}
              className={`text-[clamp(56px,15vw,220px)] leading-[0.9] font-black tracking-tighter ${className}`}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {/* Single sweep overlay instead of 3 slices — saves 2 motion.span per char */}
            <motion.span
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 0] }}
              transition={{
                duration: 0.7,
                delay: baseDelay + i * 0.04,
                ease: "easeInOut",
              }}
              aria-hidden="true"
              className="absolute inset-0 text-[clamp(56px,15vw,220px)] leading-[0.9] font-black tracking-tighter text-[var(--color-accent-blue)] z-10 pointer-events-none"
            >
              {char}
            </motion.span>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function HeroShutterTitle({
  line1 = "STUY",
  line2 = "CAST",
  line2ClassName = "text-[var(--color-accent-blue)]",
  className,
}: HeroShutterTitleProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  return (
    <div className={`relative z-10 font-[var(--font-outfit)] ${className ?? ""}`}>
      <ShutterLine
        text={line1}
        baseDelay={0.2}
        className="text-[var(--color-text-primary)]"
        reduceMotion={reduceMotion}
      />
      <ShutterLine
        text={line2}
        baseDelay={0.5}
        className={line2ClassName}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}
