"use server";
import {
  generateRegistrationOptions,
} from "@simplewebauthn/server";
import { redisClient } from "@/lib/redis-client";
import { getRelyingPartyID } from "@/lib/auth";
import { nanoid } from "nanoid";

export const genRegOptions = async () => {
    const userId = nanoid(); // 默认 21 字符
const userIdBuffer = Buffer.from(userId, "utf-8");

  const options = await generateRegistrationOptions({
    rpName: "CRIMSON",
    rpID: getRelyingPartyID(),
    userName: userId,
    userID: userIdBuffer,
    authenticatorSelection: {
      userVerification: "required", // 强制要求用户验证
      residentKey: "preferred", // 优先但不强制常驻密钥
    },
  });

  // 存储到 Redis，60秒过期
  await redisClient.setex(
    `reg:challenge:${options.challenge}`,
    60,
    JSON.stringify({
      challenge: options.challenge,
      userId,
      createdAt: Date.now(),
    })
  );

  return options;
};