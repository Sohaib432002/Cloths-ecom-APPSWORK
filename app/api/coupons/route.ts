import { COUPONS, validateCoupon } from '@/lib/commerce/pricing'
import { jsonError, jsonOk, readJson } from '@/lib/http'
import { couponSchema } from '@/lib/validation'

export async function GET() {
  return jsonOk({
    coupons: Object.values(COUPONS).map(({ code, label, description }) => ({
      code,
      label,
      description,
    })),
  })
}

export async function POST(request: Request) {
  const parsed = couponSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError('Enter a coupon code.', 400)
  }

  const result = validateCoupon(parsed.data.code, parsed.data.subtotal)
  if (!result.ok) {
    return jsonError(result.error, 400, 'COUPON')
  }

  return jsonOk({ coupon: result.coupon })
}
