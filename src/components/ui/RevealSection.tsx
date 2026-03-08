"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function RevealSection({ children, className }: RevealSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-section",
        isVisible && "reveal-section-visible",
        className
      )}
    >
      {children}
    </div>
  );
}
