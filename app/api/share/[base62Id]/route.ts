import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { updateShareSchema } from "@/lib/schemas/share";
import {
  getSessionOrError,
  getShareOrError,
  hashPin,
  parseZodError,
} from "../utils";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { deleteShareCache, getShareCache } from "@/lib/redisCache/shareCache";
import { base62ToSnowflake, snowflakeToBase62 } from "@/lib/base62";
import { enqueueScreenshot } from "@/lib/screenshotQueue";
import { unlink } from "fs/promises";
import { join } from "path";

type Params = { params: Promise<{ base62Id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const sessionResult = await getSessionOrError();
  if ("error" in sessionResult) return sessionResult.error;
  const { userId } = sessionResult;

  const { base62Id } = await params;

  try {
    const id = base62ToSnowflake(base62Id);
    const shareData = await getShareCache(id, userId);

    if (!shareData) {
      return NextResponse.json(
        { error: "共有が見つかりません" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      content: shareData.content,
    });
  } catch {
    return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const sessionResult = await getSessionOrError();
  if ("error" in sessionResult) return sessionResult.error;
  const { userId } = sessionResult;

  const { base62Id } = await params;
  const shareResult = await getShareOrError(base62Id, userId);
  if ("error" in shareResult) return shareResult.error;
  const { id, share: existingShare } = shareResult;

  try {
    const body = await request.json();
    const parsed = updateShareSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parseZodError(parsed.error) },
        { status: 400 },
      );
    }

    const { html, title, accessType, changePin, pin } = parsed.data;

    // 只有 changePin 为 true 时才更新 pinHash
    const pinHash = changePin
      ? await hashPin(accessType, pin)
      : existingShare.pinHash;

    // 检查核心字段是否有变化
    const now = new Date();
    const coreFieldsChanged = pinHash !== existingShare.pinHash;
    const contentChanged = html !== existingShare.content;

    await db
      .update(share)
      .set({
        content: html,
        title,
        accessType,
        pinHash,
        updatedAt: now,
        ...(coreFieldsChanged && { contentUpdatedAt: now }),
        // 内容变更时：置空 coverId 并更新 contentUpdatedAt
        ...(contentChanged && { coverId: null, contentUpdatedAt: now }),
      })
      .where(eq(share.id, id));

    // 清除缓存
    await deleteShareCache(id);

    // 内容变更时：删除旧截图文件，重新入队
    if (contentChanged) {
      if (existingShare.coverId) {
        const oldFilename = `${snowflakeToBase62(existingShare.coverId)}.jpg`;
        const oldPath = join(process.cwd(), "files", "screenshots", oldFilename);
        unlink(oldPath).catch(() => {});
      }
      enqueueScreenshot(id, now).catch((err) =>
        console.error("[screenshot] enqueue failed:", err)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("共有の更新に失敗しました:", error);
    return NextResponse.json(
      { error: "共有の更新に失敗しました" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const sessionResult = await getSessionOrError();
  if ("error" in sessionResult) return sessionResult.error;
  const { userId } = sessionResult;

  const { base62Id } = await params;
  const shareResult = await getShareOrError(base62Id, userId);
  if ("error" in shareResult) return shareResult.error;
  const { id } = shareResult;

  try {
    // 删除截图文件（如果存在）
    if (shareResult.share.coverId) {
      const filename = `${snowflakeToBase62(shareResult.share.coverId)}.jpg`;
      const filepath = join(process.cwd(), "files", "screenshots", filename);
      await unlink(filepath).catch(() => {});
    }

    await db.delete(share).where(eq(share.id, id));

    // 清除缓存
    await deleteShareCache(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("共有の削除に失敗しました:", error);
    return NextResponse.json(
      { error: "共有の削除に失敗しました" },
      { status: 500 },
    );
  }
}
