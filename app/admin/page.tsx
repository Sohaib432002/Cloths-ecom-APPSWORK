import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAdminUser } from '@/lib/auth/admin'
import { listAllOrders } from '@/lib/commerce/orders'
import { getDb } from '@/lib/db/client'
import { emailEnabled, smsEnabled } from '@/lib/notify'
import { stripeEnabled } from '@/lib/payments/stripe'
import { AdminOrders } from './AdminOrders'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } }

export default async function AdminPage() {
  if (!(await getAdminUser())) notFound()

  const db = await getDb()
  const [orders, messages, subscribers, lowStock, revenue] = await Promise.all([
    listAllOrders(100),
    db.execute('SELECT name, email, subject, message, created_at FROM contact_messages ORDER BY id DESC LIMIT 20'),
    db.execute('SELECT email, created_at FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 50'),
    db.execute('SELECT title, sku, stock FROM products WHERE stock <= 5 ORDER BY stock, title LIMIT 15'),
    db.execute("SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status != 'Cancelled' AND payment_status = 'Paid'"),
  ])

  const stat = 'rounded-2xl border border-lavender-200 bg-white p-5'
  const status = (ok: boolean) => (ok ? 'text-emerald-700' : 'text-amber-700')

  return (
    <div className="mx-auto max-w-310 py-10">
      <p className="eyebrow">Shop owner</p>
      <h1 className="mt-2 text-3xl font-extrabold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className={stat}>
          <p className="text-sm text-gray-500">Orders</p>
          <p className="mt-1 text-2xl font-bold">{orders.length}</p>
        </div>
        <div className={stat}>
          <p className="text-sm text-gray-500">Paid revenue</p>
          <p className="mt-1 text-2xl font-bold">${Number(revenue.rows[0].total).toFixed(2)}</p>
        </div>
        <div className={stat}>
          <p className="text-sm text-gray-500">Newsletter subscribers</p>
          <p className="mt-1 text-2xl font-bold">{subscribers.rows.length}</p>
        </div>
        <div className={stat}>
          <p className="text-sm text-gray-500">Low-stock items</p>
          <p className="mt-1 text-2xl font-bold">{lowStock.rows.length}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Card payments: <span className={status(stripeEnabled())}>{stripeEnabled() ? 'on' : 'off'}</span> · Email:{' '}
        <span className={status(emailEnabled())}>{emailEnabled() ? 'on' : 'off'}</span> · SMS:{' '}
        <span className={status(smsEnabled())}>{smsEnabled() ? 'on' : 'off'}</span>
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Orders</h2>
        <AdminOrders initial={orders} />
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold">Customer messages</h2>
          <ul className="mt-4 space-y-3">
            {messages.rows.length === 0 && <li className="text-gray-500">No messages yet.</li>}
            {messages.rows.map((row, i) => (
              <li key={i} className="rounded-2xl border border-lavender-200 bg-white p-4 text-sm">
                <p className="font-semibold">{String(row.subject)}</p>
                <p className="text-xs text-gray-500">
                  {String(row.name)} · {String(row.email)} · {new Date(String(row.created_at)).toLocaleString('en-GB')}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-gray-700">{String(row.message)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold">Low stock</h2>
          <ul className="mt-4 divide-y divide-lavender-100 rounded-2xl border border-lavender-200 bg-white text-sm">
            {lowStock.rows.length === 0 && <li className="p-4 text-gray-500">Everything is well stocked.</li>}
            {lowStock.rows.map((row, i) => (
              <li key={i} className="flex justify-between p-4">
                <span>
                  {String(row.title)} <span className="text-xs text-gray-400">{String(row.sku)}</span>
                </span>
                <span className="font-semibold text-amber-700">{String(row.stock)} left</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
