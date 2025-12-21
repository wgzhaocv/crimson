"use client";

import { useQuery } from "@tanstack/react-query";
import { ShareCard, type Share } from "./ShareCard";
import { ShareLoadingList } from "./LoadingList";
import { ErrorShareList } from "./ErrorShareList";
import { EmptyShareList } from "./EmptyShareList";

const fetchShares = async (): Promise<Share[]> => {
  const res = await fetch("/api/shares");
  if (!res.ok) {
    let errorMessage = "";
    try {
      const json = await res.json();
      if (json.error) {
        errorMessage = json.error;
      }
    } catch {
      throw new Error("データの取得に失敗しました");
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const ShareList = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["shares"],
    queryFn: fetchShares,
  });

  // 加载状态
  if (isLoading) {
    return <ShareLoadingList />;
  }

  // 错误状态
  if (isError) {
    return <ErrorShareList error={error} refetch={refetch} />;
  }

  // 空状态
  if (!data || data.length === 0) {
    return <EmptyShareList />;
  }

  // 显示列表
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((share) => (
        <ShareCard key={share.id} share={share} />
      ))}
    </div>
  );
};
