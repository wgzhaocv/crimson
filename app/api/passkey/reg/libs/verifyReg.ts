import { getRelyingPartyID } from "@/lib/auth";
import { db } from "@/lib/db";
import { passkey, user } from "@/lib/db/schema";
import { redisClient } from "@/lib/redis-client";
import {
  RegistrationResponseJSON,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { nanoid } from "nanoid";
import { createBetterAuthSession } from "../../createBetterAuthSession";

export const verifyReg = async (credential: RegistrationResponseJSON) => {
  // 从客户端响应中提取 challenge
  const clientDataJSON = JSON.parse(
    Buffer.from(credential.response.clientDataJSON, "base64").toString("utf-8"),
  );
  const challenge = clientDataJSON.challenge;

  // 从 Redis 获取
  const challengeData = await redisClient.get(`reg:challenge:${challenge}`);
  if (!challengeData) {
    throw new Error("Challenge not found or expired");
  }

  const { challenge: expectedChallenge, userId } = JSON.parse(challengeData);
  // clear redis
  redisClient.del(`reg:challenge:${challenge}`);

  const verifyResult = await verifyRegistrationResponse({
    response: credential,
    expectedChallenge,
    expectedOrigin: process.env.BETTER_AUTH_URL as string,
    expectedRPID: getRelyingPartyID(),
    requireUserVerification: true, // 强制要求用户验证
  });

  if (verifyResult.verified) {
    const { credential: cred } = verifyResult.registrationInfo;

    await db.insert(user).values({
      id: userId,
      email: `${nanoid()}@passkey.local`, // 假 email，保证唯一
      name: "Passkey User",
      emailVerified: true,
    });

    await db.insert(passkey).values({
      id: nanoid(),
      userId,
      credentialID: Buffer.from(cred.id, "base64url").toString("base64"),
      publicKey: Buffer.from(cred.publicKey).toString("base64"),
      counter: cred.counter,
      deviceType: verifyResult.registrationInfo!.credentialDeviceType,
      backedUp: verifyResult.registrationInfo!.credentialBackedUp,
    });

    await createBetterAuthSession(userId);
  }
  return null;
};
