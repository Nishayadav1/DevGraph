import Link from 'next/link'
import type { Project } from '@/lib/graph/types'

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-accent-soft text-accent',
  'on-hold': 'bg-amber-50 text-amber-700',
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-surface group block rounded-xl p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground transition-colors group-hover:text-accent">
          {project.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            STATUS_STYLES[project.status] ?? 'bg-accent-soft text-accent'
          }`}
        >
          {project.status}
        </span>
      </div>
      <p className="mt-1.5 text-sm text-muted">{project.description}</p>
    </Link>
  )
}
