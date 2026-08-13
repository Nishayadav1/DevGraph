// name: listTechnologies
// Lists technologies, optionally filtered by a case-insensitive name match.
MATCH (t:Technology)
WHERE $search IS NULL OR toLower(t.name) CONTAINS toLower($search)
RETURN t
ORDER BY t.name

// name: graphStats
// Node counts by label, for the dashboard's stat tiles.
MATCH (n)
RETURN labels(n)[0] AS label, count(n) AS count

// name: getTechnologyById
// A technology plus directly related technologies and the projects using it.
// Each OPTIONAL MATCH is aggregated via WITH before the next starts, to avoid
// a cartesian product between related technologies and projects.
MATCH (t:Technology {id: $id})
OPTIONAL MATCH (t)-[r:RELATED_TO]->(related:Technology)
WITH t, collect(DISTINCT CASE WHEN related IS NULL THEN NULL ELSE {
  technology: related, strength: r.strength
} END) AS relatedTechnologies
OPTIONAL MATCH (project:Project)-[u:USES]->(t)
WITH t, relatedTechnologies, collect(DISTINCT CASE WHEN project IS NULL THEN NULL ELSE {
  project: project, usage: u.usage
} END) AS projects
RETURN t, relatedTechnologies, projects

// name: listSkills
// Lists skills, optionally filtered by a case-insensitive name match.
MATCH (s:Skill)
WHERE $search IS NULL OR toLower(s.name) CONTAINS toLower($search)
RETURN s
ORDER BY s.name

// name: getSkillById
// A skill plus directly related skills and the developers who have it.
// Each OPTIONAL MATCH is aggregated via WITH before the next starts, to avoid
// a cartesian product between related skills and developers.
MATCH (s:Skill {id: $id})
OPTIONAL MATCH (s)-[r:RELATED_TO]->(related:Skill)
WITH s, collect(DISTINCT CASE WHEN related IS NULL THEN NULL ELSE {
  skill: related, strength: r.strength
} END) AS relatedSkills
OPTIONAL MATCH (developer:Developer)-[hs:HAS_SKILL]->(s)
WITH s, relatedSkills, collect(DISTINCT CASE WHEN developer IS NULL THEN NULL ELSE {
  developer: developer, proficiency: hs.proficiency
} END) AS developers
RETURN s, relatedSkills, developers

// name: similarDevelopers
// Recommends other developers for $developerId, ranked by shared skills.
MATCH (target:Developer {id: $developerId})-[:HAS_SKILL]->(skill:Skill)<-[:HAS_SKILL]-(other:Developer)
WHERE other.id <> target.id
WITH other, count(DISTINCT skill) AS sharedSkills
RETURN other AS developer, sharedSkills
ORDER BY sharedSkills DESC, other.name ASC
LIMIT 10

// name: relatedTechnologiesForProject
// Recommends technologies for $projectId, based on RELATED_TO edges from
// technologies the project already uses, excluding ones it already uses.
// Uses an explicit id-list membership check rather than a correlated
// `WHERE NOT (pattern)` predicate — this backend does not evaluate the
// bound outer variable correctly inside a negated pattern predicate.
MATCH (p:Project {id: $projectId})-[:USES]->(used:Technology)
WITH p, collect(used) AS usedTechs, collect(used.id) AS usedIds
UNWIND usedTechs AS u
MATCH (u)-[:RELATED_TO]->(candidate:Technology)
WHERE NOT candidate.id IN usedIds
RETURN DISTINCT candidate AS technology
LIMIT 10

// name: fullGraph
// Every node and relationship, for the graph visualization view.
MATCH (n)
OPTIONAL MATCH (n)-[r]->(m)
RETURN n, r, m

// name: peerRecommendedProjects
// 3-hop traversal: Developer -[:HAS_SKILL]-> Skill <-[:HAS_SKILL]- Peer -[:WORKED_ON]-> Project.
// Recommends projects for $developerId based on what skill-sharing peers
// have worked on, excluding projects the developer has already worked on.
// Uses an explicit id-list membership check rather than a correlated
// `WHERE NOT (pattern)` predicate — this backend does not evaluate the
// bound outer variable correctly inside a negated pattern predicate.
MATCH (target:Developer {id: $developerId})
OPTIONAL MATCH (target)-[:WORKED_ON]->(existing:Project)
WITH target, collect(existing.id) AS existingProjectIds
MATCH (target)-[:HAS_SKILL]->(:Skill)<-[:HAS_SKILL]-(peer:Developer)-[:WORKED_ON]->(project:Project)
WHERE NOT project.id IN existingProjectIds
WITH project, count(DISTINCT peer) AS peerCount
RETURN project, peerCount
ORDER BY peerCount DESC, project.name ASC
LIMIT 10

// name: developerConnectionPath
// STAR: the shortest path between two developers, through ANY relationship
// type (skills, projects, companies, RELATED_TO edges) and unknown length up
// front. `shortestPath()` + a variable-length, undirected, multi-type
// pattern is native Cypher; a relational schema would need a recursive CTE
// per relationship/join table, manual cycle detection, and still couldn't
// guarantee shortest-path without re-deriving BFS by hand.
MATCH (from:Developer {id: $fromDeveloperId}), (to:Developer {id: $toDeveloperId})
MATCH path = shortestPath((from)-[*..6]-(to))
RETURN
  [node IN nodes(path) | {
    label: labels(node)[0],
    id: node.id,
    name: node.name
  }] AS pathNodes,
  [rel IN relationships(path) | type(rel)] AS relationshipTypes,
  length(path) AS hops
