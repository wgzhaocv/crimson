import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const getGreeting = () => {
  const hourStr = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    hour12: false,
  });
  const hour = parseInt(hourStr, 10);
  if (hour >= 5 && hour < 12) return "おはよう";
  if (hour >= 12 && hour < 18) return "こんにちは";
  return "こんばんは";
};

export const Greeting = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const greeting = getGreeting();

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight">
        <span className="text-muted-foreground font-normal">{greeting}、</span>
        <span className="text-primary">{session?.user.name}</span>
      </h1>
    </div>
  );
};
