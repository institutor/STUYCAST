import type { Video } from "@/types/video";

export const featuredVideo: Video = {
  id: "1",
  title: "Stuyvesant Class of 2029: Big Sib x Little Sib Jolly January",
  description:
    "The Class of 2029 kicks off the new year with the Big Sib x Little Sib Jolly January event — bonding, energy, and Stuyvesant spirit all around.",
  thumbnailUrl: "https://img.youtube.com/vi/8XJTT1CKL7g/maxresdefault.jpg",
  videoId: "8XJTT1CKL7g",
  publishedAt: "2026-02-08",
  category: "Events",
};

export const trendingVideos: Video[] = [
  {
    id: "2",
    title: "A Letter to Our Counselors: Thank You | Stuyvesant High School",
    description:
      "For National School Counseling Week, Stuyvesant students share heartfelt messages of gratitude to the counselors who guide them through it all.",
    thumbnailUrl: "https://img.youtube.com/vi/40o8UpmlY64/maxresdefault.jpg",
    videoId: "40o8UpmlY64",
    publishedAt: "2026-02-07",
    category: "Community",
  },
  {
    id: "3",
    title: "Stuyvesant Class of 2029: Big Sib x Little Sib Picnic 2025",
    description:
      "The Class of 2029 celebrates spring with their Big Sib x Little Sib Picnic — good vibes, good weather, good people.",
    thumbnailUrl: "https://img.youtube.com/vi/cRm2Unngs10/maxresdefault.jpg",
    videoId: "cRm2Unngs10",
    publishedAt: "2025-10-15",
    category: "Events",
  },
  {
    id: "4",
    title: "Stuyvesant Class of 2026: Senior Sunrise",
    description:
      "The Class of 2026 gathers for an unforgettable Senior Sunrise, welcoming the dawn of their final year at Stuyvesant.",
    thumbnailUrl: "https://img.youtube.com/vi/EY_5bTtAa6E/maxresdefault.jpg",
    videoId: "EY_5bTtAa6E",
    publishedAt: "2025-09-20",
    category: "Events",
  },
  {
    id: "5",
    title: "The Orange (2025) - A Short Film",
    description:
      "A student-produced short film by StuyCast — storytelling through cinema, made entirely by Stuyvesant students.",
    thumbnailUrl: "https://img.youtube.com/vi/t_40QD0tidA/maxresdefault.jpg",
    videoId: "t_40QD0tidA",
    publishedAt: "2025-08-10",
    category: "Film",
  },
  {
    id: "6",
    title: "Stuyvesant Class of 2026: Junior SING!",
    description:
      "The Class of 2026 takes the stage for Junior SING! — music, dance, and drama in one electrifying performance.",
    thumbnailUrl: "https://img.youtube.com/vi/YRDpu7cBb_A/maxresdefault.jpg",
    videoId: "YRDpu7cBb_A",
    publishedAt: "2025-04-15",
    category: "Events",
  },
];

export const secondaryVideo: Video = {
  id: "7",
  title: "Stuyvesant Class of 2025: Senior Sunset",
  description:
    "The Class of 2025 bids farewell at Senior Sunset — a golden evening of memories, friends, and one last hurrah.",
  thumbnailUrl: "https://img.youtube.com/vi/o2lgtzYWh6Q/maxresdefault.jpg",
  videoId: "o2lgtzYWh6Q",
  publishedAt: "2025-06-10",
  category: "Events",
};

export const additionalVideos: Video[] = [
  {
    id: "8",
    title: "Stuyvesant Outlet Showcase 2025 - Spreading Awareness",
    description:
      "StuyCast covers the Outlet Showcase 2025, highlighting student creativity and spreading awareness through art and media.",
    thumbnailUrl: "https://img.youtube.com/vi/Xv7wwN_OffQ/maxresdefault.jpg",
    videoId: "Xv7wwN_OffQ",
    publishedAt: "2025-03-20",
    category: "Events",
  },
  {
    id: "9",
    title: "Stuyvesant Outlet Showcase 2025 - Official Trailer",
    description:
      "The official trailer for Stuyvesant's Outlet Showcase 2025 — a preview of the talent and passion on display.",
    thumbnailUrl: "https://img.youtube.com/vi/J7TPWCyD_6Q/maxresdefault.jpg",
    videoId: "J7TPWCyD_6Q",
    publishedAt: "2025-03-15",
    category: "Events",
  },
];

export const allVideos: Video[] = [
  featuredVideo,
  ...trendingVideos,
  secondaryVideo,
  ...additionalVideos,
];
