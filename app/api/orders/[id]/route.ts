import { getCurrentUser } from '@/lib/auth/session'
import { getOrderById } from '@/lib/commerce/orders'
import { jsonError, jsonOk } from '@/lib/http'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const user = await getCurrentUser()
  const order = await getOrderById(id)

  // guest orders are only readable through the confirmation response, never by id
  if (!order || !user || order.email !== user.email.toLowerCase()) {
    return jsonError('Order not found.', 404, 'NOT_FOUND')
  }
  return jsonOk({ order })
}
