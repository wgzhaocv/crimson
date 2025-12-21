import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { base62ToSnowflake } from "@/lib/base62";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import type { ZodError } from "zod";

// 获取 session，返回 userId 或错误响应
export async function getSessionOrError() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "認証が必要です" }, { status: 401 }),
    };
  }

  return { userId: session.user.id };
}

// 获取用户的 share，返回 share 或错误响应
export async function getShareOrError(base62Id: string, userId: string) {
  try {
    const id = base62ToSnowflake(base62Id);

    const result = await db
      .select()
      .from(share)
      .where(and(eq(share.id, id), eq(share.ownerId, userId)))
      .limit(1);

    if (result.length === 0) {
      return {
        error: NextResponse.json(
          { error: "共有が見つかりません" },
          { status: 404 },
        ),
      };
    }

    return { share: result[0], id };
  } catch {
    return {
      error: NextResponse.json({ error: "無効なIDです" }, { status: 400 }),
    };
  }
}

// 解析 Zod 错误
export function parseZodError(error: ZodError): string {
  return error.issues[0]?.message ?? "入力が無効です";
}

// 哈希 PIN
export async function hashPin(
  accessType: string,
  pin: string | null,
): Promise<string | null> {
  if (accessType !== "password" || !pin) {
    return null;
  }
  return Bun.password.hash(pin, { algorithm: "bcrypt", cost: 10 });
}

// 验证 PIN
export async function verifyPin(
  pin: string,
  pinHash: string,
): Promise<boolean> {
  return Bun.password.verify(pin, pinHash);
}
