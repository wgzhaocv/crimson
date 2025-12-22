import { Skeleton } from "@/components/ui/skeleton";
import { LogoIcon } from "../Icons/LogoIcon";
import { ThemeToggle } from "../theme-toggle";
import { logout } from "./action";
import { LogoutButton } from "./LogOutButton";

export const Header = () => {
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
          <form action={logout}>
            <LogoutButton />
          </form>
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
