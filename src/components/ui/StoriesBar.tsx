"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StoryViewer, type Story } from "@/components/ui/story-viewer";
import { manualStories } from "@/data/stories";

interface StoriesData {
  stories: {
    id: string;
    media_type: "IMAGE" | "VIDEO";
    media_url: string;
    timestamp: string;
  }[];
  profile: {
    username: string;
    name: string;
    avatar: string;
  } | null;
}

export function StoriesBar() {
  const [apiData, setApiData] = useState<StoriesData | null>(null);

  // Only fetch from API if no manual stories are configured
  useEffect(() => {
    if (manualStories.length > 0) return;

    fetch("/api/stories")
      .then((res) => res.json())
      .then((d: StoriesData) => setApiData(d))
      .catch(() => {});
  }, []);

  // Manual stories take priority
  const viewerStories: Story[] =
    manualStories.length > 0
      ? manualStories
      : (apiData?.stories ?? []).map((s) => ({
          id: s.id,
          type: s.media_type === "VIDEO" ? "video" : "image",
          src: s.media_url,
        }));

  if (viewerStories.length === 0) return null;

  const profile = apiData?.profile ?? {
    username: "stuycast",
    name: "StuyCast",
    avatar: "/logo.png",
  };

  const timestamp =
    manualStories.length > 0
      ? new Date().toISOString()
      : apiData?.stories[0]?.timestamp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8 -mt-4"
    >
      <div className="flex items-center gap-4 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden">
        <StoryViewer
          stories={viewerStories}
          username={profile.username}
          avatar={profile.avatar}
          timestamp={timestamp}
        />

        {/* Subtle label */}
        <div className="flex flex-col gap-0.5 pl-2 min-w-fit">
          <span className="font-[var(--font-outfit)] text-[10px] uppercase tracking-[3px] text-white/20">
            Live story
          </span>
          <span className="font-[var(--font-outfit)] text-[11px] text-white/40">
            Tap to view
          </span>
        </div>
      </div>
    </motion.div>
  );
}
