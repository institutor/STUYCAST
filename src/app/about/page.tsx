import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { RevealSection } from "@/components/ui/RevealSection";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PageTitle } from "@/components/ui/PageTitle";
import { StoriesBar } from "@/components/ui/StoriesBar";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about StuyCast - Stuyvesant High School's premier media club.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <RevealSection>
        <PageTitle
          glitchText="About StuyCast"
          subtitle="Our mission, our team, and how we bring Stuyvesant's stories to life."
        >
          About <span className="text-blue-400">StuyCast</span>
        </PageTitle>
      </RevealSection>

      <StoriesBar />

      {/* Animated stats counters */}
      <RevealSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-12">
          <AnimatedCounter end={55} suffix="+" label="Posts" />
          <AnimatedCounter end={700} suffix="K+" label="Impressions" />
          <AnimatedCounter end={100} suffix="+" label="Members" />
          <AnimatedCounter end={3} label="Years Running" />
        </div>
      </RevealSection>

      <div className="space-y-8">
        <RevealSection>
          <GlassCard padding="lg">
            <h2 className="text-xl font-bold text-white mb-4">Why we&apos;re here</h2>
            <p className="text-slate-300 leading-relaxed">
              Stuy has a million stories &mdash; sports wins, hallway drama, senior year chaos,
              that one teacher everyone loves. We&apos;re the kids who thought: why not tell those
              stories really, really well? StuyCast is student-run, student-shot, and student-edited.
              No adults hovering. Just us and our cameras.
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
                  Game days, events, the occasional vlog that goes off the rails.
                  If it&apos;s happening at Stuy, we&apos;re probably filming it.
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
                  The unfiltered, behind-the-scenes chaos that doesn&apos;t make the final cut.
                  Follow for bonus content and accidental bloopers.
                </p>
              </div>
            </div>
          </GlassCard>
        </RevealSection>

        <RevealSection>
          <GlassCard padding="lg">
            <h2 className="text-xl font-bold text-white mb-4">Come make stuff with us</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Doesn&apos;t matter if you&apos;ve never touched a camera or can&apos;t tell a
              condenser mic from a lav mic. We&apos;ll teach you. We just need people who care
              about making cool things and don&apos;t mind staying after school sometimes.
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
