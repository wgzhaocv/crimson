"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/auth-error-messages";

export const PasskeyLogin = ({
  setError,
}: {
  setError: (error: string) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePasskeySignIn = async () => {
    const { data, error } = await authClient.signIn.passkey();

    if (error) {
      const message = error.message || "";

      if (message.includes("cancelled") || message.includes("Cancel")) {
        setError("認証がキャンセルされました");
      } else if (message.includes("NotAllowedError")) {
        setError("パスキーが見つかりません");
      } else if (message.includes("NotSupportedError")) {
        setError("お使いのブラウザはパスキーに対応していません");
      } else {
        const errorCode = "code" in error ? error.code : undefined;
        setError(getErrorMessage(errorCode));
      }
      return;
    }

    if (data) {
      router.push("/");
    }
  };

  return (
    <Button
      className="bg-primary text-primary-foreground shadow-primary/20 h-12 w-full text-sm font-bold shadow-md transition-all duration-300 hover:opacity-90 dark:shadow-[0_8px_30px_rgba(var(--primary),0.4)]"
      onClick={() => startTransition(handlePasskeySignIn)}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : "パスキーでログイン"}
    </Button>
  );
};
