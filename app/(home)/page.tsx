import { CopyRight } from "@/components/Layout/CopyRight";
import { Header } from "@/components/Layout/Header";
import { MainBg } from "@/components/Layout/MainBg";
import { ShareDialog } from "@/components/ShareDialog/ShareDialog";
import { Greeting } from "@/components/Greeting";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServerShareListHydration } from "@/components/ShareList/ServerShareListHydration";

function MainPage() {
  return (
    <MainBg>
      {/* Header Area */}
      <Header />
      {/* Main Content Area */}
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Greeting />

          {/* Add HTML Fragment Button */}
          <ShareDialog>
            <Button className="shadow-primary/20 bg-primary text-primary-foreground flex h-12 items-center gap-2 px-6 font-black tracking-widest uppercase shadow-lg transition-all hover:opacity-90">
              <Plus className="h-5 w-5" />
              HTMLを追加
            </Button>
          </ShareDialog>
        </div>

        {/* Share List */}
        <ServerShareListHydration />
      </main>

      <CopyRight />
    </MainBg>
  );
}

export default MainPage;
