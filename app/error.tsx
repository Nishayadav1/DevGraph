"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-start justify-center px-6 py-12">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
        ⚠️
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        That didn&apos;t load correctly. This is usually temporary — try again
        in a moment.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-contrast shadow-sm transition-colors hover:bg-accent-hover"
      >
        Try again
      </button>
    </main>
  );
}
