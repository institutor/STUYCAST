import type { Metadata } from "next";
import { InstagramFeed } from "@/components/instagram/InstagramFeed";
import { PageTitle } from "@/components/ui/PageTitle";
import { StoriesBar } from "@/components/ui/StoriesBar";
import { getInstagramPosts, getInstagramCacheDate } from "@/lib/instagram";

export const metadata: Metadata = {
  title: "Instagram",
  description: "Browse StuyCast's Instagram feed - photos, videos, and highlights.",
};

export default async function InstagramPage() {
  const posts = await getInstagramPosts(20);
  const cacheDate = getInstagramCacheDate();

  const formattedDate = cacheDate
    ? new Date(cacheDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      <PageTitle
        glitchText="The Gram"
        subtitle="Behind-the-scenes photography and highlights from our Instagram."
      >
        The Gram
      </PageTitle>

      <StoriesBar />

      {posts.length > 0 ? (
        <>
          <InstagramFeed posts={posts} />
          {formattedDate && (
            <p className="text-center text-xs text-slate-500 mt-6">
              Last updated {formattedDate} &middot;{" "}
              <a
                href="https://instagram.com/stuycast"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Follow @stuycast for the latest
              </a>
            </p>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-400">No Instagram posts available.</p>
          <a
            href="https://instagram.com/stuycast"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
          >
            Follow us on Instagram &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
