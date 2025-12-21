import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

const getPageHref = (page: number) => (page === 1 ? "?" : `?page=${page}`);

// 计算中间要显示的页码（最多3个）
const getMiddlePages = (page: number, totalPages: number): number[] => {
  if (totalPages <= 5) {
    // 总页数 <= 5，返回除首尾外的所有页码
    return Array.from({ length: totalPages - 2 }, (_, i) => i + 2);
  }

  // 确保中间页码不包含首尾页
  const start = Math.max(2, Math.min(page - 1, totalPages - 3));
  const end = Math.min(totalPages - 1, Math.max(page + 1, 4));

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export function PaginationComponent({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const middlePages = getMiddlePages(page, totalPages);
  const showLeftEllipsis = middlePages[0] > 2;
  const showRightEllipsis =
    middlePages[middlePages.length - 1] < totalPages - 1;

  return (
    <Pagination>
      <PaginationContent>
        {/* 上一页 */}
        <PaginationItem>
          <PaginationPrevious
            href={hasPrev ? getPageHref(page - 1) : undefined}
            aria-disabled={!hasPrev}
            tabIndex={hasPrev ? 0 : -1}
            className={!hasPrev ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* 首页 */}
        <PaginationItem>
          <PaginationLink href={getPageHref(1)} isActive={page === 1}>
            1
          </PaginationLink>
        </PaginationItem>

        {/* 左省略号 */}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 中间页码 */}
        {middlePages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href={getPageHref(p)} isActive={page === p}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 右省略号 */}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 尾页 */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href={getPageHref(totalPages)}
              isActive={page === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 下一页 */}
        <PaginationItem>
          <PaginationNext
            href={hasNext ? getPageHref(page + 1) : undefined}
            aria-disabled={!hasNext}
            tabIndex={hasNext ? 0 : -1}
            className={!hasNext ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
