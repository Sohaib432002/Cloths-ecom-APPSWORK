'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrdersContext'
import { useWishlist } from '@/context/wishlistContext'
import { formatMoney } from '@/lib/commerce/pricing'

export const Dashboard = () => {
  const { user } = useAuth()
  const { orders } = useOrders()
  const { wishlist } = useWishlist()
  const recent = orders.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-brand p-6 text-white sm:p-8">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-gray-300">{user?.name || 'Véora member'}</p>
        <p className="mt-4 text-sm text-gray-300">
          Manage orders, saved pieces, and the looks your stylist recommended.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: 'Total Orders', value: orders.length },
          { label: 'Wishlist', value: wishlist.length },
          { label: 'Processing', value: orders.filter((order) => order.status === 'Processing').length },
          { label: 'Coupons', value: 4 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border p-6">
            <h2 className="text-3xl font-bold">{stat.value}</h2>
            <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
          <Link href="/account/profile?Tab=Orders" className="text-sm font-semibold">
            View All
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-gray-500">No orders yet. Your next checkout will appear here.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((order) => (
              <Link
                key={order.id}
                href={`/checkout/vieworders/${order.id}`}
                className="flex items-center justify-between rounded-2xl bg-[#F5F5F5] p-4"
              >
                <div>
                  <h3 className="font-semibold">{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {order.items.length} item{order.items.length === 1 ? '' : 's'} · {formatMoney(order.total)}
                  </p>
                </div>
                <span className="text-sm font-semibold">{order.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/account/profile?Tab=Profile Details" className="rounded-3xl border p-6 hover:bg-lavender-50">
          <h3 className="text-xl font-bold">Edit Profile</h3>
          <p className="mt-2 text-sm text-gray-500">Update your personal information.</p>
        </Link>
        <Link href="/wishlist" className="rounded-3xl border p-6 hover:bg-lavender-50">
          <h3 className="text-xl font-bold">Wishlist</h3>
          <p className="mt-2 text-sm text-gray-500">Jump back into saved pieces.</p>
        </Link>
      </div>
    </div>
  )
}
