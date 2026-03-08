import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Glitch 404 */}
      <h1 className="glitch-text text-8xl md:text-9xl font-extrabold text-white mb-6" data-text="404">
        404
      </h1>

      <p className="text-xl text-slate-400 mb-2">Signal Lost</p>
      <p className="text-sm text-slate-500 mb-10 max-w-md">
        This episode seems to have gone off-air. The page you&apos;re looking for
        doesn&apos;t exist or has been moved.
      </p>

      {/* Audio wave bars decoration */}
      <div className="flex items-center gap-[3px] mb-10 h-8" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-blue-500 to-violet-500 opacity-60"
            style={{
              height: `${12 + Math.sin(i * 0.8) * 10}px`,
              animation: `wave-bar 1.2s ease-in-out ${i * 0.05}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <Link
        href="/"
        className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.97]"
      >
        Back to Broadcast &rarr;
      </Link>
    </div>
  );
}
