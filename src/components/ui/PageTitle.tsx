import { cn } from "@/lib/utils";
import { ShutterText } from "@/components/ui/hero-shutter-text";

interface PageTitleProps {
  children: React.ReactNode;
  glitchText: string;
  subtitle?: string;
  className?: string;
}

export function PageTitle({ children, glitchText, subtitle, className }: PageTitleProps) {
  // Split glitchText: everything except the last word is white, last word is blue
  const words = glitchText.trim().split(/\s+/);
  const lastWord = words.pop() || "";
  const firstWords = words.join(" ");

  return (
    <div className={cn("mb-10", className)}>
      <h1
        className="title-glitch text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-[-0.04em] leading-[0.95] uppercase"
        data-text={glitchText}
        data-first={firstWords}
        data-last={lastWord}
      >
        {firstWords && <>{firstWords} </>}
        <span className="text-[var(--color-accent-blue)]">{lastWord}</span>
      </h1>
      <div className="mt-3 h-[2px] w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
      {subtitle && (
        <p className="mt-4 text-slate-400 text-base md:text-lg font-medium tracking-wide">
          <ShutterText text={subtitle} delay={0.3} />
        </p>
      )}
    </div>
  );
}
