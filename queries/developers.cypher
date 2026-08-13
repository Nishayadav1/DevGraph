// name: listDevelopers
// Lists developers, optionally filtered by a case-insensitive name match.
// $search may be null, in which case every developer is returned.
MATCH (d:Developer)
WHERE $search IS NULL OR toLower(d.name) CONTAINS toLower($search)
RETURN d
ORDER BY d.name

// name: getDeveloperById
// A developer plus their skills, project history, and employment history.
// Each OPTIONAL MATCH is aggregated via WITH before the next one starts, so
// they don't fan out against each other into a cartesian product — chaining
// them directly (all under one RETURN) would multiply rows across the three
// relationship types and produce duplicated projects/companies.
MATCH (d:Developer {id: $id})
OPTIONAL MATCH (d)-[hs:HAS_SKILL]->(skill:Skill)
WITH d, collect(DISTINCT CASE WHEN skill IS NULL THEN NULL ELSE {
  skill: skill, proficiency: hs.proficiency, yearsOfExperience: hs.yearsOfExperience
} END) AS skills
OPTIONAL MATCH (d)-[wo:WORKED_ON]->(project:Project)
WITH d, skills, collect(DISTINCT CASE WHEN project IS NULL THEN NULL ELSE {
  project: project, role: wo.role, startDate: wo.startDate, endDate: wo.endDate
} END) AS projects
OPTIONAL MATCH (d)-[wa:WORKED_AT]->(company:Company)
WITH d, skills, projects, collect(DISTINCT CASE WHEN company IS NULL THEN NULL ELSE {
  company: company, role: wa.role, startDate: wa.startDate, endDate: wa.endDate
} END) AS companies
RETURN d, skills, projects, companies

// name: findDevelopersBySkill
// Developers who have a skill matching $skillName (case-insensitive),
// ranked by years of experience with that skill.
MATCH (s:Skill)
WHERE toLower(s.name) CONTAINS toLower($skillName)
MATCH (d:Developer)-[hs:HAS_SKILL]->(s)
RETURN d AS developer, s AS skill, hs.proficiency AS proficiency, hs.yearsOfExperience AS yearsOfExperience
ORDER BY hs.yearsOfExperience DESC
