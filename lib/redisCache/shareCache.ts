import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { eq, and } from "drizzle-orm";
import { redisClient } from "./index";

const CACHE_PREFIX = "share:";
const CACHE_TTL = 60 * 60 * 24; // 24 小时

export type ShareData = {
  id: string;
  ownerId: string;
  accessType: "public" | "password" | "private";
  pinHash: string | null;
  content: string;
  coverId: string | null;
  title: string | null;
  description: string | null;
  contentUpdatedAt: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

// BigInt 序列化处理
const serializeShare = (data: typeof share.$inferSelect): ShareData => ({
  id: data.id.toString(),
  ownerId: data.ownerId,
  accessType: data.accessType,
  pinHash: data.pinHash,
  content: data.content,
  coverId: data.coverId?.toString() ?? null,
  title: data.title,
  description: data.description,
  contentUpdatedAt: data.contentUpdatedAt.toISOString(),
  viewCount: data.viewCount,
  createdAt: data.createdAt.toISOString(),
  updatedAt: data.updatedAt.toISOString(),
});

const getCacheKey = (id: bigint | string): string =>
  `${CACHE_PREFIX}${id.toString()}`;

/**
 * 获取 share，优先从缓存取，没有则从数据库取并缓存
 */
export const getShareCache = async (
  id: bigint,
  ownerId?: string,
): Promise<ShareData | null> => {
  const cacheKey = getCacheKey(id);

  // 先尝试从缓存获取
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    const data = JSON.parse(cached) as ShareData;
    // 如果指定了 ownerId，验证所有权
    if (ownerId && data.ownerId !== ownerId) {
      return null;
    }
    return data;
  }

  // 缓存未命中，从数据库查询
  const whereClause = ownerId
    ? and(eq(share.id, id), eq(share.ownerId, ownerId))
    : eq(share.id, id);

  const result = await db.select().from(share).where(whereClause).limit(1);

  if (result.length === 0) {
    return null;
  }

  const serialized = serializeShare(result[0]);

  // 存入缓存
  await redisClient.set(cacheKey, JSON.stringify(serialized), "EX", CACHE_TTL);

  return serialized;
};

/**
 * 更新 share 缓存（通常在更新数据库后调用）
 */
export const setShareCache = async (
  data: typeof share.$inferSelect,
): Promise<void> => {
  const cacheKey = getCacheKey(data.id);
  const serialized = serializeShare(data);
  await redisClient.set(cacheKey, JSON.stringify(serialized), "EX", CACHE_TTL);
};

/**
 * 删除 share 缓存
 */
export const deleteShareCache = async (id: bigint | string): Promise<void> => {
  const cacheKey = getCacheKey(id);
  await redisClient.del(cacheKey);
};

/**
 * 刷新 share 缓存（从数据库重新加载）
 */
export const refreshShareCache = async (
  id: bigint,
): Promise<ShareData | null> => {
  await deleteShareCache(id);
  return getShareCache(id);
};
