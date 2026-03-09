"use client";

import {
  useScroll,
  useMotionValueEvent,
  motion,
  useTransform,
} from "framer-motion";
import { useRef, useEffect, useCallback } from "react";

// ── Palette ────────────────────────────────────────────────────────
const BG = "#000000";
const P = {
  bodyDk:    "#0f172a",
  body:      "#1e293b",
  bodyLt:    "#334155",
  bodyHi:    "#475569",
  lensDk:    "#1e3a5f",
  lensRing:  "#3b82f6",
  lensGlass: "#60a5fa",
  lensCore:  "#93c5fd",
  lensFlare: "#dbeafe",
  red:       "#ef4444",
  white:     "#e2e8f0",
  whiteDim:  "#94a3b8",
  blue:      "#3b82f6",
  blueDim:   "#1e3a5f",
  grip:      "#252540",
  gripLt:    "#3d3d5c",
};

// ── Seeded PRNG ────────────────────────────────────────────────────
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// ── Programmatic pixel camera builder ──────────────────────────────
// Instead of a text sprite, define the camera with shape primitives
// snapped to a pixel grid. This avoids row-length bugs entirely.

interface Pixel {
  gx: number; // grid col
  gy: number; // grid row
  color: string;
  scatterX: number;
  scatterY: number;
  delay: number;
}

function fillRect(
  pixels: Pixel[],
  gx: number, gy: number,
  w: number, h: number,
  color: string,
  rand: () => number
) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      pixels.push({
        gx: gx + dx,
        gy: gy + dy,
        color,
        scatterX: (rand() - 0.5) * 120,
        scatterY: (rand() - 0.5) * 90,
        delay: rand() * 0.55,
      });
    }
  }
}

function fillCircle(
  pixels: Pixel[],
  cx: number, cy: number,
  r: number,
  color: string,
  rand: () => number
) {
  const r2 = r * r;
  for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++) {
    for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++) {
      if (dx * dx + dy * dy <= r2) {
        pixels.push({
          gx: Math.round(cx + dx),
          gy: Math.round(cy + dy),
          color,
          scatterX: (rand() - 0.5) * 120,
          scatterY: (rand() - 0.5) * 90,
          delay: rand() * 0.55,
        });
      }
    }
  }
}

function fillRing(
  pixels: Pixel[],
  cx: number, cy: number,
  rOuter: number, rInner: number,
  color: string,
  rand: () => number
) {
  const ro2 = rOuter * rOuter;
  const ri2 = rInner * rInner;
  for (let dy = -Math.ceil(rOuter); dy <= Math.ceil(rOuter); dy++) {
    for (let dx = -Math.ceil(rOuter); dx <= Math.ceil(rOuter); dx++) {
      const d2 = dx * dx + dy * dy;
      if (d2 <= ro2 && d2 > ri2) {
        pixels.push({
          gx: Math.round(cx + dx),
          gy: Math.round(cy + dy),
          color,
          scatterX: (rand() - 0.5) * 120,
          scatterY: (rand() - 0.5) * 90,
          delay: rand() * 0.55,
        });
      }
    }
  }
}

// Grid dimensions for the camera — wider and taller for better proportions
const GRID_W = 52;
const GRID_H = 36;

let _pixelCache: Pixel[] | null = null;
function buildCamera(): Pixel[] {
  if (_pixelCache) return _pixelCache;
  const rand = mulberry32(77);
  const pixels: Pixel[] = [];

  // ── Microphone / antenna on top ──
  fillRect(pixels, 18, 0, 1, 3, P.bodyHi, rand);
  fillRect(pixels, 17, 0, 3, 1, P.bodyHi, rand);

  // ── Viewfinder housing ──
  fillRect(pixels, 14, 3, 8, 1, P.bodyLt, rand);  // top edge
  fillRect(pixels, 14, 4, 1, 4, P.bodyLt, rand);  // left wall
  fillRect(pixels, 21, 4, 1, 4, P.bodyLt, rand);  // right wall
  fillRect(pixels, 14, 8, 8, 1, P.bodyLt, rand);  // bottom edge
  fillRect(pixels, 15, 4, 6, 4, P.bodyDk, rand);  // screen
  // Screen highlight
  fillRect(pixels, 16, 5, 2, 1, P.blueDim, rand);

  // ── Viewfinder neck ──
  fillRect(pixels, 17, 9, 3, 1, P.body, rand);

  // ── Main body — outer shell ──
  fillRect(pixels, 8, 10, 32, 1, P.bodyDk, rand);  // top outline
  fillRect(pixels, 7, 11, 1, 18, P.bodyDk, rand);  // left outline
  fillRect(pixels, 40, 11, 1, 18, P.bodyDk, rand);  // right outline
  fillRect(pixels, 8, 29, 32, 1, P.bodyDk, rand);  // bottom outline

  // ── Main body — fill ──
  fillRect(pixels, 8, 11, 32, 18, P.body, rand);

  // ── Inner panel (lighter area) ──
  fillRect(pixels, 10, 12, 28, 16, P.bodyLt, rand);

  // ── Panel details / ridges ──
  fillRect(pixels, 11, 13, 26, 1, P.bodyHi, rand);  // top accent line
  fillRect(pixels, 11, 26, 26, 1, P.bodyDk, rand);  // bottom shadow line

  // ── Recording light (top-left of body) ──
  fillRect(pixels, 11, 12, 2, 1, P.red, rand);

  // ── White detail dot (top-right of body) ──
  fillRect(pixels, 35, 12, 1, 1, P.white, rand);

  // ── Tape compartment lines ──
  fillRect(pixels, 24, 15, 12, 1, P.bodyDk, rand);
  fillRect(pixels, 24, 15, 1, 8, P.bodyDk, rand);
  fillRect(pixels, 35, 15, 1, 8, P.bodyDk, rand);
  fillRect(pixels, 24, 22, 12, 1, P.bodyDk, rand);
  // Tape reels (two small circles)
  fillCircle(pixels, 28, 18, 1.5, P.bodyHi, rand);
  fillCircle(pixels, 32, 18, 1.5, P.bodyHi, rand);

  // ── Buttons row ──
  fillRect(pixels, 13, 24, 2, 2, P.bodyDk, rand);
  fillRect(pixels, 16, 24, 2, 2, P.bodyHi, rand);
  fillRect(pixels, 19, 24, 2, 2, P.bodyDk, rand);

  // ── Lens barrel ──
  // Outer barrel
  fillCircle(pixels, 3, 20, 6, P.lensDk, rand);
  // Blue ring
  fillRing(pixels, 3, 20, 5.2, 3.8, P.lensRing, rand);
  // Lens glass
  fillCircle(pixels, 3, 20, 3.5, P.lensGlass, rand);
  // Inner ring
  fillRing(pixels, 3, 20, 2.5, 1.5, P.lensDk, rand);
  // Core highlight
  fillCircle(pixels, 3, 20, 1.2, P.lensCore, rand);
  // Flare spot
  fillRect(pixels, 2, 18, 1, 1, P.lensFlare, rand);

  // ── Grip / handle (right side) ──
  fillRect(pixels, 41, 13, 3, 16, P.grip, rand);
  // Grip ridges
  for (let i = 0; i < 7; i++) {
    fillRect(pixels, 41, 14 + i * 2, 3, 1, P.gripLt, rand);
  }
  // Grip top/bottom caps
  fillRect(pixels, 41, 12, 3, 1, P.bodyDk, rand);
  fillRect(pixels, 41, 29, 3, 1, P.bodyDk, rand);

  // ── Shoulder pad / bottom detail ──
  fillRect(pixels, 12, 30, 24, 2, P.bodyDk, rand);
  fillRect(pixels, 14, 32, 20, 1, P.bodyDk, rand);

  // De-duplicate: keep only the last pixel at each grid position
  const seen = new Map<string, number>();
  for (let i = 0; i < pixels.length; i++) {
    seen.set(`${pixels[i].gx},${pixels[i].gy}`, i);
  }
  _pixelCache = Array.from(seen.values()).map(i => pixels[i]);
  return _pixelCache;
}

// ── Floating particle data ─────────────────────────────────────────
interface Particle {
  x: number; y: number; // position as fraction of canvas
  size: number;
  speed: number;
  alpha: number;
}

let _particles: Particle[] | null = null;
function getParticles(): Particle[] {
  if (_particles) return _particles;
  const rand = mulberry32(123);
  _particles = [];
  for (let i = 0; i < 30; i++) {
    _particles.push({
      x: rand(),
      y: rand(),
      size: 1 + rand() * 3,
      speed: 0.2 + rand() * 0.8,
      alpha: 0.05 + rand() * 0.15,
    });
  }
  return _particles;
}

// ── Scene draw helpers ─────────────────────────────────────────────
function drawDotGrid(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  alpha: number
) {
  const spacing = 28;
  ctx.fillStyle = `rgba(59,130,246,${alpha})`;
  for (let y = spacing; y < ch; y += spacing) {
    for (let x = spacing; x < cw; x += spacing) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function drawFilmStrip(
  ctx: CanvasRenderingContext2D,
  x: number, ch: number,
  width: number, alpha: number, progress: number
) {
  ctx.globalAlpha = alpha;
  // Film strip background
  ctx.fillStyle = P.bodyDk;
  ctx.fillRect(x, 0, width, ch);
  // Sprocket holes
  const holeSize = width * 0.35;
  const spacing = holeSize * 2.5;
  const yOffset = (progress * ch * 2) % spacing;
  ctx.fillStyle = BG;
  for (let y = -spacing + yOffset; y < ch + spacing; y += spacing) {
    const hx = x + (width - holeSize) / 2;
    ctx.fillRect(hx, y, holeSize, holeSize);
  }
  // Edge perforations
  ctx.fillStyle = P.body;
  ctx.fillRect(x, 0, 1, ch);
  ctx.fillRect(x + width - 1, 0, 1, ch);
  ctx.globalAlpha = 1;
}

function drawFloatingParticles(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  progress: number, alpha: number
) {
  const particles = getParticles();
  for (const p of particles) {
    const px = ((p.x + progress * p.speed * 0.5) % 1.2 - 0.1) * cw;
    const py = ((p.y + progress * p.speed * 0.3) % 1.2 - 0.1) * ch;
    ctx.globalAlpha = p.alpha * alpha;
    ctx.fillStyle = P.lensRing;
    ctx.fillRect(px, py, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}


function drawVignette(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  strength: number
) {
  const grad = ctx.createRadialGradient(
    cw / 2, ch / 2, Math.min(cw, ch) * 0.2,
    cw / 2, ch / 2, Math.max(cw, ch) * 0.75
  );
  grad.addColorStop(0, "transparent");
  grad.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);
}

function drawEdgeFade(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number
) {
  const fadeSize = Math.max(cw, ch) * 0.15;
  const topG = ctx.createLinearGradient(0, 0, 0, fadeSize);
  topG.addColorStop(0, BG); topG.addColorStop(1, "transparent");
  ctx.fillStyle = topG; ctx.fillRect(0, 0, cw, fadeSize);
  const botG = ctx.createLinearGradient(0, ch - fadeSize, 0, ch);
  botG.addColorStop(0, "transparent"); botG.addColorStop(1, BG);
  ctx.fillStyle = botG; ctx.fillRect(0, ch - fadeSize, cw, fadeSize);
  const leftF = fadeSize * 1.8;
  const leftG = ctx.createLinearGradient(0, 0, leftF, 0);
  leftG.addColorStop(0, BG); leftG.addColorStop(1, "transparent");
  ctx.fillStyle = leftG; ctx.fillRect(0, 0, leftF, ch);
  const rightG = ctx.createLinearGradient(cw - fadeSize, 0, cw, 0);
  rightG.addColorStop(0, "transparent"); rightG.addColorStop(1, BG);
  ctx.fillStyle = rightG; ctx.fillRect(cw - fadeSize, 0, fadeSize, ch);
}

// Cache noise textures to avoid regenerating per frame
const _noiseCache = new Map<string, HTMLCanvasElement>();

function drawNoise(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  density: number, _seed: number
) {
  // Use a single cached noise texture (seed-independent) to avoid per-frame regeneration.
  // The subtle visual difference from changing seeds is imperceptible.
  const key = `${cw}x${ch}`;
  let noiseCanvas = _noiseCache.get(key);
  if (!noiseCanvas) {
    noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = cw;
    noiseCanvas.height = ch;
    const nctx = noiseCanvas.getContext("2d")!;
    const rand = mulberry32(42);
    const step = cw < 600 ? 8 : 6;
    for (let y = 0; y < ch; y += step) {
      for (let x = 0; x < cw; x += step) {
        if (rand() < 0.35) {
          nctx.fillStyle = `rgba(226,232,240,${rand() * 0.25})`;
          nctx.fillRect(x, y, step, step);
        }
      }
    }
    _noiseCache.set(key, noiseCanvas);
  }
  ctx.globalAlpha = Math.min(density / 0.35, 1);
  ctx.drawImage(noiseCanvas, 0, 0);
  ctx.globalAlpha = 1;
}

// ── Main draw ──────────────────────────────────────────────────────
// Phases:
// 0.00–0.12  Noise + scattered pixels
// 0.12–0.50  Assembly — pixels fly into place
// 0.50–0.70  Camera formed, scene elements appear
// 0.70–1.00  Full scene — REC, film strips, glow

function drawScene(
  ctx: CanvasRenderingContext2D,
  cw: number, ch: number,
  progress: number
) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, cw, ch);

  const camera = buildCamera();

  // Scale pixel grid to fill ~55% height, maintain aspect
  const pxSize = Math.max(2, Math.floor((ch * 0.50) / GRID_H));
  const totalW = GRID_W * pxSize;
  const totalH = GRID_H * pxSize;
  const ox = (cw - totalW) / 2;
  const oy = (ch - totalH) / 2 - pxSize * 2; // slightly above center for text below

  // Lens center in canvas coords (for glow)
  const lensCX = ox + 3 * pxSize;
  const lensCY = oy + 20 * pxSize;

  // ─── Phase 1: Scatter ──────────────────────────────────────
  if (progress < 0.12) {
    const t = progress / 0.12;
    drawNoise(ctx, cw, ch, 0.35 * (1 - t * 0.4), Math.floor(progress * 500));
    drawDotGrid(ctx, cw, ch, 0.03 * t);

    for (const px of camera) {
      const sx = ox + px.gx * pxSize + px.scatterX * pxSize * 0.9;
      const sy = oy + px.gy * pxSize + px.scatterY * pxSize * 0.9;
      ctx.globalAlpha = 0.1 + t * 0.2;
      ctx.fillStyle = px.color;
      ctx.fillRect(sx, sy, pxSize, pxSize);
    }
    ctx.globalAlpha = 1;
    drawFloatingParticles(ctx, cw, ch, progress, 0.4 * t);
  }

  // ─── Phase 2: Assembly ─────────────────────────────────────
  else if (progress < 0.50) {
    const t = (progress - 0.12) / 0.38;

    drawDotGrid(ctx, cw, ch, 0.04);
    drawNoise(ctx, cw, ch, 0.06 * (1 - t), Math.floor(progress * 400));
    drawFloatingParticles(ctx, cw, ch, progress, 0.3 + t * 0.4);

    for (const px of camera) {
      const arrStart = px.delay * 0.5;
      const arrEnd = arrStart + 0.45;
      const pt = Math.max(0, Math.min(1, (t - arrStart) / (arrEnd - arrStart)));
      const ease = easeOutCubic(pt);

      const fx = ox + px.gx * pxSize;
      const fy = oy + px.gy * pxSize;
      const sx = fx + px.scatterX * pxSize * (1 - ease);
      const sy = fy + px.scatterY * pxSize * (1 - ease);

      ctx.globalAlpha = 0.3 + ease * 0.7;
      ctx.fillStyle = px.color;
      ctx.fillRect(Math.round(sx), Math.round(sy), pxSize, pxSize);
    }
    ctx.globalAlpha = 1;

    // Lens glow building
    if (t > 0.6) {
      const ga = (t - 0.6) / 0.4 * 0.3;
      const grad = ctx.createRadialGradient(lensCX, lensCY, 0, lensCX, lensCY, pxSize * 8);
      grad.addColorStop(0, `rgba(59,130,246,${ga})`);
      grad.addColorStop(0.4, `rgba(59,130,246,${ga * 0.3})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(lensCX - pxSize * 8, lensCY - pxSize * 8, pxSize * 16, pxSize * 16);
    }
  }

  // ─── Phase 3: Formed + details ─────────────────────────────
  else if (progress < 0.70) {
    const t = (progress - 0.50) / 0.20;

    drawDotGrid(ctx, cw, ch, 0.04);
    drawFloatingParticles(ctx, cw, ch, progress, 0.6);

    // Film strips fade in
    const stripAlpha = t * 0.12;
    const stripW = pxSize * 3;
    drawFilmStrip(ctx, ox - stripW - pxSize * 3, ch, stripW, stripAlpha, progress);
    drawFilmStrip(ctx, ox + totalW + pxSize * 3, ch, stripW, stripAlpha, progress);

    // Camera
    for (const px of camera) {
      ctx.fillStyle = px.color;
      ctx.fillRect(ox + px.gx * pxSize, oy + px.gy * pxSize, pxSize, pxSize);
    }

    // Lens glow
    const grad = ctx.createRadialGradient(lensCX, lensCY, 0, lensCX, lensCY, pxSize * 10);
    grad.addColorStop(0, "rgba(59,130,246,0.35)");
    grad.addColorStop(0.3, "rgba(59,130,246,0.12)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(lensCX - pxSize * 10, lensCY - pxSize * 10, pxSize * 20, pxSize * 20);

    // Title
    if (t > 0.2) {
      const ta = Math.min((t - 0.2) / 0.4, 1);
      ctx.globalAlpha = ta;
      const fs = Math.max(12, pxSize * 2.8);
      ctx.font = `800 ${fs}px Outfit, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.letterSpacing = `${Math.max(2, pxSize * 0.5)}px`;
      ctx.fillStyle = P.white;
      ctx.fillText("STUYCAST", cw / 2, oy + totalH + pxSize * 2.5);
      ctx.letterSpacing = "0px";
      ctx.globalAlpha = 1;
    }
    if (t > 0.5) {
      const sa = Math.min((t - 0.5) / 0.3, 1);
      ctx.globalAlpha = sa;
      const ss = Math.max(9, pxSize * 1.3);
      ctx.font = `400 ${ss}px Outfit, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.letterSpacing = `${Math.max(2, pxSize * 0.7)}px`;
      ctx.fillStyle = P.blue;
      ctx.fillText("MEDIA PRODUCTION", cw / 2, oy + totalH + pxSize * 6);
      ctx.letterSpacing = "0px";
      ctx.globalAlpha = 1;
    }
  }

  // ─── Phase 4: Full scene + REC ─────────────────────────────
  else {
    const t = (progress - 0.70) / 0.30;

    drawDotGrid(ctx, cw, ch, 0.05);
    drawFloatingParticles(ctx, cw, ch, progress, 0.7);

    // Film strips
    const stripW = pxSize * 3;
    drawFilmStrip(ctx, ox - stripW - pxSize * 3, ch, stripW, 0.12, progress);
    drawFilmStrip(ctx, ox + totalW + pxSize * 3, ch, stripW, 0.12, progress);

    // Camera
    for (const px of camera) {
      ctx.fillStyle = px.color;
      ctx.fillRect(ox + px.gx * pxSize, oy + px.gy * pxSize, pxSize, pxSize);
    }

    // Lens glow
    const grad = ctx.createRadialGradient(lensCX, lensCY, 0, lensCX, lensCY, pxSize * 10);
    grad.addColorStop(0, "rgba(59,130,246,0.4)");
    grad.addColorStop(0.3, "rgba(59,130,246,0.15)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(lensCX - pxSize * 10, lensCY - pxSize * 10, pxSize * 20, pxSize * 20);

    // REC indicator — blink
    const blink = Math.sin(progress * 50) > 0;
    if (blink) {
      const rx = ox + totalW - pxSize * 2;
      const ry = oy - pxSize * 2;
      // Red dot
      ctx.fillStyle = P.red;
      ctx.beginPath();
      ctx.arc(rx, ry, pxSize * 0.8, 0, Math.PI * 2);
      ctx.fill();
      // Glow
      const rg = ctx.createRadialGradient(rx, ry, 0, rx, ry, pxSize * 3);
      rg.addColorStop(0, "rgba(239,68,68,0.25)");
      rg.addColorStop(1, "transparent");
      ctx.fillStyle = rg;
      ctx.fillRect(rx - pxSize * 3, ry - pxSize * 3, pxSize * 6, pxSize * 6);
      // Text
      ctx.font = `700 ${Math.max(10, pxSize * 1.1)}px Outfit, system-ui, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "2px";
      ctx.fillStyle = P.red;
      ctx.fillText("REC", rx + pxSize * 1.4, ry);
      ctx.letterSpacing = "0px";
    }

    // Title
    const fs = Math.max(12, pxSize * 2.8);
    ctx.font = `800 ${fs}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.letterSpacing = `${Math.max(2, pxSize * 0.5)}px`;
    ctx.fillStyle = P.white;
    ctx.fillText("STUYCAST", cw / 2, oy + totalH + pxSize * 2.5);
    ctx.letterSpacing = "0px";

    // Subtitle
    const ss = Math.max(9, pxSize * 1.3);
    ctx.font = `400 ${ss}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.letterSpacing = `${Math.max(2, pxSize * 0.7)}px`;
    ctx.fillStyle = P.blue;
    ctx.fillText("MEDIA PRODUCTION", cw / 2, oy + totalH + pxSize * 6);
    ctx.letterSpacing = "0px";

    // Corner brackets
    const m = Math.max(8, pxSize * 1.5);
    const bl = Math.max(12, pxSize * 2.5);
    ctx.strokeStyle = `rgba(59,130,246,${0.15 + t * 0.1})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(m, m + bl); ctx.lineTo(m, m); ctx.lineTo(m + bl, m); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cw-m-bl, m); ctx.lineTo(cw-m, m); ctx.lineTo(cw-m, m+bl); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(m, ch-m-bl); ctx.lineTo(m, ch-m); ctx.lineTo(m+bl, ch-m); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cw-m-bl, ch-m); ctx.lineTo(cw-m, ch-m); ctx.lineTo(cw-m, ch-m-bl); ctx.stroke();

    // Timestamp
    ctx.globalAlpha = 0.35 + t * 0.15;
    ctx.font = `400 ${Math.max(8, pxSize * 0.8)}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.letterSpacing = "1px";
    ctx.fillStyle = P.whiteDim;
    ctx.fillText("EST. 2019  ·  STUYVESANT HIGH SCHOOL", cw - m - 4, ch - m - 4);
    ctx.letterSpacing = "0px";
    ctx.globalAlpha = 1;
  }

  // Global overlays
  drawVignette(ctx, cw, ch, 0.5);
  drawEdgeFade(ctx, cw, ch);
}

// ── Component ──────────────────────────────────────────────────────
export function ScrollDrivenSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Continuous marquee text — peaks in the middle of the scroll, fades at edges
  const marqueeX = useTransform(scrollYProgress, [0.05, 1], ["15%", "-30%"]);
  const marqueeOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.15, 0.40, 0.55, 0.80, 0.95],
    [0,    0.06,  0.20, 0.20, 0.06, 0]
  );

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

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const progressVisible = useTransform(scrollYProgress, (v) =>
    v > 0.01 && v < 0.99 ? 1 : 0
  );
  const canvasOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.14, 0.95, 1],
    [0, 0, 1, 1, 0]
  );

  const draw = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    drawScene(ctx, canvas.width / dpr, canvas.height / dpr, progress);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;
    function resize() {
      // Cap DPR at 2 for performance on high-DPI screens
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrap!.getBoundingClientRect();
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = rect.width + "px";
      canvas!.style.height = rect.height + "px";
      const ctx = canvas!.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      draw(progressRef.current);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  useEffect(() => { draw(0); }, [draw]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    progressRef.current = progress;
    requestAnimationFrame(() => draw(progress));
  });

  return (
    <section ref={sectionRef} className="relative z-10 h-[200vh] sm:h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-black">
        {/* Continuous marquee text — single line near the bottom */}
        <div className="pointer-events-none absolute inset-0 z-[5] flex select-none items-end overflow-hidden pb-[3%]" aria-hidden="true">
          <motion.div
            style={{ x: marqueeX, opacity: marqueeOpacity }}
            className="whitespace-nowrap font-[var(--font-outfit)] text-[clamp(36px,12vw,160px)] font-black uppercase tracking-[-2px] sm:tracking-[-4px] text-[var(--color-accent-blue)]"
          >
            CAPTURE &middot; STORIES &middot; CREATE &middot; BROADCAST &middot; EVERY ANGLE &middot; PRODUCE &middot; DIRECT &middot; FILM &middot; EDIT &middot; INSPIRE &middot; RECORD &middot; SHARE &middot; AMPLIFY &middot; VISION &middot; MOTION
          </motion.div>
        </div>

        {/* Canvas — full bleed on mobile (behind text), right half on desktop */}
        <motion.div ref={canvasWrapRef} style={{ opacity: canvasOpacity }} className="absolute inset-0 z-[1] opacity-60 sm:opacity-100 sm:left-auto sm:right-0 sm:w-[55%]">
          <canvas ref={canvasRef} className="absolute inset-0" style={{ background: "transparent" }} />
        </motion.div>

        {/* Scroll progress */}
        <motion.div style={{ opacity: progressVisible }} className="fixed left-6 top-1/2 z-[100] hidden -translate-y-1/2 sm:block">
          <div className="h-[120px] w-[2px] rounded-full bg-white/[0.06]">
            <motion.div style={{ height: progressHeight }} className="w-full rounded-full bg-[var(--color-accent-blue)]" />
          </div>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-[var(--font-outfit)] text-[10px] uppercase tracking-[2px] text-[var(--color-text-muted)]">scroll</div>
        </motion.div>

        {/* Left text column */}
        <div className="absolute left-4 top-1/2 z-10 max-w-[75vw] -translate-y-1/2 sm:left-[8%] sm:max-w-[420px]">
          <motion.div style={{ opacity: labelOpacity }} className="mb-3 font-[var(--font-outfit)] text-[11px] uppercase tracking-[3px] text-[var(--color-accent-blue)] sm:mb-5 sm:text-[13px] sm:tracking-[6px]">
            002 / What We Are
          </motion.div>
          <motion.p style={{ opacity: line1Opacity, y: line1Y }} className="font-[var(--font-outfit)] text-[clamp(18px,5vw,36px)] font-light leading-relaxed">
            we&apos;re not just a club.
          </motion.p>
          <motion.p style={{ opacity: line2Opacity, y: line2Y }} className="font-[var(--font-outfit)] text-[clamp(18px,5vw,36px)] font-light leading-relaxed">
            we&apos;re the <strong className="font-bold">lens</strong>, the{" "}<strong className="font-bold">voice</strong>,
          </motion.p>
          <motion.p style={{ opacity: line3Opacity, y: line3Y }} className="font-[var(--font-outfit)] text-[clamp(18px,5vw,36px)] font-light leading-relaxed">
            and the{" "}<em className="text-[var(--color-accent-blue)]">creative pulse</em>
          </motion.p>
          <motion.p style={{ opacity: line4Opacity, y: line4Y }} className="font-[var(--font-outfit)] text-[clamp(18px,5vw,36px)] font-light leading-relaxed">
            of Stuyvesant.
          </motion.p>
          <motion.p style={{ opacity: subOpacity, y: subY }} className="mt-4 font-[var(--font-outfit)] text-[clamp(12px,3vw,18px)] font-light leading-relaxed text-[var(--color-text-muted)] sm:mt-6">
            eight departments. twenty-six leaders.<br />
            <span className="text-[var(--color-accent-blue)]">every moving part — in perfect sync.</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
