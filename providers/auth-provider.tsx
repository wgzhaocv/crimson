"use client";
import MainPageSkeleton from "@/app/loading";
import { useSession } from "@/lib/auth-client";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { isPending } = session;
  console.log("AuthProvider session", session);
  // 只在初次加载时显示 skeleton
  // 不要用 isRefetching，否则登出时会闪烁
  if (isPending) return <MainPageSkeleton />;

  return <>{children}</>;
};
