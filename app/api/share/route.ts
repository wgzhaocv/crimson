import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { generateSnowflakeId } from "@/lib/snowflake";
import { snowflakeToBase62 } from "@/lib/base62";
import { createShareSchema } from "@/lib/schemas/share";
import { getSessionOrError, hashPin, parseZodError } from "./utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const sessionResult = await getSessionOrError();
  if ("error" in sessionResult) return sessionResult.error;
  const { userId } = sessionResult;

  try {
    const body = await request.json();
    const parsed = createShareSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parseZodError(parsed.error) }, { status: 400 });
    }

    const { html, title, accessType, pin } = parsed.data;
    const id = generateSnowflakeId();
    const pinHash = await hashPin(accessType, pin);

    await db.insert(share).values({
      id,
      ownerId: userId,
      accessType,
      pinHash,
      content: html,
      title,
    });

    return NextResponse.json({ id: snowflakeToBase62(id) });
  } catch (error) {
    console.error("共有の作成に失敗しました:", error);
    return NextResponse.json(
      { error: "共有の作成に失敗しました" },
      { status: 500 },
    );
  }
}
