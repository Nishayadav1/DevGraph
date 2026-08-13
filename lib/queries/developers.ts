import 'server-only'

import { getCognoSession } from '../cognodb'
import type { Company, Developer, Project, Skill } from '../graph/types'
import { convertValue } from './convert'
import { getQuery } from './loadCypherFile'

export interface DeveloperSkillSummary {
  skill: Skill
  proficiency: string
  yearsOfExperience: number
}

export interface DeveloperProjectSummary {
  project: Project
  role: string
  startDate: string
  endDate: string | null
}

export interface DeveloperCompanySummary {
  company: Company
  role: string
  startDate: string
  endDate: string | null
}

export interface DeveloperDetail extends Developer {
  skills: DeveloperSkillSummary[]
  projects: DeveloperProjectSummary[]
  companies: DeveloperCompanySummary[]
}

export interface DeveloperBySkill {
  developer: Developer
  skill: Skill
  proficiency: string
  yearsOfExperience: number
}

export async function listDevelopers(search?: string): Promise<Developer[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('developers.cypher', 'listDevelopers'), {
      search: search?.trim() || null,
    })
    return result.records.map((record) => convertValue<Developer>(record.get('d')))
  } finally {
    await session.close()
  }
}

export async function getDeveloperById(id: string): Promise<DeveloperDetail | null> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('developers.cypher', 'getDeveloperById'), { id })
    if (result.records.length === 0) {
      return null
    }

    const record = result.records[0]
    return {
      ...convertValue<Developer>(record.get('d')),
      skills: convertValue<DeveloperSkillSummary[]>(record.get('skills')),
      projects: convertValue<DeveloperProjectSummary[]>(record.get('projects')),
      companies: convertValue<DeveloperCompanySummary[]>(record.get('companies')),
    }
  } finally {
    await session.close()
  }
}

/** Developers who have a skill matching `skillName`, ranked by experience. */
export async function findDevelopersBySkill(skillName: string): Promise<DeveloperBySkill[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('developers.cypher', 'findDevelopersBySkill'), {
      skillName,
    })
    return result.records.map((record) => ({
      developer: convertValue<Developer>(record.get('developer')),
      skill: convertValue<Skill>(record.get('skill')),
      proficiency: convertValue<string>(record.get('proficiency')),
      yearsOfExperience: convertValue<number>(record.get('yearsOfExperience')),
    }))
  } finally {
    await session.close()
  }
}
