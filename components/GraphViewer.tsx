'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { NodeObject } from 'react-force-graph-2d'

// Canvas/WebGL rendering needs `window`, so the graph library is loaded
// client-side only.
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

interface GraphNode {
  id: string
  label: string
  name: string
  properties: Record<string, unknown>
}

interface GraphLink {
  id: string
  source: string
  target: string
  type: string
}

interface GraphApiResponse {
  nodes: GraphNode[]
  links: GraphLink[]
}

const LABEL_COLORS: Record<string, string> = {
  Developer: '#38bdf8',
  Skill: '#a78bfa',
  Project: '#34d399',
  Technology: '#fbbf24',
  Company: '#f87171',
}

const ALL_LABELS = ['Developer', 'Skill', 'Project', 'Technology', 'Company'] as const
const ALL_REL_TYPES = ['HAS_SKILL', 'WORKED_ON', 'WORKED_AT', 'USES', 'RELATED_TO'] as const

const DETAIL_ROUTES: Record<string, string> = {
  Developer: '/developers',
  Skill: '/skills',
  Project: '/projects',
  Technology: '/technologies',
}

function asGraphNode(node: NodeObject): GraphNode {
  return node as unknown as GraphNode
}

export default function GraphViewer({ compact = false }: { compact?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [data, setData] = useState<GraphApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [visibleLabels, setVisibleLabels] = useState<Set<string>>(new Set(ALL_LABELS))
  const [visibleRelTypes, setVisibleRelTypes] = useState<Set<string>>(new Set(ALL_REL_TYPES))
  const [search, setSearch] = useState('')
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/graph', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }
        return res.json() as Promise<GraphApiResponse>
      })
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setWidth(entry.contentRect.width)
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // react-force-graph mutates the node/link objects it's given (adds x/y/vx/vy,
  // and replaces link.source/target string ids with node object references).
  // Deriving fresh copies here on every filter change keeps `data` itself
  // pristine, so filtering always reads plain string ids, not stale refs.
  const graphData = useMemo(() => {
    if (!data) return null

    const nodes = data.nodes.filter((node) => visibleLabels.has(node.label)).map((node) => ({ ...node }))
    const nodeIds = new Set(nodes.map((node) => node.id))
    const links = data.links
      .filter((link) => visibleRelTypes.has(link.type) && nodeIds.has(link.source) && nodeIds.has(link.target))
      .map((link) => ({ ...link }))

    return { nodes, links }
  }, [data, visibleLabels, visibleRelTypes])

  const searchTerm = search.trim().toLowerCase()

  function toggleLabel(label: string) {
    setVisibleLabels((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  function toggleRelType(type: string) {
    setVisibleRelTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  return (
    <div>
      {!compact && data && (
        <div className="mb-3 flex flex-col gap-3">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search graph by name…"
              className="w-full rounded-lg border border-border bg-surface py-2 pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted focus:border-accent"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-muted">Show:</span>
            {ALL_LABELS.map((label) => {
              const active = visibleLabels.has(label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleLabel(label)}
                  aria-pressed={active}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    active
                      ? 'border-transparent bg-accent-soft text-accent'
                      : 'border-border text-muted opacity-60'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: LABEL_COLORS[label] }}
                    aria-hidden="true"
                  />
                  {label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-muted">Relationships:</span>
            {ALL_REL_TYPES.map((type) => {
              const active = visibleRelTypes.has(type)
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleRelType(type)}
                  aria-pressed={active}
                  className={`rounded-full border px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                    active
                      ? 'border-transparent bg-accent-soft text-accent'
                      : 'border-border text-muted opacity-60'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="h-[520px] w-full overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
      >
        {error ? (
          <p className="p-6 text-sm text-red-500">Failed to load graph: {error}</p>
        ) : !data || !graphData ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 animate-ping rounded-full bg-accent" aria-hidden="true" />
            Loading graph…
          </div>
        ) : (
          <ForceGraph2D
            graphData={graphData}
            width={width || undefined}
            height={520}
            nodeId="id"
            nodeRelSize={5}
            nodeLabel={(node) => `${asGraphNode(node).label}: ${asGraphNode(node).name}`}
            nodeColor={(node) => {
              const graphNode = asGraphNode(node)
              const base = LABEL_COLORS[graphNode.label] ?? '#94a3b8'
              if (!searchTerm) return base
              return graphNode.name.toLowerCase().includes(searchTerm) ? base : '#d8d8e0'
            }}
            onNodeClick={(node) => setSelectedNode(asGraphNode(node))}
            linkLabel={(link) => (link as unknown as GraphLink).type}
            linkColor={() => '#c9c7e6'}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
          />
        )}
      </div>

      {selectedNode && (
        <div className="card-surface mt-3 flex items-start justify-between gap-4 rounded-xl p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: LABEL_COLORS[selectedNode.label] ?? '#94a3b8' }}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {selectedNode.label}
              </span>
            </div>
            <h3 className="mt-1 truncate text-base font-semibold text-foreground">
              {selectedNode.name}
            </h3>
            <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              {Object.entries(selectedNode.properties)
                .filter(([key]) => key !== 'id' && key !== 'name')
                .map(([key, value]) => (
                  <div key={key} className="flex gap-1">
                    <dt className="font-medium">{key}:</dt>
                    <dd>{String(value)}</dd>
                  </div>
                ))}
            </dl>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {DETAIL_ROUTES[selectedNode.label] && (
              <Link
                href={`${DETAIL_ROUTES[selectedNode.label]}/${selectedNode.id}`}
                className="whitespace-nowrap text-sm font-medium text-accent hover:underline"
              >
                View profile →
              </Link>
            )}
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              aria-label="Close details"
              className="text-muted transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
