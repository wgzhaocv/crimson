import { createHash } from "crypto";

// 将 IP 做不可逆 hash（用于 share_view.ip_hash）
export const hashIp = (ip: string): string =>
  createHash("sha256").update(ip).digest("hex"); // 64 长度

