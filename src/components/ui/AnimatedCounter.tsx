"use client";

import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${Math.round(n)}+`;
}

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  label: string;
  /** Use "compact" to auto-format large numbers as K+/M+ */
  format?: "compact";
}

export function AnimatedCounter({ end, duration = 2000, suffix = "", label, format }: AnimatedCounterProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.5 });
  const [display, setDisplay] = useState(() => {
    if (format === "compact") return formatCompact(0);
    return `0${suffix}`;
  });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const fmt = (n: number) => {
      if (format === "compact") return formatCompact(n);
      return `${Math.floor(n)}${suffix}`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(fmt(end));
      return;
    }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(fmt(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration, suffix, format]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-heading">
        {display}
      </div>
      <div className="text-white/60 text-sm mt-2 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
