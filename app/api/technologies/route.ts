import { listTechnologies } from '@/lib/queries/technologies'
import { parseOptionalSearch } from '@/lib/validation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = parseOptionalSearch(searchParams.get('q'))

  try {
    const technologies = await listTechnologies(search)
    return Response.json({ technologies })
  } catch (error) {
    console.error('Failed to list technologies:', error)
    return Response.json({ error: 'Failed to load technologies' }, { status: 503 })
  }
}
