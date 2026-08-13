import 'server-only'

import { getCognoSession } from '../cognodb'
import type { Developer, Project, Technology } from '../graph/types'
import { convertValue } from './convert'
import { getQuery } from './loadCypherFile'

export interface ProjectTechnologySummary {
  technology: Technology
  usage: string
}

export interface ProjectDeveloperSummary {
  developer: Developer
  role: string
  startDate: string
  endDate: string | null
}

export interface ProjectDetail extends Project {
  technologies: ProjectTechnologySummary[]
  developers: ProjectDeveloperSummary[]
}

export interface ProjectByTechnology {
  project: Project
  technology: Technology
  usage: string
}

export interface ProjectDeveloper {
  developer: Developer
  role: string
  startDate: string
  endDate: string | null
}

export async function listProjects(search?: string): Promise<Project[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('projects.cypher', 'listProjects'), {
      search: search?.trim() || null,
    })
    return result.records.map((record) => convertValue<Project>(record.get('p')))
  } finally {
    await session.close()
  }
}

export async function getProjectById(id: string): Promise<ProjectDetail | null> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('projects.cypher', 'getProjectById'), { id })
    if (result.records.length === 0) {
      return null
    }

    const record = result.records[0]
    return {
      ...convertValue<Project>(record.get('p')),
      technologies: convertValue<ProjectTechnologySummary[]>(record.get('technologies')),
      developers: convertValue<ProjectDeveloperSummary[]>(record.get('developers')),
    }
  } finally {
    await session.close()
  }
}

/** Projects that use a technology matching `technologyName`. */
export async function findProjectsByTechnology(technologyName: string): Promise<ProjectByTechnology[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('projects.cypher', 'findProjectsByTechnology'), {
      technologyName,
    })
    return result.records.map((record) => ({
      project: convertValue<Project>(record.get('project')),
      technology: convertValue<Technology>(record.get('technology')),
      usage: convertValue<string>(record.get('usage')),
    }))
  } finally {
    await session.close()
  }
}

/** Developers who worked on `projectId`, most recent first. */
export async function findDevelopersForProject(projectId: string): Promise<ProjectDeveloper[]> {
  const session = getCognoSession()
  try {
    const result = await session.run(getQuery('projects.cypher', 'findDevelopersForProject'), {
      projectId,
    })
    return result.records.map((record) => ({
      developer: convertValue<Developer>(record.get('developer')),
      role: convertValue<string>(record.get('role')),
      startDate: convertValue<string>(record.get('startDate')),
      endDate: convertValue<string | null>(record.get('endDate')),
    }))
  } finally {
    await session.close()
  }
}
