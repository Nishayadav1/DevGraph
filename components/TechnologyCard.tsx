import Link from 'next/link'
import type { Technology } from '@/lib/graph/types'

export default function TechnologyCard({ technology }: { technology: Technology }) {
  return (
    <Link
      href={`/technologies/${technology.id}`}
      className="card-surface group block rounded-xl p-4"
    >
      <h3 className="font-semibold text-foreground transition-colors group-hover:text-accent">
        {technology.name}
      </h3>
      <span className="mt-3 inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
        {technology.category}
      </span>
    </Link>
  )
}
