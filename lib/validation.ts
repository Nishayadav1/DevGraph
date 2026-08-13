const MAX_QUERY_LENGTH = 100

/** Trims a query param and caps its length; returns `undefined` if empty. */
export function parseOptionalSearch(value: string | null): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed.slice(0, MAX_QUERY_LENGTH) : undefined
}

/** Trims a required route/query param; returns `null` if missing or empty. */
export function parseRequiredParam(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed.slice(0, MAX_QUERY_LENGTH) : null
}
