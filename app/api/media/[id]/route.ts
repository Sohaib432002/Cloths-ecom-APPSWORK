import { getDb } from '@/lib/db/client'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const result = await db.execute({ sql: 'SELECT mime, data FROM product_media WHERE id = ?', args: [id] })
  if (!result.rows.length) return new Response('Not found', { status: 404 })

  const row = result.rows[0]
  return new Response(row.data as ArrayBuffer, {
    headers: { 'Content-Type': String(row.mime), 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
}
