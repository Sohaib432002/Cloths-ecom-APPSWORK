'use client'

import Link from 'next/link'

export const Dashboard = () => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome */}
      <div className="rounded-xl bg-black p-4 text-white sm:rounded-2xl sm:p-6 lg:rounded-3xl lg:p-8">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">Welcome Back 👋</h1>

        <p className="mt-2 text-xs text-gray-300 sm:text-sm md:text-base">
          Muhammad Sohaib Maqsood
        </p>

        <p className="mt-3 text-xs text-gray-300 sm:mt-4 sm:text-sm md:text-base lg:mt-6">
          Manage your profile, orders, wishlist and account settings.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 lg:gap-6">
        <div className="rounded-xl border p-3 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">
          <i className="fa-solid fa-box text-lg sm:text-2xl lg:text-3xl"></i>

          <h2 className="mt-3 text-lg font-bold sm:text-2xl lg:mt-5 lg:text-3xl">12</h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm lg:mt-2 lg:text-base">Total Orders</p>
        </div>

        <div className="rounded-xl border p-3 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">
          <i className="fa-solid fa-heart text-lg text-red-500 sm:text-2xl lg:text-3xl"></i>

          <h2 className="mt-3 text-lg font-bold sm:text-2xl lg:mt-5 lg:text-3xl">18</h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm lg:mt-2 lg:text-base">Wishlist</p>
        </div>

        <div className="rounded-xl border p-3 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">
          <i className="fa-solid fa-location-dot text-lg sm:text-2xl lg:text-3xl"></i>

          <h2 className="mt-3 text-lg font-bold sm:text-2xl lg:mt-5 lg:text-3xl">3</h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm lg:mt-2 lg:text-base">
            Saved Addresses
          </p>
        </div>

        <div className="rounded-xl border p-3 sm:rounded-2xl sm:p-4 lg:rounded-3xl lg:p-6">
          <i className="fa-solid fa-ticket text-lg text-green-500 sm:text-2xl lg:text-3xl"></i>

          <h2 className="mt-3 text-lg font-bold sm:text-2xl lg:mt-5 lg:text-3xl">5</h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm lg:mt-2 lg:text-base">Coupons</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border p-4 sm:rounded-2xl sm:p-6 lg:rounded-3xl lg:p-8">
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <h2 className="text-lg font-bold sm:text-xl lg:text-2xl">Recent Orders</h2>

          <Link href="/account/orders" className="text-xs font-semibold sm:text-sm lg:text-base">
            View All
          </Link>
        </div>

        <div className="space-y-3 lg:space-y-4">
          <div className="flex flex-col gap-3 rounded-xl bg-[#F5F5F5] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 lg:rounded-2xl lg:p-5">
            <div>
              <h3 className="text-sm font-semibold sm:text-base">Order #ORD-458921</h3>

              <p className="text-xs text-gray-500 sm:text-sm">2 Products</p>
            </div>

            <div className="text-sm font-semibold text-green-600">Delivered</div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-[#F5F5F5] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 lg:rounded-2xl lg:p-5">
            <div>
              <h3 className="text-sm font-semibold sm:text-base">Order #ORD-458922</h3>

              <p className="text-xs text-gray-500 sm:text-sm">1 Product</p>
            </div>

            <div className="text-sm font-semibold text-yellow-600">Processing</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-6">
        <Link
          href="/account/profile"
          className="rounded-xl border p-4 transition hover:bg-gray-50 sm:rounded-2xl sm:p-5 lg:rounded-3xl lg:p-8"
        >
          <i className="fa-solid fa-user text-lg sm:text-2xl lg:text-3xl"></i>

          <h3 className="mt-3 text-base font-bold sm:text-lg lg:mt-4 lg:text-xl">Edit Profile</h3>

          <p className="mt-2 text-xs text-gray-500 sm:text-sm lg:text-base">
            Update your personal information.
          </p>
        </Link>

        <Link
          href="/account/orders"
          className="rounded-xl border p-4 transition hover:bg-gray-50 sm:rounded-2xl sm:p-5 lg:rounded-3xl lg:p-8"
        >
          <i className="fa-solid fa-truck text-lg sm:text-2xl lg:text-3xl"></i>

          <h3 className="mt-3 text-base font-bold sm:text-lg lg:mt-4 lg:text-xl">Track Orders</h3>

          <p className="mt-2 text-xs text-gray-500 sm:text-sm lg:text-base">
            Check your latest order status.
          </p>
        </Link>

        <Link
          href="/account/wishlist"
          className="rounded-xl border p-4 transition hover:bg-gray-50 sm:rounded-2xl sm:p-5 lg:rounded-3xl lg:p-8"
        >
          <i className="fa-solid fa-heart text-lg text-red-500 sm:text-2xl lg:text-3xl"></i>

          <h3 className="mt-3 text-base font-bold sm:text-lg lg:mt-4 lg:text-xl">Wishlist</h3>

          <p className="mt-2 text-xs text-gray-500 sm:text-sm lg:text-base">
            View your saved products.
          </p>
        </Link>

        <Link
          href="/Store"
          className="rounded-xl border p-4 transition hover:bg-gray-50 sm:rounded-2xl sm:p-5 lg:rounded-3xl lg:p-8"
        >
          <i className="fa-solid fa-cart-shopping text-lg sm:text-2xl lg:text-3xl"></i>

          <h3 className="mt-3 text-base font-bold sm:text-lg lg:mt-4 lg:text-xl">
            Continue Shopping
          </h3>

          <p className="mt-2 text-xs text-gray-500 sm:text-sm lg:text-base">
            Explore our latest collections.
          </p>
        </Link>
      </div>
    </div>
  )
}
