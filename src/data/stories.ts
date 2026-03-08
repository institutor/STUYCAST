/**
 * Manual stories — add your own story content here.
 *
 * To add a new story:
 *   1. Drop your image/video into public/stories/
 *   2. Add an entry below
 *   3. Redeploy (or restart dev server)
 *
 * Stories at the top of the array show first.
 * Remove old entries whenever you want.
 */
export const manualStories: {
  id: string;
  type: "image" | "video";
  src: string;
}[] = [
  { id: "story-1", type: "image", src: "/stories/story-1.jpg" },
  { id: "story-2", type: "image", src: "/stories/story-2.jpg" },
  { id: "story-3", type: "image", src: "/stories/story-3.jpg" },
  { id: "story-4", type: "image", src: "/stories/story-4.jpg" },
];
