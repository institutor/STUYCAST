import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { PlayButton } from "@/components/ui/PlayButton";
import { TiltWrapper } from "@/components/ui/TiltWrapper";
import type { Video } from "@/types/video";

interface VideoCardProps {
  video: Video;
  variant?: "large" | "small";
  className?: string;
}

export function VideoCard({ video, variant = "small", className }: VideoCardProps) {
  const isLarge = variant === "large";

  return (
    <TiltWrapper>
    <GlassCard padding="none" className={cn("group relative", className)}>
      <Link href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
        <div className={cn("relative overflow-hidden rounded-2xl", isLarge ? "aspect-video" : "aspect-video")}>
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes={isLarge ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayButton size={isLarge ? "lg" : "md"} />
          </div>

          {/* Category badge */}
          {video.category && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 text-xs font-medium bg-blue-500/80 backdrop-blur-sm text-white rounded-full">
                {video.category}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className={cn(
              "font-bold text-white leading-tight",
              isLarge ? "text-xl md:text-2xl" : "text-sm md:text-base"
            )}>
              {video.title}
            </h3>
            {video.publishedAt && (
              <p className="mt-1 text-xs text-slate-400">
                {new Date(video.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            )}
          </div>
        </div>
      </Link>
    </GlassCard>
    </TiltWrapper>
  );
}
