import DeveloperCard from "@/components/DeveloperCard";
import ProjectCard from "@/components/ProjectCard";
import SkillCard from "@/components/SkillCard";
import TechnologyCard from "@/components/TechnologyCard";
import SearchBar from "@/components/SearchBar";
import { searchAll } from "@/lib/queries/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const results = query ? await searchAll(query) : null;
  const totalResults = results
    ? results.developers.length +
      results.projects.length +
      results.skills.length +
      results.technologies.length
    : 0;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Search</h1>
      <p className="mt-1.5 text-sm text-muted">
        Search across developers, projects, skills, and technologies at once.
      </p>
      <div className="mt-8">
        <SearchBar placeholder="Search DevGraph…" />
      </div>

      {!query && (
        <p className="mt-10 text-sm text-muted">Start typing to search.</p>
      )}

      {query && totalResults === 0 && (
        <p className="mt-10 text-sm text-muted">No results for &ldquo;{query}&rdquo;.</p>
      )}

      {query && results && results.developers.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Developers ({results.developers.length})
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {results.developers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </div>
        </section>
      )}

      {query && results && results.projects.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Projects ({results.projects.length})
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {results.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {query && results && results.skills.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Skills ({results.skills.length})
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {results.skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {query && results && results.technologies.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Technologies ({results.technologies.length})
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {results.technologies.map((technology) => (
              <TechnologyCard key={technology.id} technology={technology} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
