"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from "lucide-react";
import { LogoIcon } from "../Icons/LogoIcon";
import { ThemeToggle } from "../theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export const Header = () => {
  const [isPending, setIsPending] = useState(false);
  const logout = async () => {
    setIsPending(true);
    await authClient.signOut();
    window.location.href = "/login"; // 最可靠
  };
  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <LogoIcon className="text-primary h-8 w-8" />
          <span className="text-primary text-xl font-black tracking-tighter uppercase italic">
            CRIMSON
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="bg-border mx-2 h-4 w-px" />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive flex items-center gap-2 px-3"
            onClick={logout}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <LogOut className="h-4 w-4" />}
            <span className="hidden text-xs font-bold tracking-widest uppercase sm:inline">
              ログアウト
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export const HeaderSkeleton = () => {
  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo 部分 - 使用 primary/20 增强暗色模式下的可见度 */}
        <div className="flex items-center">
          <LogoIcon className="text-primary h-8 w-8" />
          <span className="text-primary text-xl font-black tracking-tighter uppercase italic">
            CRIMSON
          </span>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 animate-pulse bg-zinc-300/50 dark:bg-zinc-700/60" />
          <div className="bg-border/40 mx-2 h-4 w-px" />
          <Skeleton className="h-9 w-24 animate-pulse bg-zinc-300/50 dark:bg-zinc-700/60" />
        </div>
      </div>
    </header>
  );
};
