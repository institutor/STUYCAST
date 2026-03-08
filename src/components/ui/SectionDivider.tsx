export function SectionDivider() {
  return (
    <div className="relative py-12" aria-hidden="true">
      {/* Gradient fade zone */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-blue-500/[0.03] to-transparent" />
      {/* Center line */}
      <div className="relative mx-auto max-w-xs h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        {/* Center glow dot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_2px_rgba(59,130,246,0.4)] animate-pulse-glow" />
      </div>
    </div>
  );
}
