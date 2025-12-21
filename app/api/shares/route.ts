import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { snowflakeToBase62 } from "@/lib/base62";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq, count } from "drizzle-orm";
import { PAGE_SIZE } from "@/components/ShareList";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  try {
    const [shares, totalResult] = await Promise.all([
      db
        .select({
          id: share.id,
          title: share.title,
          accessType: share.accessType,
          viewCount: share.viewCount,
          createdAt: share.createdAt,
          updatedAt: share.updatedAt,
        })
        .from(share)
        .where(eq(share.ownerId, session.user.id))
        .orderBy(desc(share.createdAt))
        .limit(PAGE_SIZE)
        .offset(offset),
      db
        .select({ total: count() })
        .from(share)
        .where(eq(share.ownerId, session.user.id)),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return NextResponse.json({
      data: shares.map((s) => ({
        ...s,
        id: snowflakeToBase62(s.id),
      })),
      total,
    });
  } catch (error) {
    console.error("共有の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "共有の取得に失敗しました" },
      { status: 500 },
    );
  }
}
