import { NextRequest, NextResponse } from "next/server";
import { generateLoginOptions } from "./libs/generateLoginOptions";
import { verifyLogin } from "./libs/verifyLogin";

// GET: 获取登录选项
export async function GET() {
  try {
    const options = await generateLoginOptions();
    return NextResponse.json(options);
  } catch (error) {
    console.error("Failed to generate login options:", error);
    return NextResponse.json(
      { error: "ログインオプションの生成に失敗しました" },
      { status: 500 },
    );
  }
}

// POST: 验证登录
export async function POST(request: NextRequest) {
  try {
    const credential = await request.json();
    const result = await verifyLogin(credential);

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Login verification failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "認証に失敗しました" },
      { status: 400 },
    );
  }
}
