import type { Session } from 'neo4j-driver'
import { getCognoSession } from '../cognodb'
import { applyConstraintsAndIndexes } from './constraints'
import {
  companies,
  developers,
  hasSkillRelationships,
  projects,
  skillRelatedToRelationships,
  skills,
  technologies,
  technologyRelatedToRelationships,
  usesRelationships,
  workedAtRelationships,
  workedOnRelationships,
} from './seed-data'
import type {
  Company,
  Developer,
  HasSkillRelationship,
  Project,
  Skill,
  SkillRelatedToRelationship,
  Technology,
  TechnologyRelatedToRelationship,
  UsesRelationship,
  WorkedAtRelationship,
  WorkedOnRelationship,
} from './types'

// All writes go through UNWIND + MERGE on `$items`, an array bound as a
// single query parameter. Node labels/relationship types are fixed string
// literals in the query text (Cypher cannot parameterize them), but no
// developer-supplied value is ever concatenated into a query.

async function seedDevelopers(session: Session, items: Developer[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MERGE (d:Developer {id: item.id})
    SET d.name = item.name,
        d.email = item.email,
        d.location = item.location,
        d.experience = item.experience
    `,
    { items }
  )
}

async function seedSkills(session: Session, items: Skill[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MERGE (s:Skill {id: item.id})
    SET s.name = item.name,
        s.category = item.category
    `,
    { items }
  )
}

async function seedProjects(session: Session, items: Project[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MERGE (p:Project {id: item.id})
    SET p.name = item.name,
        p.description = item.description,
        p.status = item.status
    `,
    { items }
  )
}

async function seedTechnologies(session: Session, items: Technology[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MERGE (t:Technology {id: item.id})
    SET t.name = item.name,
        t.category = item.category
    `,
    { items }
  )
}

async function seedCompanies(session: Session, items: Company[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MERGE (c:Company {id: item.id})
    SET c.name = item.name,
        c.industry = item.industry
    `,
    { items }
  )
}

async function seedHasSkillRelationships(session: Session, items: HasSkillRelationship[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MATCH (d:Developer {id: item.developerId})
    MATCH (s:Skill {id: item.skillId})
    MERGE (d)-[r:HAS_SKILL]->(s)
    SET r.proficiency = item.proficiency,
        r.yearsOfExperience = item.yearsOfExperience
    `,
    { items }
  )
}

async function seedWorkedOnRelationships(session: Session, items: WorkedOnRelationship[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MATCH (d:Developer {id: item.developerId})
    MATCH (p:Project {id: item.projectId})
    MERGE (d)-[r:WORKED_ON]->(p)
    SET r.role = item.role,
        r.startDate = item.startDate,
        r.endDate = item.endDate
    `,
    { items }
  )
}

async function seedWorkedAtRelationships(session: Session, items: WorkedAtRelationship[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MATCH (d:Developer {id: item.developerId})
    MATCH (c:Company {id: item.companyId})
    MERGE (d)-[r:WORKED_AT]->(c)
    SET r.role = item.role,
        r.startDate = item.startDate,
        r.endDate = item.endDate
    `,
    { items }
  )
}

async function seedUsesRelationships(session: Session, items: UsesRelationship[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MATCH (p:Project {id: item.projectId})
    MATCH (t:Technology {id: item.technologyId})
    MERGE (p)-[r:USES]->(t)
    SET r.usage = item.usage
    `,
    { items }
  )
}

async function seedSkillRelatedToRelationships(session: Session, items: SkillRelatedToRelationship[]): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MATCH (from:Skill {id: item.fromSkillId})
    MATCH (to:Skill {id: item.toSkillId})
    MERGE (from)-[r:RELATED_TO]->(to)
    SET r.strength = item.strength
    `,
    { items }
  )
}

async function seedTechnologyRelatedToRelationships(
  session: Session,
  items: TechnologyRelatedToRelationship[]
): Promise<void> {
  await session.run(
    `
    UNWIND $items AS item
    MATCH (from:Technology {id: item.fromTechnologyId})
    MATCH (to:Technology {id: item.toTechnologyId})
    MERGE (from)-[r:RELATED_TO]->(to)
    SET r.strength = item.strength
    `,
    { items }
  )
}

/**
 * Applies constraints/indexes and seeds all node and relationship data.
 * Safe to run repeatedly: constraints use `IF NOT EXISTS` and all writes
 * use `MERGE` keyed on `id`, so re-running only updates properties rather
 * than creating duplicates.
 */
export async function seedGraph(): Promise<void> {
  const session = getCognoSession()

  try {
    await applyConstraintsAndIndexes(session)

    await seedDevelopers(session, developers)
    await seedSkills(session, skills)
    await seedProjects(session, projects)
    await seedTechnologies(session, technologies)
    await seedCompanies(session, companies)

    await seedHasSkillRelationships(session, hasSkillRelationships)
    await seedWorkedOnRelationships(session, workedOnRelationships)
    await seedWorkedAtRelationships(session, workedAtRelationships)
    await seedUsesRelationships(session, usesRelationships)
    await seedSkillRelatedToRelationships(session, skillRelatedToRelationships)
    await seedTechnologyRelatedToRelationships(session, technologyRelatedToRelationships)
  } finally {
    await session.close()
  }
}
