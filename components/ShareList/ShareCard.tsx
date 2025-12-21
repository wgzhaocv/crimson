"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Globe, Lock, Eye, Calendar, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

export type Share = {
  id: string;
  title: string | null;
  accessType: "public" | "password" | "private";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

const accessTypeConfig = {
  public: {
    icon: Globe,
    label: "公開",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  password: {
    icon: KeyRound,
    label: "パスワード",
    className: "text-amber-600 dark:text-amber-400",
  },
  private: {
    icon: Lock,
    label: "非公開",
    className: "text-rose-600 dark:text-rose-400",
  },
};

export const ShareCard = ({ share }: { share: Share }) => {
  const config = accessTypeConfig[share.accessType];
  const AccessIcon = config.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:ring-primary/30 group cursor-pointer transition-all hover:ring-2">
      <CardHeader>
        <CardTitle className="line-clamp-1">{share.title || "無題"}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <AccessIcon className={cn("h-3.5 w-3.5", config.className)} />
          <span>{config.label}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="bg-muted/50 flex aspect-video items-center justify-center rounded-sm">
          <span className="text-muted-foreground text-xs">プレビュー</span>
        </div>
      </CardContent>

      <CardFooter className="text-muted-foreground justify-between border-t-0 pt-0 text-xs">
        <div className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          <span>{share.viewCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(share.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
