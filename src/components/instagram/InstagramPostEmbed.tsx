import Image from "next/image";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCount, truncate } from "@/lib/utils";
import type { InstagramPost } from "@/types/instagram";

interface InstagramPostEmbedProps {
  post: InstagramPost;
  className?: string;
}

export function InstagramPostEmbed({ post, className }: InstagramPostEmbedProps) {
  return (
    <GlassCard padding="none" className={cn("flex flex-col", className)}>
      {/* Header - Instagram branding */}
      <div className="flex items-center gap-3 p-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">stuycast</p>
        </div>
        <svg className="w-5 h-5 text-slate-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
        </svg>
      </div>

      {/* Image */}
      <div className="relative aspect-square">
        <Image
          src={post.media_type === "VIDEO" ? (post.thumbnail_url || post.media_url) : post.media_url}
          alt={post.caption ? truncate(post.caption, 100) : "Instagram post"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 30vw"
        />
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
          <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </div>

        <p className="text-sm font-semibold text-white mb-1">
          {formatCount(post.like_count || 0)} likes
        </p>
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-white">stuycast</span>{" "}
          {post.caption ? truncate(post.caption, 120) : ""}
        </p>
        {post.comments_count && post.comments_count > 0 && (
          <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 mt-1 block hover:text-slate-400">
            View all {post.comments_count} comments
          </a>
        )}
      </div>
    </GlassCard>
  );
}
