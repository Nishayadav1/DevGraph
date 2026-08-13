import { getDeveloperConnectionPath } from '@/lib/queries/graph'
import { parseRequiredParam } from '@/lib/validation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = parseRequiredParam(searchParams.get('from'))
  const to = parseRequiredParam(searchParams.get('to'))

  if (!from || !to) {
    return Response.json(
      { error: 'Both "from" and "to" developer ids are required' },
      { status: 400 }
    )
  }

  try {
    const path = await getDeveloperConnectionPath(from, to)
    if (!path) {
      return Response.json(
        { error: 'No connection found between those developers' },
        { status: 404 }
      )
    }
    return Response.json({ path })
  } catch (error) {
    console.error('Failed to load developer connection path:', error)
    return Response.json({ error: 'Failed to load connection' }, { status: 503 })
  }
}
