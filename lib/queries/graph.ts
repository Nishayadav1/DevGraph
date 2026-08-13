import 'server-only'

import neo4j, { type Node as Neo4jNode, type Relationship } from 'neo4j-driver'
import { getCognoSession } from '../cognodb'
import { convertValue } from './convert'
import { getQuery } from './loadCypherFile'

export interface GraphNode {
  id: string
  label: string
  name: string
  properties: Record<string, unknown>
}

export interface GraphLink {
  id: string
  source: string
  target: string
  type: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export interface ConnectionPathNode {
  label: string
  id: string
  name: string
}

export interface ConnectionPath {
  nodes: ConnectionPathNode[]
  relationshipTypes: string[]
  hops: number
}

export interface GraphStats {
  developers: number
  skills: number
  projects: number
  technologies: number
  companies: number
}

function toPlainProperties(node: Neo4jNode): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(node.properties).map(([key, value]) => [
      key,
      neo4j.isInt(value) ? value.toNumber() : value,
    ])
  )
}

function toGraphNode(node: Neo4jNode): GraphNode {
  const properties = toPlainProperties(node)
  const id = String(properties.id)
  return {
    id,
    label: node.labels[0] ?? 'Unknown',
    name: typeof properties.name === 'string' ? properties.name : id,
    properties,
  }
}

/** The full graph (every node and relationship) for the graph viewer. */
export async function getFullGraph(): Promise<GraphData> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('recommendations.cypher', 'fullGraph'))

    const nodes = new Map<string, GraphNode>()
    const links = new Map<string, GraphLink>()

    for (const record of result.records) {
      const source = toGraphNode(record.get('n') as Neo4jNode)
      nodes.set(source.id, source)

      const relationship = record.get('r') as Relationship | null
      const targetNode = record.get('m') as Neo4jNode | null

      if (relationship && targetNode) {
        const target = toGraphNode(targetNode)
        nodes.set(target.id, target)

        const linkId = relationship.elementId
        links.set(linkId, {
          id: linkId,
          source: source.id,
          target: target.id,
          type: relationship.type,
        })
      }
    }

    return { nodes: [...nodes.values()], links: [...links.values()] }
  } finally {
    await session.close()
  }
}

const STATS_LABEL_KEYS: Record<string, keyof GraphStats> = {
  Developer: 'developers',
  Skill: 'skills',
  Project: 'projects',
  Technology: 'technologies',
  Company: 'companies',
}

/** Node counts by label, for the dashboard's stat tiles. */
export async function getGraphStats(): Promise<GraphStats> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('recommendations.cypher', 'graphStats'))

    const stats: GraphStats = { developers: 0, skills: 0, projects: 0, technologies: 0, companies: 0 }
    for (const record of result.records) {
      const label = record.get('label') as string
      const key = STATS_LABEL_KEYS[label]
      if (key) {
        stats[key] = convertValue<number>(record.get('count'))
      }
    }
    return stats
  } finally {
    await session.close()
  }
}

/**
 * The shortest path between two developers through any relationship type
 * (skills, projects, companies, RELATED_TO edges), of unknown length up
 * front — a `shortestPath()` traversal that's awkward to express relationally.
 * Returns `null` if either developer doesn't exist or no path exists within
 * 6 hops.
 */
export async function getDeveloperConnectionPath(
  fromDeveloperId: string,
  toDeveloperId: string
): Promise<ConnectionPath | null> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('recommendations.cypher', 'developerConnectionPath'), {
      fromDeveloperId,
      toDeveloperId,
    })
    if (result.records.length === 0) {
      return null
    }

    const record = result.records[0]
    return {
      nodes: convertValue<ConnectionPathNode[]>(record.get('pathNodes')),
      relationshipTypes: convertValue<string[]>(record.get('relationshipTypes')),
      hops: convertValue<number>(record.get('hops')),
    }
  } finally {
    await session.close()
  }
}
