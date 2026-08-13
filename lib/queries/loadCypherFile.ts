import 'server-only'

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Splits a `.cypher` file into named queries. Each query is introduced by
// a `// name: <queryName>` comment line; everything up to the next marker
// (or end of file) is that query's body.
const NAME_MARKER = /^\/\/\s*name:\s*(\S+)\s*$/m

function parseNamedQueries(fileContents: string): Map<string, string> {
  const queries = new Map<string, string>()
  const markers = [...fileContents.matchAll(new RegExp(NAME_MARKER, 'gm'))]

  for (const [index, marker] of markers.entries()) {
    const name = marker[1]
    const bodyStart = marker.index! + marker[0].length
    const bodyEnd = markers[index + 1]?.index ?? fileContents.length
    queries.set(name, fileContents.slice(bodyStart, bodyEnd).trim())
  }

  return queries
}

const fileCache = new Map<string, Map<string, string>>()

// The dev server is a long-running process, and `.cypher` files are plain
// runtime assets (read via `fs`, not imported) — Next's module HMR has no
// reason to know they exist, so editing one without this check would keep
// serving the previously-cached query text until the process restarts.
const shouldCache = process.env.NODE_ENV === 'production'

/**
 * Reads `queries/<fileName>`, parses its named queries, and returns the
 * Cypher text for `queryName`. File contents are cached per process in
 * production; re-read on every call in development.
 */
export function getQuery(fileName: string, queryName: string): string {
  let queries = shouldCache ? fileCache.get(fileName) : undefined

  if (!queries) {
    const filePath = join(process.cwd(), 'queries', fileName)
    queries = parseNamedQueries(readFileSync(filePath, 'utf-8'))
    if (shouldCache) {
      fileCache.set(fileName, queries)
    }
  }

  const query = queries.get(queryName)
  if (!query) {
    throw new Error(`Query "${queryName}" not found in queries/${fileName}`)
  }

  return query
}
