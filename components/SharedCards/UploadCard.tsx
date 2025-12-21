"use client";
import { FileCode } from "lucide-react";
import { Card } from "../ui/card";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShareDialog } from "../ShareDialog/ShareDialog";

export const UploadCard = ({
  onClick,
  onDropHtml,
}: {
  onClick: () => void;
  onDropHtml: (html: string) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length === 0) {
        toast.error("ファイルがありません");
        return;
      }

      const file = files[0];
      if (file.type !== "text/html" && !file.name.endsWith(".html")) {
        toast.error("HTMLファイルのみ対応しています");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onDropHtml(content);
      };
      reader.onerror = () => {
        toast.error("ファイルの読み込みに失敗しました");
      };
      reader.readAsText(file);
    },
    [onDropHtml],
  );

  return (
    <Card
      className={cn(
        "border-border/50 hover:border-primary/30 group flex cursor-pointer flex-col items-center justify-center space-y-4 border-2 border-dashed bg-transparent p-12 text-center ring-0 transition-colors",
        isDragOver && "border-primary bg-primary/5",
      )}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="bg-muted group-hover:bg-primary/10 rounded-full p-4 transition-colors">
        <FileCode className="text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold tracking-tight uppercase">
          HTMLをドロップ
        </h3>
        <p className="text-muted-foreground text-xs tracking-tighter">
          またはクリックして追加してください
        </p>
      </div>
    </Card>
  );
};

export const UploadArea = () => {
  const [open, setOpen] = useState(false);
  const [droppedHtml, setDroppedHtml] = useState<string | undefined>(undefined);

  const handleClick = () => {
    setDroppedHtml(undefined);
    setOpen(true);
  };

  const handleDropHtml = (html: string) => {
    setDroppedHtml(html);
    setOpen(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setDroppedHtml(undefined);
    }
  };

  return (
    <ShareDialog
      open={open}
      onOpenChange={handleOpenChange}
      initialHtml={droppedHtml}
    >
      <UploadCard onClick={handleClick} onDropHtml={handleDropHtml} />
    </ShareDialog>
  );
};
