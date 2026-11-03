import { z } from 'zod'
import { denyUnlessAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/client'
import { jsonError, jsonOk, readJson } from '@/lib/http'

const schema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{3,20}$/, 'Code must be 3-20 letters or numbers.'),
  type: z.enum(['percent', 'shipping']),
  value: z.number().min(0).max(100).default(0),
  minSubtotal: z.number().min(0).nullable().optional(),
  description: z.string().trim().max(160).optional(),
})

export async function GET() {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const db = await getDb()
  const result = await db.execute(
    `SELECT c.*, (SELECT COUNT(*) FROM orders o WHERE o.coupon_code = c.code) AS uses FROM coupons c ORDER BY c.code`
  )
  return jsonOk({
    coupons: result.rows.map((row) => ({
      code: String(row.code),
      type: String(row.type),
      value: Number(row.value),
      minSubtotal: row.min_subtotal == null ? null : Number(row.min_subtotal),
      description: String(row.description),
      active: Boolean(row.active),
      uses: Number(row.uses),
    })),
  })
}

export async function POST(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const parsed = schema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || 'Check the coupon.', 400)
  const { code, type, value, minSubtotal, description } = parsed.data
  if (type === 'percent' && (value <= 0 || value > 100)) return jsonError('Percent must be between 1 and 100.', 400)

  const label = type === 'shipping' ? 'Free standard shipping' : `${value}% off`
  const text =
    description ||
    (type === 'shipping'
      ? 'Complimentary standard delivery on this order.'
      : `Save ${value}%${minSubtotal ? ` on orders over $${minSubtotal}` : ' on any order'}.`)

  const db = await getDb()
  const exists = await db.execute({ sql: 'SELECT 1 FROM coupons WHERE code = ?', args: [code] })
  if (exists.rows.length) return jsonError('That code already exists.', 409)
  await db.execute({
    sql: 'INSERT INTO coupons (code, label, description, type, value, min_subtotal, active) VALUES (?, ?, ?, ?, ?, ?, 1)',
    args: [code, label, text, type, type === 'shipping' ? 0 : value, minSubtotal || null],
  })
  return jsonOk({ ok: true }, 201)
}
