const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-border animate-pulse rounded-xl ${className}`} />
)

export const CropDetailSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Hero */}
    <div className="bg-surface-2 px-4 md:px-8 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-4 w-16 mb-6" />
        <div className="flex gap-6 items-start">
          <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
          <div className="flex flex-col gap-3 flex-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Info cards */}
    <div className="px-4 md:px-8 lg:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>

        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export const CropsPageSkeleton = () => (
  <div className="min-h-screen bg-background px-4 md:px-8 lg:px-12 py-12">
    <div className="max-w-7xl mx-auto">
      <Skeleton className="h-8 w-64 mb-3" />
      <Skeleton className="h-4 w-96 mb-8" />
      <div className="flex gap-2 mb-8">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-9 w-20" />)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({length: 10}).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </div>
  </div>
)

export const HomeHeroSkeleton = () => (
  <div className="flex flex-col gap-3 items-center py-8">
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-12 w-96 max-w-full" />
    <Skeleton className="h-4 w-72 max-w-full" />
    <Skeleton className="h-14 w-full max-w-2xl mt-2" />
  </div>
)

export default Skeleton