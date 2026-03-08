import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "section";
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export function GlassCard({
  children,
  className,
  hover = true,
  padding = "md",
  as: Tag = "div",
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "bg-white/5 backdrop-blur-md",
        "border border-white/10 rounded-2xl",
        "overflow-hidden",
        hover &&
          "transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </Tag>
  );
}
