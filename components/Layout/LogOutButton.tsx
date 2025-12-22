"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Spinner } from "../ui/spinner";

export const LogoutButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-destructive flex items-center gap-2 px-3 transition-all duration-300"
      disabled={pending}
    >
      {pending ? <Spinner /> : <LogOut className="h-4 w-4" />}
      <span className="hidden text-xs font-bold tracking-widest uppercase sm:inline">
        ログアウト
      </span>
    </Button>
  );
};
