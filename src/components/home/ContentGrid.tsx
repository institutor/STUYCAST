"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Instagram, Users, ArrowRight } from "lucide-react";
import { formatCount, truncate } from "@/lib/utils";
import type { Video } from "@/types/video";
import type { InstagramPost, InstagramProfile } from "@/types/instagram";

interface ContentGridProps {
  video: Video;
  instagramPost: InstagramPost | null;
  instagramProfile: InstagramProfile | null;
  recentPosts: InstagramPost[];
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function ContentGrid({ video, instagramPost, instagramProfile, recentPosts }: ContentGridProps) {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Section header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center">
            <Instagram className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">From Our Instagram</h2>
        </div>
        <Link
          href="/instagram"
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-1"
        >
          See all <ArrowRight className="w-3 h-3" />
        </Link>
      </motion.div>

      {/* Instagram profile banner + recent posts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
        {/* Profile card */}
        <motion.div variants={fadeUp}>
          {instagramProfile ? (
            <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-pink-500/40">
                  <Image
                    src={instagramProfile.profile_picture_url}
                    alt={instagramProfile.username}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">StuyCast</p>
                  <p className="text-xs text-slate-400">@{instagramProfile.username}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
                {instagramProfile.biography || "Stuyvesant's student-run media production team."}
              </p>
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-lg font-bold text-white">{formatCount(instagramProfile.followers_count)}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Followers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{formatCount(instagramProfile.media_count)}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Posts</p>
                </div>
              </div>
              <a
                href={`https://instagram.com/${instagramProfile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-400 hover:to-purple-500 transition-all"
              >
                <Instagram className="w-3.5 h-3.5" />
                Follow on Instagram
              </a>
            </div>
          ) : (
            <div className="h-full bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-8 min-h-[200px]">
              <p className="text-slate-500 text-sm">Loading profile...</p>
            </div>
          )}
        </motion.div>

        {/* Recent posts grid */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {recentPosts.slice(0, 8).map((post, i) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 transition-all duration-300"
              >
                <Image
                  src={post.media_type === "VIDEO" ? (post.thumbnail_url || post.media_url) : post.media_url}
                  alt={post.caption ? truncate(post.caption, 50) : "Post"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 33vw, 15vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                {post.like_count !== undefined && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-semibold text-white">
                      {formatCount(post.like_count)} likes
                    </span>
                  </div>
                )}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Secondary video pick */}
      <motion.div variants={fadeUp} className="mt-6">
        <Link
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col md:flex-row items-center gap-5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 256px"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-1 block">
              Latest Video
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
              {video.title}
            </h3>
            <p className="mt-1 text-sm text-slate-400 line-clamp-2">{video.description}</p>
            <p className="mt-2 text-xs text-slate-500">
              {new Date(video.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 hidden md:block" />
        </Link>
      </motion.div>
    </motion.section>
  );
}
