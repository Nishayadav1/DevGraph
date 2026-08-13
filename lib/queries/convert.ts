import 'server-only'

import neo4j from 'neo4j-driver'

function isNeo4jNode(value: unknown): value is { properties: Record<string, unknown> } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'properties' in value &&
    'labels' in value &&
    'identity' in value
  )
}

/**
 * Recursively converts a raw neo4j-driver result value into plain,
 * JSON-serializable data: Neo4j `Integer`s become numbers, Nodes become
 * their `.properties`, and arrays/maps are walked the same way.
 */
export function convertValue<T = unknown>(value: unknown): T {
  if (neo4j.isInt(value)) {
    return value.toNumber() as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => convertValue(item)) as T
  }
  if (isNeo4jNode(value)) {
    return convertValue(value.properties) as T
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, v]) => [key, convertValue(v)])
    ) as T
  }
  return value as T
}
