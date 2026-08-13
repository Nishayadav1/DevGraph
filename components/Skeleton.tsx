export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded bg-border ${className}`}
      style={{ animation: 'pulse-skeleton 1.5s ease-in-out infinite' }}
      aria-hidden="true"
    />
  )
}
