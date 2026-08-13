import 'server-only'

import { getCognoSession } from '../cognodb'
import type { Project, Technology } from '../graph/types'
import { convertValue } from './convert'
import { getQuery } from './loadCypherFile'

export interface RelatedTechnologySummary {
  technology: Technology
  strength: number
}

export interface TechnologyProjectSummary {
  project: Project
  usage: string
}

export interface TechnologyDetail extends Technology {
  relatedTechnologies: RelatedTechnologySummary[]
  projects: TechnologyProjectSummary[]
}

export async function listTechnologies(search?: string): Promise<Technology[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('recommendations.cypher', 'listTechnologies'), {
      search: search?.trim() || null,
    })
    return result.records.map((record) => convertValue<Technology>(record.get('t')))
  } finally {
    await session.close()
  }
}

export async function getTechnologyById(id: string): Promise<TechnologyDetail | null> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('recommendations.cypher', 'getTechnologyById'), { id })
    if (result.records.length === 0) {
      return null
    }

    const record = result.records[0]
    return {
      ...convertValue<Technology>(record.get('t')),
      relatedTechnologies: convertValue<RelatedTechnologySummary[]>(record.get('relatedTechnologies')),
      projects: convertValue<TechnologyProjectSummary[]>(record.get('projects')),
    }
  } finally {
    await session.close()
  }
}
