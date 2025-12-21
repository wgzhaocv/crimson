"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldCheck, AlertCircle } from "lucide-react";
import PinCodeInput from "@/components/PinCodeInput";

interface PinEntryProps {
  wrongPin?: boolean;
}

const PinEntry = ({ wrongPin = false }: PinEntryProps) => {
  const pathname = usePathname();
  const [pin, setPin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) {
      document.cookie = `share-pin=${pin}; path=${pathname}; max-age=60; SameSite=Lax`;
      window.location.reload();
    }
  };

  return (
    <div className="bg-background fixed inset-0 flex flex-col items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-full p-2",
                wrongPin ? "bg-destructive/10" : "bg-primary/10",
              )}
            >
              {wrongPin ? (
                <AlertCircle className="text-destructive h-5 w-5" />
              ) : (
                <ShieldCheck className="text-primary h-5 w-5" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">アクセスコードを入力</CardTitle>
              <CardDescription>
                このページを閲覧するには6桁のコードが必要です
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Error Message */}
            {wrongPin && (
              <div className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
                コードが正しくありません。もう一度お試しください。
              </div>
            )}

            {/* Pin Input */}
            <PinCodeInput value={pin} onChange={setPin} hideShieldIcon />

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-2 h-11 w-full font-bold tracking-wide"
              disabled={pin.length !== 6}
            >
              確認する
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinEntry;
