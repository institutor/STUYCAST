"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

// ── Context ──────────────────────────────────────────────────────────
interface PageTransitionContextValue {
  transition: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  transition: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);

// ── Provider ─────────────────────────────────────────────────────────
export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const solidRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const progressRef = useRef({ value: 0 });

  const transition = useCallback(
    (href: string) => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      const overlay = overlayRef.current;
      const glass = glassRef.current;
      const solid = solidRef.current;
      if (!overlay || !glass || !solid) {
        router.push(href);
        setIsTransitioning(false);
        return;
      }

      // Reset state
      overlay.style.visibility = "visible";
      overlay.style.pointerEvents = "all";
      progressRef.current.value = 0;
      glass.style.clipPath = "circle(0% at 50% 50%)";
      solid.style.clipPath = "circle(0% at 50% 50%)";
      solid.style.opacity = "0";

      // Phase 1: Glass circle expands — translucent, refractive look over old page
      gsap.to(progressRef.current, {
        value: 1,
        duration: 0.7,
        ease: "power2.inOut",
        onUpdate: () => {
          const p = progressRef.current.value;
          const r = p * 150;
          glass.style.clipPath = `circle(${r}% at 50% 50%)`;

          // Solid layer trails behind the glass edge, growing to cover
          const solidR = Math.max(0, (p - 0.3) / 0.7) * 150;
          solid.style.clipPath = `circle(${solidR}% at 50% 50%)`;
          // Solid fades in as glass expands
          solid.style.opacity = `${Math.min(1, p * 1.5)}`;
        },
        onComplete: () => {
          // Fully covered — navigate
          router.push(href);

          // Phase 2: Hold, then fade out the solid overlay to reveal new page
          setTimeout(() => {
            // Remove backdrop-filter during fade-out to reduce GPU load
            glass.style.backdropFilter = "none";
            (glass.style as unknown as Record<string, string>).webkitBackdropFilter = "none";
            gsap.to(solid, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
            });
            gsap.to(glass, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                overlay.style.visibility = "hidden";
                overlay.style.pointerEvents = "none";
                glass.style.opacity = "1";
                solid.style.opacity = "0";
                glass.style.clipPath = "circle(0% at 50% 50%)";
                solid.style.clipPath = "circle(0% at 50% 50%)";
                glass.style.backdropFilter = "blur(8px) saturate(1.2) brightness(0.6)";
                (glass.style as unknown as Record<string, string>).webkitBackdropFilter = "blur(8px) saturate(1.2) brightness(0.6)";
                setIsTransitioning(false);
              },
            });
          }, 400);
        },
      });
    },
    [isTransitioning, router]
  );

  return (
    <PageTransitionContext.Provider value={{ transition, isTransitioning }}>
      {children}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {/* Glass layer — frosted translucent with backdrop blur, expands first */}
        <div
          ref={glassRef}
          className="absolute inset-0"
          style={{
            clipPath: "circle(0% at 50% 50%)",
            backdropFilter: "blur(8px) saturate(1.2) brightness(0.6)",
            WebkitBackdropFilter: "blur(8px) saturate(1.2) brightness(0.6)",
            background:
              "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08) 0%, rgba(10,10,20,0.45) 40%, rgba(10,10,20,0.6) 100%)",
            boxShadow: "inset 0 0 120px 40px rgba(59,130,246,0.04)",
          }}
        />
        {/* Solid layer — fully opaque, trails behind glass to ensure full coverage */}
        <div
          ref={solidRef}
          className="absolute inset-0 bg-[var(--color-bg-primary)]"
          style={{
            clipPath: "circle(0% at 50% 50%)",
            opacity: 0,
          }}
        />
      </div>
    </PageTransitionContext.Provider>
  );
}
