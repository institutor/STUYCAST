"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion } from "framer-motion";
import { usePageTransition } from "@/components/effects/PageTransition";

const siteLinks = [
  {
    number: "01",
    name: "Videos",
    href: "/videos",
    description: "Watch our latest productions, interviews, and event coverage",
  },
  {
    number: "02",
    name: "Instagram",
    href: "/instagram",
    description: "Behind-the-scenes photography and highlights from @stuycast",
  },
  {
    number: "03",
    name: "About Us",
    href: "/about",
    description: "Our mission, our team, and how we bring Stuy's stories to life",
  },
  {
    number: "04",
    name: "Join",
    href: "/join",
    description: "Apply to become a member of StuyCast",
  },
] as const;

function SiteLinkItem({
  link,
  index,
}: {
  link: (typeof siteLinks)[number];
  index: number;
}) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  });
  const { transition, isTransitioning } = usePageTransition();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <button
        onClick={() => !isTransitioning && transition(link.href)}
        disabled={isTransitioning}
        className="dept-item-row group relative flex w-full items-center justify-between border-b border-white/[0.06] py-5 sm:py-9 transition-all duration-[400ms] text-left"
      >
        {/* Hover accent dot */}
        <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[var(--color-accent-blue)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="min-w-[60px] font-[var(--font-outfit)] text-[13px] tracking-[2px] text-[var(--color-text-muted)]">
          {link.number}
        </span>
        <span className="flex-1 font-[var(--font-outfit)] text-[clamp(24px,3vw,40px)] font-bold tracking-[-1px] transition-all duration-300 group-hover:text-[var(--color-accent-blue)]">
          {link.name}
        </span>
        <span className="hidden font-[var(--font-outfit)] text-[14px] font-light leading-relaxed text-[var(--color-text-muted)] text-right max-w-[300px] md:block">
          {link.description}
        </span>

        {/* Arrow on hover */}
        <span className="ml-4 font-[var(--font-outfit)] text-[20px] text-[var(--color-accent-blue)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          →
        </span>
      </button>
    </motion.div>
  );
}

export function DepartmentsSection() {
  return (
    <section
      id="explore"
      className="relative z-10 bg-[var(--color-bg-primary)] px-4 py-16 sm:px-12 sm:py-24 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-12 sm:mb-20">
          <div className="mb-4 font-[var(--font-outfit)] text-[13px] uppercase tracking-[6px] text-[var(--color-accent-blue)]">
            003 / Explore
          </div>
          <h2 className="font-[var(--font-outfit)] text-[clamp(36px,5vw,64px)] font-black leading-[1.1] tracking-[-2px]">
            explore
            <br />
            stuycast.
          </h2>
        </div>

        {/* Links list */}
        <div>
          {siteLinks.map((link, i) => (
            <SiteLinkItem key={link.number} link={link} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
