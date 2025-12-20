import { CopyRight } from "@/components/Layout/CopyRight";
import { HeaderSkeleton } from "@/components/Layout/Header";
import { MainContentSkeleton } from "@/components/SharedCards/MainContentSkeleton";

export const MainPageSkeleton = () => {
  return (
    <>
      <HeaderSkeleton />
      <MainContentSkeleton />
      <CopyRight />
    </>
  );
};

export default MainPageSkeleton;
