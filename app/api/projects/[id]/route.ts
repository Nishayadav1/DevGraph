import { getProjectById } from '@/lib/queries/projects'
import { parseRequiredParam } from '@/lib/validation'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseRequiredParam((await params).id)
  if (!id) {
    return Response.json({ error: 'A project id is required' }, { status: 400 })
  }

  try {
    const project = await getProjectById(id)
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 })
    }
    return Response.json({ project })
  } catch (error) {
    console.error('Failed to load project:', error)
    return Response.json({ error: 'Failed to load project' }, { status: 503 })
  }
}
