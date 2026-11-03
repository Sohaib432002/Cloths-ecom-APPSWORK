'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/client/api'
import type { Order } from '@/context/OrdersContext'

const STATUSES = ['Pending payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export function AdminOrders({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState(initial)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  const change = async (id: string, status: string) => {
    setBusy(id)
    setError('')
    try {
      const data = await apiFetch<{ order: Order }>(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setOrders((list) => list.map((order) => (order.id === id ? data.order : order)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.')
    } finally {
      setBusy('')
    }
  }

  if (!orders.length) return <p className="py-8 text-gray-500">No orders yet.</p>

  return (
    <div className="overflow-x-auto">
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="py-3 pr-4">Order</th>
            <th className="pr-4">Customer</th>
            <th className="pr-4">Items</th>
            <th className="pr-4">Total</th>
            <th className="pr-4">Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lavender-100">
          {orders.map((order) => (
            <tr key={order.id} className="align-top">
              <td className="py-3 pr-4">
                <p className="font-semibold">{order.id}</p>
                <p className="text-xs text-gray-500">{new Date(order.date).toLocaleString('en-GB')}</p>
              </td>
              <td className="pr-4">
                <p>{order.address.name}</p>
                <p className="text-xs text-gray-500">{order.address.phone}</p>
                <p className="text-xs text-gray-500">{order.email}</p>
                <p className="text-xs text-gray-500">
                  {order.address.address}, {order.address.city}
                </p>
              </td>
              <td className="pr-4 text-xs text-gray-600">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.quantity} × {item.title}
                    {item.size ? ` (${item.size})` : ''}
                  </p>
                ))}
              </td>
              <td className="pr-4 font-semibold">${order.total.toFixed(2)}</td>
              <td className="pr-4 text-xs">
                {order.payment}
                <br />
                <span className={order.paymentStatus === 'Paid' ? 'font-semibold text-emerald-700' : 'text-amber-700'}>
                  {order.paymentStatus}
                </span>
              </td>
              <td>
                <select
                  aria-label={`Status of ${order.id}`}
                  value={order.status}
                  disabled={busy === order.id}
                  onChange={(event) => change(order.id, event.target.value)}
                  className="rounded-lg border border-lavender-200 bg-white px-2 py-1.5 text-sm"
                >
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
