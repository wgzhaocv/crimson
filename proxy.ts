import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  setVerifyCookie,
  verifyShareVerifyToken,
} from "./lib/crypto/genShareVerify";
import { getShareCache } from "./lib/redisCache/shareCache";
import { base62ToSnowflake } from "./lib/base62";
import { auth } from "./lib/auth";
import { genOneTimeToken } from "./lib/crypto/genOneTimeToken";
import { checkPinIsValid } from "./lib/crypto/checkPinIsValid";
import { getReqIp } from "./lib/getReqIp";
import { recordShareView } from "./lib/viewTracking";
import {
  checkPasswordRateLimit,
  clearPasswordAttempts,
  recordPasswordFailure,
} from "./lib/redisCache/rateLimit";

const redirectToRenderPage = (base62Id: string) => {
  const token = genOneTimeToken(base62Id);
  const response = NextResponse.redirect(
    `${process.env.RENDER_URL}/share/${base62Id}?token=${token}`,
  );

  // 清除临时 cookie
  response.cookies.delete("share-state");
  response.cookies.delete("share-pin");

  return response;
};

const handleShare = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const base62Id = pathname.split("/")[2];
  const id = base62ToSnowflake(base62Id);

  const [shareData, session] = await Promise.all([
    getShareCache(id),
    auth.api.getSession({ headers: request.headers }),
  ]);

  // 记录一次浏览（排除 owner），异步写 Redis：不阻塞跳转
  const recordView = () => {
    if (session?.user.id && session.user.id === shareData?.ownerId) return;
    recordShareView({
      shareId: id,
      viewerId: session?.user.id ?? null,
      ip: getReqIp(request),
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    }).catch((err) => console.error("recordShareView failed:", err));
  };

  if (!shareData) {
    const response = NextResponse.next();
    response.cookies.set("share-state", "not-found", {
      path: pathname,
    });
    return response;
  }

  if (
    session?.user.id === shareData.ownerId ||
    shareData.accessType === "public"
  ) {
    // public 且非 owner：记一次浏览
    if (
      shareData.accessType === "public" &&
      session?.user.id !== shareData.ownerId
    ) {
      recordView();
    }
    return redirectToRenderPage(base62Id);
  }

  if (shareData.accessType === "private") {
    const response = NextResponse.next();
    response.cookies.set("share-state", "not-found", { path: pathname });
    return response;
  }

  const verifyTokenValid = await verifyShareVerifyToken(
    request,
    base62Id,
    shareData.contentUpdatedAt,
  );

  if (verifyTokenValid) {
    recordView();
    return redirectToRenderPage(base62Id);
  }

  const ip = getReqIp(request);
  if (ip) {
    const rateLimitResult = await checkPasswordRateLimit(base62Id, ip);
    if (!rateLimitResult.allowed) {
      const response = NextResponse.next();
      response.cookies.set(
        "share-state",
        `rate-limit:${rateLimitResult.remainingSeconds}`,
        { path: pathname },
      );
      return response;
    }
  }

  const pinStatus = await checkPinIsValid(request, shareData.pinHash!);

  if (pinStatus !== "valid") {
    if (ip && pinStatus === "invalid") {
      await recordPasswordFailure(base62Id, ip);
    }
    const response = NextResponse.next();
    const shareState =
      pinStatus === "empty" ? "need-password" : "invalid-password";
    response.cookies.set("share-state", shareState, { path: pathname });
    return response;
  }

  if (ip) {
    await clearPasswordAttempts(base62Id, ip);
  }

  recordView();
  const redirectResponse = redirectToRenderPage(base62Id);
  setVerifyCookie(redirectResponse, base62Id);
  return redirectResponse;
};

// This function can be marked `async` if using `await` inside
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
    return handleShare(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/share/:id"],
};
