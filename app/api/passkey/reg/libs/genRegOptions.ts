import {
  generateRegistrationOptions,
} from "@simplewebauthn/server";
import { redisClient } from "@/lib/redis-client";
import { getRelyingPartyID } from "@/lib/auth";
import { nanoid } from "nanoid";

export const genRegOptions = async () => {
  const userId = nanoid(); // 默认 21 字符
  const userIdBuffer = Buffer.from(userId, "utf-8");
  const displayName = `CrimsonUser#${userId.slice(0, 6)}`;

  const options = await generateRegistrationOptions({
    rpName: "CRIMSON",
    rpID: getRelyingPartyID(),
    userName: displayName,
    userID: userIdBuffer,
    authenticatorSelection: {
      userVerification: "required",
      residentKey: "preferred",
    },
    // 优先提示使用手机等远程设备（Chrome 128+ 支持，其他浏览器可能忽略）
    preferredAuthenticatorType: "remoteDevice",
  });

  // 存储到 Redis，60秒过期
  await redisClient.setex(
    `reg:challenge:${options.challenge}`,
    60,
    JSON.stringify({
      challenge: options.challenge,
      userId,
      displayName,
      createdAt: Date.now(),
    })
  );

  return options;
};