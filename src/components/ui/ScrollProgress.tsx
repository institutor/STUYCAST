"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!barRef.current) return;
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const progress = scrollTop / (scrollHeight - clientHeight);
      barRef.current.style.transform = `scaleX(${Math.min(progress, 1)})`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[60]">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-blue-500 to-violet-500"
        style={{ transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
}
