import { SkeletonCard } from '../SkeletonCard';

interface MediaGridSkeletonProps {
  count?: number;
}

export default function MediaGridSkeleton({ count = 12 }: MediaGridSkeletonProps) {
  return (
    <div className="grid lg:grid-cols-1 animate-pulse">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={`skeleton-${i}`} />
      ))}
    </div>
  );
}