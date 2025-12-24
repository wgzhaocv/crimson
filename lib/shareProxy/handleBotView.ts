import { NextRequest, NextResponse } from "next/server";
import { base62ToSnowflake } from "../base62";
import { getShareCache } from "../redisCache/shareCache";
import { clearHtmlBody } from "./clearHtmlBody";
import { getNotFoundOrPrivateOgHtml, getPasswordRequiredOgHtml } from "./og";

const createHtmlResponse = (html: string, status: number = 200) => {
  return new NextResponse(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
};

export const handleBotView = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const base62Id = pathname.split("/")[2];
  const id = base62ToSnowflake(base62Id);

  const shareData = await getShareCache(id);

  // 不存在或私有：返回 not found 页面
  if (!shareData || shareData.accessType === "private") {
    return createHtmlResponse(getNotFoundOrPrivateOgHtml(pathname), 404);
  }

  // 需要密码：返回密码确认页面
  if (shareData.accessType === "password") {
    return createHtmlResponse(getPasswordRequiredOgHtml(pathname));
  }

  // 公开：返回原始 HTML（清理 body）
  const headerHtml = clearHtmlBody(shareData.content);
  return createHtmlResponse(headerHtml);
};
