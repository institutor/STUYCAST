import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { RevealSection } from "@/components/ui/RevealSection";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PageTitle } from "@/components/ui/PageTitle";
import { MemoriesSlider } from "@/components/about/MemoriesSlider";
import { MeetTeamSection } from "@/components/about/MeetTeamSection";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about StuyCast - the largest media production club at Stuyvesant High School.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <RevealSection>
        <PageTitle
          glitchText="About StuyCast"
          subtitle="Stuyvesant's largest media production club — covering events, producing videos, and telling the stories that matter."
        >
          About <span className="text-blue-400">StuyCast</span>
        </PageTitle>
      </RevealSection>

      {/* Animated stats counters */}
      <RevealSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-12">
          <AnimatedCounter end={65} suffix="+" label="Posts" />
          <AnimatedCounter end={2_000_000} label="Impressions" format="compact" />
          <AnimatedCounter end={100} suffix="+" label="Members" />
          <AnimatedCounter end={4.5} label="Years Running" />
        </div>
      </RevealSection>

      <RevealSection>
        <MemoriesSlider />
      </RevealSection>

      <div className="space-y-8">
        <RevealSection>
          <GlassCard padding="lg">
            <h2 className="text-xl font-bold text-white mb-4">Why we&apos;re here</h2>
            <p className="text-slate-300 leading-relaxed">
              StuyCast is the largest media production club at Stuyvesant. From SOS showcases
              and Clubs &amp; Pubs Fair recaps to wrestling highlight reels and photography
              competitions &mdash; if it&apos;s happening at Stuy, we&apos;re there covering it.
              Everything is student-run, student-shot, and student-edited.
            </p>
          </GlassCard>
        </RevealSection>

        <RevealSection>
          <GlassCard padding="lg">
            <h2 className="text-xl font-bold text-white mb-4">The stuff we make</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Videos</h3>
                <p className="text-sm text-slate-400">
                  Event recaps, talent show promos, club spotlights, and drone footage
                  of StuySquad dance crews. If it moves, we film it.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Social Media</h3>
                <p className="text-sm text-slate-400">
                  Photography showcases, behind-the-scenes content, and event coverage
                  across Instagram. Follow @stuycast for the latest.
                </p>
              </div>
            </div>
          </GlassCard>
        </RevealSection>

        <MeetTeamSection />

        <RevealSection>
          <GlassCard padding="lg">
            <h2 className="text-xl font-bold text-white mb-4">Come make stuff with us</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              No experience needed. Whether you&apos;re into filming, video editing, photography,
              business, art, or anything in between &mdash; there&apos;s a place for you.
              Both leadership and member applications open each semester.
            </p>
            <a
              href="/join"
              className="inline-flex items-center text-blue-400 hover:text-white font-medium transition-colors group/link"
            >
              I&apos;m interested
              <span className="ml-2 group-hover/link:translate-x-1 transition-transform">&rarr;</span>
            </a>
          </GlassCard>
        </RevealSection>
      </div>
    </div>
  );
}
