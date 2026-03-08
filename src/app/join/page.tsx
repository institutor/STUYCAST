import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "Join StuyCast",
  description: "Join Stuyvesant's largest media production club. No experience needed — apply to become a member of StuyCast.",
};

export default function JoinPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <PageTitle
        glitchText="Join StuyCast"
        subtitle="No experience needed. Filming, editing, photography, business, art — there's a place for everyone."
      >
        Join <span className="text-blue-400">StuyCast</span>
      </PageTitle>

      <GlassCard padding="lg">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Applications are closed</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Recruitment for the 2025–2026 school year has ended. Follow us on Instagram for updates on when applications reopen.
          </p>
          <a
            href="https://instagram.com/stuycast"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-[var(--color-accent-blue)] hover:text-white font-medium transition-colors"
          >
            Follow @stuycast
            <span>&rarr;</span>
          </a>
        </div>
      </GlassCard>
    </div>
  );
}
