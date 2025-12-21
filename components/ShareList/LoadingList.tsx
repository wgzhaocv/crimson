import { ShareCardSkeleton } from "./ShareCardSkeleton";

export const ShareLoadingList = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <ShareCardSkeleton key={i} />
    ))}
  </div>
);
