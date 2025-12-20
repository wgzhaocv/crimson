import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const MainContentSkeleton = () => {
  return (
    <main className="container mx-auto flex-1 px-4 py-8">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-1"></div>

        {/* Add HTML Fragment Button Skeleton */}
        <Skeleton className="h-12 w-40 rounded-md" />
      </div>

      {/* Content Grid Placeholder */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UploadCardSkeleton />
        <UploadCardSkeleton />
        <UploadCardSkeleton />
      </div>
    </main>
  );
};

const UploadCardSkeleton = () => {
  return (
    <Card className="border-border/50 flex flex-col items-center justify-center space-y-4 border-2 border-dashed bg-transparent p-12 text-center">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6 mx-auto" />
      </div>
    </Card>
  );
};
