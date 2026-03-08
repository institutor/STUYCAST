export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoId: string;
  duration?: string;
  publishedAt: string;
  views?: number;
  category?: string;
}
