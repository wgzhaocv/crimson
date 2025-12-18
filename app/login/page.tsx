"use client";

import { useState } from "react";
import { GoogleIcon } from "@/assets/svg/components/GoogleIcon";
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

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden p-4">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Decor: ライトモードでの清潔感を保つため不透明度を調整 */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-40 dark:opacity-100">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[80px] dark:bg-primary/20 dark:blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[80px] dark:bg-primary/20 dark:blur-[120px]" />
      </div>

      <Card className="w-full max-w-[400px] border-border/50 bg-card/80 backdrop-blur-2xl shadow-lg shadow-primary/5 dark:shadow-2xl dark:shadow-black/60 animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-4xl font-black tracking-tighter text-primary italic uppercase leading-none">
            CRIMSON
          </CardTitle>
          <CardDescription className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 sr-only">
            AI生成HTMLの安全な共有プラットフォーム
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 p-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {/* Google Login */}
          <GoogleLogin />

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

          {/* Passkey Login: より重厚感のあるボタンデザイン */}
          <PasskeyLogin />
        </CardContent>

        <div className="px-6 pb-5 text-center">
          <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-bold tracking-tight">
            生体認証またはセキュリティキーによる保護
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
