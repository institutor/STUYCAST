"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

export function OrbitalClock() {
  const [time, setTime] = useState<Date | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)
  const secondRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTime(new Date())
    // Only update state once per second for the hour markers / date display
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // Use rAF for smooth second hand only
    let rafId: number
    const tick = () => {
      const now = new Date()
      const s = now.getSeconds() + now.getMilliseconds() / 1000
      const m = now.getMinutes() + s / 60
      const h = (now.getHours() % 12) + m / 60
      if (secondRef.current) secondRef.current.style.transform = `translateX(-50%) rotate(${s * 6}deg)`
      if (minuteRef.current) minuteRef.current.style.transform = `translateX(-50%) rotate(${m * 6}deg)`
      if (hourRef.current) hourRef.current.style.transform = `translateX(-50%) rotate(${h * 30}deg)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      clearInterval(interval)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setMousePos({ x: x * 8, y: y * 8 })
  }

  if (!time) return <div className="relative w-36 h-36 sm:w-44 sm:h-44" />

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000
  const minutes = time.getMinutes() + seconds / 60
  const hours = (time.getHours() % 12) + minutes / 60

  const secondDeg = seconds * 6
  const minuteDeg = minutes * 6
  const hourDeg = hours * 30

  const formatDate = () => {
    return time.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: 0, y: 0 })
      }}
      onMouseMove={handleMouseMove}
      style={{ perspective: "600px" }}
    >
      {/* Main clock container */}
      <div
        className="relative w-36 h-36 sm:w-44 sm:h-44 transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
        }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            background: isHovered
              ? "radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)"
              : "transparent",
            transform: isHovered ? "scale(1.3)" : "scale(1)",
          }}
        />

        {/* Clock face */}
        <div className="absolute inset-2 rounded-full bg-[var(--color-bg-primary)]/80 border border-white/[0.08] shadow-2xl backdrop-blur-sm">
          {/* Inner subtle ring */}
          <div
            className={`absolute inset-3 rounded-full border transition-all duration-500 ${
              isHovered
                ? "border-[var(--color-accent-blue)]/30"
                : "border-white/[0.04]"
            }`}
          />

          {/* Hour markers */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30
            const isActive = Math.floor(hours) === i || Math.floor(hours) === i + 12
            const rad = (angle - 90) * (Math.PI / 180)
            const x = 50 + 38 * Math.cos(rad)
            const y = 50 + 38 * Math.sin(rad)

            return (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  background: isActive
                    ? "var(--color-accent-blue)"
                    : i % 3 === 0
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(255,255,255,0.18)",
                  boxShadow: isActive
                    ? "0 0 10px rgba(59,130,246,0.6)"
                    : "none",
                }}
              />
            )
          })}

          {/* Hour hand */}
          <div
            ref={hourRef}
            className="absolute left-1/2 bottom-1/2 w-1 origin-bottom rounded-full bg-white/80"
            style={{
              height: "28%",
              transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            }}
          />

          {/* Minute hand */}
          <div
            ref={minuteRef}
            className="absolute left-1/2 bottom-1/2 w-0.5 origin-bottom rounded-full bg-white/50"
            style={{
              height: "36%",
              transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
            }}
          />

          {/* Second hand */}
          <div
            ref={secondRef}
            className="absolute left-1/2 bottom-1/2 origin-bottom rounded-full"
            style={{
              width: "1px",
              height: "40%",
              transform: `translateX(-50%) rotate(${secondDeg}deg)`,
              background: "var(--color-accent-blue)",
              boxShadow: "0 0 8px rgba(59,130,246,0.6)",
            }}
          />

          {/* Center dot */}
          <div
            className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              transform: "translate(-50%, -50%)",
              background: isHovered ? "var(--color-accent-blue)" : "rgba(255,255,255,0.85)",
              boxShadow: isHovered
                ? "0 0 12px rgba(59,130,246,0.7)"
                : "none",
            }}
          />
        </div>
      </div>

      {/* Date reveal on hover */}
      <div
        className="absolute w-full flex items-center justify-center -bottom-8 left-1/2 font-[var(--font-outfit)] text-[10px] tracking-[0.3em] uppercase transition-all duration-500"
        style={{
          transform: `translateX(-50%) translateY(${isHovered ? 0 : -10}px)`,
          opacity: isHovered ? 1 : 0,
          color: "var(--color-accent-blue)",
        }}
      >
        {formatDate()}
      </div>
    </div>
  )
}
