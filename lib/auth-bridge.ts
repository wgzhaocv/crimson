import { timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
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

// 按 email 找用户；没有就建一个（emailVerified=true，日后 Google 登录按 email
// link 到这同一行）。email 唯一约束 + onConflictDoNothing 兜并发插入。
export async function findOrCreateUserByEmail(email: string): Promise<string> {
  const found = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  if (found.length > 0) return found[0].id;

  await db
    .insert(user)
    .values({
      id: nanoid(),
      name: email.split("@")[0] || email,
      email,
      emailVerified: true,
    })
    .onConflictDoNothing({ target: user.email });

  // insert 成功或并发冲突都靠这次 re-select 拿到稳定 id。
  const row = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  return row[0].id;
}

type ResolveResult = { userId: string } | { error: NextResponse };

// 现有 cookie session 之外，多认一条「amber secret + email」路径。命中走
// find-or-create；否则回落到 better-auth 的 session。返回形状与原
// getSessionOrError 完全一致，所以所有调用点无需改动。
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
    const userId = await findOrCreateUserByEmail(email);
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
