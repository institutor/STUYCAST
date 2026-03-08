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
  animKey,
}: {
  text: string;
  baseDelay: number;
  className?: string;
  reduceMotion: boolean;
  animKey: number;
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
    <AnimatePresence mode="wait">
      <motion.div key={animKey} className="flex flex-wrap justify-center items-center">
        {characters.map((char, i) => (
          <div key={i} className="relative overflow-hidden">
            {/* Main character — blur in after slices clear */}
            <motion.span
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: baseDelay + i * 0.04 + 0.3, duration: 0.8, ease: "easeOut" }}
              className={`text-[clamp(56px,15vw,220px)] leading-[0.9] font-black tracking-tighter ${className}`}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {/* Top slice — sweeps left to right */}
            <motion.span
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, delay: baseDelay + i * 0.04, ease: "easeInOut" }}
              aria-hidden="true"
              className={`absolute inset-0 text-[clamp(56px,15vw,220px)] leading-[0.9] font-black tracking-tighter text-[var(--color-accent-blue)] z-10 pointer-events-none`}
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {/* Middle slice — sweeps right to left */}
            <motion.span
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "-100%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, delay: baseDelay + i * 0.04 + 0.1, ease: "easeInOut" }}
              aria-hidden="true"
              className={`absolute inset-0 text-[clamp(56px,15vw,220px)] leading-[0.9] font-black tracking-tighter text-[var(--color-text-primary)] z-10 pointer-events-none`}
              style={{ clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {/* Bottom slice — sweeps left to right */}
            <motion.span
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, delay: baseDelay + i * 0.04 + 0.2, ease: "easeInOut" }}
              aria-hidden="true"
              className={`absolute inset-0 text-[clamp(56px,15vw,220px)] leading-[0.9] font-black tracking-tighter text-[var(--color-accent-blue)] z-10 pointer-events-none`}
              style={{ clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
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
        animKey={0}
      />
      <ShutterLine
        text={line2}
        baseDelay={0.5}
        className={line2ClassName}
        reduceMotion={reduceMotion}
        animKey={0}
      />
    </div>
  );
}
