"use client";

import { Moon, Sun } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          if (typeof window !== "undefined") {
            document.documentElement.classList.toggle(
              "dark",
              newTheme === "dark"
            );
          }
          return { theme: newTheme };
        }),
    }),
    { name: "theme-storage" }
  )
);

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      toggleTheme();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      toggleTheme();
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
        }
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
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground group-hover/toggle:text-primary" />

      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground group-hover/toggle:text-primary dark:drop-shadow-[0_0_8px_var(--primary)]" />

      <span className="sr-only">テーマを切り替え</span>
    </Button>
  );
}
