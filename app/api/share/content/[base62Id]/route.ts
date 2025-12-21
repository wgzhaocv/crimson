import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { base62ToSnowflake } from "@/lib/base62";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ base62Id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { base62Id } = await params;

  try {
    const id = base62ToSnowflake(base62Id);

    const result = await db
      .select({
        content: share.content,
      })
      .from(share)
      .where(and(eq(share.id, id), eq(share.ownerId, session.user.id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "共有が見つかりません" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      content: result[0].content,
    });
  } catch {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }
}
