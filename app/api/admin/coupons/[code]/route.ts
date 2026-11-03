import { z } from 'zod'
import { denyUnlessAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/client'
import { jsonError, jsonOk, readJson } from '@/lib/http'

type Ctx = { params: Promise<{ code: string }> }

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const parsed = z.object({ active: z.boolean() }).safeParse(await readJson(request))
  if (!parsed.success) return jsonError('Invalid request.', 400)
  const db = await getDb()
  const { code } = await ctx.params
  const result = await db.execute({ sql: 'UPDATE coupons SET active = ? WHERE code = ?', args: [parsed.data.active ? 1 : 0, code] })
  return result.rowsAffected ? jsonOk({ ok: true }) : jsonError('Coupon not found.', 404)
}

// A coupon that has been used stays in the database (turned off) so past orders still point at it.
export async function DELETE(_request: Request, ctx: Ctx) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const db = await getDb()
  const { code } = await ctx.params
  const used = await db.execute({ sql: 'SELECT 1 FROM orders WHERE coupon_code = ? LIMIT 1', args: [code] })
  if (used.rows.length) {
    await db.execute({ sql: 'UPDATE coupons SET active = 0 WHERE code = ?', args: [code] })
    return jsonOk({ result: 'disabled' })
  }
  await db.execute({ sql: 'DELETE FROM coupons WHERE code = ?', args: [code] })
  return jsonOk({ result: 'deleted' })
}
