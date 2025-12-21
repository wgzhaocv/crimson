// 统一管理 view 相关 Redis key，保证 proxy 和 worker 一致

export const VIEW_COUNT_TOTAL_KEY_PREFIX = "share:vc:total:"; // share 总浏览增量
export const VIEW_COUNT_DAY_KEY_PREFIX = "share:vc:day:"; // share 每日浏览增量：share:vc:day:{shareId}:{YYYYMMDD}

export const VIEW_COUNT_DIRTY_TOTAL_SET = "share:vc:dirty:total"; // 需要落库的 shareId（总数）
export const VIEW_COUNT_DIRTY_DAYS_SET = "share:vc:dirty:days"; // 哪些日期有需要落库的数据（YYYYMMDD）
export const VIEW_COUNT_DIRTY_DAY_SET_PREFIX = "share:vc:dirty:day:"; // share:vc:dirty:day:{YYYYMMDD} -> set(shareId)

export const SHARE_VIEW_STREAM_KEY = "share:view:stream"; // 访问事件 stream
export const SHARE_UV_HLL_KEY_PREFIX = "share:uv:hll:"; // 每日 UV（HyperLogLog）：share:uv:hll:{shareId}:{YYYYMMDD}

export const getTotalViewKey = (shareId: bigint | string): string =>
  `${VIEW_COUNT_TOTAL_KEY_PREFIX}${shareId.toString()}`;

export const getDailyViewKey = (shareId: bigint | string, yyyymmdd: string): string =>
  `${VIEW_COUNT_DAY_KEY_PREFIX}${shareId.toString()}:${yyyymmdd}`;

export const getDirtyDaySetKey = (yyyymmdd: string): string =>
  `${VIEW_COUNT_DIRTY_DAY_SET_PREFIX}${yyyymmdd}`;

export const getDailyUvHllKey = (shareId: bigint | string, yyyymmdd: string): string =>
  `${SHARE_UV_HLL_KEY_PREFIX}${shareId.toString()}:${yyyymmdd}`;

// UTC 日期（用于切天统计）
export const formatUtcYYYYMMDD = (date: Date): string => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
};
