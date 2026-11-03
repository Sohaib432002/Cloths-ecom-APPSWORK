'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { apiFetch } from '@/lib/client/api'
import { formatMoney } from '@/lib/commerce/pricing'
import type { Order } from '@/context/OrdersContext'

const STEPS = ['Processing', 'Shipped', 'Delivered']

export function TrackOrder() {
  const params = useSearchParams()
  const [orderId, setOrderId] = useState(params.get('order') || '')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const data = await apiFetch<{ order: Order }>('/api/orders/track', {
        method: 'POST',
        body: JSON.stringify({ orderId, email }),
      })
      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to find that order.')
    } finally {
      setLoading(false)
    }
  }

  const stepIndex = order ? STEPS.indexOf(order.status) : -1
  const field = 'mt-1 h-12 w-full rounded-xl border border-lavender-200 bg-white px-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

  return (
    <>
      <form onSubmit={submit} className="mt-8 grid gap-4 rounded-3xl border border-lavender-200 bg-white p-6 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Order number
          <input value={orderId} onChange={(e) => setOrderId(e.target.value.toUpperCase())} placeholder="ORD-ABC123" required className={field} />
        </label>
        <label className="text-sm font-medium">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={field} />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-full bg-brand font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60 sm:col-span-2"
        >
          {loading ? 'Checking...' : 'Track order'}
        </button>
        {error && (
          <p role="alert" className="text-sm text-red-600 sm:col-span-2">
            {error}
          </p>
        )}
      </form>

      {order && (
        <section className="mt-6 rounded-3xl border border-lavender-200 bg-white p-6" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold">{order.id}</h2>
            <span className="rounded-full bg-lavender-100 px-3 py-1 text-sm font-semibold text-brand-dark">{order.status}</span>
          </div>

          {stepIndex >= 0 ? (
            <ol className="mt-6 flex items-center">
              {STEPS.map((step, i) => (
                <li key={step} className="flex flex-1 items-center last:flex-none">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= stepIndex ? 'bg-brand text-white' : 'bg-lavender-100 text-gray-400'}`}
                  >
                    {i <= stepIndex ? <Check size={15} /> : i + 1}
                  </span>
                  <span className={`ml-2 text-xs font-medium ${i <= stepIndex ? 'text-black' : 'text-gray-400'}`}>{step}</span>
                  {i < STEPS.length - 1 && <span className={`mx-3 h-0.5 flex-1 ${i < stepIndex ? 'bg-brand' : 'bg-lavender-200'}`} />}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              {order.status === 'Cancelled' ? 'This order was cancelled.' : 'Waiting for payment confirmation.'}
            </p>
          )}

          <ul className="mt-6 divide-y divide-lavender-100 text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between py-2.5">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium">{formatMoney(item.price * item.quantity)}</span>
              </li>
            ))}
            <li className="flex justify-between py-2.5 font-bold">
              <span>Total ({order.payment})</span>
              <span>{formatMoney(order.total)}</span>
            </li>
          </ul>
        </section>
      )}
    </>
  )
}
