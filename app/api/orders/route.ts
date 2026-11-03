import { getCurrentUser } from '@/lib/auth/session'
import { createOrder, listOrdersForUser, OrderError } from '@/lib/commerce/orders'
import { jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { checkoutSchema } from '@/lib/validation'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return jsonError('Please sign in to see your orders.', 401, 'UNAUTHENTICATED')
  return jsonOk({ orders: await listOrdersForUser(user.id) })
}

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Unable to place this order.', 400, 'VALIDATION')
  }

  try {
    const user = await getCurrentUser()
    const order = await createOrder(parsed.data, user)
    logEvent('order.created', { orderId: order.id, email: order.email, total: order.total })
    return jsonOk({ order }, 201)
  } catch (error) {
    if (error instanceof OrderError) return jsonError(error.message, 409, error.code)
    throw error
  }
}
