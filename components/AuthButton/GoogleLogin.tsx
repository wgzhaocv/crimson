"use client";
import { GoogleIcon } from "@/assets/svg/components/GoogleIcon";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";

export const GoogleLogin = () => {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleGoogleSignIn = async () => {
    try {
      setError("");
    } catch (error) {
      setError("Google登録失敗、再試行してください");
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full h-12 text-xs font-bold border-border/60 bg-transparent hover:bg-accent transition-all duration-300"
      onClick={() => startTransition(handleGoogleSignIn)}
      disabled={isPending}
    >
      <div className="mr-3">
        <GoogleIcon />
      </div>
      {isPending ? "サインイン中..." : "Googleでサインイン"}
    </Button>
  );
};
