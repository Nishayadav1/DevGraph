import Link from 'next/link'
import type { Skill } from '@/lib/graph/types'

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link
      href={`/skills/${skill.id}`}
      className="card-surface group block rounded-xl p-4"
    >
      <h3 className="font-semibold text-foreground transition-colors group-hover:text-accent">
        {skill.name}
      </h3>
      <span className="mt-3 inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
        {skill.category}
      </span>
    </Link>
  )
}
