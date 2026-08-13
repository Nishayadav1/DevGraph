import Skeleton from './Skeleton'

export default function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border border-border bg-surface p-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
