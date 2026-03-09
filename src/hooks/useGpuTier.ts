"use client";

import { useEffect, useState } from "react";

export type GpuTier = "high" | "low";

let _cachedTier: GpuTier | null = null;

/**
 * Quick WebGL draw benchmark. Renders a handful of triangles and checks
 * how long it takes. Software rendering (no HW accel) is significantly
 * slower — typically 5-20× — so even a coarse threshold works.
 */
function isSoftwareRendering(gl: WebGLRenderingContext): boolean {
  try {
    const size = 256;
    gl.canvas.width = size;
    gl.canvas.height = size;
    gl.viewport(0, 0, size, size);

    // Minimal shader program
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, "attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}");
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, "precision lowp float;void main(){gl_FragColor=vec4(1,0,0,1);}");
    gl.compileShader(fs);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Triangle strip covering the viewport
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // Draw several times and force GPU sync with readPixels
    const start = performance.now();
    for (let i = 0; i < 10; i++) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    const pixel = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    const elapsed = performance.now() - start;

    // Cleanup
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    // GPU-accelerated typically finishes in <5ms; software rendering >16ms
    return elapsed > 16;
  } catch {
    return true; // If the benchmark itself fails, assume software
  }
}

/**
 * Detect whether the device has hardware-accelerated graphics.
 * Returns "low" for software renderers, low-end GPUs, or when detection fails.
 * Result is cached globally so detection runs only once.
 */
export function detectGpuTier(): GpuTier {
  if (_cachedTier) return _cachedTier;

  try {
    // Prefer reduced motion = treat as low tier
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      _cachedTier = "low";
      return _cachedTier;
    }

    // Check device memory (Chrome/Edge only) — <4GB = low tier
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (deviceMemory !== undefined && deviceMemory < 4) {
      _cachedTier = "low";
      return _cachedTier;
    }

    // Low core count = likely low-end
    if (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2) {
      _cachedTier = "low";
      return _cachedTier;
    }

    // WebGL renderer detection — identify software renderers
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      // No WebGL = definitely low tier
      _cachedTier = "low";
      return _cachedTier;
    }

    const glCtx = gl as WebGLRenderingContext;
    const debugExt = glCtx.getExtension("WEBGL_debug_renderer_info");

    if (debugExt) {
      const renderer = glCtx.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) as string;
      const rendererLower = renderer.toLowerCase();

      // Known software renderers — these appear when hardware acceleration
      // is disabled in browser settings or no GPU driver is available
      const softwareRenderers = [
        "swiftshader",    // Chrome/Edge with HW accel off
        "llvmpipe",       // Mesa software renderer (Linux)
        "softpipe",       // Mesa software renderer
        "microsoft basic render driver", // Windows with HW accel off
        "software",       // Generic software tag
        "mesa",           // Software Mesa without GPU
        "apple gpu",      // Safari software fallback (rare)
      ];

      if (softwareRenderers.some((sw) => rendererLower.includes(sw))) {
        _cachedTier = "low";
        return _cachedTier;
      }

      // Known low-end integrated GPUs
      const lowEndGpus = [
        "intel hd graphics",      // Older Intel integrated
        "intel uhd graphics 6",   // Lower-end UHD (600 series)
        "intel(r) hd graphics",
        "mali-4",                 // Older ARM Mali
        "mali-t6",
        "adreno 3",               // Older Qualcomm
        "adreno 4",
        "powervr sgx",            // Older PowerVR
      ];

      if (lowEndGpus.some((gpu) => rendererLower.includes(gpu))) {
        _cachedTier = "low";
        return _cachedTier;
      }
    } else {
      // WEBGL_debug_renderer_info not available (e.g. Firefox with
      // privacy.resistFingerprinting). Fall back to a quick draw test —
      // software rendering will be measurably slower than GPU.
      if (isSoftwareRendering(glCtx)) {
        _cachedTier = "low";
        return _cachedTier;
      }
    }

    _cachedTier = "high";
  } catch {
    _cachedTier = "low";
  }

  return _cachedTier;
}

/**
 * React hook that returns the GPU tier.
 * Returns "high" during SSR/initial render, then detects on mount.
 */
export function useGpuTier(): GpuTier {
  const [tier, setTier] = useState<GpuTier>(_cachedTier ?? "high");

  useEffect(() => {
    setTier(detectGpuTier());
  }, []);

  return tier;
}
