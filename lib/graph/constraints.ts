import type { Session } from 'neo4j-driver'

// Every statement uses `IF NOT EXISTS`, so re-running this against an
// already-initialized database is a no-op rather than an error.
const CONSTRAINTS_AND_INDEXES: readonly string[] = [
  'CREATE CONSTRAINT developer_id_unique IF NOT EXISTS FOR (d:Developer) REQUIRE d.id IS UNIQUE',
  'CREATE CONSTRAINT skill_id_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE',
  'CREATE CONSTRAINT project_id_unique IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE',
  'CREATE CONSTRAINT technology_id_unique IF NOT EXISTS FOR (t:Technology) REQUIRE t.id IS UNIQUE',
  'CREATE CONSTRAINT company_id_unique IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE',

  // Uniqueness constraints already index `id`. These extra indexes speed up
  // lookups by the human-readable `name` field, which the app will also
  // query by (e.g. searching for a skill or technology by name).
  'CREATE INDEX developer_name_index IF NOT EXISTS FOR (d:Developer) ON (d.name)',
  'CREATE INDEX skill_name_index IF NOT EXISTS FOR (s:Skill) ON (s.name)',
  'CREATE INDEX project_name_index IF NOT EXISTS FOR (p:Project) ON (p.name)',
  'CREATE INDEX technology_name_index IF NOT EXISTS FOR (t:Technology) ON (t.name)',
  'CREATE INDEX company_name_index IF NOT EXISTS FOR (c:Company) ON (c.name)',
]

export async function applyConstraintsAndIndexes(session: Session): Promise<void> {
  for (const statement of CONSTRAINTS_AND_INDEXES) {
    await session.run(statement)
  }
}
