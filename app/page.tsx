import { LogoIcon } from "@/components/Icons/LogoIcon";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, FileCode } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Area */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <LogoIcon className="w-8 h-8" />
            <span className="text-xl font-black tracking-tighter text-primary italic uppercase">
              CRIMSON
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="h-4 w-px bg-border mx-2" />
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive flex items-center gap-2 px-3"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">
                Logout
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1"></div>

          {/* Add HTML Fragment Button */}
          <Button className="bg-primary text-primary-foreground font-black uppercase tracking-widest h-12 px-6 shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            HTMLを追加
          </Button>
        </div>

        {/* Empty State / Content Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-dashed border-2 border-border/50 bg-transparent flex flex-col items-center justify-center p-12 text-center space-y-4 hover:border-primary/30 transition-colors group cursor-pointer">
            <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
              <FileCode className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold uppercase tracking-tight text-sm">
                コンテンツがありません
              </h3>
              <p className="text-xs text-muted-foreground tracking-tighter">
                新しいHTMLをアップロードして共有を開始してください。
              </p>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer Area */}
      <footer className="py-10 text-center opacity-20">
        <p className="text-[9px] tracking-[0.3em] uppercase font-bold">
          &copy; 2025 CRIMSON
        </p>
      </footer>
    </div>
  );
}
