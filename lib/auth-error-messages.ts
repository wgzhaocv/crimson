import { authClient } from "@/lib/auth-client";

// 获取所有错误代码的类型
type ErrorCode = keyof typeof authClient.$ERROR_CODES;

// 日语错误消息映射
export const errorMessages: Record<ErrorCode, string> = {
  USER_NOT_FOUND: "ユーザーが見つかりません",
  FAILED_TO_CREATE_USER: "ユーザーの作成に失敗しました",
  FAILED_TO_CREATE_SESSION: "セッションの作成に失敗しました",
  FAILED_TO_UPDATE_USER: "ユーザー情報の更新に失敗しました",
  FAILED_TO_GET_SESSION: "セッションの取得に失敗しました",
  INVALID_PASSWORD: "パスワードが正しくありません",
  INVALID_EMAIL: "メールアドレスが無効です",
  INVALID_EMAIL_OR_PASSWORD: "メールアドレスまたはパスワードが間違っています",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "このアカウントは既に連携されています",
  PROVIDER_NOT_FOUND: "認証プロバイダーが見つかりません",
  INVALID_TOKEN: "トークンが無効です",
  ID_TOKEN_NOT_SUPPORTED: "IDトークンはサポートされていません",
  FAILED_TO_GET_USER_INFO: "ユーザー情報の取得に失敗しました",
  USER_EMAIL_NOT_FOUND: "ユーザーのメールアドレスが見つかりません",
  EMAIL_NOT_VERIFIED: "メールアドレスが未確認です",
  PASSWORD_TOO_SHORT: "パスワードが短すぎます",
  PASSWORD_TOO_LONG: "パスワードが長すぎます",
  USER_ALREADY_EXISTS: "このメールアドレスは既に登録されています",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "このメールアドレスは既に使用されています。別のメールアドレスをご利用ください",
  EMAIL_CAN_NOT_BE_UPDATED: "メールアドレスを更新できません",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "認証情報が見つかりません",
  SESSION_EXPIRED: "セッションの有効期限が切れました。再度ログインしてください",
  FAILED_TO_UNLINK_LAST_ACCOUNT: "最後のアカウントの連携を解除できません",
  ACCOUNT_NOT_FOUND: "アカウントが見つかりません",
  USER_ALREADY_HAS_PASSWORD: "既にパスワードが設定されています",

  CHALLENGE_NOT_FOUND: "認証チャレンジが見つかりません",
  YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY: "このパスキーを登録する権限がありません",
  FAILED_TO_VERIFY_REGISTRATION: "パスキーの登録確認に失敗しました",
  PASSKEY_NOT_FOUND: "パスキーが見つかりません",
  AUTHENTICATION_FAILED: "認証に失敗しました",
  UNABLE_TO_CREATE_SESSION: "セッションを作成できませんでした",
  FAILED_TO_UPDATE_PASSKEY: "パスキーの登録に失敗しました",
};

export function getErrorMessage(code?: string): string {
  if (!code) return "エラーが発生しました";

  if (code in errorMessages) {
    return errorMessages[code as ErrorCode];
  }

  return "エラーが発生しました";
}