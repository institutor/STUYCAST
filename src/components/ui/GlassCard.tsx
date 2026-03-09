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
        "transition-all duration-300",
        hover && "glass-card-hover",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </Tag>
  );
}
