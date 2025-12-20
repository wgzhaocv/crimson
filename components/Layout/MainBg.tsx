import { cn } from "@/lib/utils";

export const MainBg = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-background text-foreground relative flex min-h-screen flex-col",
        className,
      )}
    >
      {children}
    </div>
  );
};
