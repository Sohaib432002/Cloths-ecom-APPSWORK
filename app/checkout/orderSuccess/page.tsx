'use client'

import Link from 'next/link'
import { CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useOrders, type Order } from '@/context/OrdersContext'
import { useCart } from '@/hooks/usecart'
import { apiFetch } from '@/lib/client/api'
import { formatMoney } from '@/lib/commerce/pricing'
import { SITE, whatsappLink } from '@/lib/site'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const sessionId = searchParams.get('session_id')
  const { getOrder, addOrder } = useOrders()
  const { clearCart } = useCart()
  const [verified, setVerified] = useState<Order | null>(null)
  const [state, setState] = useState<'idle' | 'checking' | 'paid' | 'unpaid' | 'error'>(sessionId ? 'checking' : 'idle')

  // Returning from the card payment page: ask the server (and Stripe) whether the payment went through.
  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    apiFetch<{ order: Order | null; paid: boolean }>(`/api/orders/confirm?session_id=${encodeURIComponent(sessionId)}`)
      .then((data) => {
        if (cancelled) return
        if (data.order) {
          setVerified(data.order)
          addOrder(data.order)
        }
        if (data.paid) clearCart()
        setState(data.paid ? 'paid' : 'unpaid')
      })
      .catch(() => !cancelled && setState('error'))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const order = verified || (orderId ? getOrder(orderId) : undefined)
  const waiting = state === 'unpaid' || state === 'error'

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-lavender-200 bg-white p-6 text-center shadow-[0_20px_50px_-24px_rgba(98,72,196,0.35)] sm:p-10">
        <div
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${waiting ? 'bg-amber-100' : 'bg-lavender-100'}`}
        >
          {state === 'checking' ? (
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
          ) : waiting ? (
            <Clock className="h-10 w-10 text-amber-600" />
          ) : (
            <CheckCircle2 className="h-11 w-11 text-brand" />
          )}
        </div>
        <h1 className="mt-6 text-3xl font-extrabold">
          {state === 'checking' ? 'Confirming your payment...' : waiting ? 'Payment not confirmed yet' : 'Thank you, your order is placed'}
        </h1>
        <p className="mt-3 text-gray-500">
          {waiting
            ? 'We could not confirm the payment yet. If money left your account it will be matched to this order automatically; otherwise contact us and we will sort it out.'
            : 'We have sent your confirmation by email and text message. You can follow the order any time from the tracking page.'}
        </p>

        <div className="mt-8 rounded-2xl bg-lavender-50 p-6 text-left text-sm">
          <Row label="Order number" value={orderId || 'Processing'} />
          <Row label="Payment" value={order?.payment || 'Confirmed'} />
          <Row label="Payment status" value={order?.paymentStatus || 'Pending'} />
          <Row label="Total" value={order ? formatMoney(order.total) : '—'} last />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/Store" className="flex-1 rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark">
            Continue shopping
          </Link>
          <Link
            href={orderId ? `/track?order=${orderId}` : '/track'}
            className="flex-1 rounded-full border border-brand py-3 font-semibold text-brand hover:bg-lavender-50"
          >
            Track order
          </Link>
        </div>
        <p className="mt-6 text-xs text-gray-500">
          Questions? WhatsApp or call{' '}
          <a href={whatsappLink(`Hi Véora, question about order ${orderId || ''}`)} className="font-semibold text-brand">
            {SITE.phoneDisplay}
          </a>
        </p>
      </div>
    </div>
  )
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex justify-between py-3 ${last ? '' : 'border-b border-lavender-200'}`}>
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

const OrderSuccess = () => (
  <Suspense fallback={<div className="py-20 text-center">Loading order confirmation...</div>}>
    <OrderSuccessContent />
  </Suspense>
)

export default OrderSuccess
