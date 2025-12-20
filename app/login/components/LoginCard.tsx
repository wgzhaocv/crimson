"use client";

import { GoogleLogin } from "@/components/AuthButton/GoogleLogin";
import { PasskeyLogin } from "@/components/AuthButton/PasskeyLogin";
import { CardContent } from "@/components/ui/card";
import { AlertCircle, MailX, Users } from "lucide-react";
import { useState } from "react";

export const LoginCardContent = () => {
  const [error, setError] = useState<string | null>(null);
  return (
    <CardContent className="grid gap-6 px-6 pb-6">
      {/* Error Message */}
      {error && (
        <div className="bg-destructive/5 border-destructive animate-in fade-in slide-in-from-top-1 flex items-center gap-3 border-l-2 p-3 duration-300">
          <AlertCircle className="text-destructive h-4 w-4 shrink-0" />
          <div className="flex flex-col text-left">
            <span className="text-destructive/90 text-[11px] leading-tight font-bold">
              {error}
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-5">
        {/* Google Login Section */}
        <div className="space-y-3">
          <GoogleLogin setError={setError} />

          {/* 隐私承诺：放在 Google 按钮正下方 */}
          <div className="flex items-center justify-center gap-2 opacity-40">
            <MailX className="h-3 w-3" />
            <span className="text-[9px] font-bold tracking-wider uppercase">
              メールの送信はしません。
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="border-border/40 w-full border-t" />
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase">
            <span className="bg-card text-muted-foreground/60 px-4">
              または
            </span>
          </div>
        </div>

        {/* Passkey Login */}
        <PasskeyLogin setError={setError} />
      </div>

      {/* 使用统计 */}
      <div className="text-muted-foreground/50 flex items-center justify-center gap-2 pt-2">
        <Users className="h-3 w-3" />
        <span className="text-[10px] font-bold tracking-wide">
          100+ 人が自分のHTMLを共有中
        </span>
      </div>
    </CardContent>
  );
};
