import { redisClient } from "./index";

// 等待时间配置（秒）
const LOCKOUT_SCHEDULE = [
  { attempts: 5, waitSeconds: 60 }, // 5次错误 → 等1分钟
  { attempts: 6, waitSeconds: 300 }, // 6次 → 等5分钟
  { attempts: 7, waitSeconds: 900 }, // 7次 → 等15分钟
  { attempts: 8, waitSeconds: 3600 }, // 8次 → 等1小时
  { attempts: 9, waitSeconds: 10800 }, // 9次 → 等3小时
  { attempts: 10, waitSeconds: 86400 }, // 10次+ → 等24小时
];

const getWaitSeconds = (attempts: number): number => {
  for (let i = LOCKOUT_SCHEDULE.length - 1; i >= 0; i--) {
    if (attempts >= LOCKOUT_SCHEDULE[i].attempts) {
      return LOCKOUT_SCHEDULE[i].waitSeconds;
    }
  }
  return 0;
};

interface RateLimitResult {
  allowed: boolean;
  remainingSeconds?: number;
  attempts?: number;
}

export const checkPasswordRateLimit = async (
  shareBase62Id: string,
  ip: string,
): Promise<RateLimitResult> => {
  const key = `pwd_attempt:${shareBase62Id}:${ip}`;
  const data = await redisClient.hgetall(key);

  if (!data.attempts) {
    return { allowed: true };
  }

  const attempts = parseInt(data.attempts);
  const lockedUntil = parseInt(data.locked_until || "0");
  const now = Date.now();

  if (lockedUntil > now) {
    return {
      allowed: false,
      remainingSeconds: Math.ceil((lockedUntil - now) / 1000),
      attempts,
    };
  }

  return { allowed: true, attempts };
};

export async function recordPasswordFailure(
  shareBase62Id: string,
  ip: string,
): Promise<{ attempts: number; waitSeconds: number }> {
  const key = `pwd_attempt:${shareBase62Id}:${ip}`;
  const attempts = await redisClient.hincrby(key, "attempts", 1);
  const waitSeconds = getWaitSeconds(attempts);

  if (waitSeconds > 0) {
    const lockedUntil = Date.now() + waitSeconds * 1000;
    await redisClient.hset(key, "locked_until", lockedUntil);
  }

  // 24小时后自动清除记录
  await redisClient.expire(key, 86400);

  return { attempts, waitSeconds };
}

export async function clearPasswordAttempts(
  shareBase62Id: string,
  ip: string,
): Promise<void> {
  const key = `pwd_attempt:${shareBase62Id}:${ip}`;
  await redisClient.del(key);
}
