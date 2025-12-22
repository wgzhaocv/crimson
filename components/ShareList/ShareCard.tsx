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
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Globe,
  Lock,
  Eye,
  Calendar,
  KeyRound,
  ExternalLink,
  Link2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { ButtonGroup } from "../ui/button-group";

export type ShareListItemType = {
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

export const ShareCard = ({
  share,
  ...props
}: { share: ShareListItemType } & React.ComponentProps<typeof Card>) => {
  const config = accessTypeConfig[share.accessType];
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

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/share/${share.id}`;

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
    <Card
      className="hover:ring-primary/30 group relative cursor-pointer transition-all hover:ring-2"
      {...props}
    >
      {/* Delete Button - Card 右上角 */}
      <div className="absolute top-2 right-2 z-10">
        <DeleteButton id={share.id} title={share.title} />
      </div>

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
          <ButtonGroup className="bg-card/90 absolute right-2 bottom-2 flex items-center gap-0.5 overflow-hidden rounded-sm shadow-sm backdrop-blur-sm">
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
          </ButtonGroup>
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

// 删除按钮组件
const DeleteButton = ({ id, title }: { id: string; title: string | null }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/share/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "削除に失敗しました");
        return;
      }

      toast.success("削除しました");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["shares"] });
    } catch {
      toast.error("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive h-9 w-9 p-0 sm:h-7 sm:w-7"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>削除</TooltipContent>
      </Tooltip>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{title || "無題"}」を削除します。この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? <Spinner /> : "削除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
