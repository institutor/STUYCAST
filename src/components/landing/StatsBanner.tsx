"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface StatConfig {
  /** Raw numeric target (e.g. 1000000 for 1M) */
  value: number;
  /** Format function: raw number → display string */
  format: (n: number) => { number: string; accent: string };
  label: string;
}

function formatCompact(n: number): { number: string; accent: string } {
  if (n >= 1_000_000) return { number: String(Math.round(n / 1_000_000)), accent: "M+" };
  if (n >= 1_000) return { number: String(Math.round(n / 1_000)), accent: "K+" };
  return { number: String(Math.round(n)), accent: "+" };
}

const stats: StatConfig[] = [
  { value: 55, format: (n) => ({ number: String(Math.round(n)), accent: "+" }), label: "Posts" },
  { value: 1_000_000, format: formatCompact, label: "Impressions" },
  { value: 100, format: (n) => ({ number: String(Math.round(n)), accent: "+" }), label: "Members" },
  { value: 1, format: (n) => ({ number: String(Math.round(n)), accent: "" }), label: "Magazine" },
];

function StatItem({
  stat,
  index,
}: {
  stat: StatConfig;
  index: number;
}) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.15 });
  const [display, setDisplay] = useState(stat.format(0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(stat.format(stat.value));
      return;
    }

    const duration = 2000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(stat.format(eased * stat.value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, stat]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="text-center"
    >
      <div className="font-[var(--font-outfit)] text-[clamp(36px,8vw,72px)] font-black leading-none">
        {display.number}
        {display.accent && (
          <span className="text-[var(--color-accent-blue)]">{display.accent}</span>
        )}
      </div>
      <div className="mt-2 font-[var(--font-outfit)] text-[13px] uppercase tracking-[2px] text-[var(--color-text-muted)]">
        {stat.label}
      </div>
    </motion.div>
  );
}

export function StatsBanner() {
  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-[var(--color-bg-primary)] px-4 py-16 sm:px-12 sm:py-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 text-center sm:gap-10 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}
