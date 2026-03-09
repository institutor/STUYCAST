"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSimpleMode } from "@/hooks/useSimpleMode";

// Seeded random to avoid hydration mismatch
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function FloatingPaths({ position, pathCount }: { position: number; pathCount: number }) {
  const paths = Array.from({ length: pathCount }, (_, i) => {
    // Spread indices to cover similar visual range as original 16 paths
    const spread = pathCount < 16 ? i * 2 : i;
    return {
      id: i,
      d: `M-${380 - spread * 5 * position} -${189 + spread * 6}C-${
        380 - spread * 5 * position
      } -${189 + spread * 6} -${312 - spread * 5 * position} ${216 - spread * 6} ${
        152 - spread * 5 * position
      } ${343 - spread * 6}C${616 - spread * 5 * position} ${470 - spread * 6} ${
        684 - spread * 5 * position
      } ${875 - spread * 6} ${684 - spread * 5 * position} ${875 - spread * 6}`,
      width: 0.2 + spread * 0.01,
      opacity: 0.35 + (spread / 15) * 0.50,
      duration: 20 + seededRandom(i * position) * 10,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="rgba(59,130,246,1)"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.3, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [path.opacity * 0.6, path.opacity, path.opacity * 0.6],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const MemoizedFloatingPaths = memo(FloatingPaths);

export function BackgroundPaths() {
  const [pathCount, setPathCount] = useState(0);
  const { simple } = useSimpleMode();

  useEffect(() => {
    if (simple) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced) return;
    // Skip entirely on touch/mobile, reduce from 16 to 8 per group on desktop
    if (isTouch) return;
    setPathCount(8);
  }, [simple]);

  if (simple || pathCount === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <MemoizedFloatingPaths position={1} pathCount={pathCount} />
      <MemoizedFloatingPaths position={-1} pathCount={pathCount} />
    </div>
  );
}
