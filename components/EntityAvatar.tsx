export default function EntityAvatar({ name, color = 'var(--accent)' }: { name: string; color?: string }) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-white"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}
