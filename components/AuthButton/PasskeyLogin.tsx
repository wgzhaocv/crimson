"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/auth-error-messages";
import { Fingerprint, Plus } from "lucide-react";

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
    await authClient.signIn.passkey({
      fetchOptions: {
        onError: (ctx) => {
          setError(getErrorMessage(ctx.error.code));
          setIsPending(false);
        },
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const handlePasskeySignUp = async () => {
    setIsSignUpPending(true);
    // TODO: 实现 passkey 注册逻辑
    setIsSignUpPending(false);
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
