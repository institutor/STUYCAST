"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { navLinks } from "@/data/navigation";

export function KineticNavigation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Build the open timeline ONCE on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const navWrap = el.querySelector<HTMLElement>(".nav-overlay-wrapper");
    const menu = el.querySelector<HTMLElement>(".menu-content");
    const overlay = el.querySelector<HTMLElement>(".overlay");
    const bgPanels = el.querySelectorAll<HTMLElement>(".backdrop-layer");
    const menuLinks = el.querySelectorAll<HTMLElement>(".nav-link");
    const fadeTargets = el.querySelectorAll<HTMLElement>("[data-menu-fade]");
    const edgeGlow = el.querySelector<HTMLElement>(".menu-edge-glow");
    const menuButtonTexts = el.querySelectorAll<HTMLElement>(".nav-close-btn p");
    const menuButtonIcon = el.querySelector<HTMLElement>(".menu-button-icon");

    if (!navWrap || !menu || !overlay) return;

    // Set initial hidden state
    gsap.set(navWrap, { display: "none" });
    gsap.set(overlay, { autoAlpha: 0 });
    // menu stays at xPercent: 0 — backdrop layers create the slide-in effect
    gsap.set(bgPanels, { xPercent: 101 });
    gsap.set(menuLinks, { yPercent: 140, rotate: 10 });
    if (fadeTargets.length) gsap.set(fadeTargets, { autoAlpha: 0, yPercent: 20 });
    if (edgeGlow) gsap.set(edgeGlow, { scaleY: 0 });

    // Build a PAUSED timeline — we'll play/reverse it manually
    const tl = gsap.timeline({ paused: true });

    tl.set(navWrap, { display: "block" })
      .to(overlay, { autoAlpha: 1, duration: 0.5, ease: "power2.out" })
      .to(bgPanels, { xPercent: 0, stagger: 0.12, duration: 0.575, ease: "power2.out" }, "<")
      .to(menuButtonTexts, { yPercent: -100, stagger: 0.2, duration: 0.5, ease: "power2.out" }, "<")
      .to(menuButtonIcon, { rotate: 315, duration: 0.5, ease: "power2.out" }, "<")
      .to(menuLinks, { yPercent: 0, rotate: 0, stagger: 0.05, duration: 0.5, ease: "power2.out" }, "<+=0.25");

    if (fadeTargets.length) {
      tl.to(fadeTargets, { autoAlpha: 1, yPercent: 0, stagger: 0.04, duration: 0.4 }, "<+=0.1");
    }

    if (edgeGlow) {
      tl.to(edgeGlow, { scaleY: 1, duration: 0.6, ease: "power2.out", transformOrigin: "top center" }, "<-=0.3");
    }

    // When reverse completes, hide the wrapper
    tl.eventCallback("onReverseComplete", () => {
      gsap.set(navWrap, { display: "none" });
    });

    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  // Play / reverse when state changes
  useEffect(() => {
    if (!tlRef.current) return;
    if (isMenuOpen) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
  }, [isMenuOpen]);

  // Hover effects for background shapes
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const menuItems = el.querySelectorAll(".menu-list-item[data-shape]");
    const shapesContainer = el.querySelector(".ambient-background-shapes");

    const cleanups: (() => void)[] = [];

    menuItems.forEach((item) => {
      const shapeIndex = item.getAttribute("data-shape");
      const shape = shapesContainer?.querySelector(`.bg-shape-${shapeIndex}`);
      if (!shape) return;

      const shapeEls = shape.querySelectorAll(".shape-element");

      const onEnter = () => {
        shapesContainer?.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
        shape.classList.add("active");
        gsap.fromTo(
          shapeEls,
          { scale: 0.5, opacity: 0, rotation: -10 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
        );
      };

      const onLeave = () => {
        gsap.to(shapeEls, {
          scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
          onComplete: () => shape.classList.remove("active"),
          overwrite: "auto",
        });
      };

      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        item.removeEventListener("mouseenter", onEnter);
        item.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <div ref={containerRef}>
      {/* Header bar */}
      <div className="site-header-wrapper">
        <header className="header">
          <div className="container is--full">
            <nav className="nav-row">
              <Link href="/" aria-label="home" className="nav-logo-row w-inline-block">
                <div className="flex items-center gap-2 group">
                  <Image
                    src="/logo.png"
                    alt="StuyCast"
                    width={40}
                    height={40}
                    className="rounded-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="text-xl font-bold text-white tracking-tight">
                    Stuy<span className="text-blue-400">Cast</span>
                  </span>
                </div>
              </Link>

              <div className="nav-row__right">
                <button className="nav-close-btn" onClick={toggleMenu} style={{ pointerEvents: "auto" }}>
                  <div className="menu-button-text">
                    <p className="p-large">Menu</p>
                    <p className="p-large">Close</p>
                  </div>
                  <div className="icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none" className="menu-button-icon">
                      <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor" />
                      <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
                      <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor" />
                      <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor" />
                      <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor" />
                      <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor" />
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      {/* Slide-out menu */}
      <section className="fullscreen-menu-container">
        <div className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content">
            {/* Glowing left edge */}
            <div className="menu-edge-glow" />

            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(59,130,246,0.15)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(99,102,241,0.12)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(14,165,233,0.1)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(59,130,246,0.15)" />
                </svg>
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(99,102,241,0.2)" strokeWidth="60" fill="none" />
                  <path className="shape-element" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(139,92,246,0.15)" strokeWidth="40" fill="none" />
                </svg>
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(59,130,246,0.3)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(99,102,241,0.3)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(14,165,233,0.3)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(59,130,246,0.3)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(99,102,241,0.25)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(14,165,233,0.25)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(59,130,246,0.25)" />
                  <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(14,165,233,0.3)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(59,130,246,0.3)" />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(99,102,241,0.3)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(14,165,233,0.3)" />
                  <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(59,130,246,0.3)" />
                  <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(99,102,241,0.3)" />
                  <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(14,165,233,0.3)" />
                </svg>
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(59,130,246,0.12)" />
                  <path className="shape-element" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(14,165,233,0.1)" />
                </svg>
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(59,130,246,0.15)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(99,102,241,0.12)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(14,165,233,0.1)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              {/* Top: close hint */}
              <div className="menu-header" data-menu-fade>
                <span className="menu-header-label">Navigation</span>
                <button className="menu-header-close" onClick={closeMenu} aria-label="Close menu">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Main nav links — spread to fill space */}
              <ul className="menu-list">
                {navLinks.map((link, index) => (
                  <li key={link.href} className="menu-list-item" data-shape={String((index % 5) + 1)}>
                    <Link href={link.href} className="nav-link w-inline-block" onClick={closeMenu}>
                      <span className="nav-link-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="nav-link-text">{link.label}</span>
                      <span className="nav-link-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                      <div className="nav-link-hover-bg"></div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Bottom: branding footer */}
              <div className="menu-footer" data-menu-fade>
                <div className="menu-footer-line" />
                <div className="menu-footer-row">
                  <span className="menu-footer-brand">StuyCast</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
