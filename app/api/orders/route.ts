import { getCurrentUser } from '@/lib/auth/session'
import { getOrderTotals, paymentLabel, validateCoupon } from '@/lib/commerce/pricing'
import { jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { checkoutSchema } from '@/lib/validation'

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Unable to place this order.', 400, 'VALIDATION')
  }

  const couponResult = parsed.data.couponCode
    ? validateCoupon(parsed.data.couponCode, getOrderTotals(parsed.data.items).subtotal)
    : null

  if (couponResult && !couponResult.ok) {
    return jsonError(couponResult.error, 400, 'COUPON')
  }

  const totals = getOrderTotals(parsed.data.items, couponResult?.ok ? couponResult.coupon : null)
  const user = await getCurrentUser()
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

  const order = {
    id: orderId,
    userId: user?.id || 'guest',
    email: parsed.data.email,
    status: 'Processing',
    date: new Date().toISOString(),
    payment: paymentLabel(parsed.data.paymentMethod),
    paymentMethod: parsed.data.paymentMethod,
    paymentStatus: parsed.data.paymentMethod === 'cod' ? 'Pending' : 'Paid',
    shipping: totals.deliveryFee === 0 ? 'Free Shipping' : 'Standard Shipping',
    items: parsed.data.items,
    address: {
      name: `${parsed.data.firstName} ${parsed.data.lastName}`,
      phone: parsed.data.phone,
      address: parsed.data.address,
      city: parsed.data.city,
      country: parsed.data.country,
      zipCode: parsed.data.zipCode,
    },
    coupon: couponResult?.ok ? couponResult.coupon : null,
    ...totals,
  }

  logEvent('order.created', { orderId, email: parsed.data.email, total: totals.total })
  return jsonOk({ order }, 201)
}
