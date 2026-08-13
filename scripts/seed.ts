import './server-only-shim'
import { loadEnvConfig } from '@next/env'
import { closeCognoDriver } from '../lib/cognodb'
import { seedGraph } from '../lib/graph/seed'

// This script runs outside the Next.js server runtime, so .env* files
// aren't loaded automatically the way they are for `next dev`/`next build`.
// This mirrors Next's own documented pattern for standalone scripts.
loadEnvConfig(process.cwd())

async function main() {
  console.log('Seeding CognoDB...')
  await seedGraph()
  console.log('Seed complete.')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(() => closeCognoDriver())
