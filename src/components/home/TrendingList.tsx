import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Video } from "@/types/video";

interface TrendingListProps {
  videos: Video[];
}

export function TrendingList({ videos }: TrendingListProps) {
  return (
    <GlassCard className="h-full">
      <SectionHeading title="Trending Now" href="/videos" live />
      <div className="space-y-3">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 group p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="96px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                {video.title}
              </h4>
              {video.category && (
                <span className="text-xs text-slate-500 mt-1 block">{video.category}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}
