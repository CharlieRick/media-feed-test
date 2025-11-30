import { Suspense } from 'react';
import { getPopularMedia } from '@/lib/pexels';
import MediaGrid from '@/components/MediaGrid';
import MediaGridSkeleton from '@/components/MediaGridSkeleton';

export default async function FeedPage() {
  const { data } = await getPopularMedia(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-xl mx-auto px-4">
        <Suspense fallback={<MediaGridSkeleton />}>
          <MediaGrid initialMedia={data} />
        </Suspense>
      </div>
    </div>
  );
}
