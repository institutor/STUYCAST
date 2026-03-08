import type { InstagramPost, InstagramProfile, InstagramApiResponse, InstagramStory } from "@/types/instagram";

const INSTAGRAM_API_BASE = "https://graph.instagram.com/v21.0";

export async function getInstagramPosts(limit = 12): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId || token === "your_long_lived_access_token_here") {
    console.warn("Instagram API not configured. Using placeholder data.");
    return getPlaceholderPosts();
  }

  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count";
    const url = `${INSTAGRAM_API_BASE}/${userId}/media?fields=${fields}&limit=${limit}&access_token=${token}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Instagram API error:", res.status);
      return getPlaceholderPosts();
    }

    const data: InstagramApiResponse = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error("Instagram fetch error:", error);
    return getPlaceholderPosts();
  }
}

export async function getInstagramProfile(): Promise<InstagramProfile | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId || token === "your_long_lived_access_token_here") {
    return getPlaceholderProfile();
  }

  try {
    const fields = "id,username,name,biography,profile_picture_url,followers_count,media_count";
    const url = `${INSTAGRAM_API_BASE}/${userId}?fields=${fields}&access_token=${token}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return getPlaceholderProfile();
    return res.json();
  } catch {
    return getPlaceholderProfile();
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token;
  } catch {
    return null;
  }
}

/**
 * Fetch active Instagram stories (ephemeral, 24h).
 * Falls back to recent posts converted to story format when API is unconfigured
 * or no active stories exist.
 */
export async function getInstagramStories(): Promise<InstagramStory[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId || token === "your_long_lived_access_token_here") {
    return getPlaceholderStories();
  }

  try {
    // Step 1: Get story media IDs
    const storiesUrl = `${INSTAGRAM_API_BASE}/${userId}/stories?access_token=${token}`;
    const storiesRes = await fetch(storiesUrl, { next: { revalidate: 300 } }); // 5 min cache

    if (!storiesRes.ok) {
      // Stories endpoint may fail if account doesn't have active stories
      return getPlaceholderStories();
    }

    const storiesData: { data?: { id: string }[] } = await storiesRes.json();
    const storyIds = storiesData.data ?? [];

    if (storyIds.length === 0) {
      return getPlaceholderStories();
    }

    // Step 2: Fetch details for each story
    const fields = "id,media_type,media_url,timestamp";
    const stories: InstagramStory[] = await Promise.all(
      storyIds.map(async ({ id }) => {
        const url = `${INSTAGRAM_API_BASE}/${id}?fields=${fields}&access_token=${token}`;
        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) return null;
        const data = await res.json();
        return {
          id: data.id,
          media_type: data.media_type as "IMAGE" | "VIDEO",
          media_url: data.media_url,
          timestamp: data.timestamp,
        };
      })
    ).then((results) => results.filter((s): s is InstagramStory => s !== null));

    return stories.length > 0 ? stories : getPlaceholderStories();
  } catch (error) {
    console.error("Instagram stories fetch error:", error);
    return getPlaceholderStories();
  }
}

// Using picsum.photos for reliable placeholder images
const placeholderImages = [
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&h=600&fit=crop",
];

function getPlaceholderPosts(): InstagramPost[] {
  return placeholderImages.map((url, i) => ({
    id: `placeholder-${i + 1}`,
    caption: `StuyCast moment #${i + 1} - Catch all the action from Stuyvesant High School! Follow us for more updates. #StuyCast #Stuyvesant #NYC`,
    media_type: "IMAGE" as const,
    media_url: url,
    permalink: "https://instagram.com/stuycast",
    timestamp: new Date(2023, 10, 15 - i).toISOString(),
    like_count: Math.floor(Math.random() * 3000) + 500,
    comments_count: Math.floor(Math.random() * 100) + 10,
  }));
}

function getPlaceholderStories(): InstagramStory[] {
  // Show recent StuyCast-themed images as "stories" when no live IG stories
  const storyImages = [
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=1400&fit=crop", // camera filming
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=1400&fit=crop", // behind scenes
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=1400&fit=crop", // film production
    "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&h=1400&fit=crop", // event coverage
  ];

  return storyImages.map((url, i) => ({
    id: `story-placeholder-${i + 1}`,
    media_type: "IMAGE" as const,
    media_url: url,
    timestamp: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(), // staggered hours ago
  }));
}

function getPlaceholderProfile(): InstagramProfile {
  return {
    id: "placeholder",
    username: "stuycast",
    name: "StuyCast",
    biography: "Stuyvesant High School's premier media club. Videos, social media, and more.",
    profile_picture_url: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=150&h=150&fit=crop",
    followers_count: 2500,
    media_count: 150,
  };
}
