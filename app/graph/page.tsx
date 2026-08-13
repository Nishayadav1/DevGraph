import ConnectionFinder from "@/components/ConnectionFinder";
import GraphViewer from "@/components/GraphViewer";
import { listDevelopers } from "@/lib/queries/developers";

// Otherwise the developer dropdown (and effectively the whole page shell)
// freezes at build time — see app/page.tsx for why.
export const dynamic = "force-dynamic";

export default async function GraphExplorerPage() {
  const developers = await listDevelopers();
  // Only pass what the client component needs — never the full record.
  const developerOptions = developers.map(({ id, name }) => ({ id, name }));

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Graph Explorer
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Every node and relationship in DevGraph. Search by name, toggle node
        and relationship types, click a node for details, drag to rearrange,
        scroll to zoom.
      </p>

      <div className="mt-5">
        <GraphViewer />
      </div>

      <div className="mt-6">
        <ConnectionFinder developers={developerOptions} />
      </div>
    </main>
  );
}
