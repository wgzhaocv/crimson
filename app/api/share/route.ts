import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { share } from "@/lib/db/schema/biz-schema";
import { generateSnowflakeId } from "@/lib/snowflake";
import { snowflakeToBase62 } from "@/lib/base62";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const shareSchema = z
  .object({
    html: z.string().min(1, "HTMLコンテンツは必須です"),
    title: z.string().nullable(),
    accessType: z.enum(["public", "password", "private"], {
      message: "有効なアクセスタイプが必要です",
    }),
    pin: z.string().nullable(),
  })
  .refine(
    (data) =>
      data.accessType !== "password" || (data.pin && data.pin.length > 0),
    {
      message: "パスワード保護された共有にはPINが必要です",
      path: ["pin"],
    },
  );

const parseFormData = (formData: FormData) => ({
  html: formData.get("html") as string | null,
  title: formData.get("title") as string | null,
  accessType: formData.get("accessType") as string | null,
  pin: Array.from({ length: 6 }, (_, i) => formData.get(`pin-${i}`)).join(""),
});

export async function POST(request: Request) {
  // 验证身份
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const parsed = shareSchema.safeParse(parseFormData(formData));

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "入力が無効です";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { html, title, accessType, pin } = parsed.data;

    // 生成雪花ID
    const id = generateSnowflakeId();

    // 哈希 PIN（如果有）
    const pinHash =
      accessType === "password" && pin
        ? await Bun.password.hash(pin, { algorithm: "bcrypt", cost: 10 })
        : null;

    // 插入数据库
    await db.insert(share).values({
      id,
      ownerId: session.user.id,
      accessType,
      pinHash,
      content: html,
      title,
    });

    // 返回 base62 编码的 ID
    return NextResponse.json({
      id: snowflakeToBase62(id),
    });
  } catch (error) {
    console.error("共有の作成に失敗しました:", error);
    return NextResponse.json(
      { error: "共有の作成に失敗しました" },
      { status: 500 },
    );
  }
}
