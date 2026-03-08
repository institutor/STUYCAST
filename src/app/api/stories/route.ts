import { getInstagramStories, getInstagramProfile } from "@/lib/instagram";
import { NextResponse } from "next/server";

// Revalidate every 5 minutes — stories are ephemeral
export const revalidate = 300;

export async function GET() {
  const [stories, profile] = await Promise.all([
    getInstagramStories(),
    getInstagramProfile(),
  ]);

  return NextResponse.json({
    stories,
    profile: profile
      ? {
          username: profile.username,
          name: profile.name,
          avatar: profile.profile_picture_url,
        }
      : null,
  });
}
