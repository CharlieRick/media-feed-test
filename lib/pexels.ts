import { ApiResponse, PexelsPhoto, PexelsVideo } from "@/interfaces";

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
const PEXELS_API_URL = process.env.NEXT_PUBLIC_PEXELS_API_URL;

export type MediaItem =
  | { type: 'photo' } & PexelsPhoto
  | { type: 'video' } & PexelsVideo;

export async function getPopularMedia(page: number = 1): Promise<ApiResponse<MediaItem[]>> {
  const perPage = 15;

  if (typeof PEXELS_API_KEY !== 'string') {
    throw new Error('PEXELS_API_KEY is missing from .env');
  }

  const [photosRes, videosRes] = await Promise.all([
    fetch(`${PEXELS_API_URL}/v1/curated?page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: 3600 },
    }),
    fetch(`${PEXELS_API_URL}/videos/popular?page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: 3600 },
    }),
  ]);

  // Safety checks
  if (!photosRes.ok) throw new Error(`Photos API error: ${photosRes.status}`);
  if (!videosRes.ok) throw new Error(`Videos API error: ${videosRes.status}`);

  const photosData = await photosRes.json();
  const videosData = await videosRes.json();

  // Debug 
  console.log('Pexels photos:', photosData);
  console.log('Pexels videos:', videosData);

  const photos = photosData.photos || [];
  const videos = videosData.videos || [];

  // Interleave media
  const media: MediaItem[] = [];
  const length = Math.max(photos.length, videos.length);

  for (let i = 0; i < length; i++) {
    if (i < photos.length) {
      media.push({ type: 'photo', ...photos[i] } as MediaItem);
    }
    if (i < videos.length) {
      media.push({ type: 'video', ...videos[i] } as MediaItem);
    }
  }

  return {
    data: media,
    meta: {
      page: {
        current_page: page,
        per_page: perPage,
        last_page: page + 10,
        total: page
      },
    },
  };
}