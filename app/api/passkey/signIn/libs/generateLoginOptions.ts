import { getRelyingPartyID } from "@/lib/auth";
import { redisClient } from "@/lib/redis-client";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export const generateLoginOptions = async () => {
  const options = await generateAuthenticationOptions({
    rpID: getRelyingPartyID(),
    userVerification: "required",
    allowCredentials: [],
  });

  await redisClient.setex(
    `login:challenge:${options.challenge}`,
    60,
    JSON.stringify({
      challenge: options.challenge,
      createdAt: Date.now(),
    }),
  );

  // 添加 hints，优先提示使用手机等远程设备（Chrome 128+ 支持）
  return {
    ...options,
    hints: ["hybrid", "security-key", "client-device"] as const,
  };
};
