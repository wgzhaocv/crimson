// 访问事件（写入 Redis Stream，worker 再批量落库到 share_view）

export type ShareViewEvent = {
  shareId: string; // snowflakeId，十进制字符串
  viewedAt: number; // 毫秒时间戳
  ipHash: string | null;
  userAgent: string | null;
  referer: string | null;
};

