"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="bg-background fixed inset-0 flex flex-col items-center justify-center">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-8 px-6 text-center">
        {/* 404 大标题 */}
        <div className="relative">
          <span className="text-primary/10 text-[12rem] leading-none font-black tracking-tighter sm:text-[16rem]">
            404
          </span>
          <span className="text-primary absolute inset-0 flex items-center justify-center text-6xl font-bold sm:text-8xl">
            404
          </span>
        </div>

        {/* 说明文字 */}
        <div className="flex flex-col gap-3">
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
            ページが見つかりません
          </h1>
          <p className="text-muted-foreground max-w-md">
            お探しの共有ページは存在しないか、削除された可能性があります。
          </p>
        </div>

        {/* CTA ボタン */}
        <Button
          nativeButton={false}
          className="shadow-primary/20 mt-4 h-12 gap-2 px-6 font-black tracking-widest uppercase shadow-lg"
          render={<Link href="/" />}
        >
          あなたのHTMLを作ってみませんか？
          <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
