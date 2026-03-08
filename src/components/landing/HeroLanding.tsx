"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroShutterTitle } from "@/components/ui/hero-shutter-title";

export function HeroLanding() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const taglineY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const taglineOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "60vw",
            height: "60vw",
            maxWidth: "800px",
            maxHeight: "800px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.03) 0%, rgba(99,102,241,0.015) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mb-3 px-4 text-center font-[var(--font-outfit)] text-[11px] uppercase tracking-[3px] text-[var(--color-accent-blue)] sm:mb-5 sm:px-0 sm:text-[13px] sm:tracking-[6px]"
      >
        001 / Stuyvesant&apos;s Creative Pulse
      </motion.div>

      {/* Title with shutter animation */}
      <motion.div style={{ y: titleY, opacity: titleOpacity }}>
        <HeroShutterTitle />
      </motion.div>

      {/* Tagline */}
      <motion.p
        style={{ y: taglineY, opacity: taglineOpacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 px-6 text-center font-[var(--font-outfit)] text-[12px] font-light uppercase tracking-[2px] text-[var(--color-text-muted)] sm:mt-8 sm:px-0 sm:text-[16px] sm:tracking-[3px]"
      >
        Every story · Every angle · Every moment
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-[var(--font-outfit)] text-[11px] uppercase tracking-[3px] text-[var(--color-text-muted)]">
          Scroll
        </span>
        <div className="scroll-pulse-line h-10 w-px bg-gradient-to-b from-[var(--color-accent-blue)] to-transparent" />
      </motion.div>
    </section>
  );
}
