import Link from "next/link";
import { notFound } from "next/navigation";
import DetailSection from "@/components/DetailSection";
import EntityAvatar from "@/components/EntityAvatar";
import { getTechnologyById } from "@/lib/queries/technologies";

export default async function TechnologyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const technology = await getTechnologyById(id);

  if (!technology) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/technologies"
        className="text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        ← Technologies
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <EntityAvatar name={technology.name} color="#f59e0b" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {technology.name}
          </h1>
          <span className="mt-1 inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
            {technology.category}
          </span>
        </div>
      </div>

      <DetailSection title="Related technologies">
        {technology.relatedTechnologies.length === 0 ? (
          <p className="text-sm text-muted">No related technologies recorded.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {technology.relatedTechnologies.map(({ technology: related, strength }) => (
              <li
                key={related.id}
                className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent"
              >
                <Link href={`/technologies/${related.id}`} className="font-medium hover:underline">
                  {related.name}
                </Link>{" "}
                · {Math.round(strength * 100)}%
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection title="Used by">
        {technology.projects.length === 0 ? (
          <p className="text-sm text-muted">No projects use this technology yet.</p>
        ) : (
          <ul className="space-y-2">
            {technology.projects.map(({ project, usage }) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="font-medium text-foreground transition-colors hover:text-accent"
                >
                  {project.name}
                </Link>
                <span className="text-sm text-muted"> — {usage}</span>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>
    </main>
  );
}
