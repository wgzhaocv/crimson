import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { generateSnowflakeId } from "@/lib/snowflake";
import { snowflakeToBase62 } from "@/lib/base62";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { deleteShareCache } from "@/lib/redisCache/shareCache";
import { unlink, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const SCREENSHOT_DIR = join(process.cwd(), "files", "screenshots");

export async function POST(request: Request) {
  // 鉴权：共享密钥
  const secret = request.headers.get("X-Screenshot-Secret");
  if (secret !== process.env.SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const shareId = formData.get("shareId") as string;
  const contentUpdatedAt = formData.get("contentUpdatedAt") as string;
  const image = formData.get("image") as Blob;

  if (!shareId || !contentUpdatedAt || !image) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 过时检查：contentUpdatedAt 是否仍然匹配
  const existing = await db
    .select({
      coverId: share.coverId,
      contentUpdatedAt: share.contentUpdatedAt,
    })
    .from(share)
    .where(eq(share.id, BigInt(shareId)))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json({ error: "Share not found" }, { status: 404 });
  }

  const current = existing[0];
  const dbTime = current.contentUpdatedAt.getTime();
  const reqTime = new Date(contentUpdatedAt).getTime();
  if (Math.abs(dbTime - reqTime) > 1000) {
    // 内容已在截图生成期间更新，丢弃
    return NextResponse.json({ error: "Stale screenshot" }, { status: 409 });
  }

  // 生成新 coverId
  const coverId = generateSnowflakeId();
  const filename = `${snowflakeToBase62(coverId)}.jpg`;

  await mkdir(SCREENSHOT_DIR, { recursive: true });

  // 写入文件
  const buffer = Buffer.from(await image.arrayBuffer());
  await writeFile(join(SCREENSHOT_DIR, filename), buffer);

  // 删除旧截图文件
  if (current.coverId) {
    const oldFilename = `${snowflakeToBase62(current.coverId)}.jpg`;
    await unlink(join(SCREENSHOT_DIR, oldFilename)).catch(() => {});
  }

  // 更新数据库
  await db
    .update(share)
    .set({ coverId })
    .where(eq(share.id, BigInt(shareId)));

  // 清除缓存
  await deleteShareCache(shareId);

  return NextResponse.json({ coverId: snowflakeToBase62(coverId) });
}
