import { createHmac, timingSafeEqual } from 'node:crypto'

// Card details are entered on Stripe's hosted checkout page and never reach this server (no PCI scope).

export function stripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

async function stripeRequest<T>(path: string, init?: { method?: string; body?: URLSearchParams }): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: init?.method || 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: init?.body,
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data?.error?.message || 'Payment provider error.')
  return data as T
}

export async function createCheckoutSession(input: {
  orderId: string
  email: string
  totalCents: number
  itemCount: number
  baseUrl: string
}) {
  const body = new URLSearchParams({
    mode: 'payment',
    'payment_method_types[0]': 'card',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(input.totalCents),
    'line_items[0][price_data][product_data][name]': `Véora order ${input.orderId}`,
    'line_items[0][price_data][product_data][description]': `${input.itemCount} item${input.itemCount === 1 ? '' : 's'}, delivery and discounts included`,
    customer_email: input.email,
    client_reference_id: input.orderId,
    'metadata[order_id]': input.orderId,
    success_url: `${input.baseUrl}/checkout/orderSuccess?orderId=${input.orderId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.baseUrl}/checkout?cancelled=1`,
  })
  return stripeRequest<{ id: string; url: string }>('/checkout/sessions', { method: 'POST', body })
}

export async function retrieveCheckoutSession(id: string) {
  return stripeRequest<{
    id: string
    payment_status: 'paid' | 'unpaid' | 'no_payment_required'
    client_reference_id: string | null
    amount_total: number | null
  }>(`/checkout/sessions/${encodeURIComponent(id)}`)
}

/** Verifies the `Stripe-Signature` header of a webhook (HMAC-SHA256 over `${timestamp}.${payload}`). */
export function verifyStripeSignature(payload: string, header: string | null, secret: string, toleranceSec = 300) {
  if (!header) return false
  const parts = Object.fromEntries(header.split(',').map((part) => part.split('=') as [string, string]))
  const timestamp = Number(parts.t)
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > toleranceSec) return false
  const expected = createHmac('sha256', secret).update(`${parts.t}.${payload}`).digest('hex')
  const given = header
    .split(',')
    .filter((part) => part.startsWith('v1='))
    .map((part) => part.slice(3))
  return given.some((signature) => {
    const a = Buffer.from(signature)
    const b = Buffer.from(expected)
    return a.length === b.length && timingSafeEqual(a, b)
  })
}
