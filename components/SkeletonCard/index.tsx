export function SkeletonCard() {
  return (
    <div className="pb-12 pt-12 not-last:border-b border-white/30">

      <div className="relative aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />

        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/60 to-transparent">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-full w-3/4 mb-2" />
          <div className="h-2 bg-gray-400 dark:bg-gray-700 rounded-full w-1/2" />
        </div>
      </div>
    </div>
  );
}
