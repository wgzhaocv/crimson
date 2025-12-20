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
  return options;
};
