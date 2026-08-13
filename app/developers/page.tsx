import { Suspense } from "react";
import CardGridSkeleton from "@/components/CardGridSkeleton";
import DeveloperCard from "@/components/DeveloperCard";
import SearchBar from "@/components/SearchBar";
import { listDevelopers } from "@/lib/queries/developers";

async function DeveloperResults({ query }: { query?: string }) {
  const developers = await listDevelopers(query);

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {developers.map((developer) => (
          <DeveloperCard key={developer.id} developer={developer} />
        ))}
      </div>
      {developers.length === 0 && (
        <p className="mt-6 text-sm text-muted">No developers found.</p>
      )}
    </>
  );
}

export default async function DevelopersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Developers
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Every developer in the graph, with their skills and history.
      </p>
      <div className="mt-8">
        <SearchBar placeholder="Search developers by name…" />
      </div>
      <Suspense key={q ?? ""} fallback={<CardGridSkeleton />}>
        <DeveloperResults query={q} />
      </Suspense>
    </main>
  );
}
