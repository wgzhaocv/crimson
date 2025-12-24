import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { handleShare } from "./lib/shareProxy/handleShare";
import { checkIsBotForOg } from "./lib/shareProxy/checkIsBotForOg";
import { handleBotView } from "./lib/shareProxy/handleBotView";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 认证路由处理
  if (pathname === "/" || pathname === "/login") {
    const session = await auth.api.getSession({ headers: request.headers });

    // 已登录访问 /login → 重定向到 /
    if (pathname === "/login" && session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 未登录访问 / → 重定向到 /login
    if (pathname === "/" && !session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  // /share/:id 处理
  if (pathname.startsWith("/share/")) {
    if (checkIsBotForOg(request)) {
      return handleBotView(request);
    }
    return handleShare(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/share/:id"],
};
