import { db } from "@/lib/db";
import { session } from "@/lib/db/schema";
import { cookies } from "next/headers";
import { createHMAC } from "@better-auth/utils/hmac";
import { nanoid } from "nanoid";

export const createBetterAuthSession = async (userId: string) => {
  const sessionToken = nanoid(64);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 写入数据库
  await db.insert(session).values({
    id: nanoid(),
    token: sessionToken,
    userId,
    expiresAt,
  });

  // 签名
  const signedToken = await createHMAC("SHA-256", "base64urlnopad").sign(
    process.env.BETTER_AUTH_SECRET!,
    sessionToken,
  );

  // 设置 cookie
  const cookieStore = await cookies();
  const isSecure = process.env.NODE_ENV === "production";

  cookieStore.set(
    isSecure
      ? "__Secure-better-auth.session_token"
      : "better-auth.session_token",
    signedToken,
    {
      expires: expiresAt,
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
    },
  );
};
