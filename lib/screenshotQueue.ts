import { redisClient } from "@/lib/redisCache";
import { snowflakeToBase62 } from "@/lib/base62";

const QUEUE_KEY = "screenshot:queue";

/**
 * 将截图任务推入 Redis 队列（fire-and-forget）
 * 截图服务挂了也不影响主流程
 */
export async function enqueueScreenshot(
  shareId: bigint,
  contentUpdatedAt: Date,
) {
  const job = JSON.stringify({
    shareId: shareId.toString(),
    base62Id: snowflakeToBase62(shareId),
    contentUpdatedAt: contentUpdatedAt.toISOString(),
  });
  await redisClient.lpush(QUEUE_KEY, job);
}
