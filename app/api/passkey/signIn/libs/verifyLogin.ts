import { redisClient } from "@/lib/redis-client";
import { db } from "@/lib/db";
import { passkey } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  AuthenticationResponseJSON,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { getRelyingPartyID } from "@/lib/auth";
import { createBetterAuthSession } from "../../createBetterAuthSession";

export const verifyLogin = async (credential: AuthenticationResponseJSON) => {
  const clientDataJSON = JSON.parse(
    Buffer.from(credential.response.clientDataJSON, "base64").toString("utf-8"),
  );
  const challenge = clientDataJSON.challenge;

  const challengeData = await redisClient.get(`login:challenge:${challenge}`);
  if (!challengeData) {
    return { success: false, error: "認証がタイムアウトしました" };
  }

  // 从数据库查找 passkey
  const credentialIdBase64 = Buffer.from(credential.id, "base64url").toString(
    "base64",
  );

  const savedPasskey = await db.query.passkey.findFirst({
    where: eq(passkey.credentialID, credentialIdBase64),
  });

  if (!savedPasskey) {
    return { success: false, error: "パスキーが見つかりません" };
  }

  const verifyResult = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: challenge,
    expectedOrigin: process.env.BETTER_AUTH_URL!,
    expectedRPID: getRelyingPartyID(),
    requireUserVerification: true,
    credential: {
      id: savedPasskey.credentialID,
      publicKey: Buffer.from(savedPasskey.publicKey, "base64"),
      counter: savedPasskey.counter,
    },
  });

  await redisClient.del(`login:challenge:${challenge}`);

  if (!verifyResult.verified) {
    return { success: false, error: "認証に失敗しました" };
  }

  // 更新 counter
  await db
    .update(passkey)
    .set({ counter: verifyResult.authenticationInfo.newCounter })
    .where(eq(passkey.id, savedPasskey.id));

  // 创建 Better Auth session
  await createBetterAuthSession(savedPasskey.userId);

  return { success: true };
};
