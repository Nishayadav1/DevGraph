import CardGridSkeleton from "@/components/CardGridSkeleton";
import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Search
      </h1>
      <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      <Skeleton className="mt-6 h-10 w-full" />
      <CardGridSkeleton />
    </main>
  );
}
