import Module from 'node:module'

// `src/lib/cognodb.ts` starts with `import 'server-only'` so Next.js's
// bundler can turn an accidental client-side import into a build error
// (see createServerOnlyClientOnlyAliases in Next's webpack config, which
// aliases the specifier at build time and never touches the real npm
// package). Outside of Next's bundler — i.e. when this seed script runs
// directly under Node — that resolution never happens, and the real
// `server-only` package unconditionally throws on load. This shim patches
// Node's CommonJS loader, for this process only, so `require('server-only')`
// resolves to a harmless empty module instead. It must be imported before
// `../src/lib/cognodb`, and it deliberately leaves that file untouched.
const nodeModule = Module as unknown as {
  _load: (request: string, parent: unknown, isMain: boolean) => unknown
}

const originalLoad = nodeModule._load.bind(nodeModule)
nodeModule._load = (request, parent, isMain) => {
  if (request === 'server-only') {
    return {}
  }
  return originalLoad(request, parent, isMain)
}
