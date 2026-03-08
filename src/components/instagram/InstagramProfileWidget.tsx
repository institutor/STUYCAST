import Image from "next/image";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCount } from "@/lib/utils";
import type { InstagramPost, InstagramProfile } from "@/types/instagram";

interface InstagramProfileWidgetProps {
  profile: InstagramProfile;
  recentPosts: InstagramPost[];
  className?: string;
}

export function InstagramProfileWidget({ profile, recentPosts, className }: InstagramProfileWidgetProps) {
  return (
    <GlassCard padding="none" className={cn("flex flex-col", className)}>
      {/* Profile header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/30">
            <Image
              src={profile.profile_picture_url}
              alt={profile.username}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">StuyCast</p>
            <p className="text-xs text-slate-400">@{profile.username}</p>
          </div>
          <a
            href={`https://instagram.com/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 text-xs font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors"
          >
            Follow
          </a>
        </div>
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-white">{formatCount(profile.followers_count)}</span> followers
          {" · "}
          <span className="font-semibold text-white">{formatCount(profile.media_count)}</span> posts
        </p>
      </div>

      {/* 3x3 post grid */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {recentPosts.slice(0, 9).map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square group overflow-hidden"
          >
            <Image
              src={post.media_type === "VIDEO" ? (post.thumbnail_url || post.media_url) : post.media_url}
              alt={post.caption ? post.caption.slice(0, 50) : "Post"}
              fill
              className="object-cover group-hover:opacity-80 transition-opacity"
              sizes="(max-width: 768px) 33vw, 10vw"
            />
          </a>
        ))}
      </div>

      {/* Footer link */}
      <a
        href={`https://instagram.com/${profile.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center py-3 text-xs text-blue-400 hover:text-blue-300 transition-colors border-t border-white/5"
      >
        View Instagram &rarr;
      </a>
    </GlassCard>
  );
}
