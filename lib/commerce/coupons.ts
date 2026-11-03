import { getDb } from '@/lib/db/client'
import type { AppliedCoupon } from '@/types/product'

export type CouponInfo = AppliedCoupon & { minSubtotal: number | null; description: string }

function toCoupon(row: Record<string, unknown>): CouponInfo {
  return {
    code: String(row.code),
    label: String(row.label),
    description: String(row.description),
    type: row.type === 'shipping' ? 'shipping' : 'percent',
    value: Number(row.value),
    minSubtotal: row.min_subtotal == null ? null : Number(row.min_subtotal),
  }
}

export async function listCoupons() {
  const db = await getDb()
  const result = await db.execute('SELECT * FROM coupons WHERE active = 1 ORDER BY code')
  return result.rows.map((row) => toCoupon(row as unknown as Record<string, unknown>))
}

export async function validateCoupon(code: string, subtotal: number) {
  const db = await getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM coupons WHERE code = ? AND active = 1',
    args: [code.trim().toUpperCase()],
  })
  if (!result.rows.length) {
    return { ok: false as const, error: 'That coupon code is not valid.' }
  }

  const coupon = toCoupon(result.rows[0] as unknown as Record<string, unknown>)
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      ok: false as const,
      error: `This coupon requires a subtotal of at least $${coupon.minSubtotal}.`,
    }
  }
  const { code: couponCode, label, type, value } = coupon
  return { ok: true as const, coupon: { code: couponCode, label, type, value } satisfies AppliedCoupon }
}
