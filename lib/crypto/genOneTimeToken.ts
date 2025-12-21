import { createHmac, randomBytes } from "crypto";

export const genOneTimeToken = (shareBase62Id: string): string => {
  const timestamp = Date.now();
  const random = randomBytes(8).toString("hex");
  const data = `${shareBase62Id}:${timestamp}:${random}`;
  const signature = createHmac("sha256", process.env.SECRET_KEY!)
    .update(data)
    .digest("hex");
  return `${data}:${signature}`;
};
