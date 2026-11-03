import { getOrderById, markOrderPaid } from '@/lib/commerce/orders'
import { notifyOrderConfirmed } from '@/lib/commerce/order-notifications'
import { jsonError, jsonOk } from '@/lib/http'
import { verifyStripeSignature } from '@/lib/payments/stripe'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return jsonError('Webhook is not configured.', 503)

  const payload = await request.text()
  if (!verifyStripeSignature(payload, request.headers.get('stripe-signature'), secret)) {
    return jsonError('Invalid signature.', 400)
  }

  const event = JSON.parse(payload) as {
    type: string
    data: { object: { client_reference_id?: string; payment_status?: string } }
  }
  if (event.type === 'checkout.session.completed' && event.data.object.payment_status === 'paid') {
    const orderId = event.data.object.client_reference_id
    if (orderId && (await markOrderPaid(orderId))) {
      const order = await getOrderById(orderId)
      if (order) await notifyOrderConfirmed(order)
    }
  }
  return jsonOk({ received: true })
}
