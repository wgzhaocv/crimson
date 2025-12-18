"use client";

import { useState, useTransition } from "react";
import { Button } from "../ui/button";

export const PasskeyLogin = () => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handlePasskeySignIn = async () => {
    try {
      setError("");
    } catch (error) {
      setError("Passkey登録失敗、再試行してください");
    }
  };
  return (
    <Button
      className="w-full h-14 text-sm font-black uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20 dark:shadow-[0_8px_30px_rgba(var(--primary),0.4)] transition-all duration-300"
      onClick={() => startTransition(handlePasskeySignIn)}
      disabled={isPending}
    >
      {isPending ? "認証中..." : "パスキーでログイン"}
    </Button>
  );
};
