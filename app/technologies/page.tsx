import { Suspense } from "react";
import CardGridSkeleton from "@/components/CardGridSkeleton";
import TechnologyCard from "@/components/TechnologyCard";
import SearchBar from "@/components/SearchBar";
import { listTechnologies } from "@/lib/queries/technologies";

async function TechnologyResults({ query }: { query?: string }) {
  const technologies = await listTechnologies(query);

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {technologies.map((technology) => (
          <TechnologyCard key={technology.id} technology={technology} />
        ))}
      </div>
      {technologies.length === 0 && (
        <p className="mt-6 text-sm text-muted">No technologies found.</p>
      )}
    </>
  );
}

export default async function TechnologiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Technologies
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        The stack, from languages to infrastructure.
      </p>
      <div className="mt-8">
        <SearchBar placeholder="Search technologies by name…" />
      </div>
      <Suspense key={q ?? ""} fallback={<CardGridSkeleton />}>
        <TechnologyResults query={q} />
      </Suspense>
    </main>
  );
}
