import Link from "next/link";
import { notFound } from "next/navigation";
import DetailSection from "@/components/DetailSection";
import EntityAvatar from "@/components/EntityAvatar";
import { getProjectById } from "@/lib/queries/projects";
import { getRelatedTechnologiesForProject } from "@/lib/queries/skills";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  completed: "bg-accent-soft text-accent",
  "on-hold": "bg-amber-50 text-amber-700",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const relatedTechnologies = await getRelatedTechnologiesForProject(id);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/projects"
        className="text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        ← Projects
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <EntityAvatar name={project.name} color="#34d399" />
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {project.name}
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                STATUS_STYLES[project.status] ?? "bg-accent-soft text-accent"
              }`}
            >
              {project.status}
            </span>
          </div>
          <p className="text-sm text-muted">{project.description}</p>
        </div>
      </div>

      <DetailSection title="Technologies">
        {project.technologies.length === 0 ? (
          <p className="text-sm text-muted">No technologies recorded.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map(({ technology, usage }) => (
              <li
                key={technology.id}
                className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent"
              >
                <Link href={`/technologies/${technology.id}`} className="font-medium hover:underline">
                  {technology.name}
                </Link>{" "}
                · {usage}
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection title="Developers">
        {project.developers.length === 0 ? (
          <p className="text-sm text-muted">No developers recorded.</p>
        ) : (
          <ul className="space-y-2.5">
            {project.developers.map(({ developer, role, startDate, endDate }) => (
              <li key={developer.id}>
                <Link
                  href={`/developers/${developer.id}`}
                  className="font-medium text-foreground transition-colors hover:text-accent"
                >
                  {developer.name}
                </Link>
                <span className="text-sm text-muted">
                  {" "}
                  — {role} ({startDate} – {endDate ?? "present"})
                </span>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      {relatedTechnologies.length > 0 && (
        <DetailSection
          title="Technologies to consider"
          description="Related to technologies this project already uses."
        >
          <ul className="flex flex-wrap gap-2">
            {relatedTechnologies.map((technology) => (
              <li
                key={technology.id}
                className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent"
              >
                <Link href={`/technologies/${technology.id}`} className="font-medium hover:underline">
                  {technology.name}
                </Link>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}
    </main>
  );
}
