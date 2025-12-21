"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";

interface RateLimitedProps {
  remainingSeconds: number;
}

const formatTime = (seconds: number): string => {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}時間${mins}分`;
  }
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  }
  return `${seconds}秒`;
};

const RateLimited = ({ remainingSeconds }: RateLimitedProps) => {
  const [timeLeft, setTimeLeft] = useState(remainingSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="bg-background fixed inset-0 flex flex-col items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="bg-destructive/10 rounded-full p-6">
          <Clock className="text-destructive h-16 w-16" />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-3">
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
            アクセスが制限されています
          </h1>
          <p className="text-muted-foreground max-w-md">
            パスワードの入力回数が多すぎます。しばらくお待ちください。
          </p>
        </div>

        {/* Countdown or Retry Button */}
        {timeLeft > 0 ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-muted-foreground text-sm">再試行まで</span>
            <span className="text-primary text-4xl font-black tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
        ) : (
          <Button
            onClick={handleRetry}
            className="h-12 gap-2 px-6 font-bold tracking-wide"
          >
            <RefreshCw className="size-4" />
            再試行する
          </Button>
        )}
      </div>
    </div>
  );
};

export default RateLimited;
