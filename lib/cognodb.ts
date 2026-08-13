import 'server-only'

import neo4j, { type Driver, type Session } from 'neo4j-driver'

// Ensures this module (and the credentials it reads) can never be bundled
// into client-side JavaScript. Importing it from a Client Component is a
// build-time error.

const globalForCognoDB = globalThis as unknown as {
  cognoDriver?: Driver
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Set it in your .env.local (or deployment environment) before connecting to CognoDB.`
    )
  }
  return value
}

function createDriver(): Driver {
  const uri = getRequiredEnv('COGNODB_URI')
  const username = getRequiredEnv('COGNODB_USERNAME')
  const password = getRequiredEnv('COGNODB_PASSWORD')

  return neo4j.driver(uri, neo4j.auth.basic(username, password))
}

/**
 * Returns the shared CognoDB driver, creating it on first use.
 * The driver manages its own internal connection pool, so it should be
 * created once per process and reused across requests — never per-request.
 * In dev, the instance is cached on `globalThis` so Next.js's module
 * reloading doesn't leak a new driver (and a new connection pool) on
 * every edit.
 */
export function getCognoDriver(): Driver {
  if (!globalForCognoDB.cognoDriver) {
    globalForCognoDB.cognoDriver = createDriver()
  }
  return globalForCognoDB.cognoDriver
}

/**
 * Opens a new session on the shared driver. Callers are responsible for
 * closing the session (e.g. in a `finally` block) once they're done with it —
 * sessions are lightweight, but they are not pooled like the driver itself.
 */
export function getCognoSession(): Session {
  return getCognoDriver().session()
}

/**
 * Verifies that the driver can actually reach CognoDB with the configured
 * credentials. Useful for health checks and startup diagnostics.
 */
export async function verifyCognoConnection(): Promise<boolean> {
  try {
    await getCognoDriver().verifyConnectivity()
    return true
  } catch (error) {
    console.error('CognoDB connection verification failed:', error)
    return false
  }
}

/**
 * Closes the shared driver and its connection pool. Intended for graceful
 * shutdown (e.g. in tests or a custom server) — not needed in normal
 * request handling.
 */
export async function closeCognoDriver(): Promise<void> {
  if (globalForCognoDB.cognoDriver) {
    await globalForCognoDB.cognoDriver.close()
    globalForCognoDB.cognoDriver = undefined
  }
}
