'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useOrders } from '@/context/OrdersContext'
import { formatMoney } from '@/lib/commerce/pricing'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { getOrder } = useOrders()
  const order = orderId ? getOrder(orderId) : undefined

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Order placed successfully</h1>
        <p className="mt-3 text-gray-500">
          Thank you for shopping with Véora. We are preparing your pieces for dispatch.
        </p>
        <div className="mt-8 rounded-2xl border bg-lavender-50 p-6 text-left">
          <div className="flex justify-between border-b py-3">
            <span className="text-gray-500">Order Number</span>
            <span className="font-semibold">{orderId || 'Processing'}</span>
          </div>
          <div className="flex justify-between border-b py-3">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold">{order?.payment || 'Confirmed'}</span>
          </div>
          <div className="flex justify-between border-b py-3">
            <span className="text-gray-500">Payment Status</span>
            <span className="font-semibold">{order?.paymentStatus || 'Pending'}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-500">Total</span>
            <span className="font-semibold">{order ? formatMoney(order.total) : '—'}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/Store" className="flex-1 rounded-xl bg-brand py-3 font-semibold text-white">
            Continue Shopping
          </Link>
          <Link
            href={orderId ? `/checkout/vieworders/${orderId}` : '/checkout/vieworders'}
            className="flex-1 rounded-xl border border-brand py-3 font-semibold"
          >
            View Order
          </Link>
        </div>
      </div>
    </div>
  )
}

const OrderSuccess = () => (
  <Suspense fallback={<div className="py-20 text-center">Loading order confirmation...</div>}>
    <OrderSuccessContent />
  </Suspense>
)

export default OrderSuccess
