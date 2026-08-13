import { listSkills } from '@/lib/queries/skills'
import { parseOptionalSearch } from '@/lib/validation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = parseOptionalSearch(searchParams.get('q'))

  try {
    const skills = await listSkills(search)
    return Response.json({ skills })
  } catch (error) {
    console.error('Failed to list skills:', error)
    return Response.json({ error: 'Failed to load skills' }, { status: 503 })
  }
}
