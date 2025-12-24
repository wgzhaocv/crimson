import { NextResponse, NextRequest } from "next/server";
import { auth } from "../auth";
import { base62ToSnowflake } from "../base62";
import { checkPinIsValid } from "../crypto/checkPinIsValid";
import { genOneTimeToken } from "../crypto/genOneTimeToken";
import {
  verifyShareVerifyToken,
  setVerifyCookie,
} from "../crypto/genShareVerify";
import { getReqIp } from "../getReqIp";
import {
  checkPasswordRateLimit,
  recordPasswordFailure,
  clearPasswordAttempts,
} from "../redisCache/rateLimit";
import { getShareCache } from "../redisCache/shareCache";
import { recordShareView } from "../viewTracking";

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

export const handleShare = async (request: NextRequest) => {
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
