import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { snowflakeToBase62 } from "@/lib/base62";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const shares = await db
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
      .orderBy(desc(share.createdAt));

    return NextResponse.json(
      shares.map((s) => ({
        ...s,
        id: snowflakeToBase62(s.id),
      })),
    );
  } catch (error) {
    console.error("共有の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "共有の取得に失敗しました" },
      { status: 500 },
    );
  }
}
