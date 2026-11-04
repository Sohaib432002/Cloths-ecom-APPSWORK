'use client'

import Link from 'next/link'
import { Bell, CheckCheck, PackageCheck } from 'lucide-react'
import { useNotification } from '@/context/NotificationContext'

export const Notifications = () => {
  const { notifications, unreadCount, markAllRead, markRead } = useNotification()

  return (
    <section aria-labelledby="notifications-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="notifications-title" className="text-2xl font-extrabold">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up.'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-full border border-lavender-200 px-4 py-2 text-sm font-semibold hover:bg-lavender-50"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-lavender-300 py-14 text-center">
          <Bell size={36} className="text-brand-soft" />
          <p className="mt-4 font-semibold">No notifications yet</p>
          <p className="mt-1 text-sm text-gray-500">Order updates will appear here.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {notifications.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={() => markRead(item.id)}
                className={`flex items-start gap-4 rounded-2xl border p-4 transition hover:shadow-md ${
                  item.read ? 'border-lavender-200 bg-white' : 'border-brand-soft bg-lavender-50'
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-100 text-brand">
                  <PackageCheck size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{item.title}</span>
                  <span className="block text-sm text-gray-500">{item.body}</span>
                  {item.createdAt > '1971' && (
                    <span className="mt-1 block text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  )}
                </span>
                {!item.read && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
