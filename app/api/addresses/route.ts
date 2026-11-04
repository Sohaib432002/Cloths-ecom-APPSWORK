import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { jsonError, jsonOk, readJson } from '@/lib/http'
import { addressSchema } from '@/lib/validation'

async function readAddresses(userId: string) {
  const db = await getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC',
    args: [userId],
  })
  return result.rows.map((row) => ({
    id: Number(row.id),
    label: String(row.label),
    fullName: String(row.full_name),
    phone: String(row.phone),
    address: String(row.address),
    city: String(row.city),
    country: String(row.country),
    zipCode: String(row.zip_code),
    isDefault: Boolean(row.is_default),
  }))
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHENTICATED')
  return jsonOk({ addresses: await readAddresses(user.id) })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHENTICATED')

  const parsed = addressSchema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || 'Check the address.', 400)

  const db = await getDb()
  const count = await db.execute({ sql: 'SELECT COUNT(*) AS n FROM addresses WHERE user_id = ?', args: [user.id] })
  if (Number(count.rows[0].n) >= 10) return jsonError('You can save up to 10 addresses.', 400)

  const a = parsed.data
  const makeDefault = a.isDefault || Number(count.rows[0].n) === 0
  await db.batch(
    [
      ...(makeDefault ? [{ sql: 'UPDATE addresses SET is_default = 0 WHERE user_id = ?', args: [user.id] }] : []),
      {
        sql: `INSERT INTO addresses (user_id, label, full_name, phone, address, city, country, zip_code, is_default)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [user.id, a.label, a.fullName, a.phone, a.address, a.city, a.country, a.zipCode, makeDefault ? 1 : 0],
      },
    ],
    'write'
  )
  return jsonOk({ addresses: await readAddresses(user.id) }, 201)
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHENTICATED')
  const parsed = z.object({ id: z.number().int() }).safeParse(await readJson(request))
  if (!parsed.success) return jsonError('Invalid request.', 400)

  const db = await getDb()
  await db.batch(
    [
      { sql: 'UPDATE addresses SET is_default = 0 WHERE user_id = ?', args: [user.id] },
      { sql: 'UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?', args: [parsed.data.id, user.id] },
    ],
    'write'
  )
  return jsonOk({ addresses: await readAddresses(user.id) })
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHENTICATED')
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isInteger(id)) return jsonError('Invalid request.', 400)

  const db = await getDb()
  await db.execute({ sql: 'DELETE FROM addresses WHERE id = ? AND user_id = ?', args: [id, user.id] })
  return jsonOk({ addresses: await readAddresses(user.id) })
}
