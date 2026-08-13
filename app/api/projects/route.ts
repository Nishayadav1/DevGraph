import { listProjects } from '@/lib/queries/projects'
import { parseOptionalSearch } from '@/lib/validation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = parseOptionalSearch(searchParams.get('q'))

  try {
    const projects = await listProjects(search)
    return Response.json({ projects })
  } catch (error) {
    console.error('Failed to list projects:', error)
    return Response.json({ error: 'Failed to load projects' }, { status: 503 })
  }
}
