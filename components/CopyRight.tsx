import { cn } from "@/lib/utils";

export const CopyRight = ({ className }: { className?: string }) => {
  return (
    <footer className={cn("py-10 text-center opacity-20", className)}>
      <p className="text-[9px] font-bold tracking-[0.3em] uppercase">
        &copy; 2025 CRIMSON
      </p>
    </footer>
  );
};
