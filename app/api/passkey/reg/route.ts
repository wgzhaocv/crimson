import { NextRequest, NextResponse } from "next/server";
import { genRegOptions } from "./libs/genRegOptions";
import { verifyReg } from "./libs/verifyReg";

// GET: 获取注册选项
export async function GET() {
  try {
    const options = await genRegOptions();
    return NextResponse.json(options);
  } catch (error) {
    console.error("Failed to generate registration options:", error);
    return NextResponse.json(
      { error: "登録オプションの生成に失敗しました" },
      { status: 500 },
    );
  }
}

// POST: 验证注册
export async function POST(request: NextRequest) {
  try {
    const credential = await request.json();
    const result = await verifyReg(credential);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Registration verification failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "認証に失敗しました" },
      { status: 400 },
    );
  }
}
