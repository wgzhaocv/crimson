import { NextRequest } from "next/server";

export function getReqIp(request: NextRequest): string | null {
  const h = request.headers;

  const cfIP = h.get("cf-connecting-ip");
  if (cfIP) return cfIP;

  const xForwardedFor = h.get("x-forwarded-for");
  if (xForwardedFor) return xForwardedFor.split(",")[0].trim();

  const xRealIP = h.get("x-real-ip");
  if (xRealIP) return xRealIP;

  return null;
}
