"use client";

import { useState, useEffect } from "react";

const DISMISSED_KEY = "stuycast-hw-accel-dismissed";

export function HardwareAccelDisclaimer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop (pointer devices)
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    // Don't show again if already dismissed
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      // sessionStorage unavailable — show anyway
    }

    setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] flex items-center justify-between gap-3 border-t border-white/[0.06] bg-black/90 px-4 py-3 backdrop-blur-sm">
      <p className="font-[var(--font-outfit)] text-[11px] leading-relaxed tracking-[0.5px] text-[var(--color-text-muted)]">
        Experiencing lag? Try enabling{" "}
        <span className="text-[var(--color-text-secondary)]">
          graphics acceleration
        </span>{" "}
        in your browser&apos;s settings
      </p>
      <button
        onClick={dismiss}
        className="shrink-0 font-[var(--font-outfit)] text-[11px] uppercase tracking-[2px] text-[var(--color-accent-blue)] transition-opacity hover:opacity-70"
      >
        Got it
      </button>
    </div>
  );
}
