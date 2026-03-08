"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShutterTextProps {
  text: string;
  className?: string;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Stagger between each character (seconds) */
  charStagger?: number;
}

export function ShutterText({
  text,
  className,
  delay = 0,
  charStagger = 0.03,
}: ShutterTextProps) {
  const characters = text.split("");

  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      <AnimatePresence>
        {characters.map((char, i) => (
          <span key={i} className="relative overflow-hidden inline-block">
            {/* Base character — fades in with blur */}
            <motion.span
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                delay: delay + i * charStagger + 0.2,
                duration: 0.6,
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {/* Top slice — sweeps right in accent color */}
            <motion.span
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 0] }}
              transition={{
                duration: 0.5,
                delay: delay + i * charStagger,
                ease: "easeInOut",
              }}
              aria-hidden
              className="absolute inset-0 text-blue-400 pointer-events-none"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {/* Middle slice — sweeps left in lighter color */}
            <motion.span
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "-100%", opacity: [0, 1, 0] }}
              transition={{
                duration: 0.5,
                delay: delay + i * charStagger + 0.07,
                ease: "easeInOut",
              }}
              aria-hidden
              className="absolute inset-0 text-slate-200 pointer-events-none"
              style={{
                clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>

            {/* Bottom slice — sweeps right in accent color */}
            <motion.span
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 1, 0] }}
              transition={{
                duration: 0.5,
                delay: delay + i * charStagger + 0.14,
                ease: "easeInOut",
              }}
              aria-hidden
              className="absolute inset-0 text-indigo-400 pointer-events-none"
              style={{
                clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </AnimatePresence>
    </span>
  );
}
