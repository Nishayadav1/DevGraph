'use client'

import { useState } from 'react'

interface DeveloperOption {
  id: string
  name: string
}

interface ConnectionPathNode {
  id: string
  label: string
  name: string
}

interface ConnectionPath {
  nodes: ConnectionPathNode[]
  relationshipTypes: string[]
  hops: number
}

type Status = 'idle' | 'loading' | 'found' | 'not-found' | 'error'

export default function ConnectionFinder({ developers }: { developers: DeveloperOption[] }) {
  const [fromId, setFromId] = useState(developers[0]?.id ?? '')
  const [toId, setToId] = useState(developers[1]?.id ?? '')
  const [status, setStatus] = useState<Status>('idle')
  const [path, setPath] = useState<ConnectionPath | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!fromId || !toId) return

    setStatus('loading')
    setPath(null)

    try {
      const res = await fetch(
        `/api/graph/connection?from=${encodeURIComponent(fromId)}&to=${encodeURIComponent(toId)}`
      )
      if (res.status === 404) {
        setStatus('not-found')
        return
      }
      if (!res.ok) {
        setStatus('error')
        return
      }
      const data = (await res.json()) as { path: ConnectionPath }
      setPath(data.path)
      setStatus('found')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="card-surface rounded-xl p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Find a connection</h2>
      <p className="mt-1.5 text-sm text-muted">
        Shortest path between two developers through any relationship — skills, projects,
        companies.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm">
          <span className="block text-xs font-medium uppercase tracking-wide text-muted">From</span>
          <select
            value={fromId}
            onChange={(event) => setFromId(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
          >
            {developers.map((developer) => (
              <option key={developer.id} value={developer.id}>
                {developer.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 text-sm">
          <span className="block text-xs font-medium uppercase tracking-wide text-muted">To</span>
          <select
            value={toId}
            onChange={(event) => setToId(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
          >
            {developers.map((developer) => (
              <option key={developer.id} value={developer.id}>
                {developer.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={status === 'loading' || !fromId || !toId || fromId === toId}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast shadow-sm transition-all hover:bg-accent-hover disabled:opacity-50"
        >
          {status === 'loading' ? 'Finding…' : 'Find path'}
        </button>
      </form>

      {fromId === toId && (
        <p className="mt-3 text-sm text-muted">Pick two different developers.</p>
      )}

      {status === 'not-found' && (
        <p className="mt-4 text-sm text-muted">No connection found within 6 hops.</p>
      )}

      {status === 'error' && (
        <p className="mt-4 text-sm text-red-500">Something went wrong finding that path. Try again.</p>
      )}

      {status === 'found' && path && (
        <div className="mt-4">
          <p className="text-sm text-muted">{path.hops} hop{path.hops === 1 ? '' : 's'}</p>
          <ol className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            {path.nodes.map((node, index) => (
              <li key={`${node.id}-${index}`} className="flex items-center gap-2">
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent">
                  {node.label}: {node.name}
                </span>
                {index < path.relationshipTypes.length && (
                  <span className="text-xs text-muted">
                    —{path.relationshipTypes[index]}→
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
