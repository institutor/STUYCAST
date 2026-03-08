"use client";

import {
  useScroll,
  motion,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useEffect, useCallback } from "react";

export function ScrollDrivenSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Floating keyword transforms — full-width drift
  const word1X = useTransform(scrollYProgress, [0.05, 0.95], ["-10%", "70%"]);
  const word1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.45, 0.55, 0.85, 0.95], [0, 0.04, 0.10, 0.10, 0.04, 0]);
  const word2X = useTransform(scrollYProgress, [0.08, 0.92], ["110%", "20%"]);
  const word2Opacity = useTransform(scrollYProgress, [0.08, 0.18, 0.42, 0.58, 0.82, 0.92], [0, 0.03, 0.08, 0.08, 0.03, 0]);
  const word3X = useTransform(scrollYProgress, [0.12, 0.88], ["5%", "60%"]);
  const word3Opacity = useTransform(scrollYProgress, [0.12, 0.22, 0.40, 0.60, 0.78, 0.88], [0, 0.05, 0.12, 0.12, 0.05, 0]);
  const word4X = useTransform(scrollYProgress, [0.15, 0.85], ["90%", "15%"]);
  const word4Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.38, 0.62, 0.75, 0.85], [0, 0.03, 0.07, 0.07, 0.03, 0]);
  const word5X = useTransform(scrollYProgress, [0.18, 0.82], ["-5%", "50%"]);
  const word5Opacity = useTransform(scrollYProgress, [0.18, 0.28, 0.42, 0.58, 0.72, 0.82], [0, 0.04, 0.09, 0.09, 0.04, 0]);

  // Text reveal transforms
  const labelOpacity = useTransform(scrollYProgress, [0.03, 0.08], [0, 1]);
  const line1Opacity = useTransform(scrollYProgress, [0.06, 0.12], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.06, 0.12], [24, 0]);
  const line2Opacity = useTransform(scrollYProgress, [0.13, 0.19], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.13, 0.19], [24, 0]);
  const line3Opacity = useTransform(scrollYProgress, [0.20, 0.26], [0, 1]);
  const line3Y = useTransform(scrollYProgress, [0.20, 0.26], [24, 0]);
  const line4Opacity = useTransform(scrollYProgress, [0.27, 0.33], [0, 1]);
  const line4Y = useTransform(scrollYProgress, [0.27, 0.33], [24, 0]);
  const subOpacity = useTransform(scrollYProgress, [0.50, 0.58], [0, 1]);
  const subY = useTransform(scrollYProgress, [0.50, 0.58], [20, 0]);

  // Scroll progress indicator
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const progressVisible = useTransform(scrollYProgress, (v) =>
    v > 0.01 && v < 0.99 ? 1 : 0
  );

  // Canvas scene opacity/scale — fade in from black
  const sceneOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.15, 0.88, 0.96],
    [0, 0, 1, 1, 0]
  );
  const sceneScale = useTransform(
    scrollYProgress,
    [0, 0.05, 0.20],
    [0.85, 0.85, 1]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  /* ── pixel-art draw routine ── */
  const drawScene = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
      const t = Date.now() / 1000;
      ctx.clearRect(0, 0, w, h);

      const px = Math.max(5, Math.floor(Math.min(w, h) / 65));
      const cols = Math.floor(w / px);
      const rows = Math.floor(h / px);

      /* ── helpers ── */
      const fill = (x: number, y: number, color: string) => {
        if (x >= 0 && y >= 0 && x < cols && y < rows) {
          ctx.fillStyle = color;
          ctx.fillRect(x * px, y * px, px - 1, px - 1);
        }
      };

      const fillRect = (
        sx: number, sy: number, rw: number, rh: number, color: string
      ) => {
        ctx.fillStyle = color;
        for (let dy = 0; dy < rh; dy++)
          for (let dx = 0; dx < rw; dx++) {
            const cx = sx + dx, cy = sy + dy;
            if (cx >= 0 && cy >= 0 && cx < cols && cy < rows)
              ctx.fillRect(cx * px, cy * px, px - 1, px - 1);
          }
      };

      const fillCircle = (
        cx: number, cy: number, r: number, color: string
      ) => {
        ctx.fillStyle = color;
        for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++)
            if (dx * dx + dy * dy <= r * r) {
              const px2 = cx + dx, py2 = cy + dy;
              if (px2 >= 0 && py2 >= 0 && px2 < cols && py2 < rows)
                ctx.fillRect(px2 * px, py2 * px, px - 1, px - 1);
            }
      };

      const fillRing = (
        cx: number, cy: number, outerR: number, innerR: number, color: string
      ) => {
        ctx.fillStyle = color;
        for (let dy = -outerR; dy <= outerR; dy++)
          for (let dx = -outerR; dx <= outerR; dx++) {
            const d = dx * dx + dy * dy;
            if (d <= outerR * outerR && d >= innerR * innerR) {
              const px2 = cx + dx, py2 = cy + dy;
              if (px2 >= 0 && py2 >= 0 && px2 < cols && py2 < rows)
                ctx.fillRect(px2 * px, py2 * px, px - 1, px - 1);
            }
          }
      };

      /* ── helper: ease a sub-range of progress ── */
      const ease = (lo: number, hi: number) =>
        Math.max(0, Math.min(1, (progress - lo) / (hi - lo)));

      /* camera grid coordinates */
      const camW = 32;
      const camH = 20;
      const camX = Math.floor(cols / 2 - camW / 2);
      const camY = Math.floor(rows / 2 - camH / 2);
      const lensX = camX + Math.floor(camW * 0.42);
      const lensY = camY + Math.floor(camH / 2);
      const lensR = Math.min(7, Math.floor(camH / 2.6));

      /* ═══════════════════════════════════════
         Phase 0 (0.05 → 0.25): dot grid fades in
         ═══════════════════════════════════════ */
      const gridAlpha = ease(0.05, 0.25);
      if (gridAlpha > 0) {
        for (let r = 0; r < rows; r += 4)
          for (let c = 0; c < cols; c += 4) {
            const flicker =
              Math.sin(t * 0.5 + c * 0.3 + r * 0.2) * 0.5 + 0.5;
            const a = (0.02 + flicker * 0.03) * gridAlpha;
            fill(c, r, `rgba(59,130,246,${a})`);
          }
      }

      /* ═══════════════════════════════════════
         Phase 1 (0.10 → 0.30): camera body draws in
         ═══════════════════════════════════════ */
      const bodyP = ease(0.10, 0.30);
      if (bodyP > 0) {
        /* outline draws clockwise — top → right → bottom → left */
        const perim = 2 * (camW + camH);
        const drawn = Math.floor(perim * bodyP);
        const outlinePixels: [number, number][] = [];
        // top edge
        for (let i = 0; i < camW; i++) outlinePixels.push([camX + i, camY]);
        // right edge
        for (let i = 1; i < camH; i++) outlinePixels.push([camX + camW - 1, camY + i]);
        // bottom edge
        for (let i = camW - 2; i >= 0; i--) outlinePixels.push([camX + i, camY + camH - 1]);
        // left edge
        for (let i = camH - 2; i >= 1; i--) outlinePixels.push([camX, camY + i]);

        for (let i = 0; i < Math.min(drawn, outlinePixels.length); i++) {
          const [ox, oy] = outlinePixels[i];
          fill(ox, oy, "#2a2a4e");
        }

        /* body fill fades in after outline is ~60% done */
        const fillP = ease(0.20, 0.30);
        if (fillP > 0) {
          for (let dy = 1; dy < camH - 1; dy++)
            for (let dx = 1; dx < camW - 1; dx++) {
              const a = fillP * 0.9;
              fill(camX + dx, camY + dy, `rgba(26,26,46,${a})`);
            }
          // highlights
          fillRect(camX, camY, camW, 1, `rgba(42,42,78,${fillP})`);
          fillRect(camX, camY, 1, camH, `rgba(42,42,78,${fillP * 0.7})`);
          // shadows
          fillRect(camX + camW - 1, camY, 1, camH, `rgba(13,13,26,${fillP})`);
          fillRect(camX, camY + camH - 1, camW, 1, `rgba(13,13,26,${fillP})`);
        }
      }

      /* ═══════════════════════════════════════
         Phase 2 (0.25 → 0.40): viewfinder + top details
         ═══════════════════════════════════════ */
      const detailsP = ease(0.25, 0.40);
      if (detailsP > 0) {
        const vfW = 8, vfH = 3;
        const vfX = camX + Math.floor(camW / 2 - vfW / 2) - 2;
        const vfY = camY - vfH;
        // viewfinder bump
        for (let dy = 0; dy < vfH; dy++)
          for (let dx = 0; dx < vfW; dx++)
            fill(vfX + dx, vfY + dy, `rgba(26,26,46,${detailsP})`);
        fillRect(vfX, vfY, vfW, 1, `rgba(42,42,78,${detailsP})`);
        // hot shoe
        fillRect(vfX + 2, vfY - 1, 4, 1, `rgba(51,51,85,${detailsP})`);
        // mode dial
        fillRect(camX + camW - 6, camY - 1, 5, 2, `rgba(68,68,102,${detailsP})`);
        fillRect(camX + camW - 5, camY - 1, 1, 1, `rgba(102,102,170,${detailsP})`);
        // shutter button
        fillRect(camX + Math.floor(camW / 2) + 4, camY - 1, 3, 1, `rgba(204,51,51,${detailsP})`);
        fillRect(camX + Math.floor(camW / 2) + 5, camY - 2, 1, 1, `rgba(220,80,80,${detailsP})`);

        // grip texture
        for (let i = 0; i < 5; i++) {
          fill(camX + 1, camY + 3 + i * 3, `rgba(34,34,68,${detailsP})`);
          fill(camX + 2, camY + 3 + i * 3, `rgba(34,34,68,${detailsP})`);
          fill(camX + 3, camY + 3 + i * 3, `rgba(34,34,68,${detailsP})`);
          fill(camX + 1, camY + 4 + i * 3, `rgba(17,17,51,${detailsP})`);
          fill(camX + 2, camY + 4 + i * 3, `rgba(17,17,51,${detailsP})`);
          fill(camX + 3, camY + 4 + i * 3, `rgba(17,17,51,${detailsP})`);
        }

        // flash unit on top-left
        fillRect(camX + 1, camY - 2, 3, 2, `rgba(60,60,90,${detailsP})`);
        fill(camX + 2, camY - 2, `rgba(180,180,220,${detailsP * 0.6})`);

        // brand text area (small rectangle on body)
        fillRect(camX + camW - 10, camY + 2, 8, 2, `rgba(20,20,40,${detailsP * 0.5})`);
      }

      /* ═══════════════════════════════════════
         Phase 3 (0.30 → 0.50): lens draws in ring by ring
         ═══════════════════════════════════════ */
      const lensP = ease(0.30, 0.50);
      if (lensP > 0) {
        // outer barrel
        if (lensP > 0.0) {
          const a = Math.min(1, lensP / 0.25);
          fillRing(lensX, lensY, lensR + 1, lensR, `rgba(40,40,70,${a})`);
        }
        // outer ring
        if (lensP > 0.2) {
          const a = Math.min(1, (lensP - 0.2) / 0.2);
          fillRing(lensX, lensY, lensR, lensR - 1, `rgba(51,51,102,${a})`);
        }
        // inner ring
        if (lensP > 0.4) {
          const a = Math.min(1, (lensP - 0.4) / 0.2);
          fillRing(lensX, lensY, lensR - 1, lensR - 2, `rgba(34,34,68,${a})`);
        }
        // glass
        if (lensP > 0.6) {
          const a = Math.min(1, (lensP - 0.6) / 0.2);
          fillCircle(lensX, lensY, lensR - 2, `rgba(10,10,32,${a})`);
        }
        // lens reflection — animated highlight
        if (lensP > 0.8) {
          const refAngle = t * 0.8 + progress * Math.PI;
          const refDx = Math.round(Math.cos(refAngle) * (lensR - 3));
          const refDy = Math.round(Math.sin(refAngle) * (lensR - 3));
          const a = 0.4 + Math.sin(t * 2) * 0.2;
          fill(lensX + refDx, lensY + refDy, `rgba(100,160,255,${a * (lensP - 0.8) * 5})`);
          // secondary reflection
          fill(lensX - refDy, lensY + refDx, `rgba(80,140,255,${a * 0.3 * (lensP - 0.8) * 5})`);
        }
        // center glow — pulses
        if (lensP > 0.9) {
          const glowA = (0.2 + Math.sin(t * 1.5) * 0.15 + progress * 0.2) * Math.min(1, (lensP - 0.9) * 10);
          fillCircle(lensX, lensY, 1, `rgba(59,130,246,${glowA})`);
        }

        // lens ring details — small notches
        if (lensP > 0.5) {
          const notchA = Math.min(1, (lensP - 0.5) * 2);
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const nx = Math.round(lensX + Math.cos(angle) * (lensR + 1));
            const ny = Math.round(lensY + Math.sin(angle) * (lensR + 1));
            fill(nx, ny, `rgba(80,80,120,${notchA * 0.6})`);
          }
        }
      }

      /* ═══════════════════════════════════════
         Phase 4 (0.40 → 0.55): film strips slide in
         ═══════════════════════════════════════ */
      const stripP = ease(0.40, 0.55);
      if (stripP > 0) {
        const stripW = 3;
        const visibleRows = Math.floor(rows * stripP);
        for (let r = 0; r < visibleRows; r++) {
          const isSprocket = r % 4 === 0;
          // left strip
          fillRect(0, r, stripW, 1, isSprocket ? `rgba(17,17,34,${stripP})` : `rgba(13,13,26,${stripP})`);
          if (isSprocket) fill(1, r, `rgba(34,34,68,${stripP})`);
          // right strip
          fillRect(cols - stripW, r, stripW, 1, isSprocket ? `rgba(17,17,34,${stripP})` : `rgba(13,13,26,${stripP})`);
          if (isSprocket) fill(cols - 2, r, `rgba(34,34,68,${stripP})`);
        }
      }

      /* ═══════════════════════════════════════
         Phase 5 (0.45 → 0.60): secondary lens (smaller, right side)
         ═══════════════════════════════════════ */
      const lens2P = ease(0.45, 0.60);
      if (lens2P > 0) {
        const l2x = camX + camW - 7;
        const l2y = camY + 5;
        const l2r = 2;
        fillRing(l2x, l2y, l2r + 1, l2r, `rgba(40,40,70,${lens2P})`);
        fillRing(l2x, l2y, l2r, l2r - 1, `rgba(51,51,102,${lens2P})`);
        fillCircle(l2x, l2y, l2r - 1, `rgba(15,15,35,${lens2P})`);

        // AF assist lamp
        const lampGlow = 0.5 + Math.sin(t * 2.5) * 0.3;
        fill(camX + camW - 4, camY + 3, `rgba(255,100,50,${lens2P * lampGlow * 0.6})`);
      }

      /* ═══════════════════════════════════════
         Phase 6 (0.50 → 0.65): floating particles appear
         ═══════════════════════════════════════ */
      const particleP = ease(0.50, 0.65);
      if (particleP > 0) {
        for (let i = 0; i < 18; i++) {
          const seed = i * 137.508;
          const fx = (Math.sin(seed + t * (0.2 + i * 0.02)) * 0.5 + 0.5) * cols;
          const fy = (Math.cos(seed * 0.7 + t * (0.15 + i * 0.01)) * 0.5 + 0.5) * rows;
          const a = (0.06 + Math.sin(t + i) * 0.05) * particleP;
          const size = i % 3 === 0 ? 2 : 1;
          if (size === 2) {
            fill(fx | 0, fy | 0, `rgba(59,130,246,${a})`);
            fill((fx | 0) + 1, fy | 0, `rgba(59,130,246,${a * 0.6})`);
            fill(fx | 0, (fy | 0) + 1, `rgba(59,130,246,${a * 0.6})`);
          } else {
            fill(fx | 0, fy | 0, `rgba(59,130,246,${a})`);
          }
        }
      }

      /* ═══════════════════════════════════════
         Phase 7 (0.55 → 0.70): scanlines + CRT vignette
         ═══════════════════════════════════════ */
      const crtP = ease(0.55, 0.70);
      if (crtP > 0) {
        // scanlines
        for (let r = 0; r < rows; r += 2) {
          ctx.fillStyle = `rgba(0,0,0,${0.06 * crtP})`;
          ctx.fillRect(0, r * px, w, 1);
        }
        // vignette corners
        const vigR = Math.max(w, h) * 0.7;
        const grad = ctx.createRadialGradient(w / 2, h / 2, vigR * 0.4, w / 2, h / 2, vigR);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, `rgba(0,0,0,${0.4 * crtP})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      /* ═══════════════════════════════════════
         Phase 8 (0.60 → 0.75): HUD elements
         ═══════════════════════════════════════ */
      const hudP = ease(0.60, 0.75);
      if (hudP > 0) {
        // REC dot — pulses
        const recBlink = Math.sin(t * 3) > 0 ? 1 : 0.3;
        ctx.fillStyle = `rgba(255,50,50,${hudP * recBlink})`;
        ctx.fillRect(6 * px, 4 * px, px - 1, px - 1);
        ctx.fillStyle = `rgba(255,50,50,${hudP * recBlink * 0.4})`;
        ctx.fillRect(7 * px, 4 * px, px - 1, px - 1);
        // REC text
        ctx.fillStyle = `rgba(255,255,255,${hudP * 0.7})`;
        ctx.font = `bold ${px * 1.4}px monospace`;
        ctx.fillText("REC", 9 * px, 5.2 * px);

        // Timecode — bottom right
        const totalFrames = Math.floor(progress * 900);
        const mm = String(Math.floor(totalFrames / 1800)).padStart(2, "0");
        const ss = String(Math.floor((totalFrames % 1800) / 30)).padStart(2, "0");
        const ff = String(totalFrames % 30).padStart(2, "0");
        ctx.fillStyle = `rgba(255,255,255,${hudP * 0.3})`;
        ctx.font = `${px * 1.1}px monospace`;
        ctx.fillText(`${mm}:${ss}:${ff}`, (cols - 14) * px, (rows - 3) * px);

        // Crosshair brackets (center)
        const chX = Math.floor(cols / 2);
        const chY = Math.floor(rows / 2);
        const chS = 3;
        const chA = hudP * 0.15;
        // top-left bracket
        fillRect(chX - lensR - chS, chY - lensR - chS, chS, 1, `rgba(255,255,255,${chA})`);
        fillRect(chX - lensR - chS, chY - lensR - chS, 1, chS, `rgba(255,255,255,${chA})`);
        // top-right bracket
        fillRect(chX + lensR + 1, chY - lensR - chS, chS, 1, `rgba(255,255,255,${chA})`);
        fillRect(chX + lensR + chS, chY - lensR - chS, 1, chS, `rgba(255,255,255,${chA})`);
        // bottom-left bracket
        fillRect(chX - lensR - chS, chY + lensR + chS, chS, 1, `rgba(255,255,255,${chA})`);
        fillRect(chX - lensR - chS, chY + lensR + 1, 1, chS, `rgba(255,255,255,${chA})`);
        // bottom-right bracket
        fillRect(chX + lensR + 1, chY + lensR + chS, chS, 1, `rgba(255,255,255,${chA})`);
        fillRect(chX + lensR + chS, chY + lensR + 1, 1, chS, `rgba(255,255,255,${chA})`);

        // ISO / aperture readout
        ctx.fillStyle = `rgba(255,255,255,${hudP * 0.2})`;
        ctx.font = `${px * 1}px monospace`;
        ctx.fillText("ISO 400", 6 * px, (rows - 3) * px);
        ctx.fillText("f/2.8", 6 * px, (rows - 1.5) * px);

        // Battery icon top-right
        const batX = cols - 8;
        fillRect(batX, 4, 5, 3, `rgba(255,255,255,${hudP * 0.15})`);
        fillRect(batX + 5, 5, 1, 1, `rgba(255,255,255,${hudP * 0.15})`);
        fillRect(batX + 1, 5, 3, 1, `rgba(100,200,100,${hudP * 0.3})`);
      }

      /* ═══════════════════════════════════════
         Phase 9 (0.70 → 0.85): lens flare burst
         ═══════════════════════════════════════ */
      const flareP = ease(0.70, 0.85);
      if (flareP > 0) {
        const flareIntensity = Math.sin(flareP * Math.PI); // peaks at 0.5
        // radial rays from lens center
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + t * 0.2;
          for (let d = lensR + 2; d < lensR + 8 + flareIntensity * 6; d++) {
            const rx = Math.round(lensX + Math.cos(angle) * d);
            const ry = Math.round(lensY + Math.sin(angle) * d);
            const falloff = 1 - (d - lensR - 2) / (8 + flareIntensity * 6);
            fill(rx, ry, `rgba(59,130,246,${flareIntensity * falloff * 0.25})`);
          }
        }
        // soft glow around lens
        fillCircle(lensX, lensY, lensR + 2, `rgba(59,130,246,${flareIntensity * 0.06})`);
      }

      /* ═══════════════════════════════════════
         Ambient: subtle camera body "breathing"
         ═══════════════════════════════════════ */
      if (bodyP >= 1) {
        const breathe = Math.sin(t * 0.8) * 0.02;
        // subtle color shift on body highlight
        fillRect(camX + 1, camY + 1, camW - 2, 1, `rgba(59,130,246,${breathe + 0.02})`);
      }
    },
    []
  );

  /* ── canvas setup + animation loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      drawScene(ctx, rect.width, rect.height, progressRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [drawScene]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-black">
        {/* Floating keywords — full viewport */}
        <div
          className="pointer-events-none absolute inset-0 z-[5] hidden select-none overflow-hidden sm:block"
          aria-hidden="true"
        >
          <motion.div style={{ x: word1X, opacity: word1Opacity }} className="absolute left-0 top-[12%] w-full whitespace-nowrap font-[var(--font-outfit)] text-[clamp(40px,10vw,140px)] font-black uppercase tracking-[-3px] text-[var(--color-accent-blue)]">CAPTURE</motion.div>
          <motion.div style={{ x: word2X, opacity: word2Opacity }} className="absolute left-0 top-[28%] w-full whitespace-nowrap font-[var(--font-outfit)] text-[clamp(36px,8vw,120px)] font-black uppercase tracking-[-2px] text-[var(--color-accent-blue)]">STORIES</motion.div>
          <motion.div style={{ x: word3X, opacity: word3Opacity }} className="absolute left-0 top-[48%] w-full whitespace-nowrap font-[var(--font-outfit)] text-[clamp(44px,12vw,160px)] font-black uppercase tracking-[-4px] text-[var(--color-accent-blue)]">CREATE</motion.div>
          <motion.div style={{ x: word4X, opacity: word4Opacity }} className="absolute left-0 top-[65%] w-full whitespace-nowrap font-[var(--font-outfit)] text-[clamp(32px,7vw,100px)] font-black uppercase tracking-[-2px] text-[var(--color-accent-blue)]">EVERY ANGLE</motion.div>
          <motion.div style={{ x: word5X, opacity: word5Opacity }} className="absolute left-0 top-[82%] w-full whitespace-nowrap font-[var(--font-outfit)] text-[clamp(38px,9vw,130px)] font-black uppercase tracking-[-3px] text-[var(--color-accent-blue)]">BROADCAST</motion.div>
        </div>

        {/* Pixel art camera — progressively assembles as you scroll */}
        <motion.div
          style={{ opacity: sceneOpacity, scale: sceneScale }}
          className="absolute inset-0 z-[1] sm:left-auto sm:right-0 sm:w-[55%]"
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full"
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>

        {/* Scroll progress indicator */}
        <motion.div
          style={{ opacity: progressVisible }}
          className="fixed left-6 top-1/2 z-[100] hidden -translate-y-1/2 sm:block"
        >
          <div className="h-[120px] w-[2px] rounded-full bg-white/[0.06]">
            <motion.div
              style={{ height: progressHeight }}
              className="w-full rounded-full bg-[var(--color-accent-blue)]"
            />
          </div>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-[var(--font-outfit)] text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)]">
            scroll
          </div>
        </motion.div>

        {/* Left text column */}
        <div className="absolute left-4 top-1/2 z-10 max-w-[85vw] -translate-y-1/2 sm:left-[8%] sm:max-w-[420px]">
          <motion.div
            style={{ opacity: labelOpacity }}
            className="mb-3 font-[var(--font-outfit)] text-[11px] uppercase tracking-[3px] text-[var(--color-accent-blue)] sm:mb-5 sm:text-[13px] sm:tracking-[6px]"
          >
            002 / What We Are
          </motion.div>

          <motion.p style={{ opacity: line1Opacity, y: line1Y }} className="font-[var(--font-outfit)] text-[clamp(18px,5vw,36px)] font-light leading-relaxed">
            we&apos;re not just a club.
          </motion.p>
          <motion.p style={{ opacity: line2Opacity, y: line2Y }} className="font-[var(--font-outfit)] text-[clamp(18px,5vw,36px)] font-light leading-relaxed">
            we&apos;re the <strong className="font-bold">lens</strong>, the{" "}
            <strong className="font-bold">voice</strong>,
          </motion.p>
          <motion.p style={{ opacity: line3Opacity, y: line3Y }} className="font-[var(--font-outfit)] text-[clamp(18px,5vw,36px)] font-light leading-relaxed">
            and the{" "}
            <em className="text-[var(--color-accent-blue)]">creative pulse</em>
          </motion.p>
          <motion.p style={{ opacity: line4Opacity, y: line4Y }} className="font-[var(--font-outfit)] text-[clamp(18px,5vw,36px)] font-light leading-relaxed">
            of Stuyvesant.
          </motion.p>

          <motion.p style={{ opacity: subOpacity, y: subY }} className="mt-4 font-[var(--font-outfit)] text-[clamp(12px,3vw,18px)] font-light leading-relaxed text-[var(--color-text-muted)] sm:mt-6">
            eight departments. twenty-six leaders.
            <br />
            <span className="text-[var(--color-accent-blue)]">
              every moving part — in perfect sync.
            </span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
