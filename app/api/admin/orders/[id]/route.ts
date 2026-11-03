import { z } from 'zod'
import { getAdminUser } from '@/lib/auth/admin'
import { getOrderById, ORDER_STATUSES, updateOrderStatus } from '@/lib/commerce/orders'
import { notifyOrderStatus } from '@/lib/commerce/order-notifications'
import { jsonError, jsonOk, readJson } from '@/lib/http'

const schema = z.object({ status: z.enum(ORDER_STATUSES) })

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminUser())) return jsonError('Not found.', 404)

  const parsed = schema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError('Invalid status.', 400)

  const { id } = await params
  const before = await getOrderById(id)
  if (!before) return jsonError('Order not found.', 404)

  await updateOrderStatus(id, parsed.data.status)
  const order = await getOrderById(id)
  if (order && before.status !== order.status) await notifyOrderStatus(order)
  return jsonOk({ order })
}
