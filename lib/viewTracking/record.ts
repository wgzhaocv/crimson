import { redisClient } from "@/lib/redisCache";
import { hashIp } from "./hash";
import {
  SHARE_VIEW_STREAM_KEY,
  getDailyUvHllKey,
  VIEW_COUNT_DIRTY_DAYS_SET,
  VIEW_COUNT_DIRTY_TOTAL_SET,
  formatUtcYYYYMMDD,
  getDailyViewKey,
  getDirtyDaySetKey,
  getTotalViewKey,
} from "./redisKeys";
import type { ShareViewEvent } from "./types";

const DAY_TTL_SECONDS = 60 * 60 * 24 * 60; // 60 天
const STREAM_MAXLEN = 200_000; // 保留最近 20 万条（近似裁剪，防止 Redis 内存压力）

const limitLen = (value: string | null, maxLen: number): string | null => {
  if (!value) return null;
  if (value.length <= maxLen) return value;
  return value.slice(0, maxLen);
};

type RecordShareViewInput = {
  shareId: bigint; // snowflakeId
  viewerId?: string | null; // 登录用户 id（用于 UV）
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  viewedAt?: number; // 默认 Date.now()
};

/**
 * 记录一次浏览（高频写只打 Redis）：
 * - viewCount 增量：total + day
 * - dirty 标记：供 worker 批量落库
 * - 事件日志：写入 stream，worker 落库到 share_view
 */
export const recordShareView = async (input: RecordShareViewInput): Promise<void> => {
  const viewedAt = input.viewedAt ?? Date.now();
  const date = new Date(viewedAt);
  const day = formatUtcYYYYMMDD(date);

  const shareIdStr = input.shareId.toString();
  const totalKey = getTotalViewKey(shareIdStr);
  const dayKey = getDailyViewKey(shareIdStr, day);
  const dirtyDayKey = getDirtyDaySetKey(day);
  const uvKey = getDailyUvHllKey(shareIdStr, day);

  const event: ShareViewEvent = {
    shareId: shareIdStr,
    viewedAt,
    ipHash: input.ip ? hashIp(input.ip) : null,
    // 控制字段长度，避免 referer/ua 过大导致 stream 膨胀
    userAgent: limitLen(input.userAgent, 512),
    referer: limitLen(input.referer, 1024),
  };

  // 简单 UV 口径：优先登录用户，否则用 ipHash；没有就不计 UV
  const viewerKey = input.viewerId
    ? `u:${input.viewerId}`
    : input.ip
      ? `ip:${event.ipHash}`
      : null;

  // 用 multi 保证同一次浏览的写入尽量一致（同时也会 pipeline 发送）
  const pipeline = redisClient.multi();
  pipeline.incr(totalKey);
  pipeline.incr(dayKey);
  pipeline.expire(dayKey, DAY_TTL_SECONDS);

  // 标记需要落库（total + day）
  pipeline.sadd(VIEW_COUNT_DIRTY_TOTAL_SET, shareIdStr);
  pipeline.sadd(VIEW_COUNT_DIRTY_DAYS_SET, day);
  pipeline.sadd(dirtyDayKey, shareIdStr);
  pipeline.expire(dirtyDayKey, DAY_TTL_SECONDS);

  // UV（HyperLogLog）：写入当天 key，定期由 worker 写回 DB
  if (viewerKey) {
    pipeline.pfadd(uvKey, viewerKey);
    pipeline.expire(uvKey, DAY_TTL_SECONDS);
  }

  // 事件写入 stream（字段用空字符串表示 null，方便 Redis 存储）
  pipeline.xadd(
    SHARE_VIEW_STREAM_KEY,
    "MAXLEN",
    "~",
    STREAM_MAXLEN,
    "*",
    "shareId",
    event.shareId,
    "viewedAt",
    String(event.viewedAt),
    "ipHash",
    event.ipHash ?? "",
    "userAgent",
    event.userAgent ?? "",
    "referer",
    event.referer ?? "",
  );

  await pipeline.exec();
};
