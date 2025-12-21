"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Globe,
  Lock,
  Eye,
  Calendar,
  KeyRound,
  ExternalLink,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

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

// 基于 id 生成稳定的随机渐变色
const gradientPresets = [
  "from-rose-400/30 via-pink-300/20 to-purple-400/30",
  "from-amber-400/30 via-orange-300/20 to-red-400/30",
  "from-emerald-400/30 via-teal-300/20 to-cyan-400/30",
  "from-blue-400/30 via-indigo-300/20 to-violet-400/30",
  "from-fuchsia-400/30 via-pink-300/20 to-rose-400/30",
  "from-cyan-400/30 via-sky-300/20 to-blue-400/30",
  "from-lime-400/30 via-green-300/20 to-emerald-400/30",
  "from-violet-400/30 via-purple-300/20 to-fuchsia-400/30",
];

const getGradient = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return gradientPresets[Math.abs(hash) % gradientPresets.length];
};

export const ShareCard = ({ share }: { share: Share }) => {
  const config = accessTypeConfig[share.accessType];
  const pathname = usePathname();
  const AccessIcon = config.icon;
  const gradient = getGradient(share.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const shareUrl = `${pathname}/share/${share.id}`;

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(shareUrl, "_blank");
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("リンクをコピーしました");
    } catch {
      toast.error("コピーに失敗しました");
    }
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
        <div
          className={cn(
            "relative aspect-video overflow-hidden rounded-sm bg-linear-to-br",
            gradient,
          )}
        >
          {/* Action Buttons */}
          <div className="bg-card/90 absolute right-2 bottom-2 flex items-center gap-0.5 rounded-sm p-0.5 shadow-sm backdrop-blur-sm">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 sm:h-7 sm:w-7"
                    onClick={handleOpenInNewTab}
                  >
                    <ExternalLink className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  </Button>
                }
              />
              <TooltipContent>新しいタブで開く</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 sm:h-7 sm:w-7"
                    onClick={handleCopyLink}
                  >
                    <Link2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  </Button>
                }
              />
              <TooltipContent>リンクをコピー</TooltipContent>
            </Tooltip>
          </div>
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
