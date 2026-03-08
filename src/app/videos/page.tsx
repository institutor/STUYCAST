import type { Metadata } from "next";
import { VideoCard } from "@/components/cards/VideoCard";
import { PageTitle } from "@/components/ui/PageTitle";
import { StoriesBar } from "@/components/ui/StoriesBar";
import { RevealSection } from "@/components/ui/RevealSection";
import { StaggerGrid } from "@/components/ui/StaggerGrid";
import { allVideos } from "@/data/content";

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch StuyCast's latest video productions, interviews, and event coverage.",
};

export default function VideosPage() {
  const [featured, ...rest] = allVideos;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      <PageTitle
        glitchText="The Tapes"
        subtitle="Our complete video archive — interviews, event coverage, and original productions."
      >
        The Tapes
      </PageTitle>

      <StoriesBar />

      {/* Featured hero video */}
      <RevealSection>
        <div className="mb-8">
          <VideoCard video={featured} variant="large" />
        </div>
      </RevealSection>

      {/* Remaining videos with stagger animation */}
      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </StaggerGrid>
    </div>
  );
}
