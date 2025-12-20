"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";

    // 检查是否支持 View Transition API
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(newTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="group/toggle relative"
      aria-label="テーマを切り替え"
    >
      <Sun className="text-muted-foreground group-hover/toggle:text-primary scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />

      <Moon className="text-muted-foreground group-hover/toggle:text-primary absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 dark:drop-shadow-[0_0_8px_var(--primary)]" />

      <span className="sr-only">テーマを切り替え</span>
    </Button>
  );
}
