import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { base62ToSnowflake, snowflakeToBase62 } from "@/lib/base62";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { headers } from "next/headers";

const SCREENSHOT_DIR = join(process.cwd(), "files", "screenshots");

type Params = { params: Promise<{ base62Id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { base62Id } = await params;

  try {
    const id = base62ToSnowflake(base62Id);

    const result = await db
      .select({
        coverId: share.coverId,
        accessType: share.accessType,
        ownerId: share.ownerId,
      })
      .from(share)
      .where(eq(share.id, id))
      .limit(1);

    if (result.length === 0 || !result[0].coverId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 非公开分享需要验证是否为 owner
    if (result[0].accessType !== "public") {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session || session.user.id !== result[0].ownerId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }

    const etag = `"${snowflakeToBase62(result[0].coverId)}"`;

    // 协商缓存：ETag 匹配则返回 304
    if (request.headers.get("If-None-Match") === etag) {
      return new Response(null, {
        status: 304,
        headers: { ETag: etag },
      });
    }

    const filename = `${snowflakeToBase62(result[0].coverId)}.jpg`;
    const filepath = join(SCREENSHOT_DIR, filename);

    const buffer = await readFile(filepath);

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=60, must-revalidate",
        ETag: etag,
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
