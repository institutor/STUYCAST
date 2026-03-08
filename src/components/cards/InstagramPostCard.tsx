"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCount, truncate } from "@/lib/utils";
import { TiltWrapper } from "@/components/ui/TiltWrapper";
import type { InstagramPost } from "@/types/instagram";

interface InstagramPostCardProps {
  post: InstagramPost;
  className?: string;
}

export function InstagramPostCard({ post, className }: InstagramPostCardProps) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = post.media_type === "VIDEO" ? (post.thumbnail_url || null) : post.media_url;

  return (
    <TiltWrapper>
    <GlassCard padding="none" className={cn("group", className)}>
      <a href={post.permalink} target="_blank" rel="noopener noreferrer">
        <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-slate-800">
          {imgSrc && !imgError ? (
            <Image
              src={imgSrc}
              alt={post.caption ? truncate(post.caption, 100) : "Instagram post"}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url('/logo.png')", backgroundSize: "40%", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-3">
                <svg className="w-6 h-6 text-white/50 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {post.caption && (
                <p className="text-[10px] text-white/30 text-center px-4 line-clamp-2 max-w-[80%]">
                  {truncate(post.caption, 60)}
                </p>
              )}
            </div>
          )}
          {post.media_type === "VIDEO" && (
            <div className="absolute top-3 right-3">
              <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          {post.media_type === "CAROUSEL_ALBUM" && (
            <div className="absolute top-3 right-3">
              <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="2" y="2" width="16" height="16" rx="2" />
                <rect x="6" y="6" width="16" height="16" rx="2" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-3">
          {/* Engagement */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-xs text-slate-400">{formatCount(post.like_count || 0)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-xs text-slate-400">{formatCount(post.comments_count || 0)}</span>
            </div>
          </div>

          {post.caption && (
            <p className="text-xs text-slate-400 line-clamp-2">{post.caption}</p>
          )}
        </div>
      </a>
    </GlassCard>
    </TiltWrapper>
  );
}
