"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MainPageSkeleton from "@/app/loading";
import { useSession } from "@/lib/auth-client";

type GuardProps = {
  children: React.ReactNode;
};

/**
 * 認証が必要なページ用のガード
 * 未ログイン → /login へリダイレクト
 */
export const AuthGuard = ({ children }: GuardProps) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return <MainPageSkeleton />;
  }

  return <>{children}</>;
};

/**
 * ゲスト専用ページ用のガード（ログインページなど）
 * ログイン済み → / へリダイレクト
 */
export const GuestGuard = ({ children }: GuardProps) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [isPending, session, router]);

  if (isPending || session) {
    return <MainPageSkeleton />;
  }

  return <>{children}</>;
};

// 後方互換性のため AuthProvider として AuthGuard をエクスポート
export const AuthProvider = AuthGuard;
