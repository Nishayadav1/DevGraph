import { getFullGraph } from '@/lib/queries/graph'

export async function GET() {
  try {
    const graph = await getFullGraph()
    return Response.json(graph)
  } catch (error) {
    console.error('Failed to load graph:', error)
    return Response.json({ error: 'Failed to load graph' }, { status: 503 })
  }
}
