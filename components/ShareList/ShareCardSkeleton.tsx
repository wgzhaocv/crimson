import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ShareCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-1 h-4 w-1/3" />
      </CardHeader>

      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>

      <CardFooter className="justify-between border-t-0 pt-0">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
      </CardFooter>
    </Card>
  );
};
