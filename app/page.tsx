import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileCode } from "lucide-react";
import { CopyRight } from "@/components/CopyRight";
import { Header } from "@/components/Header";

export default function Page() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Header Area */}
      <Header />
      {/* Main Content Area */}
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-1"></div>

          {/* Add HTML Fragment Button */}
          <Button className="shadow-primary/20 flex h-12 items-center gap-2 px-6 font-black tracking-widest uppercase shadow-lg transition-all hover:opacity-90">
            <Plus className="h-5 w-5" />
            HTMLを追加
          </Button>
        </div>

        {/* Empty State / Content Grid Placeholder */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </main>

      <CopyRight />
    </div>
  );
}
