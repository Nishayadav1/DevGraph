import { getDeveloperById } from '@/lib/queries/developers'
import { parseRequiredParam } from '@/lib/validation'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseRequiredParam((await params).id)
  if (!id) {
    return Response.json({ error: 'A developer id is required' }, { status: 400 })
  }

  try {
    const developer = await getDeveloperById(id)
    if (!developer) {
      return Response.json({ error: 'Developer not found' }, { status: 404 })
    }
    return Response.json({ developer })
  } catch (error) {
    console.error('Failed to load developer:', error)
    return Response.json({ error: 'Failed to load developer' }, { status: 503 })
  }
}
