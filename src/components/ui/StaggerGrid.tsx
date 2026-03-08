"use client";

import { Children } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerGrid({ children, className }: StaggerGridProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn(className, isVisible && "stagger-grid-visible")}
    >
      {Children.map(children, (child, i) => (
        <div
          className="stagger-grid-item"
          style={{ "--stagger-index": i } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
