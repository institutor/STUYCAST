import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero skeleton */}
      <div className="flex flex-col lg:flex-row gap-5">
        <Skeleton className="lg:w-[60%] aspect-video rounded-2xl" />
        <Skeleton className="lg:w-[40%] h-80 rounded-2xl" />
      </div>
      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Skeleton className="aspect-video rounded-2xl" />
        <Skeleton className="aspect-square rounded-2xl" />
        <Skeleton className="aspect-square rounded-2xl" />
      </div>
      {/* Bottom grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="aspect-square rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
