import { z } from 'zod'
import { getOrderById } from '@/lib/commerce/orders'
import { getClientIp, jsonError, jsonOk, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({ orderId: z.string().trim().min(6).max(20), email: z.string().trim().email() })

// Guests can look up an order only with the order number AND the email it was placed with.
export async function POST(request: Request) {
  const limited = rateLimit(`track:${getClientIp(request)}`, 10, 60_000)
  if (!limited.success) return jsonError('Too many attempts. Please wait a minute.', 429, 'RATE_LIMITED')

  const parsed = schema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError('Enter your order number and email.', 400)

  const order = await getOrderById(parsed.data.orderId.toUpperCase())
  if (!order || order.email?.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return jsonError('We could not find an order with those details.', 404, 'NOT_FOUND')
  }
  return jsonOk({ order })
}
