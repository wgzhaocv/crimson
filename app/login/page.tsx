"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { GoogleLogin } from "@/components/AuthButton/GoogleLogin";
import { PasskeyLogin } from "@/components/AuthButton/PasskeyLogin";
import { AlertCircle, MailX, Users } from "lucide-react";
import { CopyRight } from "@/components/CopyRight";

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden p-4">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-40 dark:opacity-100">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[80px] dark:bg-primary/20 dark:blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[80px] dark:bg-primary/20 dark:blur-[120px]" />
      </div>

      <Card className="w-full max-w-[400px] border-border/50 bg-card/80 backdrop-blur-2xl shadow-lg shadow-primary/5 dark:shadow-2xl dark:shadow-black/60 animate-in slide-in-from-bottom-20 duration-500">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="space-y-1">
            <CardTitle className="text-4xl font-black tracking-tighter text-primary italic uppercase leading-none">
              CRIMSON
            </CardTitle>
            <CardDescription className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold opacity-70">
              ログインしてHTMLを共有
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 px-6 pb-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-3 bg-destructive/5 border-l-2 border-destructive animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-destructive/90 leading-tight">
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
                <MailX className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  メールの送信はしません。
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black">
                <span className="bg-card px-4 text-muted-foreground/60 tracking-[0.4em]">
                  or
                </span>
              </div>
            </div>

            {/* Passkey Login */}
            <PasskeyLogin setError={setError} />
          </div>

          {/* 使用统计 */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground/50 pt-2">
            <Users className="w-3 h-3" />
            <span className="text-[10px] font-bold tracking-wide">
              100+ 人が自分のHTMLを共有中
            </span>
          </div>
        </CardContent>
      </Card>

      <CopyRight />
    </div>
  );
};

export default LoginPage;
