// name: listProjects
// Lists projects, optionally filtered by a case-insensitive name match.
MATCH (p:Project)
WHERE $search IS NULL OR toLower(p.name) CONTAINS toLower($search)
RETURN p
ORDER BY p.name

// name: getProjectById
// A project plus the technologies it uses and the developers who worked on it.
// Each OPTIONAL MATCH is aggregated via WITH before the next starts, to avoid
// a cartesian product between technologies and developers (see getDeveloperById).
MATCH (p:Project {id: $id})
OPTIONAL MATCH (p)-[u:USES]->(technology:Technology)
WITH p, collect(DISTINCT CASE WHEN technology IS NULL THEN NULL ELSE {
  technology: technology, usage: u.usage
} END) AS technologies
OPTIONAL MATCH (developer:Developer)-[wo:WORKED_ON]->(p)
WITH p, technologies, collect(DISTINCT CASE WHEN developer IS NULL THEN NULL ELSE {
  developer: developer, role: wo.role, startDate: wo.startDate, endDate: wo.endDate
} END) AS developers
RETURN p, technologies, developers

// name: findProjectsByTechnology
// Projects that use a technology matching $technologyName (case-insensitive).
MATCH (t:Technology)
WHERE toLower(t.name) CONTAINS toLower($technologyName)
MATCH (p:Project)-[u:USES]->(t)
RETURN p AS project, t AS technology, u.usage AS usage
ORDER BY p.name

// name: findDevelopersForProject
// Developers who worked on $projectId, most recent first.
MATCH (p:Project {id: $projectId})
MATCH (d:Developer)-[wo:WORKED_ON]->(p)
RETURN d AS developer, wo.role AS role, wo.startDate AS startDate, wo.endDate AS endDate
ORDER BY wo.startDate DESC
