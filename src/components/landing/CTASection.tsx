"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

function SpreadingWord({
  index,
  centerIndex,
  isVisible,
  spreadProgress,
}: {
  index: number;
  centerIndex: number;
  isVisible: boolean;
  spreadProgress: number;
}) {
  const offset = index - centerIndex; // -2, -1, 0, 1, 2
  const distFromCenter = Math.abs(offset);
  const delay = distFromCenter * 0.06;

  // Spread vertically from center — each row moves proportional to its distance
  const spreadY = offset * spreadProgress * 28;
  // Slight horizontal drift for non-center rows
  const spreadX = offset * spreadProgress * 8;
  // Rows further from center get slightly more transparent
  const baseOpacity = 0.12 - distFromCenter * 0.015;
  // Scale rows slightly as they spread
  const scale = 1 + spreadProgress * distFromCenter * 0.02;

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.3, y: 0 }}
      animate={
        isVisible
          ? { opacity: baseOpacity, scaleX: 1 }
          : {}
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="whitespace-nowrap font-[var(--font-outfit)] font-black leading-[0.85] tracking-[-2px] text-[var(--color-accent-blue)] sm:tracking-[-4px]"
      style={{
        fontSize: "clamp(36px, 12vw, 180px)",
        transform: `translateY(${spreadY}px) translateX(${spreadX}px) scale(${scale})`,
        transition: "transform 0.1s linear",
      }}
    >
      STUYCAST
    </motion.div>
  );
}

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: visRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Slide-in uses a separate scroll range
  const sectionY = useTransform(scrollYProgress, [0, 0.3], [120, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Spread progress: 0 at section entry → 1 at section exit
  const [spread, setSpread] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Start spreading once section is ~40% scrolled in, reach max at 80%
    const progress = Math.max(0, Math.min(1, (v - 0.3) / 0.5));
    setSpread(progress);
  });

  const centerIndex = 2;

  return (
    <motion.section
      ref={sectionRef}
      style={{ y: sectionY, opacity: sectionOpacity }}
      className="relative z-10 min-h-[60vh] overflow-hidden bg-[var(--color-bg-primary)] sm:min-h-[80vh]"
    >
      <div
        ref={visRef}
        className="relative flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[80vh] sm:px-12 sm:py-28"
      >
        {/* Expanding STUYCAST watermark wall */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <SpreadingWord
              key={i}
              index={i}
              centerIndex={centerIndex}
              isVisible={isVisible}
              spreadProgress={spread}
            />
          ))}
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 font-[var(--font-outfit)] font-black leading-none tracking-[-2px] sm:tracking-[-3px]"
          style={{ fontSize: "clamp(36px, 8vw, 120px)" }}
        >
          join{" "}
          <span className="text-[var(--color-accent-blue)]">the cast.</span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-10 mb-8 mt-3 px-4 font-[var(--font-outfit)] text-[12px] font-light tracking-wider text-[var(--color-text-muted)] sm:mb-12 sm:mt-4 sm:px-0 sm:text-[16px]"
        >
          Photography · Videography · Writing · Design · Business · Media
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-10"
        >
          <Link
            href="/join"
            className="group inline-flex items-center gap-3 bg-[var(--color-accent-blue)] px-8 py-4 font-[var(--font-outfit)] text-[12px] font-bold uppercase tracking-[3px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(59,130,246,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] sm:px-12 sm:py-5 sm:text-[14px] sm:tracking-[4px]"
          >
            Join StuyCast
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
