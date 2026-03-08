import { getInstagramPosts } from "@/lib/instagram";
import { NextResponse } from "next/server";

export const revalidate = 3600;

const MAX_LIMIT = 30;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = parseInt(searchParams.get("limit") ?? "12", 10);
  const limit = Math.max(1, Math.min(raw, MAX_LIMIT));

  const posts = await getInstagramPosts(limit);
  return NextResponse.json({ posts });
}
