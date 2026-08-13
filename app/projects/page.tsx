import { Suspense } from "react";
import CardGridSkeleton from "@/components/CardGridSkeleton";
import ProjectCard from "@/components/ProjectCard";
import SearchBar from "@/components/SearchBar";
import { listProjects } from "@/lib/queries/projects";

async function ProjectResults({ query }: { query?: string }) {
  const projects = await listProjects(query);

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {projects.length === 0 && (
        <p className="mt-6 text-sm text-muted">No projects found.</p>
      )}
    </>
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Projects
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        What&apos;s being built, and the technologies behind it.
      </p>
      <div className="mt-8">
        <SearchBar placeholder="Search projects by name…" />
      </div>
      <Suspense key={q ?? ""} fallback={<CardGridSkeleton />}>
        <ProjectResults query={q} />
      </Suspense>
    </main>
  );
}
