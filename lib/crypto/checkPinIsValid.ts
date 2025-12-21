import { verifyPin } from "@/app/api/share/utils";
import { NextRequest } from "next/server";

type PinStatus = "empty" | "valid" | "invalid";

export const checkPinIsValid = async (
  request: NextRequest,
  pinHash: string,
): Promise<PinStatus> => {
  const cookieValue = request.cookies.get("share-pin")?.value;
  if (!cookieValue) return "empty";

  // 检查是否为6位数字字符串
  if (!/^\d{6}$/.test(cookieValue)) return "empty";

  const isValid = await verifyPin(cookieValue, pinHash);

  return isValid ? "valid" : "invalid";
};
