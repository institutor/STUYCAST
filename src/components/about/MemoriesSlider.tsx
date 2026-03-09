"use client";

import { LuminaInteractiveList } from "@/components/ui/lumina-interactive-list";
import type { LuminaSlide } from "@/components/ui/lumina-interactive-list";

const memories: LuminaSlide[] = [
  {
    title: "Senior SING",
    description:
      "The stage lights, the energy, the roar of the crowd — Senior SING is where Stuy comes alive.",
    media: "/instagram/18076381981707344.jpg",
  },
  {
    title: "Pie Your Captain",
    description:
      "50 captains, 30 teams, and a whole lot of whipped cream. Our biggest fundraiser ever.",
    media: "/instagram/18514957426026768.jpg",
  },
  {
    title: "The Team",
    description:
      "StuyCast 2025 — the faces behind every frame, every edit, every story we tell.",
    media: "/instagram/18028459412664032.jpg",
  },
  {
    title: "SOS Showcase",
    description:
      "The biggest one-day show of the year — where student talent meets heart and community.",
    media: "/instagram/17963563451924074.jpg",
  },
  {
    title: "Opening Night",
    description:
      "Curtain up on STC's The Importance of Being Earnest — every moment captured by StuyCast.",
    media: "/instagram/18142209148361175.jpg",
  },
  {
    title: "Holi Festival",
    description:
      "Colors in the air, laughter everywhere — celebrating together as one Stuy family.",
    media: "/instagram/18264966577272089.jpg",
    focusY: 1,
  },
];

export function MemoriesSlider() {
  return (
    <div className="my-12">
      <div className="mb-6">
        <span className="font-[var(--font-outfit)] text-[11px] uppercase tracking-[4px] text-[var(--color-accent-blue)]">
          Memories
        </span>
        <h2 className="text-xl font-bold text-white mt-2">
          Moments we&apos;ve captured
        </h2>
      </div>
      <LuminaInteractiveList
        slides={memories}
        transitionDuration={2}
        className="w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden border border-white/[0.06]"
      />
    </div>
  );
}
