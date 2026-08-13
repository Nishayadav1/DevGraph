import { listDevelopers } from '@/lib/queries/developers'
import { parseOptionalSearch } from '@/lib/validation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = parseOptionalSearch(searchParams.get('q'))

  try {
    const developers = await listDevelopers(search)
    return Response.json({ developers })
  } catch (error) {
    console.error('Failed to list developers:', error)
    return Response.json({ error: 'Failed to load developers' }, { status: 503 })
  }
}
