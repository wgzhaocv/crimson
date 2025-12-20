"use client";
import { CopyRight } from "@/components/Layout/CopyRight";
import { Header } from "@/components/Layout/Header";
import { UploadCard } from "@/components/SharedCards/UploadCard";
import { useSession } from "@/lib/auth-client";
import { MainBg } from "@/components/Layout/MainBg";
import { AddShare } from "@/components/AddShare";

function MainPage() {
  const session = useSession();
  return (
    <MainBg>
      {/* Header Area */}
      <Header />
      {/* Main Content Area */}
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-1"> {session.data?.user?.name}</div>

          {/* Add HTML Fragment Button */}
          <AddShare />
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
