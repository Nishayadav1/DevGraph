import Link from "next/link";
import { notFound } from "next/navigation";
import DetailSection from "@/components/DetailSection";
import EntityAvatar from "@/components/EntityAvatar";
import { getDeveloperById } from "@/lib/queries/developers";
import { getPeerRecommendedProjects, getSimilarDevelopers } from "@/lib/queries/skills";

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const developer = await getDeveloperById(id);

  if (!developer) {
    notFound();
  }

  const [similarDevelopers, recommendedProjects] = await Promise.all([
    getSimilarDevelopers(id),
    getPeerRecommendedProjects(id),
  ]);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/developers"
        className="text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        ← Developers
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <EntityAvatar name={developer.name} color="#38bdf8" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {developer.name}
          </h1>
          <p className="text-sm text-muted">
            {developer.location} · {developer.email}
          </p>
        </div>
      </div>
      <p className="mt-3 inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
        {developer.experience} yrs experience
      </p>

      <DetailSection title="Skills">
        {developer.skills.length === 0 ? (
          <p className="text-sm text-muted">No skills recorded.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {developer.skills.map(({ skill, proficiency, yearsOfExperience }) => (
              <li
                key={skill.id}
                className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent"
              >
                <Link href={`/skills/${skill.id}`} className="font-medium hover:underline">
                  {skill.name}
                </Link>{" "}
                · {proficiency} ({yearsOfExperience}y)
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection title="Projects">
        {developer.projects.length === 0 ? (
          <p className="text-sm text-muted">No projects recorded.</p>
        ) : (
          <ul className="space-y-2.5">
            {developer.projects.map(({ project, role, startDate, endDate }) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="font-medium text-foreground transition-colors hover:text-accent"
                >
                  {project.name}
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

      <DetailSection title="Companies">
        {developer.companies.length === 0 ? (
          <p className="text-sm text-muted">No employment history recorded.</p>
        ) : (
          <ul className="space-y-2.5">
            {developer.companies.map(({ company, role, startDate, endDate }) => (
              <li key={company.id}>
                <span className="font-medium text-foreground">{company.name}</span>
                <span className="text-sm text-muted">
                  {" "}
                  — {role} ({startDate} – {endDate ?? "present"})
                </span>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection
        title="Recommended projects"
        description={`Projects worked on by developers who share a skill with ${developer.name.split(" ")[0]}.`}
      >
        {recommendedProjects.length === 0 ? (
          <p className="text-sm text-muted">No recommendations yet.</p>
        ) : (
          <ul className="space-y-2">
            {recommendedProjects.map(({ project, peerCount }) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="font-medium text-foreground transition-colors hover:text-accent"
                >
                  {project.name}
                </Link>
                <span className="text-sm text-muted">
                  {" "}
                  — {peerCount} peer{peerCount === 1 ? "" : "s"} worked on it
                </span>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      {similarDevelopers.length > 0 && (
        <DetailSection title="Developers with similar skills">
          <ul className="space-y-2">
            {similarDevelopers.map(({ developer: other, sharedSkills }) => (
              <li key={other.id}>
                <Link
                  href={`/developers/${other.id}`}
                  className="font-medium text-foreground transition-colors hover:text-accent"
                >
                  {other.name}
                </Link>
                <span className="text-sm text-muted">
                  {" "}
                  — {sharedSkills} shared skill{sharedSkills === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}
    </main>
  );
}
