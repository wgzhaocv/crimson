"use client";

import { GoogleLogin } from "@/components/AuthButton/GoogleLogin";
import { CardContent } from "@/components/ui/card";
import { AlertCircle, MailX } from "lucide-react";
import { useState } from "react";

export const LoginCardContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
              メールの送信はしません
            </span>
          </div>
        </div>
      </div>

      {/* 使用统计 */}
      {children}
    </CardContent>
  );
};
