import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { snowflakeToBase62 } from "@/lib/base62";
import { resolveUserId } from "@/lib/auth-bridge";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getViewCountTotalDeltas } from "@/lib/viewTracking";

export async function GET() {
  const result = await resolveUserId();
  if ("error" in result) return result.error;
  const { userId } = result;

  try {
    const shares = await db
      .select({
        id: share.id,
        title: share.title,
        accessType: share.accessType,
        viewCount: share.viewCount,
        coverId: share.coverId,
        createdAt: share.createdAt,
        updatedAt: share.updatedAt,
      })
      .from(share)
      .where(eq(share.ownerId, userId))
      .orderBy(desc(share.createdAt));

    // 近实时：DB viewCount + Redis 增量
    const deltas = await getViewCountTotalDeltas(shares.map((s) => s.id));

    return NextResponse.json(
      shares.map((s) => ({
        ...s,
        viewCount: s.viewCount + (deltas.get(s.id.toString()) ?? 0),
        id: snowflakeToBase62(s.id),
        coverId: s.coverId ? snowflakeToBase62(s.coverId) : null,
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
