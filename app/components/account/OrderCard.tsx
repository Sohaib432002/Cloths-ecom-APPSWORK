'use client'

import Link from 'next/link'

export const Orders = () => {
  return (
    <div className="space-y-4 lg:space-y-8">
      {/* Header */}
      <div className="rounded-xl bg-black p-4 text-white sm:rounded-2xl sm:p-6 lg:rounded-3xl lg:p-8">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">My Orders</h1>

        <p className="mt-2 text-xs text-gray-300 sm:mt-3 sm:text-sm md:text-base">
          View and track all your recent and previous orders.
        </p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 lg:gap-6">
        <div className="rounded-xl border p-3 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">
          <i className="fa-solid fa-box text-lg sm:text-2xl lg:text-3xl"></i>

          <h2 className="mt-3 text-lg font-bold sm:text-2xl lg:mt-5 lg:text-3xl">12</h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm lg:mt-2 lg:text-base">Total Orders</p>
        </div>

        <div className="rounded-xl border p-3 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">
          <i className="fa-solid fa-truck text-lg text-yellow-500 sm:text-2xl lg:text-3xl"></i>

          <h2 className="mt-3 text-lg font-bold sm:text-2xl lg:mt-5 lg:text-3xl">2</h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm lg:mt-2 lg:text-base">Processing</p>
        </div>

        <div className="rounded-xl border p-3 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">
          <i className="fa-solid fa-circle-check text-lg text-green-500 sm:text-2xl lg:text-3xl"></i>

          <h2 className="mt-3 text-lg font-bold sm:text-2xl lg:mt-5 lg:text-3xl">9</h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm lg:mt-2 lg:text-base">Delivered</p>
        </div>

        <div className="rounded-xl border p-3 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">
          <i className="fa-solid fa-xmark text-lg text-red-500 sm:text-2xl lg:text-3xl"></i>

          <h2 className="mt-3 text-lg font-bold sm:text-2xl lg:mt-5 lg:text-3xl">1</h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm lg:mt-2 lg:text-base">Cancelled</p>
        </div>
      </div>

      {/* Order History */}
      <div className="rounded-xl border p-4 sm:rounded-2xl sm:p-6 lg:rounded-3xl lg:p-8">
        <h2 className="mb-4 text-lg font-bold sm:text-xl lg:mb-6 lg:text-2xl">Order History</h2>

        <div className="space-y-4 lg:space-y-5">
          {/* Order 1 */}
          <div className="flex flex-col gap-4 rounded-xl bg-[#F5F5F5] p-4 sm:rounded-2xl sm:p-5 md:flex-row md:items-center md:justify-between lg:p-6">
            <div>
              <h3 className="text-sm font-bold sm:text-base">#ORD-458921</h3>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">24 July 2026</p>

              <p className="text-xs text-gray-500 sm:text-sm">3 Products</p>
            </div>

            <div className="text-left md:text-center">
              <p className="text-sm font-bold sm:text-base">£189</p>

              <span className="text-xs font-medium text-green-600 sm:text-sm">Delivered</span>
            </div>

            <Link
              href="/orders/458921"
              className="w-full rounded-lg bg-black px-4 py-2 text-center text-xs text-white transition hover:bg-gray-800 sm:w-auto sm:px-5 sm:py-3 sm:text-sm lg:rounded-xl lg:text-base"
            >
              View Details
            </Link>
          </div>

          {/* Order 2 */}
          <div className="flex flex-col gap-4 rounded-xl bg-[#F5F5F5] p-4 sm:rounded-2xl sm:p-5 md:flex-row md:items-center md:justify-between lg:p-6">
            <div>
              <h3 className="text-sm font-bold sm:text-base">#ORD-458922</h3>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">20 July 2026</p>

              <p className="text-xs text-gray-500 sm:text-sm">1 Product</p>
            </div>

            <div className="text-left md:text-center">
              <p className="text-sm font-bold sm:text-base">£75</p>

              <span className="text-xs font-medium text-yellow-600 sm:text-sm">Processing</span>
            </div>

            <Link
              href="/orders/458922"
              className="w-full rounded-lg bg-black px-4 py-2 text-center text-xs text-white transition hover:bg-gray-800 sm:w-auto sm:px-5 sm:py-3 sm:text-sm lg:rounded-xl lg:text-base"
            >
              Track Order
            </Link>
          </div>

          {/* Order 3 */}
          <div className="flex flex-col gap-4 rounded-xl bg-[#F5F5F5] p-4 sm:rounded-2xl sm:p-5 md:flex-row md:items-center md:justify-between lg:p-6">
            <div>
              <h3 className="text-sm font-bold sm:text-base">#ORD-458923</h3>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">15 July 2026</p>

              <p className="text-xs text-gray-500 sm:text-sm">2 Products</p>
            </div>

            <div className="text-left md:text-center">
              <p className="text-sm font-bold sm:text-base">£120</p>

              <span className="text-xs font-medium text-red-500 sm:text-sm">Cancelled</span>
            </div>

            <Link
              href="/orders/458923"
              className="w-full rounded-lg border border-black px-4 py-2 text-center text-xs transition hover:bg-black hover:text-white sm:w-auto sm:px-5 sm:py-3 sm:text-sm lg:rounded-xl lg:text-base"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
