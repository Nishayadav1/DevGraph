import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-start justify-center px-6 py-12">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-2xl">
        🔍
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        Not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Nothing lives at this address. It may have been renamed or never
        existed.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast shadow-sm transition-colors hover:bg-accent-hover"
      >
        Back to Dashboard
      </Link>
    </main>
  );
}
