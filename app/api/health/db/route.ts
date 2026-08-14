import { getCognoSession } from '@/lib/cognodb'

export async function GET() {
  let session
  try {
    session = getCognoSession()
    await session.run('RETURN 1 AS result')
    return Response.json({ success: true, database: 'connected' })
  } catch (error) {
    console.error('CognoDB health check failed:', error)
    return Response.json(
      { success: false, database: 'unavailable' },
      { status: 503 }
    )
  } finally {
    await session?.close()
  }
}
