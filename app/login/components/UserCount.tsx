import { Users } from "lucide-react";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export const UserCount = async () => {
  const result = await db.select({ count: count() }).from(user);
  const userCount = result[0]?.count ?? 0;

  return (
    <div className="text-muted-foreground/50 flex items-center justify-center gap-2 pt-2">
      <Users className="h-3 w-3" />
      <span className="text-[10px] font-bold tracking-wide">
        {userCount} 人が自分のHTMLを共有中
      </span>
    </div>
  );
};
