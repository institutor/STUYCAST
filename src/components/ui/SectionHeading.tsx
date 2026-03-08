import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  href?: string;
  linkText?: string;
  className?: string;
  live?: boolean;
}

export function SectionHeading({ title, href, linkText = "See All", className, live }: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div className="flex items-center gap-3">
        {live && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Live</span>
          </span>
        )}
        <h2
          className="text-xl font-bold tracking-wide uppercase heading-scan"
          data-text={title}
        >
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="text-sm text-slate-500 hover:text-white transition-colors"
        >
          {linkText} &rarr;
        </Link>
      )}
    </div>
  );
}
