import Link from "next/link";
import { Suspense } from "react";
import GraphViewer from "@/components/GraphViewer";
import Skeleton from "@/components/Skeleton";
import { getGraphStats } from "@/lib/queries/graph";

// Without this, Next statically prerenders this page at build time (nothing
// in the render path reads searchParams/cookies/headers to signal otherwise),
// freezing the stat counts until the next deploy instead of reflecting the
// live graph.
export const dynamic = "force-dynamic";

const STAT_TILES = [
  { key: "developers", label: "Developers", href: "/developers", color: "#38bdf8" },
  { key: "projects", label: "Projects", href: "/projects", color: "#34d399" },
  { key: "skills", label: "Skills", href: "/skills", color: "#a78bfa" },
  { key: "technologies", label: "Technologies", href: "/technologies", color: "#fbbf24" },
  { key: "companies", label: "Companies", href: null, color: "#f87171" },
] as const;

async function StatTiles() {
  const stats = await getGraphStats();

  return (
    <>
      {STAT_TILES.map((tile) => {
        const content = (
          <>
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: tile.color }}
              aria-hidden="true"
            />
            <div>
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {stats[tile.key]}
              </p>
              <p className="mt-0.5 text-xs text-muted">{tile.label}</p>
            </div>
          </>
        );

        return tile.href ? (
          <Link
            key={tile.key}
            href={tile.href}
            className="card-surface flex items-center gap-3 rounded-xl p-4"
          >
            {content}
          </Link>
        ) : (
          <div key={tile.key} className="card-surface flex items-center gap-3 rounded-xl p-4">
            {content}
          </div>
        );
      })}
    </>
  );
}

function StatTilesSkeleton() {
  return (
    <>
      {STAT_TILES.map((tile) => (
        <Skeleton key={tile.key} className="h-[68px] w-full rounded-xl" />
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      <section className="dot-grid border-b border-border bg-gradient-to-b from-accent-soft/60 to-transparent">
        <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Developer intelligence, as a graph
          </p>
          <h1 className="mt-3 max-w-lg text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Who knows what, connected.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            DevGraph maps developers, skills, projects, and technologies as a
            living graph — so you can trace a skill to the people who have
            it, and a project to what it&apos;s really built on.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/graph"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast shadow-md transition-transform hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              Open Graph Explorer
            </Link>
            <Link
              href="/developers"
              className="rounded-lg border border-border-strong bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Browse developers
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Suspense fallback={<StatTilesSkeleton />}>
            <StatTiles />
          </Suspense>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Graph overview
          </h2>
          <Link
            href="/graph"
            className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Open full explorer →
          </Link>
        </div>
        <div className="mt-4">
          <GraphViewer compact />
        </div>
      </div>
    </main>
  );
}
