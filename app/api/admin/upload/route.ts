import { randomUUID } from 'node:crypto'
import { denyUnlessAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/client'
import { jsonError, jsonOk } from '@/lib/http'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 1_500_000

// The admin form shrinks photos in the browser first, so uploads are small and stored right in the database.
export async function POST(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied

  const mime = request.headers.get('content-type')?.split(';')[0] || ''
  if (!ALLOWED.includes(mime)) return jsonError('Upload a JPG, PNG or WebP photo.', 400)

  const data = Buffer.from(await request.arrayBuffer())
  if (!data.length || data.length > MAX_BYTES) return jsonError('Photo must be under 1.5 MB.', 400)

  const id = randomUUID()
  const db = await getDb()
  await db.execute({
    sql: 'INSERT INTO product_media (id, mime, data, created_at) VALUES (?, ?, ?, ?)',
    args: [id, mime, data, new Date().toISOString()],
  })
  return jsonOk({ url: `/api/media/${id}` }, 201)
}
