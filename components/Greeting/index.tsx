"use client";

import { useSession } from "@/lib/auth-client";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "おはよう";
  if (hour >= 12 && hour < 18) return "こんにちは";
  return "こんばんは";
};

export const Greeting = () => {
  const session = useSession();
  const greeting = getGreeting();

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight">
        <span className="text-muted-foreground font-normal">{greeting}、</span>
        <span className="text-primary">{session.data?.user?.name}</span>
      </h1>
    </div>
  );
};
