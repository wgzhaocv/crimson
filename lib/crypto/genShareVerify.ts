import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const generateShareVerify = (shareBase62Id: string): string => {
  const timestamp = Date.now();
  const data = `${shareBase62Id}:${timestamp}`;
  const signature = createHmac("sha256", process.env.SECRET_KEY!)
    .update(data)
    .digest("hex");
  return `${data}:${signature}`;
};

export const setVerifyCookie = async (
  response: NextResponse,
  shareBase62Id: string,
) => {
  response.cookies.set("share-verify", generateShareVerify(shareBase62Id), {
    path: `/share/${shareBase62Id}`,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 86400,
  });
};

export const verifyShareVerifyToken = async (
  request: NextRequest,
  expectedShareBase62Id: string,
  updatedAt: string, // ISO 字符串，直接从 ShareData 传入
) => {
  const cookieValue = request.cookies.get("share-verify")?.value;
  if (!cookieValue) return false;

  const parts = cookieValue.split(":");
  if (parts.length !== 3) return false;

  const [shareBase62Id, timestamp, signature] = parts;

  if (shareBase62Id !== expectedShareBase62Id) return false;

  // ISO字符串转时间戳比较
  if (Number(timestamp) < new Date(updatedAt).getTime()) return false;

  if (Date.now() - Number(timestamp) > 24 * 60 * 60 * 1000) return false;

  const data = `${shareBase62Id}:${timestamp}`;
  const expectedSig = createHmac("sha256", process.env.SECRET_KEY!)
    .update(data)
    .digest("hex");

  return signature === expectedSig;
};
