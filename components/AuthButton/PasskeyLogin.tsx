"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { Fingerprint, Plus } from "lucide-react";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

export const PasskeyLogin = ({
  setError,
}: {
  setError: (error: string) => void;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [isSignUpPending, setIsSignUpPending] = useState(false);
  const router = useRouter();

  const handlePasskeySignIn = async () => {
    setIsPending(true);
    setError("");

    try {
      // 1. 获取登录选项
      const optionsRes = await fetch("/api/passkey/signIn");
      if (!optionsRes.ok) {
        throw new Error("ログインオプションの取得に失敗しました");
      }
      const options = await optionsRes.json();

      // 2. 调用浏览器 WebAuthn API
      const credential = await startAuthentication({ optionsJSON: options });

      // 3. 发送验证
      const verifyRes = await fetch("/api/passkey/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });

      const result = await verifyRes.json();

      if (!verifyRes.ok || !result.success) {
        throw new Error(result.error || "ログインに失敗しました");
      }

      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        // 用户取消不显示错误
        if (error.name === "NotAllowedError") {
          setError("");
        } else {
          setError(error.message);
        }
      } else {
        setError("ログインに失敗しました");
      }
    } finally {
      setIsPending(false);
    }
  };

  const handlePasskeySignUp = async () => {
    setIsSignUpPending(true);
    setError("");

    try {
      // 1. 获取注册选项
      const optionsRes = await fetch("/api/passkey/reg");
      if (!optionsRes.ok) {
        throw new Error("登録オプションの取得に失敗しました");
      }
      const options = await optionsRes.json();

      // 2. 调用浏览器 WebAuthn API
      const credential = await startRegistration({ optionsJSON: options });

      // 3. 发送验证
      const verifyRes = await fetch("/api/passkey/reg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });

      const result = await verifyRes.json();

      if (!verifyRes.ok || !result.success) {
        throw new Error(result.error || "登録に失敗しました");
      }

      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        // 用户取消不显示错误
        if (error.name === "NotAllowedError") {
          setError("");
        } else {
          setError(error.message);
        }
      } else {
        setError("登録に失敗しました");
      }
    } finally {
      setIsSignUpPending(false);
    }
  };

  const isAnyPending = isPending || isSignUpPending;

  return (
    <div className="space-y-3">
      {/* Primary: Passkey Sign In */}
      <Button
        className="bg-primary text-primary-foreground shadow-primary/20 h-12 w-full text-sm font-bold shadow-md transition-all duration-300 hover:opacity-90 dark:shadow-[0_8px_30px_rgba(var(--primary),0.4)]"
        onClick={handlePasskeySignIn}
        disabled={isAnyPending}
      >
        <Fingerprint className="mr-2 h-4 w-4" />
        {isPending ? <Spinner /> : "パスキーでログイン"}
      </Button>

      {/* Secondary: Passkey Sign Up */}
      <button
        type="button"
        className="text-muted-foreground hover:text-primary flex w-full items-center justify-center gap-1.5 py-1 text-[11px] font-medium transition-colors duration-200 disabled:opacity-50"
        onClick={handlePasskeySignUp}
        disabled={isAnyPending}
      >
        {isSignUpPending ? (
          <Spinner className="h-3 w-3" />
        ) : (
          <>
            <Plus className="h-3 w-3" />
            <span>パスキーを新規登録</span>
          </>
        )}
      </button>
    </div>
  );
};
