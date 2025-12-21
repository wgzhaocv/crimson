"use client";
import { CopyRight } from "@/components/Layout/CopyRight";
import { Header } from "@/components/Layout/Header";
import { ShareList } from "@/components/ShareList";
import { MainBg } from "@/components/Layout/MainBg";
import { AddShare } from "@/components/AddShare";
import { Greeting } from "@/components/Greeting";

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
          <AddShare />
        </div>

        {/* Share List */}
        <ShareList />
      </main>

      <CopyRight />
    </MainBg>
  );
}

export default MainPage;
