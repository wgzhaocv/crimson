"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CopyRight } from "@/components/CopyRight";
import { Header, HeaderSkeleton } from "@/components/Header";
import { UploadCard } from "@/components/SharedCards/UploadCard";
import { MainContentSkeleton } from "@/components/SharedCards/MainContentSkeleton";
import { redirect } from "next/navigation";
import { useSession } from "@/lib/auth-client";

function MainPage() {
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
          <UploadCard />
        </div>
      </main>

      <CopyRight />
    </div>
  );
}

const MainPageSkeleton = () => {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <HeaderSkeleton />
      <MainContentSkeleton />
      <CopyRight />
    </div>
  );
};

const Page = () => {
  const { isPending } = useSession();

  if (isPending) return <MainPageSkeleton />;

  return <MainPage />;
};

export default Page;
