import { getOrderById, markOrderPaid } from '@/lib/commerce/orders'
import { notifyOrderConfirmed } from '@/lib/commerce/order-notifications'
import { jsonError, jsonOk } from '@/lib/http'
import { retrieveCheckoutSession, stripeEnabled } from '@/lib/payments/stripe'

// Called by the success page after Stripe redirects back; asks Stripe whether the session was really paid.
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get('session_id')
  if (!sessionId || !stripeEnabled()) return jsonError('Nothing to confirm.', 400)

  try {
    const session = await retrieveCheckoutSession(sessionId)
    const orderId = session.client_reference_id
    if (!orderId) return jsonError('Unknown payment session.', 404)

    if (session.payment_status === 'paid') {
      if (await markOrderPaid(orderId)) {
        const order = await getOrderById(orderId)
        if (order) await notifyOrderConfirmed(order)
      }
    }
    const order = await getOrderById(orderId)
    return jsonOk({ order, paid: session.payment_status === 'paid' })
  } catch {
    return jsonError('We could not verify this payment yet. If you were charged, contact support.', 502)
  }
}
