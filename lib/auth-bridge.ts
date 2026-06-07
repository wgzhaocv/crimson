import { timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema/auth-schema";

// amber 服务端 → crimson 服务端的 server-to-server 认证。
// 链路：amber CLI →(bearer)→ amber 服务端 →(下面这对头)→ crimson。
// 密钥只在两个服务端之间，不下发到任何客户端。
const SECRET_HEADER = "x-amber-secret";
const EMAIL_HEADER = "x-amber-email";

// 长度不同直接 false；长度相同走常量时间比较，避免计时旁路。
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// 按 email 找用户，没有返回 null。amber 侧已用 Google OAuth 验证过该 email，但
// crimson 不替用户预建账号——本人需先在网页用 Google 登录一次（注册即登录）。
// 早期 amber 直接预建的存量行（emailVerified=true）仍会命中，照常可用。
async function findUserIdByEmail(email: string): Promise<string | null> {
  const found = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  return found[0]?.id ?? null;
}

type ResolveResult = { userId: string } | { error: NextResponse };

// 现有 cookie session 之外，多认一条「amber secret + email」路径。命中且该
// email 已注册则放行；未注册回 403 引导网页登录；否则回落到 better-auth 的
// session。返回形状与原 getSessionOrError 完全一致，所以所有调用点无需改动。
export async function resolveUserId(): Promise<ResolveResult> {
  const h = await headers();

  const provided = h.get(SECRET_HEADER);
  const expected = process.env.AMBER_INGEST_SECRET;
  if (provided && expected && secretMatches(provided, expected)) {
    const email = h.get(EMAIL_HEADER);
    if (!email) {
      return {
        error: NextResponse.json(
          { error: "X-Amber-Email がありません" },
          { status: 400 },
        ),
      };
    }
    const userId = await findUserIdByEmail(email);
    if (!userId) {
      const base = process.env.BASE_URL;
      const hint = base
        ? `crimson に未登録です。先に ${base}/login で Google ログインしてください`
        : "crimson に未登録です。先にブラウザで Google ログインしてください";
      return {
        error: NextResponse.json({ error: hint }, { status: 403 }),
      };
    }
    return { userId };
  }

  const session = await auth.api.getSession({ headers: h });
  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "認証が必要です" }, { status: 401 }),
    };
  }
  return { userId: session.user.id };
}
