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
import { base62ToSnowflake } from "@/lib/base62";

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
    const coreFieldsChanged =
      html !== existingShare.content ||
      accessType !== existingShare.accessType ||
      pinHash !== existingShare.pinHash;

    await db
      .update(share)
      .set({
        content: html,
        title,
        accessType,
        pinHash,
        updatedAt: now,
        ...(coreFieldsChanged && { contentUpdatedAt: now }),
      })
      .where(eq(share.id, id));

    // 清除缓存
    await deleteShareCache(id);

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
