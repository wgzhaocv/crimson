import { FileCode } from "lucide-react";
import { Card } from "../ui/card";

export const UploadCard = () => {
  return (
    <Card className="border-border/50 hover:border-primary/30 group flex cursor-pointer flex-col items-center justify-center space-y-4 border-2 border-dashed bg-transparent p-12 text-center transition-colors">
      <div className="bg-muted group-hover:bg-primary/10 rounded-full p-4 transition-colors">
        <FileCode className="text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold tracking-tight uppercase">
          コンテンツがありません
        </h3>
        <p className="text-muted-foreground text-xs tracking-tighter">
          新しいHTMLをアップロードして共有を開始してください。
        </p>
      </div>
    </Card>
  );
};
