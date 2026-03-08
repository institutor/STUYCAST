"use client";

import { useState, useEffect } from "react";

export function MobileDisclaimer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] flex items-center justify-between gap-3 border-t border-white/[0.06] bg-black/90 px-4 py-3 backdrop-blur-md sm:hidden">
      <p className="font-[var(--font-outfit)] text-[11px] tracking-[1px] text-[var(--color-text-muted)]">
        For the best experience, visit on desktop
      </p>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 font-[var(--font-outfit)] text-[11px] uppercase tracking-[2px] text-[var(--color-accent-blue)] transition-opacity hover:opacity-70"
      >
        Got it
      </button>
    </div>
  );
}
