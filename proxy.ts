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
import {
  checkPasswordRateLimit,
  clearPasswordAttempts,
  recordPasswordFailure,
} from "./lib/redisCache/rateLimit";

const redirectToRenderPage = (base62Id: string) => {
  const token = genOneTimeToken(base62Id);
  return NextResponse.redirect(
    `${process.env.RENDER_URL}/share/${base62Id}?token=${token}`,
  );
};

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const base62Id = pathname.split("/")[2];
  const id = base62ToSnowflake(base62Id);

  const [shareData, session] = await Promise.all([
    getShareCache(id),
    auth.api.getSession({ headers: request.headers }),
  ]);

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

  const redirectResponse = redirectToRenderPage(base62Id);
  redirectResponse.cookies.delete("share-pin");
  setVerifyCookie(redirectResponse, base62Id);
  return redirectResponse;
}

export const config = {
  matcher: "/share/:id",
};
