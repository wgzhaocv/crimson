// app/shares/page.tsx (Server Component)
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ShareList } from "@/components/ShareList";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";

// 服务端用的 fetch 函数，需要完整 URL
async function getShares() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shares`, {
    cache: "no-store",
    headers: {
      cookie: (await cookies()).toString(),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export const ServerShareListHydration = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["shares"],
    queryFn: getShares,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ShareList />
    </HydrationBoundary>
  );
};
