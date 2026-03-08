import { GlassCard } from "@/components/ui/GlassCard";

export function SupportCard() {
  return (
    <GlassCard className="h-full flex flex-col justify-center items-center text-center">
      <h3 className="text-2xl font-extrabold text-white tracking-wide uppercase mb-3">
        Keep us on air
      </h3>
      <p className="text-sm text-slate-400 mb-6 max-w-xs">
        Good merch, good cause. Every dollar helps us upgrade our gear and make
        better stuff for Stuy.
      </p>
      <a
        href="#"
        className="inline-flex items-center text-slate-300 hover:text-white font-medium border border-white/20 hover:border-white/50 px-6 py-2.5 rounded-full transition-all hover:bg-white/5"
      >
        Check it out
      </a>
    </GlassCard>
  );
}
