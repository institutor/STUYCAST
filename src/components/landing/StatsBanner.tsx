"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion } from "framer-motion";

const stats = [
  { number: "55", accent: "+", label: "Posts" },
  { number: "700", accent: "K+", label: "Impressions" },
  { number: "100", accent: "+", label: "Members" },
  { number: "1", accent: "", label: "Magazine" },
];

function StatItem({
  number,
  accent,
  label,
  index,
}: {
  number: string;
  accent: string;
  label: string;
  index: number;
}) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.15 });

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
        {number}
        {accent && (
          <span className="text-[var(--color-accent-blue)]">{accent}</span>
        )}
      </div>
      <div className="mt-2 font-[var(--font-outfit)] text-[13px] uppercase tracking-[2px] text-[var(--color-text-muted)]">
        {label}
      </div>
    </motion.div>
  );
}

export function StatsBanner() {
  return (
    <section className="relative z-10 border-y border-white/[0.06] bg-[var(--color-bg-primary)] px-4 py-16 sm:px-12 sm:py-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 text-center sm:gap-10 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatItem key={stat.label} {...stat} index={i} />
        ))}
      </div>
    </section>
  );
}
