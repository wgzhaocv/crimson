import { ListWrapper } from "./ListWrapper";
import { ShareCardSkeleton } from "./ShareCardSkeleton";

export const ShareLoadingList = () => (
  <ListWrapper>
    {Array.from({ length: 6 }).map((_, i) => (
      <ShareCardSkeleton key={i} />
    ))}
  </ListWrapper>
);
