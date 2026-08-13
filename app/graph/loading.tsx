import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Graph Explorer
      </h1>
      <Skeleton className="mt-4 h-4 w-2/3" />
      <Skeleton className="mt-4 h-[520px] w-full" />
      <Skeleton className="mt-8 h-40 w-full" />
    </main>
  );
}
