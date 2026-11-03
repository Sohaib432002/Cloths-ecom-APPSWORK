'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, BadgeCheck, CalendarDays, CreditCard, MapPin, Truck } from 'lucide-react'

import { useOrders } from '@/context/OrdersContext'

export const OrderDetailsPage = () => {
  const params = useParams()
  const orderId = params.orderId as string

  const { getOrder } = useOrders()

  const order = getOrder(orderId)

  if (!order) {
    return (
      <section className="container mx-auto max-w-310 flex min-h-[70vh] items-center justify-center px-4 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Order Not Found</h2>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            The order you are looking for doesn't exist.
          </p>

          <Link
            href="/checkout/vieworders"
            className="mt-6 inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark sm:text-base"
          >
            Back To Orders
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto max-w-310  py-6 sm:py-8 lg:py-10">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">Order Details</h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Order ID:
            <span className="ml-2 font-semibold text-black">#{order.id}</span>
          </p>
        </div>

        <Link
          href="/checkout/vieworders"
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-gray-300
            px-4
            py-2
            text-sm
            font-medium
            transition
            hover:bg-lavender-100
            sm:px-5
            sm:py-3
            sm:text-base
          "
        >
          <ArrowLeft size={18} />
          Back Orders
        </Link>
      </div>

      {/* Main Layout */}

      <div className="grid gap-3 lg:grid-cols-[2fr_1fr] lg:gap-4">
        {/* Products */}

        <div className="space-y-5">
          <div className="grid gap-2 grid-cols-2 lg:grid-cols-1">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="
                rounded-2xl
                border
                bg-white
                p-4
                shadow-sm
                transition
                duration-300
                hover:shadow-md
                sm:rounded-3xl
                
              "
              >
                <div className="flex flex-col gap-3  sm:flex-row">
                  {/* Product Image */}

                  <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-xl sm:mx-0 sm:h-40 sm:w-40">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>

                  {/* Product Details */}

                  <div className="flex flex-1 flex-col justify-center">
                    <h2 className="text-lg font-bold sm:text-xl lg:text-2xl">{item.title}</h2>

                    <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-3 sm:text-base">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">Quantity</p>

                        <p className="mt-1 font-semibold text-black">{item.quantity}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">Price</p>

                        <p className="mt-1 font-semibold text-black">${item.price}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">Total</p>

                        <p className="mt-1 text-lg font-bold text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section Starts Here */}
        {/* Summary */}

        <div className="space-y-5">
          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6  lg:top-24">
            <h2 className="mb-6 text-xl font-bold sm:text-2xl">Summary</h2>

            <InfoRow icon={<BadgeCheck size={18} />} title="Status" value={order.status} />

            <InfoRow icon={<CalendarDays size={18} />} title="Date" value={order.date} />

            <InfoRow icon={<CreditCard size={18} />} title="Payment" value={order.payment} />

            <InfoRow icon={<Truck size={18} />} title="Shipping" value={order.shipping} />

            <hr className="my-5" />

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold sm:text-lg">Total</span>

              <span className="text-xl font-bold sm:text-2xl">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Address */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <MapPin size={20} />

              <h2 className="text-lg font-bold sm:text-xl">Delivery Address</h2>
            </div>

            <div className="space-y-2 text-sm text-gray-600 sm:text-base">
              <p className="font-semibold text-black">{order.address.name}</p>

              <p>{order.address.phone}</p>

              <p>{order.address.address}</p>

              <p>
                {order.address.city}, {order.address.country}
              </p>

              <p>{order.address.zipCode}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoRow({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 sm:text-base">
        <span className="text-black">{icon}</span>

        <span>{title}</span>
      </div>

      <span className="text-right text-sm font-semibold text-black sm:text-base">{value}</span>
    </div>
  )
}

export default OrderDetailsPage
