import 'server-only'

import { getCognoSession } from '../cognodb'
import type { Developer, Project, Skill, Technology } from '../graph/types'
import { convertValue } from './convert'
import { getQuery } from './loadCypherFile'

export interface RelatedSkillSummary {
  skill: Skill
  strength: number
}

export interface SkillDeveloperSummary {
  developer: Developer
  proficiency: string
}

export interface SkillDetail extends Skill {
  relatedSkills: RelatedSkillSummary[]
  developers: SkillDeveloperSummary[]
}

export interface SimilarDeveloper {
  developer: Developer
  sharedSkills: number
}

export interface PeerRecommendedProject {
  project: Project
  peerCount: number
}

export async function listSkills(search?: string): Promise<Skill[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('recommendations.cypher', 'listSkills'), {
      search: search?.trim() || null,
    })
    return result.records.map((record) => convertValue<Skill>(record.get('s')))
  } finally {
    await session.close()
  }
}

export async function getSkillById(id: string): Promise<SkillDetail | null> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('recommendations.cypher', 'getSkillById'), { id })
    if (result.records.length === 0) {
      return null
    }

    const record = result.records[0]
    return {
      ...convertValue<Skill>(record.get('s')),
      relatedSkills: convertValue<RelatedSkillSummary[]>(record.get('relatedSkills')),
      developers: convertValue<SkillDeveloperSummary[]>(record.get('developers')),
    }
  } finally {
    await session.close()
  }
}

/** Recommends other developers for `developerId`, ranked by shared skills. */
export async function getSimilarDevelopers(developerId: string): Promise<SimilarDeveloper[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('recommendations.cypher', 'similarDevelopers'), {
      developerId,
    })
    return result.records.map((record) => ({
      developer: convertValue<Developer>(record.get('developer')),
      sharedSkills: convertValue<number>(record.get('sharedSkills')),
    }))
  } finally {
    await session.close()
  }
}

/** Recommends technologies for `projectId` related to ones it already uses. */
export async function getRelatedTechnologiesForProject(projectId: string): Promise<Technology[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(
      getQuery('recommendations.cypher', 'relatedTechnologiesForProject'),
      { projectId }
    )
    return result.records.map((record) => convertValue<Technology>(record.get('technology')))
  } finally {
    await session.close()
  }
}

/**
 * 3-hop traversal: recommends projects for `developerId` based on what
 * skill-sharing peers have worked on (Developer-HAS_SKILL-Skill-HAS_SKILL-Peer-WORKED_ON-Project).
 */
export async function getPeerRecommendedProjects(developerId: string): Promise<PeerRecommendedProject[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('recommendations.cypher', 'peerRecommendedProjects'), {
      developerId,
    })
    return result.records.map((record) => ({
      project: convertValue<Project>(record.get('project')),
      peerCount: convertValue<number>(record.get('peerCount')),
    }))
  } finally {
    await session.close()
  }
}
