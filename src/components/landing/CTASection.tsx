"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

// Each STUYCAST word — all start stacked at center, outer ones spread after delay
function WatermarkWord({
  offset,
  isVisible,
  expanded,
}: {
  offset: number;   // -2, -1, 0, 1, 2
  isVisible: boolean;
  expanded: boolean;
}) {
  const distFromCenter = Math.abs(offset);
  const isCenter = offset === 0;
  const shouldShow = isCenter ? isVisible : (isVisible && expanded);
  const expandDelay = distFromCenter * 0.12;

  // All words start at center (translateY(-50%)).
  // When expanded, each moves to offset * step away from center.
  // clamp(34px, 7vw, 125px) ≈ one line-height unit at each breakpoint.
  const yVal = shouldShow
    ? `calc(-50% + ${offset} * clamp(38px, 11.5vw, 168px))`
    : `calc(-50%)`;

  return (
    <div
      className="pointer-events-none absolute left-1/2 select-none whitespace-nowrap font-[var(--font-outfit)] font-black leading-[0.85] tracking-[-2px] text-[var(--color-accent-blue)] sm:tracking-[-4px]"
      style={{
        fontSize: "clamp(36px, 12vw, 180px)",
        top: "50%",
        transform: `translateX(-50%) translateY(${yVal})`,
        opacity: shouldShow ? Math.max(0.07, 0.20 - distFromCenter * 0.04) : 0,
        transition: [
          `opacity 0.55s ease ${isCenter ? 0 : expandDelay + 0.05}s`,
          `transform ${isCenter ? 0.5 : 1.1}s cubic-bezier(0.16, 1, 0.3, 1) ${expandDelay}s`,
        ].join(", "),
      }}
    >
      STUYCAST
    </div>
  );
}

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: visRef, isVisible } = useIntersectionObserver({ threshold: 0.25 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionY = useTransform(scrollYProgress, [0, 0.3], [120, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // After the section is visible, wait 700ms then spread the outer words
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!isVisible) {
      setExpanded(false);
      return;
    }
    const timer = setTimeout(() => setExpanded(true), 700);
    return () => clearTimeout(timer);
  }, [isVisible]);

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
        {/* Watermark: center appears first, then 4 spread out */}
        <div
          className="pointer-events-none absolute inset-0 select-none overflow-hidden"
          aria-hidden="true"
        >
          {([-2, -1, 0, 1, 2] as const).map((offset) => (
            <WatermarkWord
              key={offset}
              offset={offset}
              isVisible={isVisible}
              expanded={expanded}
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
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mb-8 mt-3 px-4 font-[var(--font-outfit)] text-[12px] font-light tracking-wider text-[var(--color-text-muted)] sm:mb-12 sm:mt-4 sm:px-0 sm:text-[16px]"
        >
          Video Production · Photography · Journalism · Business · Visual Media · Outreach
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <Link
            href="/join"
            className="group inline-flex items-center gap-3 bg-[var(--color-accent-blue)] px-8 py-3.5 min-h-[48px] font-[var(--font-outfit)] text-[12px] font-bold uppercase tracking-[3px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(59,130,246,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] sm:px-12 sm:py-5 sm:text-[14px] sm:tracking-[4px]"
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
