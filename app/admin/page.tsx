import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAdminUser } from '@/lib/auth/admin'
import { listAllOrders } from '@/lib/commerce/orders'
import { getDb } from '@/lib/db/client'
import { emailEnabled, smsEnabled } from '@/lib/notify'
import { stripeEnabled } from '@/lib/payments/stripe'
import { AdminOrders } from './AdminOrders'
import { AdminProducts } from './AdminProducts'
import { AdminMarketing } from './AdminMarketing'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } }

const TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Products' },
  { id: 'marketing', label: 'Coupons & announcements' },
  { id: 'messages', label: 'Messages' },
]

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  if (!(await getAdminUser())) notFound()
  const requested = (await searchParams).tab
  const tab = TABS.some((item) => item.id === requested) ? requested! : 'orders'

  const db = await getDb()
  const [orders, messages, subscribers, lowStock, revenue] = await Promise.all([
    listAllOrders(100),
    db.execute('SELECT name, email, subject, message, created_at FROM contact_messages ORDER BY id DESC LIMIT 30'),
    db.execute('SELECT COUNT(*) AS n FROM newsletter_subscribers'),
    db.execute('SELECT title, sku, stock FROM products WHERE stock <= 5 AND is_active = 1 ORDER BY stock, title LIMIT 15'),
    db.execute("SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status != 'Cancelled' AND payment_status = 'Paid'"),
  ])

  const stat = 'rounded-2xl border border-lavender-200 bg-white p-5'
  const state = (ok: boolean) => (ok ? 'text-emerald-700' : 'text-amber-700')
  const newOrders = orders.filter((order) => order.status === 'Processing' || order.status === 'Pending payment').length

  return (
    <div className="mx-auto max-w-310 py-10">
      <p className="eyebrow">Shop owner</p>
      <h1 className="mt-2 text-3xl font-extrabold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className={stat}>
          <p className="text-sm text-gray-500">Orders to handle</p>
          <p className="mt-1 text-2xl font-bold">{newOrders}</p>
        </div>
        <div className={stat}>
          <p className="text-sm text-gray-500">Paid revenue</p>
          <p className="mt-1 text-2xl font-bold">${Number(revenue.rows[0].total).toFixed(2)}</p>
        </div>
        <div className={stat}>
          <p className="text-sm text-gray-500">Newsletter subscribers</p>
          <p className="mt-1 text-2xl font-bold">{Number(subscribers.rows[0].n)}</p>
        </div>
        <div className={stat}>
          <p className="text-sm text-gray-500">Low-stock items</p>
          <p className="mt-1 text-2xl font-bold">{lowStock.rows.length}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Card payments: <span className={state(stripeEnabled())}>{stripeEnabled() ? 'on' : 'off'}</span> · Email:{' '}
        <span className={state(emailEnabled())}>{emailEnabled() ? 'on' : 'off'}</span> · SMS:{' '}
        <span className={state(smsEnabled())}>{smsEnabled() ? 'on' : 'off'}</span>
      </p>

      <nav aria-label="Dashboard sections" className="mt-8 flex gap-1 overflow-x-auto border-b border-lavender-200">
        {TABS.map((item) => (
          <Link
            key={item.id}
            href={`/admin?tab=${item.id}`}
            aria-current={tab === item.id ? 'page' : undefined}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${
              tab === item.id ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">
        {tab === 'orders' && <AdminOrders initial={orders} />}
        {tab === 'products' && (
          <>
            <AdminProducts />
            {lowStock.rows.length > 0 && (
              <section className="mt-10">
                <h2 className="text-lg font-bold">Running low</h2>
                <ul className="mt-3 divide-y divide-lavender-100 rounded-2xl border border-lavender-200 bg-white text-sm">
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
            )}
          </>
        )}
        {tab === 'marketing' && <AdminMarketing />}
        {tab === 'messages' && (
          <ul className="space-y-3">
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
        )}
      </div>
    </div>
  )
}
