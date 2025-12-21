import { redisClient } from "@/lib/redisCache";
import { getTotalViewKey } from "./redisKeys";

/**
 * 读取多个 share 的“总浏览增量”（Redis -> number）。
 * 用于页面显示：DB.viewCount + RedisDelta。
 */
export const getViewCountTotalDeltas = async (
  shareIds: Array<bigint>,
): Promise<Map<string, number>> => {
  if (shareIds.length === 0) return new Map();

  const keys = shareIds.map((id) => getTotalViewKey(id.toString()));
  const values = await redisClient.mget(...keys);

  const result = new Map<string, number>();
  for (let i = 0; i < shareIds.length; i++) {
    const raw = values[i];
    const delta = raw ? Number.parseInt(raw, 10) : 0;
    if (delta > 0) result.set(shareIds[i].toString(), delta);
  }
  return result;
};

