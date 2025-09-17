import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSwap({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="grid items-center justify-items-center">
      <div
        className={cn(
          "col-start-1 col-end-1 row-start-1 row-end-1",
          isLoading ? "invisible" : "visible",
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-1 row-start-1 row-end-1",
          isLoading ? "visible" : "invisible",
          className
        )}
      >
        <Loader2Icon className="animate-spin" />
      </div>
    </div>
  );
}
