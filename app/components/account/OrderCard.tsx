'use client'

import Link from 'next/link'
import { useOrders } from '@/context/OrdersContext'
import { formatMoney } from '@/lib/commerce/pricing'

export const Orders = () => {
  const { orders } = useOrders()
  const processing = orders.filter((order) => order.status === 'Processing').length

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-black p-6 text-white sm:p-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-2 text-gray-300">Track every SHOP.CO order placed in this browser session.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border p-6">
          <h2 className="text-3xl font-bold">{orders.length}</h2>
          <p className="mt-2 text-sm text-gray-500">Total Orders</p>
        </div>
        <div className="rounded-3xl border p-6">
          <h2 className="text-3xl font-bold">{processing}</h2>
          <p className="mt-2 text-sm text-gray-500">Processing</p>
        </div>
        <div className="rounded-3xl border p-6">
          <h2 className="text-3xl font-bold">{Math.max(0, orders.length - processing)}</h2>
          <p className="mt-2 text-sm text-gray-500">Completed</p>
        </div>
      </div>
      {orders.length === 0 ? (
        <div className="rounded-3xl border p-8 text-center">
          <p className="text-gray-500">You have not placed an order yet.</p>
          <Link href="/Store" className="mt-4 inline-block rounded-full bg-black px-6 py-3 text-white">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/checkout/vieworders/${order.id}`}
              className="block rounded-3xl border p-5 hover:bg-gray-50"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()} · {order.payment}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatMoney(order.total)}</p>
                  <p className="text-sm text-gray-500">{order.status}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
