import { Button } from "../ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export const ErrorShareList = ({
  error,
  refetch,
}: {
  error: Error;
  refetch: () => void;
}) => (
  <div className="bg-card ring-destructive/20 flex flex-col items-center justify-center gap-4 rounded-none p-12 text-center ring-1">
    <div className="bg-destructive/10 rounded-full p-4">
      <AlertCircle className="text-destructive h-8 w-8" />
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-bold tracking-tight uppercase">
        エラーが発生しました
      </h3>
      <p className="text-muted-foreground text-xs tracking-tighter">
        {error instanceof Error ? error.message : "データの取得に失敗しました"}
      </p>
    </div>
    <Button
      variant="outline"
      size="sm"
      onClick={() => refetch()}
      className="mt-2 gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      再試行
    </Button>
  </div>
);
