"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CopyRight } from "@/components/Layout/CopyRight";
import { Header } from "@/components/Layout/Header";
import { UploadCard } from "@/components/SharedCards/UploadCard";
import { useSession } from "@/lib/auth-client";
import { MainBg } from "@/components/Layout/MainBg";

function MainPage() {
  const session = useSession();
  return (
    <MainBg>
      {/* Header Area */}
      <Header />
      {/* Main Content Area */}
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-1"> {session.data?.user?.email}</div>

          {/* Add HTML Fragment Button */}
          <Button className="shadow-primary/20 flex h-12 items-center gap-2 px-6 font-black tracking-widest uppercase shadow-lg transition-all hover:opacity-90">
            <Plus className="h-5 w-5" />
            HTMLを追加
          </Button>
        </div>

        {/* Empty State / Content Grid Placeholder */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UploadCard />
        </div>
      </main>

      <CopyRight />
    </MainBg>
  );
}

export default MainPage;
