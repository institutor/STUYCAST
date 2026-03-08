import { cn } from "@/lib/utils";

interface PlayButtonProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
};

const triangleSizeMap = {
  sm: "border-l-[10px] border-t-[6px] border-b-[6px] ml-0.5",
  md: "border-l-[14px] border-t-[8px] border-b-[8px] ml-1",
  lg: "border-l-[20px] border-t-[12px] border-b-[12px] ml-1",
};

export function PlayButton({ size = "md", className }: PlayButtonProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        "bg-white/20 backdrop-blur-sm border border-white/30",
        "group-hover:bg-blue-500/80 group-hover:border-blue-400/50",
        "group-active:scale-95",
        "transition-all duration-300",
        "animate-pulse-glow",
        sizeMap[size],
        className
      )}
    >
      <div
        className={cn(
          "w-0 h-0",
          "border-t-transparent border-b-transparent border-l-white",
          triangleSizeMap[size]
        )}
      />
    </div>
  );
}
