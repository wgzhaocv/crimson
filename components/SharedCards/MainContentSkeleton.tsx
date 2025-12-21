import { ShareLoadingList } from "../ShareList/LoadingList";

export const MainContentSkeleton = () => {
  return (
    <main className="container mx-auto flex-1 px-4 py-8">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-1"></div>

        {/* Add HTML Fragment Button Skeleton */}
        <div className="bg-foreground/10 h-12 w-40 animate-pulse" />
      </div>

      {/* Content Grid Placeholder */}
      <ShareLoadingList />
    </main>
  );
};
