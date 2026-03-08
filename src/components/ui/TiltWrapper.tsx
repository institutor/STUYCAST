"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface TiltWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltWrapper({ children, className }: TiltWrapperProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHover = window.matchMedia("(hover: hover)").matches;
    setEnabled(!reducedMotion && hasHover);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || !enabled) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 8;
    const rotateY = (x - 0.5) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  }, [enabled]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={enabled ? handleMouseMove : undefined}
      onMouseLeave={enabled ? handleMouseLeave : undefined}
      style={{ transition: "transform 0.15s ease-out", willChange: "transform", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
