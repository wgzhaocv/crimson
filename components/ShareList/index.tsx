"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ShareCard, type ShareListItemType } from "./ShareCard";
import { ShareLoadingList } from "./LoadingList";
import { ErrorShareList } from "./ErrorShareList";
import { EmptyShareList } from "./EmptyShareList";
import { UploadArea } from "../SharedCards/UploadCard";
import { ShareDialog } from "../ShareDialog/ShareDialog";
import { PaginationComponent } from "./Pagination";

export const PAGE_SIZE = 20;

type SharesResponse = {
  data: ShareListItemType[];
  total: number;
};

const fetchShares = async (page: number): Promise<SharesResponse> => {
  const res = await fetch(`/api/shares?page=${page}`);
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
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["shares", page],
    queryFn: () => fetchShares(page),
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
  if (!data || data.data.length === 0) {
    return <EmptyShareList />;
  }

  const totalPages = Math.ceil(data.total / PAGE_SIZE);

  // 显示列表
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UploadArea />
        {data.data.map((share) => (
          <ShareDialog key={share.id} initialData={share}>
            <ShareCard share={share} />
          </ShareDialog>
        ))}
      </div>
      {totalPages > 1 && <PaginationComponent totalPages={totalPages} />}
    </div>
  );
};
