'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Eye, Package, CalendarDays, CreditCard } from 'lucide-react'

import { useOrders } from '@/context/OrdersContext'

export default function ViewOrders() {
  const { orders } = useOrders()

  if (!orders || orders.length === 0) {
    return (
      <section className="container max-w-310 mx-auto py-12  ">
        <div className="flex flex-col items-center justify-center rounded-3xl border bg-white  py-16 text-center shadow-sm">
          <h2 className="text-2xl font-bold sm:text-3xl">No Orders Found</h2>

          <p className="mt-3 max-w-md text-sm text-gray-500 sm:text-base">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>

          <Link
            href="/Store"
            className="mt-6 rounded-full bg-black  py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:px-8 sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto max-w-310 py-8  sm:py-10  lg:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">My Orders</h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">Track and manage all your orders</p>
      </div>

      {/* Orders */}
      <div className="space-y-5 sm:space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-5 lg:rounded-3xl lg:p-6"
          >
            {/* Top */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold sm:text-xl lg:text-2xl">Order #{order.id}</h2>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600 sm:gap-5 sm:text-sm">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {order.date}
                  </span>

                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {order.payment}
                  </span>

                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="self-start lg:self-auto">
                <span className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-semibold text-yellow-700 sm:text-sm">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-3 transition hover:bg-gray-100 sm:flex-row sm:items-center sm:p-4"
                >
                  <div className="relative h-28 w-full overflow-hidden rounded-xl sm:h-24 sm:w-24 md:h-28 md:w-28">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold sm:text-lg">{item.title}</h3>

                      <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="text-lg font-bold sm:text-xl">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom */}
            <div className="mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>

                <h3 className="text-xl font-bold sm:text-2xl">£{order.total.toFixed(2)}</h3>
              </div>

              <Link
                href={`/checkout/vieworders/${order.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-800 sm:w-auto sm:text-base"
              >
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
