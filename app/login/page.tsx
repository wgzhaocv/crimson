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
    <div className="bg-background text-foreground relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Decor */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40 dark:opacity-100">
        <div className="bg-primary/5 dark:bg-primary/20 absolute top-[-5%] left-[-5%] h-[40%] w-[40%] rounded-full blur-[80px] dark:blur-[120px]" />
        <div className="bg-primary/5 dark:bg-primary/20 absolute right-[-5%] bottom-[-5%] h-[40%] w-[40%] rounded-full blur-[80px] dark:blur-[120px]" />
      </div>

      <Card className="border-border/50 bg-card/80 shadow-primary/5 animate-in slide-in-from-bottom-20 w-full max-w-[400px] shadow-lg backdrop-blur-2xl duration-500 dark:shadow-2xl dark:shadow-black/60">
        <CardHeader className="space-y-4 pb-2 text-center">
          <div className="space-y-1">
            <CardTitle className="text-primary text-4xl leading-none font-black tracking-tighter uppercase italic">
              CRIMSON
            </CardTitle>
            <CardDescription className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase opacity-70">
              ログインしてHTMLを共有
            </CardDescription>
          </div>
        </CardHeader>

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
      </Card>

      <CopyRight />
    </div>
  );
};

export default LoginPage;
