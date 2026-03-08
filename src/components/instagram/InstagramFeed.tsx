import { cn } from "@/lib/utils";
import { InstagramPostCard } from "@/components/cards/InstagramPostCard";
import type { InstagramPost } from "@/types/instagram";

interface InstagramFeedProps {
  posts: InstagramPost[];
  className?: string;
}

export function InstagramFeed({ posts, className }: InstagramFeedProps) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {posts.map((post) => (
        <InstagramPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
