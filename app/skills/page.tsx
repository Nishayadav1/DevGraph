import { Suspense } from "react";
import CardGridSkeleton from "@/components/CardGridSkeleton";
import SkillCard from "@/components/SkillCard";
import SearchBar from "@/components/SearchBar";
import { listSkills } from "@/lib/queries/skills";

async function SkillResults({ query }: { query?: string }) {
  const skills = await listSkills(query);

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
      {skills.length === 0 && (
        <p className="mt-6 text-sm text-muted">No skills found.</p>
      )}
    </>
  );
}

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Skills
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        The skills developers bring, and how they relate to each other.
      </p>
      <div className="mt-8">
        <SearchBar placeholder="Search skills by name…" />
      </div>
      <Suspense key={q ?? ""} fallback={<CardGridSkeleton />}>
        <SkillResults query={q} />
      </Suspense>
    </main>
  );
}
