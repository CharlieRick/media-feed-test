'use client';

import { useEffect } from 'react';
import { useAsync } from '@/hooks';
import MediaItem from '../MediaItem';
import MediaGridSkeleton from '../MediaGridSkeleton';
import { getPopularMedia } from '@/lib/pexels';
import type { MediaItem as MediaItemType } from '@/interfaces';

interface MediaGridProps {
  initialMedia: MediaItemType[];
}

export default function MediaGrid({
  initialMedia,
}: MediaGridProps) {
  const {
    data: media = initialMedia,
    isLoading,
    isError,
    error,
    run,
    currentPage,
    nextPage,
  } = useAsync<MediaItemType[]>({
    data: initialMedia,
    status: 'resolved',
    appendMode: true
  });

  // Load next page when near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
        !isLoading
      ) {
        const nextPageNum = currentPage + 1;
        run(getPopularMedia(nextPageNum));
        nextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, isLoading, run, nextPage]);

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load media: {error?.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1">
        {media?.map((item) => (
          <MediaItem key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>

      {isLoading && (
        <div className="mt-12">
          <MediaGridSkeleton count={8} />
        </div>
      )}

    </>
  );
}