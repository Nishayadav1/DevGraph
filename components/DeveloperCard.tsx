import Link from 'next/link'
import type { Developer } from '@/lib/graph/types'

export default function DeveloperCard({ developer }: { developer: Developer }) {
  return (
    <Link
      href={`/developers/${developer.id}`}
      className="card-surface group block rounded-xl p-4"
    >
      <h3 className="font-semibold text-foreground transition-colors group-hover:text-accent">
        {developer.name}
      </h3>
      <p className="mt-1 text-sm text-muted">{developer.location}</p>
      <p className="mt-3 inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
        {developer.experience} yrs experience
      </p>
    </Link>
  )
}
