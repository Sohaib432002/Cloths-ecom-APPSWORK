import { getCurrentUser } from '@/lib/auth/session'
import { createOrder, listOrdersForUser, OrderError } from '@/lib/commerce/orders'
import { notifyOrderConfirmed } from '@/lib/commerce/order-notifications'
import { getAppUrl } from '@/lib/env'
import { getClientIp, jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { createCheckoutSession } from '@/lib/payments/stripe'
import { rateLimit } from '@/lib/rate-limit'
import { checkoutSchema } from '@/lib/validation'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return jsonError('Please sign in to see your orders.', 401, 'UNAUTHENTICATED')
  return jsonOk({ orders: await listOrdersForUser(user.id) })
}

export async function POST(request: Request) {
  const limited = rateLimit(`order:${getClientIp(request)}`, 10, 60_000)
  if (!limited.success) return jsonError('Too many orders. Please wait a moment.', 429, 'RATE_LIMITED')

  const parsed = checkoutSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Unable to place this order.', 400, 'VALIDATION')
  }

  try {
    const user = await getCurrentUser()
    const order = await createOrder(parsed.data, user)
    logEvent('order.created', { orderId: order.id, email: order.email, total: order.total })

    if (order.paymentMethod === 'card') {
      // hand the shopper to Stripe's hosted page; notifications go out once the payment is confirmed
      const session = await createCheckoutSession({
        orderId: order.id,
        email: order.email || parsed.data.email,
        totalCents: Math.round(order.total * 100),
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        baseUrl: getAppUrl(),
      })
      return jsonOk({ order, checkoutUrl: session.url }, 201)
    }

    await notifyOrderConfirmed(order)
    return jsonOk({ order }, 201)
  } catch (error) {
    if (error instanceof OrderError) return jsonError(error.message, 409, error.code)
    throw error
  }
}
