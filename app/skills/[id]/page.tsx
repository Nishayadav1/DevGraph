import Link from "next/link";
import { notFound } from "next/navigation";
import DetailSection from "@/components/DetailSection";
import EntityAvatar from "@/components/EntityAvatar";
import { getSkillById } from "@/lib/queries/skills";

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await getSkillById(id);

  if (!skill) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/skills"
        className="text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        ← Skills
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <EntityAvatar name={skill.name} color="#a78bfa" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {skill.name}
          </h1>
          <span className="mt-1 inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
            {skill.category}
          </span>
        </div>
      </div>

      <DetailSection title="Related skills">
        {skill.relatedSkills.length === 0 ? (
          <p className="text-sm text-muted">No related skills recorded.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {skill.relatedSkills.map(({ skill: related, strength }) => (
              <li
                key={related.id}
                className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent"
              >
                <Link href={`/skills/${related.id}`} className="font-medium hover:underline">
                  {related.name}
                </Link>{" "}
                · {Math.round(strength * 100)}%
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection title="Developers">
        {skill.developers.length === 0 ? (
          <p className="text-sm text-muted">No developers have this skill yet.</p>
        ) : (
          <ul className="space-y-2">
            {skill.developers.map(({ developer, proficiency }) => (
              <li key={developer.id}>
                <Link
                  href={`/developers/${developer.id}`}
                  className="font-medium text-foreground transition-colors hover:text-accent"
                >
                  {developer.name}
                </Link>
                <span className="text-sm text-muted"> — {proficiency}</span>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>
    </main>
  );
}
