import { createHmac, randomBytes } from "crypto";

export const genOneTimeToken = (shareBase62Id: string): string => {
  const timestamp = Date.now();
  const random = randomBytes(8).toString("base64url");
  const data = `${shareBase62Id}:${timestamp}:${random}`;
  const hmacFull = createHmac("sha256", process.env.SECRET_KEY!)
    .update(data)
    .digest();
  // Truncate HMAC to 16 bytes (128-bit, plenty for 10-min TTL)
  const signature = hmacFull.subarray(0, 16).toString("base64url");
  return `${timestamp}:${random}:${signature}`;
};
