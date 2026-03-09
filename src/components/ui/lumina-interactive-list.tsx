"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

export interface LuminaSlide {
  title: string;
  description: string;
  media: string;
  /** Vertical focus point 0=top, 0.5=center, 1=bottom. Default 0.3 */
  focusY?: number;
}

interface LuminaInteractiveListProps {
  slides?: LuminaSlide[];
  transitionDuration?: number;
  className?: string;
}

const defaultSlides: LuminaSlide[] = [
  { title: "Ethereal Glow", description: "A soft, radiant light that illuminates the soul.", media: "https://assets.codepen.io/7558/orange-portrait-001.jpg" },
  { title: "Rose Mirage", description: "Lost in a desert of blooming dreams and endless horizons.", media: "https://assets.codepen.io/7558/orange-portrait-002.jpg" },
  { title: "Velvet Mystique", description: "Wrapped in the deep, luxurious embrace of the night.", media: "https://assets.codepen.io/7558/orange-portrait-003.jpg" },
  { title: "Golden Hour", description: "That fleeting moment when the world is dipped in gold.", media: "https://assets.codepen.io/7558/orange-portrait-004.jpg" },
  { title: "Midnight Dreams", description: "Where reality fades and imagination takes flight.", media: "https://assets.codepen.io/7558/orange-portrait-005.jpg" },
  { title: "Silver Light", description: "A cool, metallic shimmer reflecting the urban pulse.", media: "https://assets.codepen.io/7558/orange-portrait-006.jpg" },
];

export function LuminaInteractiveList({
  slides = defaultSlides,
  transitionDuration = 2,
  className,
}: LuminaInteractiveListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let currentSlideIndex = 0;
    let isTransitioning = false;
    let shaderMaterial: THREE.ShaderMaterial;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let slideTextures: THREE.Texture[] = [];
    let texturesLoaded = false;
    let animFrameId: number;
    let renderLoopRunning = false;

    const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
    const fragmentShader = `
      uniform sampler2D uTexture1, uTexture2;
      uniform float uProgress, uFocusY1, uFocusY2;
      uniform vec2 uResolution, uTexture1Size, uTexture2Size;
      varying vec2 vUv;

      vec2 getCoverUV(vec2 uv, vec2 textureSize, float focusY) {
        vec2 s = uResolution / textureSize;
        float scale = max(s.x, s.y);
        vec2 scaledSize = textureSize * scale;
        vec2 offset = (uResolution - scaledSize) * 0.5;
        offset.y = (uResolution.y - scaledSize.y) * focusY;
        return (uv * uResolution - offset) / scaledSize;
      }

      void main() {
        vec2 uv1 = getCoverUV(vUv, uTexture1Size, uFocusY1);
        vec2 uv2 = getCoverUV(vUv, uTexture2Size, uFocusY2);
        float time = uProgress * 5.0;
        float maxR = length(uResolution) * 0.85;
        float br = uProgress * maxR;
        vec2 p = vUv * uResolution;
        vec2 c = uResolution * 0.5;
        float d = length(p - c);
        float nd = d / max(br, 0.001);
        float param = smoothstep(br + 3.0, br - 3.0, d);

        vec4 img;
        if (param > 0.0) {
          float ro = 0.08 * pow(smoothstep(0.3, 1.0, nd), 1.5);
          vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
          vec2 distUV = uv2 - dir * ro;
          distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * nd * param;
          float ca = 0.02 * pow(smoothstep(0.3, 1.0, nd), 1.2);
          img = vec4(
            texture2D(uTexture2, distUV + dir * ca * 1.2).r,
            texture2D(uTexture2, distUV + dir * ca * 0.2).g,
            texture2D(uTexture2, distUV - dir * ca * 0.8).b,
            1.0
          );
          float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
          img.rgb += rim * 0.08;
        } else {
          img = texture2D(uTexture2, uv2);
        }
        vec4 oldImg = texture2D(uTexture1, uv1);
        if (uProgress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (uProgress - 0.95) / 0.05);
        gl_FragColor = mix(oldImg, img, param);
      }
    `;

    const updateContent = (idx: number) => {
      const titleEl = container.querySelector(".lumina-title") as HTMLElement;
      const descEl = container.querySelector(".lumina-desc") as HTMLElement;
      if (!titleEl || !descEl) return;

      // Animate out
      gsap.to(titleEl, { y: -20, opacity: 0, duration: 0.4, ease: "power2.in" });
      gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in" });

      setTimeout(() => {
        titleEl.textContent = slides[idx].title;
        descEl.textContent = slides[idx].description;
        gsap.set(titleEl, { y: 20, opacity: 0 });
        gsap.set(descEl, { y: 20, opacity: 0 });
        gsap.to(titleEl, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
        gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "power3.out" });
      }, 450);
    };

    const updateNavigationState = (idx: number) =>
      container.querySelectorAll(".lumina-nav-item").forEach((el, i) => el.classList.toggle("active", i === idx));

    const updateCounter = (idx: number) => {
      const sn = container.querySelector(".lumina-slide-number") as HTMLElement;
      const st = container.querySelector(".lumina-slide-total") as HTMLElement;
      if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
      if (st) st.textContent = String(slides.length).padStart(2, "0");
    };

    // Only run the render loop during transitions, then do a single render for idle
    const startRenderLoop = () => {
      if (renderLoopRunning) return;
      renderLoopRunning = true;
      const loop = () => {
        if (!renderLoopRunning) return;
        renderer.render(scene, camera);
        animFrameId = requestAnimationFrame(loop);
      };
      loop();
    };

    const stopRenderLoop = () => {
      renderLoopRunning = false;
      cancelAnimationFrame(animFrameId);
    };

    const renderOnce = () => {
      if (renderer && scene && camera) renderer.render(scene, camera);
    };

    const navigateToSlide = (targetIndex: number) => {
      if (isTransitioning || targetIndex === currentSlideIndex || !texturesLoaded) return;

      const currentTexture = slideTextures[currentSlideIndex];
      const targetTexture = slideTextures[targetIndex];
      if (!currentTexture || !targetTexture) return;

      isTransitioning = true;
      shaderMaterial.uniforms.uTexture1.value = currentTexture;
      shaderMaterial.uniforms.uTexture2.value = targetTexture;
      shaderMaterial.uniforms.uTexture1Size.value = (currentTexture as any).userData.size;
      shaderMaterial.uniforms.uTexture2Size.value = (targetTexture as any).userData.size;
      shaderMaterial.uniforms.uFocusY1.value = slides[currentSlideIndex]?.focusY ?? 0.5;
      shaderMaterial.uniforms.uFocusY2.value = slides[targetIndex]?.focusY ?? 0.5;

      updateContent(targetIndex);
      currentSlideIndex = targetIndex;
      updateCounter(currentSlideIndex);
      updateNavigationState(currentSlideIndex);

      startRenderLoop();

      gsap.fromTo(
        shaderMaterial.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: transitionDuration,
          ease: "power2.inOut",
          onComplete: () => {
            shaderMaterial.uniforms.uProgress.value = 0;
            shaderMaterial.uniforms.uTexture1.value = targetTexture;
            shaderMaterial.uniforms.uTexture1Size.value = (targetTexture as any).userData.size;
            shaderMaterial.uniforms.uFocusY1.value = slides[currentSlideIndex]?.focusY ?? 0.5;
            isTransitioning = false;
            stopRenderLoop();
            renderOnce();
          },
        }
      );
    };

    // Build navigation — click only, no auto-advance
    const nav = container.querySelector(".lumina-nav") as HTMLElement;
    if (nav) {
      nav.innerHTML = "";
      slides.forEach((slide, i) => {
        const item = document.createElement("div");
        item.className = `lumina-nav-item${i === 0 ? " active" : ""}`;
        item.innerHTML = `<div class="lumina-progress-line"><div class="lumina-progress-fill"></div></div><div class="lumina-nav-title">${slide.title}</div>`;
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          navigateToSlide(i);
        });
        nav.appendChild(item);
      });
    }

    updateCounter(0);

    // Set initial text directly (visible immediately)
    const titleEl = container.querySelector(".lumina-title") as HTMLElement;
    const descEl = container.querySelector(".lumina-desc") as HTMLElement;
    if (titleEl && descEl) {
      titleEl.textContent = slides[0].title;
      descEl.textContent = slides[0].description;
    }

    // Init renderer — wait for container to have non-zero dimensions
    // (on client-side SPA navigation, layout may not be ready immediately)
    const initRenderer = async () => {
      const canvas = container.querySelector(".lumina-canvas") as HTMLCanvasElement;
      if (!canvas) return;

      let rect = container.getBoundingClientRect();

      // If dimensions are zero, wait for layout via ResizeObserver
      if (rect.width === 0 || rect.height === 0) {
        await new Promise<void>((resolve) => {
          const ro = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
              ro.disconnect();
              resolve();
            }
          });
          ro.observe(container);
        });
        rect = container.getBoundingClientRect();
      }

      // Bail if component unmounted while waiting for layout
      if (disposed) return;

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(1); // Keep at 1 for performance

      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTexture1: { value: null },
          uTexture2: { value: null },
          uProgress: { value: 0 },
          uResolution: { value: new THREE.Vector2(rect.width, rect.height) },
          uTexture1Size: { value: new THREE.Vector2(1, 1) },
          uTexture2Size: { value: new THREE.Vector2(1, 1) },
          uFocusY1: { value: slides[0]?.focusY ?? 0.5 },
          uFocusY2: { value: slides[1]?.focusY ?? 0.5 },
        },
        vertexShader,
        fragmentShader,
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

      const loader = new THREE.TextureLoader();
      for (const s of slides) {
        try {
          const t = await new Promise<THREE.Texture>((res, rej) => {
            loader.load(s.media, (tex) => {
              tex.minFilter = tex.magFilter = THREE.LinearFilter;
              (tex as any).userData = { size: new THREE.Vector2(tex.image.width, tex.image.height) };
              res(tex);
            }, undefined, rej);
          });
          slideTextures.push(t);
        } catch { console.warn("Failed to load texture:", s.media); }
      }

      if (slideTextures.length >= 2) {
        shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
        shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
        shaderMaterial.uniforms.uTexture1Size.value = (slideTextures[0] as any).userData.size;
        shaderMaterial.uniforms.uTexture2Size.value = (slideTextures[1] as any).userData.size;
        texturesLoaded = true;
        container.querySelector(".lumina-wrapper")?.classList.add("loaded");
        renderOnce();
      }

      const onResize = () => {
        const r = container.getBoundingClientRect();
        renderer.setSize(r.width, r.height);
        shaderMaterial.uniforms.uResolution.value.set(r.width, r.height);
        renderOnce();
      };
      window.addEventListener("resize", onResize);

      cleanupRef.current = () => {
        stopRenderLoop();
        window.removeEventListener("resize", onResize);
        slideTextures.forEach((t) => t.dispose());
        renderer.dispose();
        shaderMaterial.dispose();
      };
    };

    initRenderer();

    return () => {
      disposed = true;
      cleanupRef.current?.();
    };
  }, [slides, transitionDuration]);

  return (
    <div ref={containerRef} className={className}>
      <div className="lumina-wrapper">
        <canvas className="lumina-canvas" />
        <span className="lumina-slide-number">01</span>
        <span className="lumina-slide-total">{String(slides.length).padStart(2, "0")}</span>
        <div className="lumina-content">
          <h2 className="lumina-title" />
          <p className="lumina-desc" />
        </div>
        <nav className="lumina-nav" />
      </div>
    </div>
  );
}
