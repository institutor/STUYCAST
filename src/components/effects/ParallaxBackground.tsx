"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { StarField } from "./StarField";

// Lazy load particle canvas — only on desktop
const AnimatedBackground = dynamic(
  () => import("./AnimatedBackground").then((m) => ({ default: m.AnimatedBackground })),
  { ssr: false }
);

export function ParallaxBackground() {
  const auroraRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setIsDesktop(!isTouch);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isTouch) return;

    let rafId: number;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (auroraRef.current) {
          auroraRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        if (starsRef.current) {
          starsRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {isDesktop && (
        <div ref={auroraRef} className="fixed inset-0 z-0 will-change-transform" aria-hidden="true">
          <AnimatedBackground />
        </div>
      )}
      <div ref={starsRef} className="fixed inset-0 z-0 will-change-transform" aria-hidden="true">
        <StarField count={isDesktop ? 15 : 8} />
      </div>
    </>
  );
}
