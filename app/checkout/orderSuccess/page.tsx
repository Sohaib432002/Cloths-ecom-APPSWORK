'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

const OrderSuccess = () => {
  const [orderId] = useState(() => {
    return `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  })

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-20">
      <div
        className="
        w-full
        max-w-2xl
        rounded-3xl
        border
        bg-white
        p-5
        sm:p-8
        lg:p-10
        text-center
        shadow-lg
        "
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className="
            flex
            h-16
            w-16
            sm:h-20
            sm:w-20
            lg:h-24
            lg:w-24
            items-center
            justify-center
            rounded-full
            bg-green-100
            "
          >
            <CheckCircle2
              className="
              h-10
              w-10
              sm:h-12
              sm:w-12
              lg:h-14
              lg:w-14
              text-green-600
              "
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="
          mt-5
          sm:mt-8
          text-2xl
          sm:text-3xl
          lg:text-4xl
          font-bold
          text-black
          "
        >
          Order Placed Successfully!
        </h1>

        {/* Description */}
        <p
          className="
          mt-3
          sm:mt-4
          text-sm
          sm:text-base
          lg:text-lg
          text-gray-500
          "
        >
          Thank you for shopping with us. Your order has been received and is now being processed.
        </p>

        {/* Order Info */}
        <div
          className="
          mt-6
          sm:mt-8
          rounded-2xl
          border
          bg-gray-50
          p-4
          sm:p-6
          text-left
          "
        >
          <div
            className="
            flex
            flex-col
            gap-1
            sm:flex-row
            sm:justify-between
            sm:items-center
            border-b
            py-3
            text-sm
            sm:text-base
            "
          >
            <span className="text-gray-500">Order Number</span>

            <span className="font-semibold break-all">{orderId}</span>
          </div>

          <div
            className="
            flex
            flex-col
            gap-1
            sm:flex-row
            sm:justify-between
            sm:items-center
            border-b
            py-3
            text-sm
            sm:text-base
            "
          >
            <span className="text-gray-500">Payment Status</span>

            <span className="font-semibold text-green-600">Paid</span>
          </div>

          <div
            className="
            flex
            flex-col
            gap-1
            sm:flex-row
            sm:justify-between
            sm:items-center
            py-3
            text-sm
            sm:text-base
            "
          >
            <span className="text-gray-500">Estimated Delivery</span>

            <span className="font-semibold">3 - 5 Business Days</span>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="
          mt-6
          sm:mt-10
          flex
          flex-col
          sm:flex-row
          gap-3
          sm:gap-4
          "
        >
          <Link
            href="/Store"
            className="
            flex-1
            rounded-xl
            bg-black
            py-3
            text-sm
            sm:text-base
            font-semibold
            text-white
            transition
            hover:bg-gray-900
            "
          >
            Continue Shopping
          </Link>

          <Link
            href="/checkout/vieworders"
            className="
            flex-1
            rounded-xl
            border
            border-black
            py-3
            text-sm
            sm:text-base
            font-semibold
            transition
            hover:bg-gray-100
            "
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
