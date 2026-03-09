"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

function createParticles(count: number, width: number, height: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.2,
  }));
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const particles = particlesRef.current;
    const connectionDistance = 120;
    const connDistSq = connectionDistance * connectionDistance;

    ctx.clearRect(0, 0, width, height);

    // Update positions
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }

    // Draw connections — skip on mobile, use squared distance to avoid sqrt
    if (!isMobileRef.current) {
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connDistSq) {
            const opacity = (1 - Math.sqrt(distSq) / connectionDistance) * 0.06;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Draw particles — batch by using a single fillStyle for similar opacities
    for (const p of particles) {
      ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    isMobileRef.current = isTouch;

    // Reduced particle counts for better performance
    const maxParticles = isTouch ? 12 : 40;
    const divisor = isTouch ? 35000 : 25000;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = createParticles(
        Math.min(maxParticles, Math.floor((window.innerWidth * window.innerHeight) / divisor)),
        canvas.width,
        canvas.height
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
