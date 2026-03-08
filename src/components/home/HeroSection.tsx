"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { Video } from "@/types/video";

interface HeroSectionProps {
  featuredVideo: Video;
  trendingVideos: Video[];
}

export function HeroSection({ featuredVideo, trendingVideos }: HeroSectionProps) {
  return (
    <section className="relative">
      {/* Main featured video — cinematic full-width */}
      <Link
        href={`https://www.youtube.com/watch?v=${featuredVideo.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[21/9] md:aspect-[2.4/1] rounded-3xl overflow-hidden"
      >
        <Image
          src={featuredVideo.thumbnailUrl}
          alt={featuredVideo.title}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="100vw"
        />
        {/* Multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-primary)]/70 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-14">
          {/* Category + badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            {featuredVideo.category && (
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-500/80 backdrop-blur-sm text-white rounded-full">
                {featuredVideo.category}
              </span>
            )}
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/10 backdrop-blur-sm text-white/80 rounded-full">
              Featured
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-3xl"
          >
            {featuredVideo.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-3 text-sm md:text-base text-slate-300 max-w-xl line-clamp-2"
          >
            {featuredVideo.description}
          </motion.p>

          {/* Play button row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mt-6 flex items-center gap-4"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              <Play className="w-4 h-4 fill-current" />
              Watch Now
            </span>
            <span className="text-xs text-slate-400">
              {new Date(featuredVideo.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              {featuredVideo.views && ` · ${(featuredVideo.views / 1000).toFixed(1)}K views`}
            </span>
          </motion.div>
        </div>
      </Link>

      {/* Trending strip below hero */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            Trending Now
          </h2>
          <Link href="/videos" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trendingVideos.slice(0, 4).map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
            >
              <Link
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-medium text-white line-clamp-2 leading-snug">{video.title}</p>
                  {video.category && (
                    <span className="mt-1 inline-block text-[10px] text-slate-400">{video.category}</span>
                  )}
                </div>
                {/* Small play icon */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
