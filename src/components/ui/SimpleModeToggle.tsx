"use client";

import { useSimpleMode } from "@/hooks/useSimpleMode";

export function SimpleModeToggle() {
  const { simple, toggle } = useSimpleMode();

  return (
    <button
      onClick={toggle}
      className="fixed left-4 top-16 z-[201] flex items-center gap-2 rounded-full border border-white/[0.06] bg-black/70 px-3 py-1.5 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-black/80"
      title={simple ? "Switch to full experience" : "Switch to optimized mode for better performance"}
    >
      <span className="font-[var(--font-outfit)] text-[10px] uppercase tracking-[1.5px] text-[var(--color-text-muted)]">
        Optimized mode
      </span>
      <div
        className="relative h-4 w-7 rounded-full transition-colors"
        style={{ backgroundColor: simple ? "var(--color-accent-blue)" : "rgba(255,255,255,0.1)" }}
      >
        <div
          className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform"
          style={{ transform: simple ? "translateX(12px)" : "translateX(2px)" }}
        />
      </div>
    </button>
  );
}
