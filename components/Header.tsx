import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { LogoIcon } from "./Icons/LogoIcon";
import { ThemeToggle } from "./theme-toggle";

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
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive flex items-center gap-2 px-3"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden text-xs font-bold tracking-widest uppercase sm:inline">
              Logout
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};
