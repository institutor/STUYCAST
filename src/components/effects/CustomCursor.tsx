"use client";

import { useEffect, useRef } from "react";
import { useSimpleMode } from "@/hooks/useSimpleMode";

const TEXT_SELECTORS = "h1,h2,h3,h4,h5,h6,p,span,a,button,li,label,strong,em,b,i,blockquote,td,th";
const INTERACTIVE_SELECTORS = "a, button, input, textarea, select, [role='button']";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<HTMLDivElement>(null);
  const { simple } = useSimpleMode();

  useEffect(() => {
    // Skip on touch devices or simple mode
    if (window.matchMedia("(pointer: coarse)").matches || simple) {
      // Reset all cursor elements when disabling
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (morphRef.current) {
        morphRef.current.style.opacity = "0";
        morphRef.current.style.width = "0px";
        morphRef.current.style.height = "0px";
      }
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const morph = morphRef.current;
    if (!dot || !ring || !morph) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let morphX = 0;
    let morphY = 0;
    let visible = false;
    let hovering = false;
    let overText = false;
    let rafId: number;
    let isAnimating = false;
    let idleFrames = 0;

    const startAnimating = () => {
      if (isAnimating) return;
      isAnimating = true;
      idleFrames = 0;
      rafId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      idleFrames = 0;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      startAnimating();
    };

    const onMouseLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      morph.style.opacity = "0";
    };

    const isTextNode = (el: HTMLElement): boolean => {
      if (el.matches(TEXT_SELECTORS)) {
        const text = el.textContent?.trim();
        if (text && text.length > 0) return true;
      }
      return false;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Interactive check (links, buttons)
      const isInteractive = target.closest(INTERACTIVE_SELECTORS);
      if (isInteractive && !hovering) {
        hovering = true;
        ring.classList.add("cursor-ring-hover");
      } else if (!isInteractive && hovering) {
        hovering = false;
        ring.classList.remove("cursor-ring-hover");
      }

      // Text morphing check
      const isText = isTextNode(target) || !!target.closest(TEXT_SELECTORS);
      if (isText && !overText) {
        overText = true;
        morph.style.opacity = "1";
        morph.style.width = "120px";
        morph.style.height = "120px";
        dot.style.opacity = "0";
        ring.style.opacity = "0";
      } else if (!isText && overText) {
        overText = false;
        morph.style.opacity = "0";
        morph.style.width = "0px";
        morph.style.height = "0px";
        if (visible) {
          dot.style.opacity = "1";
          ring.style.opacity = "1";
        }
      }
    };

    const animate = () => {
      // Ring lerp
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      const ringSize = hovering ? 48 : 36;
      ring.style.transform = `translate(${ringX - ringSize / 2}px, ${ringY - ringSize / 2}px)`;

      // Morph circle lerp
      morphX += (mouseX - morphX) * 0.12;
      morphY += (mouseY - morphY) * 0.12;
      morph.style.transform = `translate(${morphX}px, ${morphY}px) translate(-50%, -50%)`;

      // Stop the loop once ring/morph have caught up (idle for 30+ frames ≈ 0.5s)
      const ringDist = Math.abs(mouseX - ringX) + Math.abs(mouseY - ringY);
      const morphDist = Math.abs(mouseX - morphX) + Math.abs(mouseY - morphY);
      if (ringDist < 0.5 && morphDist < 0.5) {
        idleFrames++;
        if (idleFrames > 30) {
          isAnimating = false;
          return;
        }
      } else {
        idleFrames = 0;
      }

      rafId = requestAnimationFrame(animate);
    };

    // Init hidden
    dot.style.opacity = "0";
    ring.style.opacity = "0";
    morph.style.opacity = "0";

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, [simple]);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      {/* Morphing circle — appears on text hover with inverted colors */}
      <div
        ref={morphRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          borderRadius: "50%",
          backgroundColor: "white",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transition:
            "width 0.45s cubic-bezier(0.33, 1, 0.68, 1), height 0.45s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.3s ease",
          willChange: "transform, width, height",
        }}
      />
    </>
  );
}
