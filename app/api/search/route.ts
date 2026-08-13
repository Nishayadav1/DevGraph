import { searchAll } from '@/lib/queries/search'
import { parseRequiredParam } from '@/lib/validation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = parseRequiredParam(searchParams.get('q'))

  if (!query) {
    return Response.json({ error: 'A search query "q" is required' }, { status: 400 })
  }

  try {
    const results = await searchAll(query)
    return Response.json(results)
  } catch (error) {
    console.error('Search failed:', error)
    return Response.json({ error: 'Search failed' }, { status: 503 })
  }
}
