"use client";

import Link from "next/link";
import { footerQuickLinks } from "@/data/navigation";
import { socialLinks } from "@/data/social-links";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion } from "framer-motion";

function FooterReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function Footer() {
  const { ref: lineRef, isVisible: lineVisible } = useIntersectionObserver({
    threshold: 0.1,
  });

  return (
    <footer className="relative z-10 bg-black">
      {/* Animated top border line */}
      <div ref={lineRef} className="relative h-px overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={lineVisible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-accent-blue) 20%, var(--color-accent-blue) 80%, transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-12 lg:py-20">
        {/* Top row — large STUYCAST wordmark + social */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <FooterReveal>
            <div className="font-[var(--font-outfit)] text-[clamp(48px,8vw,96px)] font-black leading-none tracking-[-3px]">
              STUY
              <span className="text-[var(--color-accent-blue)]">CAST</span>
            </div>
          </FooterReveal>

          <FooterReveal delay={0.15}>
            <div className="flex items-center gap-1">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group relative p-3 transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 rounded-full bg-white/0 transition-colors duration-300 group-hover:bg-white/[0.05]" />
                  <SocialIcon icon={social.icon} />
                </motion.a>
              ))}
            </div>
          </FooterReveal>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Quick Links */}
          <FooterReveal delay={0.1}>
            <div className="mb-4 font-[var(--font-outfit)] text-[11px] uppercase tracking-[4px] text-[var(--color-accent-blue)]">
              Navigate
            </div>
            <div className="flex flex-col gap-0">
              {footerQuickLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 border-b border-white/[0.04] py-3 font-[var(--font-outfit)] text-[14px] font-light tracking-wide text-white/40 transition-all duration-300 hover:text-white"
                >
                  <span className="font-[var(--font-outfit)] text-[10px] tracking-[2px] text-white/20 transition-colors duration-300 group-hover:text-[var(--color-accent-blue)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                  <span className="ml-auto text-[var(--color-accent-blue)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </FooterReveal>

          {/* About blurb */}
          <FooterReveal delay={0.2}>
            <div className="mb-4 font-[var(--font-outfit)] text-[11px] uppercase tracking-[4px] text-[var(--color-accent-blue)]">
              About
            </div>
            <p className="font-[var(--font-outfit)] text-[14px] font-light leading-relaxed text-white/30">
              StuyCast is the largest media production club at Stuyvesant
              High School, founded in 2022. From event coverage and photography
              to video production &mdash; we tell the stories that define Stuy.
            </p>
            <p className="mt-4 font-[var(--font-outfit)] text-[14px] font-light leading-relaxed text-white/30">
              Eight departments. Twenty-six leaders.
              <br />
              <span className="text-white/50">One creative vision.</span>
            </p>
          </FooterReveal>
        </div>

        {/* Bottom bar */}
        <FooterReveal delay={0.35}>
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-8 sm:flex-row">
            <p className="font-[var(--font-outfit)] text-[11px] font-light tracking-wide text-white/20">
              Developed by <span className="text-white/40">Jiewen Huang</span>
            </p>
            <p className="font-[var(--font-outfit)] text-[11px] tracking-[2px] text-white/15">
              EST. 2022 &middot; &copy; {new Date().getFullYear()} STUYCAST
            </p>
          </div>
        </FooterReveal>
      </div>
    </footer>
  );
}
