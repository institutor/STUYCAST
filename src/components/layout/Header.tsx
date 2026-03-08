"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/navigation";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300",
          scrolled
            ? "bg-black/90 border-white/10 shadow-lg shadow-black/20"
            : "bg-black/60 border-white/5 shadow-none"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
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
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors",
                    pathname === link.href
                      ? "text-blue-400"
                      : "text-slate-300 hover:text-white",
                    "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-blue-400 after:transition-all after:duration-300",
                    pathname === link.href ? "after:w-full" : "hover:after:w-full"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side: Search + Join CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>

            {/* Mobile menu button */}
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-start justify-center pt-24">
          <div className="w-full max-w-2xl mx-4">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white">Search</h2>
              <button
                onClick={() => setSearchOpen(false)}
                className="ml-auto p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Close search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              placeholder="Search videos, posts, and more..."
              autoFocus
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
            />
            <p className="mt-4 text-sm text-slate-500">Press ESC to close</p>
          </div>
        </div>
      )}
    </>
  );
}
