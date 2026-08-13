// Node types

export interface Developer {
  id: string
  name: string
  email: string
  location: string
  experience: number
}

export interface Skill {
  id: string
  name: string
  category: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: string
}

export interface Technology {
  id: string
  name: string
  category: string
}

export interface Company {
  id: string
  name: string
  industry: string
}

// Relationship types
// Each pairs the ids of the two nodes it connects with whatever
// properties are useful to keep on the edge itself.

export interface HasSkillRelationship {
  developerId: string
  skillId: string
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsOfExperience: number
}

export interface WorkedOnRelationship {
  developerId: string
  projectId: string
  role: string
  startDate: string
  endDate: string | null
}

export interface WorkedAtRelationship {
  developerId: string
  companyId: string
  role: string
  startDate: string
  endDate: string | null
}

export interface UsesRelationship {
  projectId: string
  technologyId: string
  usage: 'primary' | 'secondary'
}

export interface SkillRelatedToRelationship {
  fromSkillId: string
  toSkillId: string
  strength: number
}

export interface TechnologyRelatedToRelationship {
  fromTechnologyId: string
  toTechnologyId: string
  strength: number
}
