import 'server-only'

import type { Developer, Project, Skill, Technology } from '../graph/types'
import { listDevelopers } from './developers'
import { listProjects } from './projects'
import { listSkills } from './skills'
import { listTechnologies } from './technologies'

export interface SearchResults {
  developers: Developer[]
  projects: Project[]
  skills: Skill[]
  technologies: Technology[]
}

/** Searches developers, projects, skills, and technologies by name in parallel. */
export async function searchAll(query: string): Promise<SearchResults> {
  const [developers, projects, skills, technologies] = await Promise.all([
    listDevelopers(query),
    listProjects(query),
    listSkills(query),
    listTechnologies(query),
  ])

  return { developers, projects, skills, technologies }
}
