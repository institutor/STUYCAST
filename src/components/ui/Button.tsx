import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#0a1628]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.97] active:transition-none",
        {
          "bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/40":
            variant === "primary",
          "bg-transparent text-slate-200 border border-white/15 hover:bg-white/5 hover:border-white/30 backdrop-blur-sm":
            variant === "outline",
          "text-slate-300 hover:text-white hover:bg-white/5":
            variant === "ghost",
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-5 py-2.5 text-sm": size === "md",
          "px-7 py-3 text-base": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
